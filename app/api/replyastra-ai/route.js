// app/api/replyastra-ai/route.js
// Next.js API Route to proxy AI requests to Cloudflare Worker

import { createClient } from "@supabase/supabase-js";
import { getCurrentMonth, getPlanLimits } from "@/lib/planLimits";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase.from("profiles").select("plan").eq("id", user.id).single();
    const plan = profile?.plan || "free";
    const limits = getPlanLimits(plan);

    if (!limits.ai_generations) {
      return Response.json({ error: "ReplyAstra AI is not available on the free plan. Upgrade to continue." }, { status: 403 });
    }

    const month = getCurrentMonth();
    const { data: usage } = await supabase
      .from("usage_tracking")
      .select("ai_count")
      .eq("user_id", user.id)
      .eq("month", month)
      .single();

    const aiUsed = usage?.ai_count || 0;
    if (limits.ai_generations !== Infinity && aiUsed >= limits.ai_generations) {
      return Response.json(
        { error: `You have reached your monthly AI limit (${limits.ai_generations}) for the ${plan} plan.` },
        { status: 403 }
      );
    }

    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return Response.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (prompt.length > 500) {
      return Response.json({ error: "Prompt too long. Maximum 500 characters." }, { status: 400 });
    }

    const workerResponse = await fetch(process.env.CLOUDFLARE_WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.INTERNAL_API_SECRET,
      },
      body: JSON.stringify({
        userId: user.id,
        prompt: prompt.trim(),
      }),
    });

    const workerData = await workerResponse.json();

    if (!workerResponse.ok) {
      return Response.json(workerData, { status: workerResponse.status });
    }

    await supabase.from("usage_tracking").upsert(
      {
        user_id: user.id,
        month,
        ai_count: aiUsed + 1,
      },
      { onConflict: "user_id,month" }
    );

    return Response.json(workerData, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Environment variables required in .env:
// CLOUDFLARE_WORKER_URL=https://your-worker.your-subdomain.workers.dev
// INTERNAL_API_SECRET=your-secret-key-here
// NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
// NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
