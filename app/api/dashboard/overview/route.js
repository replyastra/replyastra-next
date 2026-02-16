// app/api/dashboard/overview/route.js

import { getAuthUser, unauthorized, serverError } from "../../../lib/authMiddleware";
import { PLAN_LIMITS, getCurrentMonth } from "../../../lib/planLimits";

export async function GET() {
  const { user, profile, supabase, error } = await getAuthUser();
  if (error) return unauthorized();

  try {
    const plan = profile.plan || "free";
    const limits = PLAN_LIMITS[plan];
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const month = getCurrentMonth();

    // Fetch all stats in parallel
    const [
      { count: totalDMs },
      { count: weekDMs },
      { count: activeAutos },
      { count: totalAccounts },
      { data: recentActivity },
      { data: usage },
    ] = await Promise.all([
      supabase.from("dm_logs").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("dm_logs").select("*", { count: "exact", head: true }).eq("user_id", user.id).gte("sent_at", weekAgo.toISOString()),
      supabase.from("automations").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "active"),
      supabase.from("instagram_accounts").select("*", { count: "exact", head: true }).eq("user_id", user.id).neq("status", "disconnected"),
      supabase.from("dm_logs").select("keyword, recipient, status, sent_at, error_message").eq("user_id", user.id).order("sent_at", { ascending: false }).limit(8),
      supabase.from("usage_tracking").select("dm_count").eq("user_id", user.id).eq("month", month).single(),
    ]);

    const monthlyDMs = usage?.dm_count || 0;
    const dmLimit = limits.dms_per_month;

    return Response.json({
      plan,
      stats: {
        totalDMs: totalDMs || 0,
        weekDMs: weekDMs || 0,
        activeAutomations: activeAutos || 0,
        totalAccounts: totalAccounts || 0,
        monthlyDMs,
        dmLimit: dmLimit === Infinity ? null : dmLimit,
        dmLimitPct: dmLimit === Infinity ? 0 : Math.round((monthlyDMs / dmLimit) * 100),
      },
      limits: {
        automations: limits.automations === Infinity ? null : limits.automations,
        accounts: limits.accounts,
        watermark: limits.watermark,
        advanced_analytics: limits.advanced_analytics,
        ask_to_follow: limits.ask_to_follow,
      },
      recentActivity: recentActivity || [],
      subscription: {
        status: profile.subscription_status,
        cancel_at_period_end: profile.cancel_at_period_end,
        current_period_end: profile.current_period_end,
      },
    });
  } catch (err) {
    console.error("Overview error:", err);
    return serverError();
  }
}
