// lib/authMiddleware.js
// Use this at the top of every API route

import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// Create supabase client for API routes using cookies
function createServerClient() {
  const cookieStore = cookies();
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          cookie: cookieStore.toString(),
        },
      },
    }
  );
}

export async function getAuthUser() {
  const supabase = createServerClient();

  // 1. Get logged-in user from session
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return { user: null, profile: null, supabase, error: "Unauthorized" };
  }

  // 2. Get their profile (plan + subscription status)
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return { user: null, profile: null, supabase, error: "Profile not found" };
  }

  // 3. Check if subscription expired (cancelled past end date)
  if (
    profile.cancel_at_period_end &&
    profile.current_period_end &&
    new Date(profile.current_period_end) < new Date()
  ) {
    // Auto-downgrade to free
    await supabase
      .from("profiles")
      .update({ plan: "free", subscription_status: "expired", cancel_at_period_end: false })
      .eq("id", user.id);
    profile.plan = "free";
    profile.subscription_status = "expired";
  }

  return { user, profile, supabase, error: null };
}

export function unauthorized(message = "Unauthorized") {
  return Response.json({ error: message }, { status: 401 });
}

export function forbidden(message = "Forbidden") {
  return Response.json({ error: message }, { status: 403 });
}

export function serverError(message = "Internal server error") {
  return Response.json({ error: message }, { status: 500 });
}
