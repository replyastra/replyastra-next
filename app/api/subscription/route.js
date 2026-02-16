// app/api/subscription/route.js

import { getAuthUser, unauthorized, serverError } from "@/lib/authMiddleware";

// GET — get subscription status
export async function GET() {
  const { user, profile, supabase, error } = await getAuthUser();
  if (error) return unauthorized();

  return Response.json({
    plan: profile.plan || "free",
    status: profile.subscription_status || "inactive",
    cancel_at_period_end: profile.cancel_at_period_end || false,
    current_period_end: profile.current_period_end,
    razorpay_subscription_id: profile.razorpay_subscription_id,
  });
}

// POST — create Razorpay subscription
export async function POST(req) {
  const { user, profile, supabase, error } = await getAuthUser();
  if (error) return unauthorized();

  const { plan } = await req.json();

  if (!["starter", "pro"].includes(plan)) {
    return Response.json({ error: "Invalid plan" }, { status: 400 });
  }

  const PLAN_IDS = {
    starter: process.env.RAZORPAY_STARTER_PLAN_ID,
    pro:     process.env.RAZORPAY_PRO_PLAN_ID,
  };

  try {
    const Razorpay = require("razorpay");
    const razorpay = new Razorpay({
      key_id:     process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Create or get customer
    let customerId = profile.razorpay_customer_id;
    if (!customerId) {
      const { data: userData } = await supabase.auth.getUser();
      const customer = await razorpay.customers.create({
        name:  profile.full_name || "ReplyAstra User",
        email: userData.user.email,
      });
      customerId = customer.id;
      await supabase.from("profiles").update({ razorpay_customer_id: customerId }).eq("id", user.id);
    }

    // Create subscription
    const subscription = await razorpay.subscriptions.create({
      plan_id:         PLAN_IDS[plan],
      customer_notify: 1,
      quantity:        1,
      total_count:     120, // 10 years max
      addons:          [],
    });

    // Save subscription ID to profile
    await supabase.from("profiles").update({
      razorpay_subscription_id: subscription.id,
    }).eq("id", user.id);

    return Response.json({
      subscription_id: subscription.id,
      short_url:       subscription.short_url,
    });
  } catch (err) {
    console.error("Subscription create error:", err);
    return serverError("Failed to create subscription");
  }
}

// DELETE — cancel subscription
export async function DELETE() {
  const { user, profile, supabase, error } = await getAuthUser();
  if (error) return unauthorized();

  if (!profile.razorpay_subscription_id) {
    return Response.json({ error: "No active subscription" }, { status: 400 });
  }

  try {
    const Razorpay = require("razorpay");
    const razorpay = new Razorpay({
      key_id:     process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Cancel at period end (cancel_at_cycle_end: 1 = wait till end)
    await razorpay.subscriptions.cancel(profile.razorpay_subscription_id, { cancel_at_cycle_end: 1 });

    // Webhook will handle the actual DB update
    return Response.json({ success: true, message: "Subscription will end at current period end" });
  } catch (err) {
    console.error("Cancel error:", err);
    return serverError("Failed to cancel subscription");
  }
}
