// app/api/subscription/route.js
import { getAuthUser, unauth, forbid, fail } from "@/lib/authMiddleware";

export const runtime = "edge";

const PLAN_PRICES = { free: 0, starter: 199, pro: 399 };

function getPlan(profile) {
  return profile.plan_type || profile.plan || "free";
}

export async function GET() {
  const { profile, error } = await getAuthUser();
  if (error) return unauth();

  return Response.json({
    plan: getPlan(profile),
    status: profile.subscription_status || "inactive",
    cancel_at_period_end: profile.cancel_at_period_end || false,
    current_period_end: profile.current_period_end || profile.subscription_end_date || null,
  });
}

export async function POST(req) {
  const { user, profile, supabase, error } = await getAuthUser();
  if (error) return unauth();

  try {
    const { targetPlan, paymentConfirmed } = await req.json();
    if (!targetPlan || !PLAN_PRICES[targetPlan]) {
      return Response.json({ error: "Invalid target plan" }, { status: 400 });
    }

    const currentPlan = getPlan(profile);
    if (currentPlan === targetPlan) {
      return Response.json({ error: "Already on this plan" }, { status: 400 });
    }

    if (targetPlan !== "pro" && targetPlan !== "starter") {
      return forbid("Only paid plan upgrades are handled here.");
    }

    const now = new Date();
    const subscriptionEnd = profile.subscription_end_date || profile.current_period_end;
    const hasActiveStarter = currentPlan === "starter" && subscriptionEnd && new Date(subscriptionEnd) > now;

    let amountDue = PLAN_PRICES[targetPlan];
    let nextSubscriptionEndDate = subscriptionEnd || null;

    if (hasActiveStarter && targetPlan === "pro") {
      amountDue = PLAN_PRICES.pro - PLAN_PRICES.starter;
    } else if (!subscriptionEnd || new Date(subscriptionEnd) <= now) {
      const d = new Date(now);
      d.setMonth(d.getMonth() + 1);
      nextSubscriptionEndDate = d.toISOString();
    }

    if (!paymentConfirmed) {
      return Response.json({
        targetPlan,
        currentPlan,
        amountDue,
        currency: "INR",
        subscription_end_date: nextSubscriptionEndDate,
      });
    }

    const { error: updateErr } = await supabase
      .from("profiles")
      .update({
        plan: targetPlan,
        plan_type: targetPlan,
        subscription_status: "active",
        subscription_end_date: nextSubscriptionEndDate,
        current_period_end: nextSubscriptionEndDate,
      })
      .eq("id", user.id);

    if (updateErr) return fail();

    return Response.json({
      success: true,
      targetPlan,
      amountDue,
      subscription_end_date: nextSubscriptionEndDate,
      note: "AI usage counters are preserved and not reset on upgrade.",
    });
  } catch {
    return fail();
  }
}
