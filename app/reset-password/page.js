"use client";

import { useState, useEffect, Suspense } from "react";
import { createClient } from "@supabase/supabase-js";
import { useSearchParams } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { auth: { persistSession: true, autoRefreshToken: true, storageKey: "replyastra-auth" } }
);

function ResetForm() {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    // Check for expired link
    const errCode = searchParams.get("error_code");
    if (errCode === "otp_expired") { setExpired(true); return; }

    // Supabase fires PASSWORD_RECOVERY when user clicks the reset link
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    return () => subscription.unsubscribe();
  }, [searchParams]);

  async function handleReset(e) {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError("Failed to update password. The link may have expired. Please request a new one.");
      setLoading(false);
      return;
    }

    setDone(true);
    setLoading(false);
    // Already logged in after reset — go to dashboard
    setTimeout(() => { window.location.href = "/dashboard"; }, 1500);
  }

  // ── SAME CARD STYLE as login/signup ──────────────────────────
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

          {/* Expired link */}
          {expired && (
            <div className="text-center py-4">
              <p className="text-lg font-black text-gray-900 mb-2">Link expired</p>
              <p className="text-sm text-gray-500 mb-5">This reset link has expired. Please request a new one.</p>
              <a href="/forgot-password"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center">
                Request New Link
              </a>
            </div>
          )}

          {/* Success */}
          {!expired && done && (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">Password updated!</h3>
              <p className="text-sm text-gray-500">Taking you to your dashboard...</p>
              <div className="w-6 h-6 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mt-4" />
            </div>
          )}

          {/* Waiting for Supabase to confirm the reset token */}
          {!expired && !done && !ready && (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-500">Verifying your reset link...</p>
            </div>
          )}

          {/* Form */}
          {!expired && !done && ready && (
            <>
              <p className="text-center text-sm text-gray-500 mb-8">Choose a new password for your account.</p>

              {error && (
                <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                  {error}
                </div>
              )}

              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Repeat password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 transition ${confirm && password !== confirm ? "border-red-300 focus:ring-red-300" : "border-gray-200 focus:ring-emerald-400"}`}
                  />
                  {confirm && password !== confirm && (
                    <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !password || password !== confirm}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Updating...
                    </>
                  ) : "Update Password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f0fdfa] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    }>
      <ResetForm />
    </Suspense>
  );
}
