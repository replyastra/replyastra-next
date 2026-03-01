export default {
  async fetch(request, env) {
    // ── CORS preflight ─────────────────────────────────────────────
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type,Authorization,x-api-key",
        },
      });
    }

    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

    const authHeader = request.headers.get("Authorization") || request.headers.get("authorization") || "";
    const apiKey = request.headers.get("x-api-key") || "";

    // ── Auth method 1: Internal API key (server-to-server) ─────────
    if (apiKey && apiKey === (env.INTERNAL_API_SECRET || "")) {
      let body;
      try { body = await request.json(); } catch { return json({ error: "Invalid JSON" }, 400); }
      const userId = body?.userId;
      if (!userId) return json({ error: "userId required" }, 400);
      return await handleRequest(env, userId, body?.prompt);
    }

    // ── Auth method 2: Bearer token in Authorization header ─────────
    else if (authHeader.startsWith("Bearer ")) {
      const token = authHeader.slice(7).trim();
      const userId = await verifyToken(env, token);
      if (!userId) return json({ error: "Unauthorized" }, 401);
      let body;
      try { body = await request.json(); } catch { return json({ error: "Invalid JSON" }, 400); }
      return await handleRequest(env, userId, body?.prompt);
    }

    // ── Auth method 3: Token in body (text/plain = no CORS preflight) ─
    else {
      let body;
      try {
        const raw = await request.text();
        body = JSON.parse(raw);
      } catch { return json({ error: "Invalid request body" }, 400); }

      const token = body?.token;
      if (!token) return json({ error: "Unauthorized" }, 401);

      const userId = await verifyToken(env, token);
      if (!userId) return json({ error: "Unauthorized" }, 401);

      return await handleRequest(env, userId, body?.prompt);
    }
  },
};

// ── Verify Supabase JWT → returns userId or null ─────────────────
async function verifyToken(env, token) {
  const supabaseUrl = (env.SUPABASE_URL || "").trim();
  const serviceKey = (env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  if (!supabaseUrl || !serviceKey) return null;
  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { apikey: serviceKey, Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const user = await res.json();
    return user?.id || null;
  } catch { return null; }
}

// ── Core AI handler ───────────────────────────────────────────────
async function handleRequest(env, userId, prompt) {
  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return json({ error: "Prompt is required" }, 400);
  }

  const now = new Date();

  const profile = await getProfile(env, userId);
  if (!profile) return json({ error: "User profile not found" }, 404);

  const plan = profile.plan_type || profile.plan || "free";
  const LIMITS = {
    free: { daily: 0, monthly: 0 },
    starter: { daily: 5, monthly: 20 },
    pro: { daily: 20, monthly: 150 },
  };
  const limits = LIMITS[plan] || LIMITS.free;
  if (!limits.daily || !limits.monthly) {
    return json({ error: "AI not available on Free plan. Upgrade to Starter or Pro." }, 403);
  }

  const dailyResetDate = profile.ai_daily_reset_date ? new Date(profile.ai_daily_reset_date) : new Date(0);
  const monthResetDate = profile.ai_month_reset_date ? new Date(profile.ai_month_reset_date) : new Date(0);
  let aiUsedToday = now > dailyResetDate ? 0 : (profile.ai_used_today || 0);
  let aiUsedMonthly = now > monthResetDate ? 0 : (profile.ai_used_monthly || 0);

  if (aiUsedToday >= limits.daily) return json({ error: "Daily AI limit reached.", remaining_today: 0, remaining_month: Math.max(limits.monthly - aiUsedMonthly, 0) }, 429);
  if (aiUsedMonthly >= limits.monthly) return json({ error: "Monthly AI limit reached.", remaining_today: Math.max(limits.daily - aiUsedToday, 0), remaining_month: 0 }, 429);

  const aiSettings = await getAISettings(env, userId);
  const tone = aiSettings?.tone || "Friendly";
  const replyLength = aiSettings?.reply_length || "Medium";
  const emojiLevel = aiSettings?.emoji_level || "Medium";
  const customInstruction = aiSettings?.custom_instruction || "";

  const systemPrompt = plan === "pro"
    ? `You are ReplyAstra AI for Instagram creators.\nTone: ${tone}\nLength: ${replyLength}\nEmoji: ${emojiLevel}${customInstruction ? `\nInstruction: ${customInstruction}` : ""}`
    : `You are ReplyAstra AI for Instagram creators. Be helpful, concise and engaging.`;

  if (!env.AI) return json({ error: "Workers AI binding missing. Add AI binding (Variable=AI) in Cloudflare Worker settings." }, 500);

  const maxTokens = replyLength === "Long" ? 500 : replyLength === "Short" ? 150 : 350;

  let aiResult;
  try {
    aiResult = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt.trim() },
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
    });
  } catch (e) {
    return json({ error: `AI model error: ${e?.message || e}` }, 500);
  }

  const text = typeof aiResult?.response === "string" ? aiResult.response : (aiResult?.result || "");

  aiUsedToday += 1;
  aiUsedMonthly += 1;

  const nextDaily = new Date(now);
  nextDaily.setDate(nextDaily.getDate() + 1);
  nextDaily.setHours(0, 0, 0, 0);
  const nextMonth = (() => { const d = new Date(now); d.setMonth(d.getMonth() + 1); return d; })();

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
}

// ── Supabase helpers ──────────────────────────────────────────────
function sbHeaders(env) {
  return { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` };
}
async function getProfile(env, userId) {
  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=*`, { headers: sbHeaders(env) });
  if (!res.ok) return null;
  const rows = await res.json();
  return rows?.[0] || null;
}
async function getAISettings(env, userId) {
  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/user_ai_settings?user_id=eq.${userId}&select=*`, { headers: sbHeaders(env) });
  if (!res.ok) return null;
  const rows = await res.json();
  return rows?.[0] || null;
}
async function updateProfile(env, userId, payload) {
  await fetch(`${env.SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, {
    method: "PATCH",
    headers: { ...sbHeaders(env), "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(payload),
  });
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });
}

