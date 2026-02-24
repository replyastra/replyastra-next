import { NextResponse } from "next/server";
import { getAuthUser, unauth, fail, forbid } from "@/lib/authMiddleware";
import { getPlanContext } from "@/lib/planGuards";

export const runtime = "edge";

export async function POST(request) {
  const { user, profile, supabase, error } = await getAuthUser();
  if (error) return unauth();

  const planCtx = getPlanContext(profile);

  if (!planCtx.features.ai) {
    return NextResponse.json(
      { error: "Upgrade to use ReplyAstra AI." },
      { status: 403 }
    );
  }

  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (prompt.length > 500) {
      return NextResponse.json(
        { error: "Prompt too long. Maximum 500 characters." },
        { status: 400 }
      );
    }

    const workerUrl = process.env.CLOUDFLARE_WORKER_URL;
    const apiSecret = process.env.INTERNAL_API_SECRET;

    if (!workerUrl || !apiSecret) {
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 500 }
      );
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
    console.error("AI API error:", err);
    return fail();
  }
}
