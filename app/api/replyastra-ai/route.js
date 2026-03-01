export const runtime = "edge";

export async function POST(request) {
  try {
    const workerUrl = (process.env.CLOUDFLARE_WORKER_URL || "").trim().replace(/\/$/, "");
    if (!workerUrl) {
      return new Response(JSON.stringify({ error: "CLOUDFLARE_WORKER_URL not configured" }), {
        status: 500, headers: { "Content-Type": "application/json" },
      });
    }

    // Read body — contains { token, prompt }
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400, headers: { "Content-Type": "application/json" },
      });
    }

    const token = body?.token || "";
    const prompt = body?.prompt || "";

    if (!token) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401, headers: { "Content-Type": "application/json" },
      });
    }

    // Forward to worker with Bearer token in Authorization header
    const wRes = await fetch(workerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ prompt }),
    });

    const responseText = await wRes.text();
    return new Response(responseText, {
      status: wRes.status,
      headers: { "Content-Type": "application/json" },
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e?.message || "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

