// app/api/replyastra-ai/route.js
import { getAuthUser, unauth, fail, forbid } from "@/lib/authMiddleware";
import { getPlanContext } from "@/lib/planGuards";

export const runtime = "edge";

export async function POST(request) {
  const { user, profile, error } = await getAuthUser();
  if (error) return unauth();

  try {
    const { features } = getPlanContext(profile);
    if (!features.canUseAI) {
      return forbid("ReplyAstra AI is not available on the free plan.");
    }

    const { prompt } = await request.json();
    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return Response.json({ error: "Prompt is required" }, { status: 400 });
    }

    const workerResponse = await fetch(process.env.CLOUDFLARE_WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.INTERNAL_API_SECRET,
      },
      body: JSON.stringify({ userId: user.id, prompt: prompt.trim() }),
    });

    const payload = await workerResponse.json();
    return Response.json(payload, { status: workerResponse.status });
  } catch {
    return fail();
  }
}
