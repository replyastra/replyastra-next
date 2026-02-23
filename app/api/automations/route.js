// app/api/automations/route.js
import { getAuthUser, unauth, forbid, fail } from "@/lib/authMiddleware";
import { getPlanLimits, getCurrentMonth } from "@/lib/planLimits";

export const runtime = "edge";

export async function GET() {
  const { user, supabase, error } = await getAuthUser();
  if (error) return unauth();

  const { data, error: dbErr } = await supabase
    .from("automations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (dbErr) return fail();
  return Response.json({ automations: data || [] });
}

export async function POST(req) {
  const { user, profile, supabase, error } = await getAuthUser();
  if (error) return unauth();

 codex/identify-next-steps-nbp9zw
  const plan = profile.plan_type || profile.plan || "free";

  const plan = profile.plan || "free";
 main
  const limits = getPlanLimits(plan);

  const { count } = await supabase
    .from("automations")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .neq("status", "disabled_by_system");

  if (limits.automations !== Infinity && count >= limits.automations) {
    return forbid(`Your ${plan} plan allows ${limits.automations} automations. Upgrade to add more.`);
  }

  const month = getCurrentMonth();
  const { data: usage } = await supabase
    .from("usage_tracking")
    .select("dm_count")
    .eq("user_id", user.id)
    .eq("month", month)
    .single();

  const monthlyDMs = usage?.dm_count || 0;
  if (limits.dms_per_month !== Infinity && monthlyDMs >= limits.dms_per_month) {
    return forbid(`Your ${plan} plan allows ${limits.dms_per_month} DMs per month. Upgrade to continue sending DMs.`);
  }

  const body = await req.json();
  const { keyword, reply, account_id } = body;
  if (!keyword?.trim() || !reply?.trim()) {
    return Response.json({ error: "Keyword and reply are required" }, { status: 400 });
  }

  const { data, error: insertErr } = await supabase
    .from("automations")
    .insert([{ user_id: user.id, account_id: account_id || null, keyword: keyword.trim().toLowerCase(), reply: reply.trim(), status: "active", active: true }])
    .select().single();

  if (insertErr) return fail();
  return Response.json({ automation: data }, { status: 201 });
}
