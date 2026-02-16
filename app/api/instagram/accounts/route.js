// app/api/instagram/accounts/route.js

import { getAuthUser, unauthorized, forbidden, serverError } from "@/lib/authMiddleware";
import { PLAN_LIMITS } from "@/lib/planLimits";

// GET — list connected accounts
export async function GET() {
  const { user, profile, supabase, error } = await getAuthUser();
  if (error) return unauthorized();

  const { data, error: dbErr } = await supabase
    .from("instagram_accounts")
    .select("id, instagram_id, handle, followers, status, connected_at, last_token_refresh, token_expires_at")
    .eq("user_id", user.id)
    .neq("status", "disconnected")
    .order("connected_at", { ascending: false });

  if (dbErr) return serverError();

  const plan = profile.plan || "free";
  const limit = PLAN_LIMITS[plan].accounts;

  return Response.json({
    accounts: data || [],
    limit,
    plan,
    canAddMore: (data || []).length < limit,
  });
}
