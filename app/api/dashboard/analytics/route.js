// app/api/dashboard/analytics/route.js
import { getAuthUser, unauth, fail } from "@/lib/authMiddleware";
import { getPlanLimits } from "@/lib/planLimits";

export const runtime = "edge";

export async function GET() {
  const { user, profile, supabase, error } = await getAuthUser();
  if (error) return unauth();

  try {
    const plan = profile.plan_type || profile.plan || "free";
    const limits = getPlanLimits(plan);
    const analyticsDays = limits.analytics_days || 7;
    const analyticsStart = new Date();
    analyticsStart.setHours(0, 0, 0, 0);
    analyticsStart.setDate(analyticsStart.getDate() - (analyticsDays - 1));

    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d;
    });

    const bars = await Promise.all(
      days.map(async (d) => {
        const start = new Date(d);
        start.setHours(0, 0, 0, 0);
        const end = new Date(d);
        end.setHours(23, 59, 59, 999);
        const query = supabase
          .from("dm_logs")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .gte("sent_at", start.toISOString())
          .lte("sent_at", end.toISOString());

        if (start < analyticsStart) {
          return { day: d.toLocaleDateString("en", { weekday: "short" }), dms: 0 };
        }

        const { count } = await query;
        return { day: d.toLocaleDateString("en", { weekday: "short" }), dms: count || 0 };
      })
    );

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const { count: total } = await supabase
      .from("dm_logs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("sent_at", analyticsStart.toISOString());

    const { count: week } = await supabase
      .from("dm_logs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("sent_at", weekAgo.toISOString());

    const { count: failed } = await supabase
      .from("dm_logs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "failed")
      .gte("sent_at", analyticsStart.toISOString());

    const t = total || 0;
    const successRate = t > 0 ? (((t - (failed || 0)) / t) * 100).toFixed(1) : "100.0";

    const { data: logs } = await supabase
      .from("dm_logs")
      .select("keyword")
      .eq("user_id", user.id)
      .gte("sent_at", analyticsStart.toISOString());

    const kwMap = {};
    (logs || []).forEach(({ keyword }) => {
      kwMap[keyword] = (kwMap[keyword] || 0) + 1;
    });

    const topKeywords = Object.entries(kwMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([k, c]) => ({ keyword: k, count: c, pct: t > 0 ? Math.round((c / t) * 100) : 0 }));

    let breakdown = null;
    if (plan === "starter" || plan === "pro") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: todayDMs } = await supabase
        .from("dm_logs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("sent_at", today.toISOString());
      breakdown = { today: todayDMs || 0, week: week || 0, total: t, successRate };
    }

    let advanced = null;
    if (plan === "pro") {
      const trend30Days = await Promise.all(
        Array.from({ length: 30 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (29 - i));
          return d;
        }).map(async (d) => {
          const start = new Date(d);
          start.setHours(0, 0, 0, 0);
          const end = new Date(d);
          end.setHours(23, 59, 59, 999);

          if (start < analyticsStart) {
            return { date: d.toISOString().split("T")[0], dms: 0 };
          }

          const { count } = await supabase
            .from("dm_logs")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
            .gte("sent_at", start.toISOString())
            .lte("sent_at", end.toISOString());
          return { date: d.toISOString().split("T")[0], dms: count || 0 };
        })
      );
      const { data: autoStats } = await supabase
        .from("automations")
        .select("keyword,triggered,fail_count")
        .eq("user_id", user.id);
      advanced = { trend30Days, automationStats: autoStats || [], conversionRates: { comment_to_dm: successRate } };
    }

    return Response.json({ plan, analyticsDays, bars, stats: { total: t, week: week || 0, successRate }, topKeywords, breakdown, advanced });
  } catch (err) {
    return fail();
  }
}
