"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";


export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    // NOTE: Always call resetPasswordForEmail — Supabase does NOT reveal if email exists (security)
    // The redirectTo URL MUST be added to Supabase → Authentication → URL Configuration → Redirect URLs
    await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    // Always show success — even if email not found or error occurred
    // This prevents email enumeration attacks
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#f0fdfa] flex items-center justify-center px-4">

      <a href="/login" className="fixed top-6 left-6 text-sm font-semibold text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-1">
        ← Back to Login
      </a>

      <div className="w-full max-w-sm">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 px-8 py-10">

          <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="ReplyAstra" className="h-10 w-auto" />
          </div>

          {sent ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">Check your email!</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                If <strong>{email}</strong> is registered, you'll receive a reset link shortly.
              </p>
              <p className="text-xs text-gray-400 mt-3">
                Link expires in 1 hour. Check spam folder if not found.
              </p>
              <button
                onClick={() => { setSent(false); setEmail(""); }}
                className="inline-block mt-4 text-xs text-emerald-600 font-semibold hover:underline"
              >
                Try a different email
              </button>
              <div className="mt-4">
                <a href="/login" className="inline-block text-sm font-bold text-gray-400 hover:text-gray-600">
                  ← Back to Login
                </a>
              </div>
            </div>
          ) : (
            <>
              <p className="text-center text-sm text-gray-500 mb-8">
                Enter your email and we'll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                  />
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
                      Sending...
                    </>
                  ) : "Send Reset Link"}
                </button>
              </form>

              <p className="text-center text-xs text-gray-400 mt-6">
                Remembered it?{" "}
                <a href="/login" className="text-emerald-600 font-semibold hover:underline">Log in</a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
