"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { auth: { persistSession: true, autoRefreshToken: true, storageKey: "replyastra-auth" } }
);

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "₹0/mo",
    features: [
      "500 DMs per month",
      "3 automation rules",
      "1 Instagram account",
      "7-day analytics",
      "Lead preview (up to 10 contacts)",
      "Multi-language dashboard",
      "ReplyAstra watermark",
      "Community support",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    price: "₹199/mo",
    features: [
      "3,000 DMs per month",
      "10 automation rules",
      "3 Instagram accounts",
      "30-day analytics",
      "ReplyAstra AI (20 generations/month)",
      "Lead generation & contact management",
      "Multi-language dashboard",
      "Email support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹399/mo",
    features: [
      "10,000 DMs per month",
      "50 automation rules",
      "10 Instagram accounts",
      "90-day advanced analytics",
      "ReplyAstra AI Pro (150 generations/month)",
      "Advanced lead insights & automation",
      "Multi-language dashboard",
      "Priority support",
    ],
  },
];

function getButtonLabel(currentPlan, targetPlan) {
  if (currentPlan === targetPlan) return "Current Plan";
  if (targetPlan === "starter") return "Upgrade to Starter";
  if (targetPlan === "pro") return "Upgrade to Pro";
  return "Upgrade";
}

export default function DashboardPricingPage() {
  const [userId, setUserId] = useState(null);
  const [plan, setPlan] = useState("free");
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user?.id) {
        window.location.href = "/login";
        return;
      }

      setUserId(session.user.id);
      const { data } = await supabase.from("profiles").select("plan").eq("id", session.user.id).single();
      setPlan(data?.plan || "free");
      setLoading(false);
    }

    loadProfile();
  }, []);

  async function handleUpgrade(targetPlan) {
    if (!userId || targetPlan === plan) return;

    setUpgrading(targetPlan);
    const { error } = await supabase
      .from("profiles")
      .update({
        plan: targetPlan,
        subscription_status: targetPlan === "free" ? "inactive" : "active",
        subscription_start_date: new Date().toISOString(),
      })
      .eq("id", userId);

    if (!error) {
      setPlan(targetPlan);
    }

    setUpgrading("");
  }

  if (loading) {
    return (
      <div className="p-4 lg:p-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 text-sm text-gray-500">Loading pricing…</div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="serif text-2xl sm:text-4xl text-gray-900 font-normal italic">Pricing</h1>
        <p className="text-sm text-gray-500 mt-1">Choose the plan that fits your growth.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((p) => {
          const isCurrent = plan === p.id;
          const isDisabled = isCurrent || upgrading.length > 0;

          return (
            <div key={p.id} className={`bg-white rounded-2xl border p-6 ${isCurrent ? "border-gray-900" : "border-gray-200"}`}>
              <div className="mb-4">
                <h2 className="text-xl font-black text-gray-900">{p.name}</h2>
                <p className="text-sm text-gray-500 mt-1">{p.price}</p>
              </div>

              <ul className="space-y-2 mb-6">
                {p.features.map((feature) => (
                  <li key={feature} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="mt-1 inline-block w-1.5 h-1.5 rounded-full bg-gray-900" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                disabled={isDisabled}
                onClick={() => handleUpgrade(p.id)}
                className={`w-full py-2.5 rounded-xl text-sm font-bold ${isCurrent ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-gray-900 text-white hover:bg-gray-800"}`}
              >
                {upgrading === p.id ? "Updating..." : getButtonLabel(plan, p.id)}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
