// lib/authMiddleware.js
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function getAuthUser() {
  const cookieStore = cookies();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { global: { headers: { cookie: cookieStore.toString() } } }
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { user: null, profile: null, supabase, error: "Unauthorized" };

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile) return { user: null, profile: null, supabase, error: "Profile not found" };

  // Auto-downgrade if subscription expired
  if (profile.cancel_at_period_end && profile.current_period_end && new Date(profile.current_period_end) < new Date()) {
    await supabase.from("profiles")
      .update({ plan: "free", subscription_status: "expired", cancel_at_period_end: false })
      .eq("id", user.id);
    profile.plan = "free";
    profile.subscription_status = "expired";
  }

  return { user, profile, supabase, error: null };
}

export const unauth = (msg = "Unauthorized") => Response.json({ error: msg }, { status: 401 });
export const forbid = (msg = "Forbidden")    => Response.json({ error: msg }, { status: 403 });
export const fail   = (msg = "Server error") => Response.json({ error: msg }, { status: 500 });
