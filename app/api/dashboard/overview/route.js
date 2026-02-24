
import { NextResponse } from "next/server";
import { getAuthUser, unauth, fail } from "@/lib/authMiddleware";
import { PLAN_LIMITS } from "@/lib/planLimits";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { user, profile, supabase, error } = await getAuthUser();
  if (error) return unauth();

  try {
    const plan = profile.plan_type || profile.plan || "free";

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const [
      { count: totalDMs },
      { count: sentDMs },
      { count: activeAutomations },
      { count: totalContacts }
    ] = await Promise.all([
      supabase
        .from("dm_logs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("sent_at", monthStart.toISOString()),
      supabase
        .from("dm_logs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "sent")
        .gte("sent_at", monthStart.toISOString()),
      supabase
        .from("automations")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "active"),
      supabase
        .from("contacts")
        .select("*", { count: "exact", head: true })
        .eq("owner_user_id", user.id)
    ]);

    const conversionRate = totalDMs > 0 ? ((sentDMs / totalDMs) * 100).toFixed(1) : "0.0";

    return NextResponse.json({
      sent_replies: totalDMs || 0,
      automation_hits: activeAutomations || 0,
      conversion_rate: conversionRate,
      leads: totalContacts || 0,
      plan,
      limits: PLAN_LIMITS[plan],
    });
  } catch (err) {
    return fail();
  }
}
