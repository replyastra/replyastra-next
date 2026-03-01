import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

export async function POST(request) {
  const corsHeaders = { "Content-Type": "application/json" };

  try {
    // ── 1. Parse body ────────────────────────────────────────
    let body;
    try {
      const raw = await request.text();
      body = JSON.parse(raw);
    } catch (e) {
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400, headers: corsHeaders,
      });
    }

    const token = body?.token || "";
    const prompt = (body?.prompt || "").trim();

    if (!token) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401, headers: corsHeaders,
      });
    }
    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400, headers: corsHeaders,
      });
    }

    // ── 2. Verify Supabase token ─────────────────────────────
    const sbUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim().replace(/\/$/, "");
    const sbKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();

    if (!sbUrl) {
      return new Response(JSON.stringify({ error: "Supabase URL not configured" }), {
        status: 500, headers: corsHeaders,
      });
    }

    const authRes = await fetch(`${sbUrl}/auth/v1/user`, {
      headers: { apikey: sbKey, Authorization: `Bearer ${token}` },
    });

    if (!authRes.ok) {
      return new Response(JSON.stringify({ error: "Invalid or expired session" }), {
        status: 401, headers: corsHeaders,
      });
    }

    const authUser = await authRes.json();
    const userId = authUser?.id;
    if (!userId) {
      return new Response(JSON.stringify({ error: "Could not identify user" }), {
        status: 401, headers: corsHeaders,
      });
    }

    // ── 3. Get user profile for plan check ───────────────────
    const profileRes = await fetch(
      `${sbUrl}/rest/v1/profiles?id=eq.${userId}&select=plan,plan_type,ai_used_today,ai_used_monthly,ai_daily_reset_date,ai_month_reset_date`,
      { headers: { apikey: sbKey, Authorization: `Bearer ${sbKey}` } }
    );
    const profiles = profileRes.ok ? await profileRes.json() : [];
    const profile = profiles?.[0];

    const plan = profile?.plan_type || profile?.plan || "free";

    const LIMITS = {
      free: { daily: 0, monthly: 0 },
      starter: { daily: 5, monthly: 20 },
      pro: { daily: 20, monthly: 150 },
    };
    const limits = LIMITS[plan] || LIMITS.free;

    if (!limits.daily || !limits.monthly) {
      return new Response(JSON.stringify({ error: "AI not available on Free plan. Upgrade to Starter or Pro." }), {
        status: 403, headers: corsHeaders,
      });
    }

    // ── 4. Check usage limits ────────────────────────────────
    const now = new Date();
    const dailyReset = profile?.ai_daily_reset_date ? new Date(profile.ai_daily_reset_date) : new Date(0);
    const monthReset = profile?.ai_month_reset_date ? new Date(profile.ai_month_reset_date) : new Date(0);

    let usedToday = now > dailyReset ? 0 : (profile?.ai_used_today || 0);
    let usedMonth = now > monthReset ? 0 : (profile?.ai_used_monthly || 0);

    if (usedToday >= limits.daily) {
      return new Response(JSON.stringify({ error: "Daily AI limit reached.", remaining_today: 0, remaining_month: Math.max(limits.monthly - usedMonth, 0) }), {
        status: 429, headers: corsHeaders,
      });
    }
    if (usedMonth >= limits.monthly) {
      return new Response(JSON.stringify({ error: "Monthly AI limit reached.", remaining_today: Math.max(limits.daily - usedToday, 0), remaining_month: 0 }), {
        status: 429, headers: corsHeaders,
      });
    }

    // ── 5. Get AI settings (Pro users) ───────────────────────
    let aiSettings = null;
    if (plan === "pro") {
      const settingsRes = await fetch(
        `${sbUrl}/rest/v1/user_ai_settings?user_id=eq.${userId}&select=*`,
        { headers: { apikey: sbKey, Authorization: `Bearer ${sbKey}` } }
      );
      if (settingsRes.ok) {
        const rows = await settingsRes.json();
        aiSettings = rows?.[0] || null;
      }
    }

    const tone = aiSettings?.tone || "Friendly";
    const replyLength = aiSettings?.reply_length || "Medium";
    const emojiLevel = aiSettings?.emoji_level || "Medium";
    const customInstruction = aiSettings?.custom_instruction || "";

    const systemPrompt = plan === "pro"
      ? `You are ReplyAstra AI for Instagram creators.\nTone: ${tone}\nLength: ${replyLength}\nEmoji: ${emojiLevel}${customInstruction ? `\nInstruction: ${customInstruction}` : ""}`
      : `You are ReplyAstra AI for Instagram creators. Be helpful, concise and engaging.`;

    const maxTokens = replyLength === "Long" ? 500 : replyLength === "Short" ? 150 : 350;

    // ── 6. Call Workers AI directly via Pages binding ─────────
    let env;
    try {
      env = getRequestContext().env;
    } catch (e) {
      return new Response(JSON.stringify({ error: "Runtime context not available. Ensure this runs on Cloudflare Pages." }), {
        status: 500, headers: corsHeaders,
      });
    }

    if (!env.AI) {
      return new Response(JSON.stringify({ error: "Workers AI binding not found. Add AI binding (name=AI) in Cloudflare Pages settings → Bindings." }), {
        status: 500, headers: corsHeaders,
      });
    }

    let aiResult;
    try {
      aiResult = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        max_tokens: maxTokens,
        temperature: 0.7,
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: `AI model error: ${e?.message || String(e)}` }), {
        status: 500, headers: corsHeaders,
      });
    }

    const text = typeof aiResult?.response === "string" ? aiResult.response : (aiResult?.result || "");

    // ── 7. Update usage ──────────────────────────────────────
    usedToday += 1;
    usedMonth += 1;

    const nextDaily = new Date(now);
    nextDaily.setDate(nextDaily.getDate() + 1);
    nextDaily.setHours(0, 0, 0, 0);

    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    await fetch(`${sbUrl}/rest/v1/profiles?id=eq.${userId}`, {
      method: "PATCH",
      headers: {
        apikey: sbKey,
        Authorization: `Bearer ${sbKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        ai_used_today: usedToday,
        ai_used_monthly: usedMonth,
        ai_daily_reset_date: nextDaily.toISOString(),
        ai_month_reset_date: nextMonth.toISOString(),
      }),
    }).catch(() => { }); // fire-and-forget, don't block response

    // ── 8. Respond ───────────────────────────────────────────
    return new Response(JSON.stringify({
      text,
      remaining_today: Math.max(limits.daily - usedToday, 0),
      remaining_month: Math.max(limits.monthly - usedMonth, 0),
    }), { status: 200, headers: corsHeaders });

  } catch (e) {
    return new Response(JSON.stringify({ error: `Server error: ${e?.message || String(e)}` }), {
      status: 500, headers: corsHeaders,
    });
  }
}
