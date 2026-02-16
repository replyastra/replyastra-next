// app/api/automations/route.js

import { getAuthUser, unauthorized, forbidden, serverError } from "../../lib/authMiddleware";
import { PLAN_LIMITS } from "../../lib/planLimits";

// GET — list all automations
export async function GET() {
  const { user, supabase, error } = await getAuthUser();
  if (error) return unauthorized();

  const { data, error: dbErr } = await supabase
    .from("automations")
    .select("*, instagram_accounts(handle, status)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (dbErr) return serverError();
  return Response.json({ automations: data || [] });
}

// POST — create new automation
export async function POST(req) {
  const { user, profile, supabase, error } = await getAuthUser();
  if (error) return unauthorized();

  const plan = profile.plan || "free";
  const limits = PLAN_LIMITS[plan];

  // Check automation limit
  const { count } = await supabase
    .from("automations")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .neq("status", "disabled_by_system");

  if (limits.automations !== Infinity && count >= limits.automations) {
    return forbidden(`Your ${plan} plan allows ${limits.automations} automations. Upgrade to add more.`);
  }

  const body = await req.json();
  const { keyword, reply, account_id } = body;

  if (!keyword?.trim() || !reply?.trim()) {
    return Response.json({ error: "Keyword and reply are required" }, { status: 400 });
  }

  const { data, error: insertErr } = await supabase
    .from("automations")
    .insert([{
      user_id: user.id,
      account_id: account_id || null,
      keyword: keyword.trim().toLowerCase(),
      reply: reply.trim(),
      status: "active",
      active: true,
    }])
    .select()
    .single();

  if (insertErr) return serverError();
  return Response.json({ automation: data }, { status: 201 });
}
