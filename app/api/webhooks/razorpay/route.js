// app/api/webhooks/razorpay/route.js
// CRITICAL: This handles all Razorpay billing events

import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

// Use service role client (bypasses RLS) — only for webhooks
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

// ── Verify Razorpay signature ─────────────────────────────────
function verifySignature(body, signature) {
  const expected = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(body)
    .digest("hex");
  return expected === signature;
}

// ── Get user_id from Razorpay subscription ID ─────────────────
async function getUserBySubscriptionId(subscriptionId) {
  const { data } = await supabase
    .from("profiles")
    .select("id, plan")
    .eq("razorpay_subscription_id", subscriptionId)
    .single();
  return data;
}

// ── Handle each event ─────────────────────────────────────────
async function handleEvent(event, payload) {
  const subId = payload?.subscription?.id || payload?.payment?.entity?.subscription_id;

  // Log webhook first
  await supabase.from("webhook_logs").insert({
    event_type: event,
    razorpay_event_id: payload?.id,
    payload,
    processed: false,
  });

  if (!subId) return;
  const user = await getUserBySubscriptionId(subId);
  if (!user) return;

  switch (event) {

    // ── Payment success / renewal ─────────────────────────────
    case "subscription.activated":
    case "invoice.paid": {
      const sub = payload?.subscription || payload?.payment?.entity;
      const planId = sub?.plan_id;

      // Map Razorpay plan ID to your plan name
      const PLAN_MAP = {
        [process.env.RAZORPAY_STARTER_PLAN_ID]: "starter",
        [process.env.RAZORPAY_PRO_PLAN_ID]:     "pro",
      };
      const newPlan = PLAN_MAP[planId] || "starter";

      await supabase.from("profiles").update({
        plan: newPlan,
        subscription_status: "active",
        cancel_at_period_end: false,
        current_period_start: new Date(sub.current_start * 1000).toISOString(),
        current_period_end:   new Date(sub.current_end   * 1000).toISOString(),
      }).eq("id", user.id);

      // Re-enable any automations that were disabled due to payment failure
      await supabase.from("automations")
        .update({ status: "active", active: true, last_error: null })
        .eq("user_id", user.id)
        .eq("last_error", "Payment failed — subscription inactive");

      break;
    }

    // ── Payment failed ────────────────────────────────────────
    case "subscription.halted":
    case "invoice.payment_failed": {
      await supabase.from("profiles").update({
        plan: "free",
        subscription_status: "payment_failed",
      }).eq("id", user.id);

      // Disable automations over free limit (keep first 3)
      const { data: autos } = await supabase
        .from("automations")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: true });

      if (autos && autos.length > 3) {
        const toDisable = autos.slice(3).map((a) => a.id);
        await supabase.from("automations")
          .update({ status: "disabled_by_system", active: false, last_error: "Payment failed — subscription inactive" })
          .in("id", toDisable);
      }

      // Pause excess accounts
      const { data: accounts } = await supabase
        .from("instagram_accounts")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "connected")
        .order("connected_at", { ascending: true });

      if (accounts && accounts.length > 1) {
        const toMark = accounts.slice(1).map((a) => a.id);
        await supabase.from("instagram_accounts")
          .update({ status: "paused" })
          .in("id", toMark);
      }

      break;
    }

    // ── User cancelled ────────────────────────────────────────
    case "subscription.cancelled": {
      const sub = payload?.subscription;
      await supabase.from("profiles").update({
        subscription_status: "cancelled",
        cancel_at_period_end: true,
        current_period_end: sub?.end_at
          ? new Date(sub.end_at * 1000).toISOString()
          : null,
        // Keep plan as is — they keep access till period end
      }).eq("id", user.id);
      break;
    }

    // ── Subscription ended ────────────────────────────────────
    case "subscription.completed": {
      await supabase.from("profiles").update({
        plan: "free",
        subscription_status: "expired",
        cancel_at_period_end: false,
      }).eq("id", user.id);
      break;
    }
  }

  // Mark webhook as processed
  await supabase.from("webhook_logs")
    .update({ processed: true, processed_at: new Date().toISOString() })
    .eq("razorpay_event_id", payload?.id);
}

// ── POST handler ──────────────────────────────────────────────
export async function POST(req) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  // Always verify signature first
  if (!verifySignature(body, signature)) {
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  const payload = JSON.parse(body);
  const event = payload?.event;

  // Process async — return 200 immediately so Razorpay doesn't retry
  handleEvent(event, payload?.payload).catch(console.error);

  return Response.json({ received: true }, { status: 200 });
}
