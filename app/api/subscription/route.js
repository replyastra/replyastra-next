// app/api/subscription/route.js
import { getAuthUser, unauth } from "@/lib/authMiddleware";

export const runtime = "edge";

export async function GET() {
  const { profile, error } = await getAuthUser();
  if (error) return unauth();

  return Response.json({
    plan: profile.plan || "free",
    status: profile.subscription_status || "inactive",
    cancel_at_period_end: profile.cancel_at_period_end || false,
    current_period_end: profile.current_period_end,
  });
}
