// app/api/instagram/accounts/route.js
import { getAuthUser, unauth, forbid, fail } from "@/lib/authMiddleware";
import { getPlanLimits } from "@/lib/planLimits";

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

 codex/identify-next-steps-crj88c
  const plan = profile.plan_type || profile.plan || "free";

 codex/identify-next-steps-jexmxf
  const plan = profile.plan_type || profile.plan || "free";

 codex/identify-next-steps-euibxt
  const plan = profile.plan_type || profile.plan || "free";

  const plan = profile.plan || "free";
 main
 main
 main
  const limit = getPlanLimits(plan).accounts;

  return Response.json({ accounts: data || [], limit, plan, canAddMore: (data || []).length < limit });
}

export async function POST(req) {
  const { user, profile, supabase, error } = await getAuthUser();
  if (error) return unauth();

 codex/identify-next-steps-crj88c
  const plan = profile.plan_type || profile.plan || "free";

 codex/identify-next-steps-jexmxf
  const plan = profile.plan_type || profile.plan || "free";

 codex/identify-next-steps-euibxt
  const plan = profile.plan_type || profile.plan || "free";

  const plan = profile.plan || "free";
 main
 main
 main
  const limits = getPlanLimits(plan);

  const { count } = await supabase
    .from("instagram_accounts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .neq("status", "disconnected");

  if (limits.accounts !== Infinity && (count || 0) >= limits.accounts) {
    return forbid(`Your ${plan} plan allows ${limits.accounts} Instagram account${limits.accounts === 1 ? "" : "s"}. Upgrade to connect more.`);
  }

  const body = await req.json();
  const { instagram_id, handle, followers, token_expires_at } = body || {};

  if (!instagram_id || !handle) {
    return Response.json({ error: "instagram_id and handle are required" }, { status: 400 });
  }

  const { data, error: insertErr } = await supabase
    .from("instagram_accounts")
    .insert([
      {
        user_id: user.id,
        instagram_id,
        handle,
        followers: Number.isFinite(Number(followers)) ? Number(followers) : 0,
        status: "connected",
        token_expires_at: token_expires_at || null,
      },
    ])
    .select("id,instagram_id,handle,followers,status,connected_at,token_expires_at")
    .single();

  if (insertErr) return fail();
  return Response.json({ account: data }, { status: 201 });
}
