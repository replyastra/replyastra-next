// app/api/dashboard/overview/route.js
import { getAuthUser, unauth, fail } from "@/lib/authMiddleware";
import { getPlanLimits, getCurrentMonth } from "@/lib/planLimits";

export const runtime = "edge";

export async function GET() {
  const { user, profile, supabase, error } = await getAuthUser();
  if (error) return unauth();

  try {
 codex/identify-next-steps-4uhrma
    const plan = profile.plan_type || profile.plan || "free";

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
 main
    const limits = getPlanLimits(plan);
    const leadLimit = limits.leads_preview === Infinity ? 1000 : limits.leads_preview;
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
    const month = getCurrentMonth();

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
      supabase.from("dm_logs").select("keyword,recipient,status,sent_at").eq("user_id", user.id).order("sent_at", { ascending: false }).limit(leadLimit),
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
        analytics_days: limits.analytics_days,
        leads_preview: limits.leads_preview === Infinity ? null : limits.leads_preview,
        ai_generations: limits.ai_generations,
      },
      recentActivity: recentActivity || [],
      leadPreviewLimited: limits.leads_preview !== Infinity,
      subscription: {
        status: profile.subscription_status,
        cancel_at_period_end: profile.cancel_at_period_end,
        current_period_end: profile.current_period_end,
      },
    });
  } catch (err) {
    return fail();
  }
}
