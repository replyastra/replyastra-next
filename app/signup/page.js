"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { auth: { persistSession: true, autoRefreshToken: true, storageKey: "replyastra-auth" } }
);

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Persistent session — skip signup if already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) window.location.href = "/dashboard";
    });
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.name },
        // FIX: After clicking confirm email → goes directly to dashboard, not homepage
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (authError) {
      const msg = authError.message?.toLowerCase() || "";
      if (msg.includes("already registered") || msg.includes("user already exists")) {
        setError("An account with this email already exists. Please log in instead.");
      } else {
        setError(authError.message);
      }
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
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

          {/* Success state — original */}
          {success ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">Check your email!</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                We sent a confirmation link to <strong>{form.email}</strong>.
                Click it to activate your account.
              </p>
              {/* FIX: Tell user clicking the link goes to dashboard */}
              <p className="text-xs text-emerald-600 font-semibold mt-3">
                ✓ Clicking the link will take you directly to your dashboard
              </p>
              <a href="/login" className="inline-block mt-5 text-sm font-bold text-emerald-600 hover:underline">
                Back to Login
              </a>
            </div>
          ) : (
            <>
              <p className="text-center text-sm text-gray-500 mb-8">
                Create your account and start automating.
              </p>

              {error && (
                <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                  {error}
                  {error.includes("already exists") && (
                    <a href="/login" className="block mt-1 text-emerald-600 font-bold hover:underline text-xs">
                      → Log in to your account
                    </a>
                  )}
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                  />
                </div>

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
                    minLength={6}
                    placeholder="Create password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                  />
                  <p className="text-xs text-gray-400 mt-1">Minimum 6 characters</p>
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
                      Creating account...
                    </>
                  ) : "Create Account"}
                </button>
              </form>

              <p className="text-center text-xs text-gray-400 mt-6">
                Already have an account?{" "}
                <a href="/login" className="text-emerald-600 font-semibold hover:underline">Login</a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
