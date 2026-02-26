
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request) {
  try {
    // ── 1. Auth via Bearer token ──────────────────────────────────────
    const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
    const accessToken = authHeader?.replace("Bearer ", "").trim();

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Trim env vars to handle accidental spaces in Cloudflare Pages settings
    const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
    const supabaseAnon = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();

    if (!supabaseUrl || !supabaseAnon) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    // Verify token using Supabase Auth REST API (fully edge-safe, no JS client)
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

    // ── 2. Parse body ─────────────────────────────────────────────────
    const body = await request.json();
    const prompt = body?.prompt;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }
    if (prompt.length > 500) {
      return NextResponse.json({ error: "Prompt too long (max 500 chars)" }, { status: 400 });
    }

    // ── 3. Forward to Cloudflare Worker ──────────────────────────────
    const workerUrl = (process.env.CLOUDFLARE_WORKER_URL || "").trim();
    const apiSecret = (process.env.INTERNAL_API_SECRET || "").trim();

    if (!workerUrl || !apiSecret) {
      return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
    }

    const workerRes = await fetch(workerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiSecret,
      },
      body: JSON.stringify({ userId: user.id, prompt: prompt.trim() }),
    });

    const workerData = await workerRes.json();

    return NextResponse.json(workerData, { status: workerRes.status });

  } catch (err) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
