// lib/planLimits.js
export const PLAN_LIMITS = {
  free: {
    automations: 3,
    accounts: 1,
    dms_per_month: 500,
    analytics_days: 7,
    leads_preview: 10,
    ai_generations: 0,
    advanced_analytics: false,
    ask_to_follow: false,
    watermark: true,
  },
  starter: {
    automations: 10,
    accounts: 3,
    dms_per_month: 3000,
    analytics_days: 30,
    leads_preview: Infinity,
    ai_generations: 20,
    advanced_analytics: false,
    ask_to_follow: true,
    watermark: false,
  },
  pro: {
    automations: 50,
    accounts: 10,
    dms_per_month: 10000,
    analytics_days: 90,
    leads_preview: Infinity,
    ai_generations: 150,
    advanced_analytics: true,
    ask_to_follow: true,
    watermark: false,
  },
};

export function getPlanLimits(plan) {
  return PLAN_LIMITS[plan] || PLAN_LIMITS.free;
}

export function getCurrentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
