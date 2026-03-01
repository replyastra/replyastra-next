export const runtime = "edge";

export async function POST(request) {
  try {
    const workerUrl = (process.env.CLOUDFLARE_WORKER_URL || "").trim().replace(/\/$/, "");
    if (!workerUrl) {
      return new Response(JSON.stringify({ error: "CLOUDFLARE_WORKER_URL not set" }), {
        status: 500, headers: { "Content-Type": "application/json" },
      });
    }

    const bodyText = await request.text().catch(() => "{}");
    const authHeader = request.headers.get("authorization") || request.headers.get("Authorization") || "";

    const wRes = await fetch(workerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": authHeader },
      body: bodyText,
    });

    const responseText = await wRes.text().catch(() => "{}");
    return new Response(responseText, {
      status: wRes.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e?.message || "Server error" }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }
}

