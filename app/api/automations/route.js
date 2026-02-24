
import { NextResponse } from "next/server";
import { getAuthUser, unauth, fail } from "@/lib/authMiddleware";
import { PLAN_LIMITS } from "@/lib/planLimits";
import { checkPlanLimit } from "@/lib/planGuards";



export async function GET(request) {
  const { user, profile, supabase, error } = await getAuthUser();
  if (error) return unauth();

  const { data, error: dbErr } = await supabase
    .from("automations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (dbErr) return fail();
  return NextResponse.json({ automations: data || [] });
}

export async function POST(request) {
  const { user, profile, supabase, error } = await getAuthUser();
  if (error) return unauth();

  const plan = profile.plan_type || profile.plan || "free";

  const { count: currentCount } = await supabase
    .from("automations")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const limit = PLAN_LIMITS[plan]?.automations || 3;
  if (currentCount >= limit) {
    return NextResponse.json(
      { error: `Automation limit reached. Upgrade to create more.` },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { trigger_type, trigger_value, response_message, account_id } = body;

    if (!trigger_type || !trigger_value || !response_message || !account_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error: insertErr } = await supabase
      .from("automations")
      .insert({
        user_id: user.id,
        account_id,
        trigger_type,
        trigger_value,
        response_message,
        status: "active",
        active: true,
      })
      .select()
      .single();

    if (insertErr) return fail();
    return NextResponse.json({ automation: data });
  } catch (err) {
    return fail();
  }
}

export async function DELETE(request) {
  const { user, supabase, error } = await getAuthUser();
  if (error) return unauth();

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing automation ID" }, { status: 400 });
    }

    const { error: delErr } = await supabase
      .from("automations")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (delErr) return fail();
    return NextResponse.json({ success: true });
  } catch (err) {
    return fail();
  }
}
