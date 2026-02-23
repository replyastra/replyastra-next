// lib/planGuards.js
import { getPlanLimits } from "@/lib/planLimits";

export function getUserPlan(profile) {
  return profile?.plan_type || profile?.plan || "free";
}

export function getFeatureFlags(plan) {
  const limits = getPlanLimits(plan);
  return {
    canUseAI: limits.ai_generations > 0,
    contactsLimit: plan === "free" ? 10 : Infinity,
    canTagContacts: plan !== "free",
    canExportContacts: plan !== "free",
    canSeeEngagementScore: plan === "pro",
    canUseAdvancedFilters: plan === "pro",
    canUseTimeline: plan === "pro",
    canViewAnalyticsSummary: plan === "pro",
    canUseAutoTagging: plan === "pro",
    aiDailyLimit: plan === "pro" ? 10 : plan === "starter" ? 3 : 0,
    aiMonthlyLimit: limits.ai_generations,
  };
}

export function getPlanContext(profile) {
  const plan = getUserPlan(profile);
  const limits = getPlanLimits(plan);
  const features = getFeatureFlags(plan);
  return { plan, limits, features };
}
