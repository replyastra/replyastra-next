"use client";

import { useState, useEffect, Suspense } from "react";
import { createClient } from "@supabase/supabase-js";
import { useSearchParams } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { auth: { persistSession: true, autoRefreshToken: true, storageKey: "replyastra-auth" } }
);

function LoginForm() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // FIX 1: Handle expired OTP links (password reset / email confirm)
    const errCode = searchParams.get("error_code");
    if (errCode === "otp_expired") {
      setError("This link has expired. Please log in again or reset your password.");
    } else if (errCode) {
      setError("The link was invalid or expired. Please try again.");
    }

    // FIX 2: Persistent session - if already logged in, skip login entirely
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) window.location.href = "/dashboard";
    });
  }, [searchParams]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (authError) {
      // FIX 3: Better error messages
      const msg = authError.message?.toLowerCase() || "";
      if (msg.includes("invalid login credentials") || msg.includes("invalid credentials")) {
        setError("No account found with this email, or wrong password. Check your details or sign up.");
      } else if (msg.includes("email not confirmed")) {
        setError("Please confirm your email first. Check your inbox for the confirmation link.");
      } else if (msg.includes("too many")) {
        setError("Too many attempts. Please wait a minute and try again.");
      } else {
        setError(authError.message);
      }
      setLoading(false);
    } else {
      window.location.href = "/dashboard";
    }
  };

  // ── ORIGINAL DESIGN — unchanged ──────────────────────────────
  return (
    <div className="min-h-screen bg-[#f0fdfa] flex items-center justify-center px-4">

      <a href="/" className="fixed top-6 left-6 text-sm font-semibold text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-1">
        ← Back to Home
      </a>

      <div className="w-full max-w-sm">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 px-8 py-10">

          <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="ReplyAstra" className="h-10 w-auto" />
          </div>

          <p className="text-center text-sm text-gray-500 mb-8">
            Welcome back. Login to your dashboard.
          </p>

          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
              {error}
              {error.includes("No account found") && (
                <a href="/signup" className="block mt-1 text-emerald-600 font-bold hover:underline text-xs">
                  → Create a free account
                </a>
              )}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                required
                placeholder="you@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              />
            </div>

            <div className="flex justify-end">
              <a href="/forgot-password" className="text-xs text-emerald-600 font-semibold hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Logging in...
                </>
              ) : "Login"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-emerald-600 font-semibold hover:underline">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f0fdfa] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
