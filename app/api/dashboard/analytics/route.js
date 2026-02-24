import { NextResponse } from "next/server";
import { getAuthUser, unauth, fail } from "@/lib/authMiddleware";
import { PLAN_LIMITS } from "@/lib/planLimits";

export async function GET(request) {
  const { user, profile, supabase, error } = await getAuthUser();
  if (error) return unauth();

  try {
    const plan = profile.plan_type || profile.plan || "free";

    const analyticsWindow = PLAN_LIMITS[plan]?.analytics || 7;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - analyticsWindow);

    const { data: dmLogs, error: dmErr } = await supabase
      .from("dm_logs")
      .select("*")
      .eq("user_id", user.id)
      .gte("sent_at", cutoffDate.toISOString())
      .order("sent_at", { ascending: false });

    if (dmErr) return fail();

    const { data: automations, error: autoErr } = await supabase
      .from("automations")
      .select("*")
      .eq("user_id", user.id);

    if (autoErr) return fail();

    return NextResponse.json({
      dm_logs: dmLogs || [],
      automations: automations || [],
      analytics_window: analyticsWindow,
    });
  } catch (err) {
    return fail();
  }
}
