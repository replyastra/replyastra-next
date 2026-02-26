export const runtime = "edge";

export async function POST(request) {
  const ok  = (data)        => new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json" } });
  const err = (msg, status) => new Response(JSON.stringify({ error: msg }), { status, headers: { "Content-Type": "application/json" } });

  try {
    const auth  = (request.headers.get("authorization") || "").trim();
    const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
    if (!token) return err("Unauthorized", 401);

    const sbUrl  = (process.env.NEXT_PUBLIC_SUPABASE_URL      || "").trim();
    const sbAnon = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();
    if (!sbUrl) return err("Supabase URL not configured", 500);

    const uRes = await fetch(sbUrl + "/auth/v1/user", {
      headers: { apikey: sbAnon, Authorization: "Bearer " + token },
    });
    if (!uRes.ok) return err("Unauthorized", 401);

    const uData = await uRes.json().catch(() => null);
    if (!uData?.id) return err("Unauthorized", 401);

    const body   = await request.json().catch(() => ({}));
    const prompt = (body?.prompt || "").trim();
    if (!prompt)             return err("Prompt is required", 400);
    if (prompt.length > 500) return err("Prompt too long", 400);

    const workerUrl = (process.env.CLOUDFLARE_WORKER_URL  || "").trim().replace(/\/$/, "");
    const secret    = (process.env.INTERNAL_API_SECRET    || "").trim();
    if (!workerUrl) return err("Worker URL not configured", 500);
    if (!secret)    return err("Worker secret not configured", 500);

    const wRes  = await fetch(workerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": secret },
      body: JSON.stringify({ userId: uData.id, prompt }),
    });

    const wText = await wRes.text().catch(() => "");
    let wData;
    try { wData = JSON.parse(wText); }
    catch { return err("Worker returned non-JSON: " + wText.slice(0, 200), 502); }

    return new Response(JSON.stringify(wData), {
      status: wRes.status,
      headers: { "Content-Type": "application/json" },
    });

  } catch (e) {
    return err(e?.message || "Server error", 500);
  }
}

