
import { NextResponse } from "next/server";

// Cloudflare Pages requires edge runtime on all API routes
export const runtime = "edge";

export async function POST(request) {
  try {
    // ── 1. Auth — verify token directly via Supabase REST (edge-safe) ──
    const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
    const accessToken = authHeader?.replace("Bearer ", "");

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Verify token using Supabase Auth REST API (no JS client needed — fully edge-safe)
    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        apikey: supabaseAnon,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userRes.ok) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await userRes.json();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── 2. Parse request body ────────────────────────────────
    const body = await request.json();
    const prompt = body?.prompt;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (prompt.length > 500) {
      return NextResponse.json({ error: "Prompt too long. Maximum 500 characters." }, { status: 400 });
    }

    // ── 3. Forward to Cloudflare Worker ─────────────────────
    const workerUrl = process.env.CLOUDFLARE_WORKER_URL;
    const apiSecret = process.env.INTERNAL_API_SECRET;

    if (!workerUrl || !apiSecret) {
      return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
    }

    const workerResponse = await fetch(workerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiSecret,
      },
      body: JSON.stringify({
        userId: user.id,
        prompt: prompt.trim(),
      }),
    });

    const workerData = await workerResponse.json();

    if (!workerResponse.ok) {
      return NextResponse.json(workerData, { status: workerResponse.status });
    }

    return NextResponse.json(workerData, { status: 200 });

  } catch (err) {
    // Expose real error temporarily for debugging
    return NextResponse.json({ error: err?.message || err?.toString() || "Server error" }, { status: 500 });
  }
}
