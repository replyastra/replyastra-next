// app/api/instagram/accounts/route.js
import { getAuthUser, unauth, fail } from "@/lib/authMiddleware";
import { PLAN_LIMITS } from "@/lib/planLimits";

export const runtime = "edge";

export async function GET() {
  const { user, profile, supabase, error } = await getAuthUser();
  if (error) return unauth();

  const { data, error: dbErr } = await supabase
    .from("instagram_accounts")
    .select("id,instagram_id,handle,followers,status,connected_at,token_expires_at")
    .eq("user_id", user.id)
    .neq("status", "disconnected")
    .order("connected_at", { ascending: false });

  if (dbErr) return fail();

  const plan = profile.plan || "free";
  const limit = PLAN_LIMITS[plan].accounts;

  return Response.json({ accounts: data || [], limit, plan, canAddMore: (data || []).length < limit });
}
