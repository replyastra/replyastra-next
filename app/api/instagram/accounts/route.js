export const runtime = "edge";
import { NextResponse } from "next/server";
import { getAuthUser, unauth, fail } from "@/lib/authMiddleware";
import { PLAN_LIMITS } from "@/lib/planLimits";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { user, profile, supabase, error } = await getAuthUser();
  if (error) return unauth();

  const { data, error: dbErr } = await supabase
    .from("instagram_accounts")
    .select("*")
    .eq("user_id", user.id)
    .neq("status", "disconnected")
    .order("connected_at", { ascending: false });

  if (dbErr) return fail();

  const plan = profile.plan_type || profile.plan || "free";

  return NextResponse.json({
    accounts: data || [],
    limit: PLAN_LIMITS[plan]?.accounts || 1,
    plan,
  });
}

export async function POST(request) {
  const { user, profile, supabase, error } = await getAuthUser();
  if (error) return unauth();

  const plan = profile.plan_type || profile.plan || "free";

  const { count: currentCount } = await supabase
    .from("instagram_accounts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .neq("status", "disconnected");

  const limit = PLAN_LIMITS[plan]?.accounts || 1;
  if (currentCount >= limit) {
    return NextResponse.json(
      { error: `Account limit reached. Upgrade to connect more accounts.` },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { handle, access_token, instagram_user_id } = body;

    if (!handle || !access_token || !instagram_user_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error: insertErr } = await supabase
      .from("instagram_accounts")
      .insert({
        user_id: user.id,
        handle,
        access_token,
        instagram_user_id,
        status: "connected",
        connected_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertErr) return fail();
    return NextResponse.json({ account: data });
  } catch (err) {
    return fail();
  }
}
