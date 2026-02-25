export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    const apiKey = request.headers.get("x-api-key");
    if (!apiKey || apiKey !== env.INTERNAL_API_SECRET) {
      return json({ error: "Unauthorized" }, 401);
    }

    const { userId, prompt } = await request.json();
    if (!userId || !prompt) return json({ error: "userId and prompt are required" }, 400);

    const now = new Date();

    // ── Fetch profile ──────────────────────────────────────────────
    const profile = await getProfile(env, userId);
    if (!profile) return json({ error: "User not found" }, 404);

    const plan = profile.plan_type || profile.plan || "free";

    // ── Rate limiting ──────────────────────────────────────────────
    const dailyResetDate  = profile.ai_daily_reset_date  ? new Date(profile.ai_daily_reset_date)  : new Date(0);
    const monthResetDate  = profile.ai_month_reset_date  ? new Date(profile.ai_month_reset_date)  : new Date(0);

    let aiUsedToday   = now > dailyResetDate  ? 0 : (profile.ai_used_today    || 0);
    let aiUsedMonthly = now > monthResetDate  ? 0 : (profile.ai_used_monthly  || 0);

    const dailyLimit   = plan === "pro" ? 10 : plan === "starter" ? 3  : 0;
    const monthlyLimit = plan === "pro" ? 150 : plan === "starter" ? 20 : 0;

    if (!dailyLimit || !monthlyLimit) {
      return json({ error: "ReplyAstra AI is not available on the free plan." }, 403);
    }
    if (aiUsedToday   >= dailyLimit)   return json({ error: "Daily AI limit reached.",   remaining_today: 0, remaining_month: Math.max(monthlyLimit - aiUsedMonthly, 0) }, 403);
    if (aiUsedMonthly >= monthlyLimit) return json({ error: "Monthly AI limit reached.", remaining_today: Math.max(dailyLimit - aiUsedToday, 0), remaining_month: 0 }, 403);

    // ── Fetch user AI settings ────────────────────────────────────
    const aiSettings = await getAISettings(env, userId);

    const tone              = aiSettings?.tone              || "Friendly";
    const replyLength       = aiSettings?.reply_length      || "Medium";
    const emojiLevel        = aiSettings?.emoji_level       || "Medium";
    const customInstruction = aiSettings?.custom_instruction || "";

    // ── Build dynamic system prompt ───────────────────────────────
    const systemPrompt = `You are ReplyAstra AI, a social media growth assistant that generates captions, replies and hashtags for Instagram creators.

User preferences:
- Tone: ${tone}
- Reply length: ${replyLength}
- Emoji level: ${emojiLevel}${customInstruction ? `\n- Additional instruction: ${customInstruction}` : ""}

Always follow the user preferences above when generating responses. Adapt your style to match the specified tone and length.`;

    // ── Generate AI response ──────────────────────────────────────
    const aiResult = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user",   content: prompt },
      ],
      max_tokens: replyLength === "Long" ? 500 : replyLength === "Short" ? 150 : 350,
      temperature: tone === "Funny" || tone === "Gen-Z" ? 0.9 : 0.7,
    });

    const text = typeof aiResult?.response === "string" ? aiResult.response : aiResult?.result || "";

    // ── Update usage counters ─────────────────────────────────────
    aiUsedToday   += 1;
    aiUsedMonthly += 1;

    const nextDaily = new Date(now);
    nextDaily.setDate(nextDaily.getDate() + 1);
    nextDaily.setHours(0, 0, 0, 0);

    const nextMonth = profile.subscription_end_date
      ? new Date(profile.subscription_end_date)
      : (() => { const d = new Date(now); d.setMonth(d.getMonth() + 1); return d; })();

    await updateProfile(env, userId, {
      ai_used_today:       aiUsedToday,
      ai_used_monthly:     aiUsedMonthly,
      ai_daily_reset_date: nextDaily.toISOString(),
      ai_month_reset_date: nextMonth.toISOString(),
    });

    return json({
      text,
      remaining_today:  Math.max(dailyLimit   - aiUsedToday,   0),
      remaining_month:  Math.max(monthlyLimit - aiUsedMonthly, 0),
    });
  },
};

/* ─── Supabase helpers ───────────────────────────────────────── */
async function getProfile(env, userId) {
  const res = await fetch(
    `${env.SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=*`,
    { headers: supabaseHeaders(env) }
  );
  if (!res.ok) return null;
  const rows = await res.json();
  return rows?.[0] || null;
}

async function getAISettings(env, userId) {
  const res = await fetch(
    `${env.SUPABASE_URL}/rest/v1/user_ai_settings?user_id=eq.${userId}&select=*`,
    { headers: supabaseHeaders(env) }
  );
  if (!res.ok) return null;
  const rows = await res.json();
  return rows?.[0] || null;
}

async function updateProfile(env, userId, payload) {
  await fetch(`${env.SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, {
    method:  "PATCH",
    headers: { ...supabaseHeaders(env), "Content-Type": "application/json", Prefer: "return=minimal" },
    body:    JSON.stringify(payload),
  });
}

function supabaseHeaders(env) {
  return {
    apikey:        env.SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
  };
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
