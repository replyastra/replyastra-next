export default {
  async fetch(request, env) {
    // ── CORS preflight ────────────────────────────────────────
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type,x-api-key",
        },
      });
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    // ── Internal API key guard ────────────────────────────────
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey || apiKey !== env.INTERNAL_API_SECRET) {
      return json({ error: "Unauthorized" }, 401);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON body" }, 400);
    }

    const { userId, prompt } = body;
    if (!userId || !prompt) {
      return json({ error: "userId and prompt are required" }, 400);
    }

    const now = new Date();

    // ── Fetch profile from Supabase ───────────────────────────
    const profile = await getProfile(env, userId);
    if (!profile) return json({ error: "User profile not found" }, 404);

    // ── Resolve plan (supports both `plan` and `plan_type` columns) ──
    const plan = profile.plan_type || profile.plan || "free";

    // ── Plan limits (Starter: 20 monthly / 5 daily; Pro: 150 / 20) ──
    const LIMITS = {
      free: { daily: 0, monthly: 0 },
      starter: { daily: 5, monthly: 20 },
      pro: { daily: 20, monthly: 150 },
    };
    const limits = LIMITS[plan] || LIMITS.free;

    if (!limits.daily || !limits.monthly) {
      return json({ error: "ReplyAstra AI is not available on the free plan." }, 403);
    }

    // ── Resolve usage counters (with daily/monthly reset logic) ──
    const dailyResetDate = profile.ai_daily_reset_date ? new Date(profile.ai_daily_reset_date) : new Date(0);
    const monthResetDate = profile.ai_month_reset_date ? new Date(profile.ai_month_reset_date) : new Date(0);

    let aiUsedToday = now > dailyResetDate ? 0 : (profile.ai_used_today || 0);
    let aiUsedMonthly = now > monthResetDate ? 0 : (profile.ai_used_monthly || 0);

    // ── Enforce limits ────────────────────────────────────────
    if (aiUsedToday >= limits.daily) {
      return json({
        error: "Daily AI limit reached.",
        remaining_today: 0,
        remaining_month: Math.max(limits.monthly - aiUsedMonthly, 0),
      }, 403);
    }
    if (aiUsedMonthly >= limits.monthly) {
      return json({
        error: "Monthly AI limit reached.",
        remaining_today: Math.max(limits.daily - aiUsedToday, 0),
        remaining_month: 0,
      }, 403);
    }

    // ── Fetch user AI settings (Pro only, but fetched for all with AI) ──
    const aiSettings = await getAISettings(env, userId);

    const tone = aiSettings?.tone || "Friendly";
    const replyLength = aiSettings?.reply_length || "Medium";
    const emojiLevel = aiSettings?.emoji_level || "Medium";
    const customInstruction = aiSettings?.custom_instruction || "";
    const autoCommentReply = aiSettings?.auto_comment_reply || false;
    const autoDMReply = aiSettings?.auto_dm_reply || false;

    // ── Build dynamic system prompt ───────────────────────────
    // For Pro users: inject all AI settings
    // For Starter/others: use sensible defaults only
    let systemPrompt;
    if (plan === "pro") {
      systemPrompt = buildProSystemPrompt({ tone, replyLength, emojiLevel, customInstruction, autoCommentReply, autoDMReply });
    } else {
      systemPrompt = buildDefaultSystemPrompt();
    }

    // ── Generate AI response via Workers AI ──────────────────
    const maxTokens = replyLength === "Long" ? 500 : replyLength === "Short" ? 150 : 350;
    const temp = (tone === "Funny" || tone === "Gen-Z") ? 0.9 : 0.7;

    const aiResult = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      max_tokens: maxTokens,
      temperature: temp,
    });

    const text = typeof aiResult?.response === "string"
      ? aiResult.response
      : (aiResult?.result || "");

    // ── Increment usage counters ──────────────────────────────
    aiUsedToday += 1;
    aiUsedMonthly += 1;

    const nextDaily = new Date(now);
    nextDaily.setDate(nextDaily.getDate() + 1);
    nextDaily.setHours(0, 0, 0, 0);

    const nextMonth = profile.subscription_end_date
      ? new Date(profile.subscription_end_date)
      : (() => { const d = new Date(now); d.setMonth(d.getMonth() + 1); return d; })();

    await updateProfile(env, userId, {
      ai_used_today: aiUsedToday,
      ai_used_monthly: aiUsedMonthly,
      ai_daily_reset_date: nextDaily.toISOString(),
      ai_month_reset_date: nextMonth.toISOString(),
    });

    return json({
      text,
      remaining_today: Math.max(limits.daily - aiUsedToday, 0),
      remaining_month: Math.max(limits.monthly - aiUsedMonthly, 0),
    });
  },
};

/* ─── System prompts ─────────────────────────────────────────── */
function buildProSystemPrompt({ tone, replyLength, emojiLevel, customInstruction, autoCommentReply, autoDMReply }) {
  return `You are ReplyAstra AI, a social media growth assistant that generates captions, replies and hashtags for Instagram creators.

User preferences (PRO configuration):
- Tone: ${tone}
- Reply length: ${replyLength}
- Emoji level: ${emojiLevel}${customInstruction ? `\n- Additional instruction: ${customInstruction}` : ""}
- Auto comment reply enabled: ${autoCommentReply}
- Auto DM reply enabled: ${autoDMReply}

Always follow the user preferences above when generating responses. Adapt your style to match the specified tone and length. Use emojis according to the emoji level setting (Low = 0-1 emoji, Medium = 2-3, High = 4+).`;
}

function buildDefaultSystemPrompt() {
  return `You are ReplyAstra AI, a social media growth assistant that generates captions, replies and hashtags for Instagram creators.

Always generate helpful, concise, and engaging responses appropriate for Instagram. Keep a friendly and professional tone.`;
}

/* ─── Supabase REST helpers ─────────────────────────────────── */
async function getProfile(env, userId) {
  const res = await fetch(
    `${env.SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=*`,
    { headers: supabaseHeaders(env) },
  );
  if (!res.ok) return null;
  const rows = await res.json();
  return rows?.[0] || null;
}

async function getAISettings(env, userId) {
  const res = await fetch(
    `${env.SUPABASE_URL}/rest/v1/user_ai_settings?user_id=eq.${userId}&select=*`,
    { headers: supabaseHeaders(env) },
  );
  if (!res.ok) return null;
  const rows = await res.json();
  return rows?.[0] || null;
}

async function updateProfile(env, userId, payload) {
  await fetch(`${env.SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, {
    method: "PATCH",
    headers: {
      ...supabaseHeaders(env),
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(payload),
  });
}

function supabaseHeaders(env) {
  return {
    apikey: env.SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
  };
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
