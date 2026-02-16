// lib/planLimits.js
export const PLAN_LIMITS = {
  free: {
    automations:        3,
    accounts:           1,
    dms_per_month:      100,
    advanced_analytics: false,
    ask_to_follow:      false,
    watermark:          true,
  },
  starter: {
    automations:        Infinity,
    accounts:           3,
    dms_per_month:      5000,
    advanced_analytics: false,
    ask_to_follow:      true,
    watermark:          false,
  },
  pro: {
    automations:        Infinity,
    accounts:           10,
    dms_per_month:      Infinity,
    advanced_analytics: true,
    ask_to_follow:      true,
    watermark:          false,
  },
};

export function getCurrentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
