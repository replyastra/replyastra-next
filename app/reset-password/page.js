"use client";
import { useState, useEffect, Suspense } from "react";
import { createClient } from "@supabase/supabase-js";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { auth: { persistSession: true, autoRefreshToken: true } }
);

function ResetForm() {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase puts the session tokens in the URL hash when the reset link is clicked
    // We need to let Supabase process the hash tokens automatically
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        // Session is now ready — user can set new password
        setReady(true);
      }
    });

    // Also handle error params
    const errCode = searchParams.get("error_code");
    if (errCode === "otp_expired") {
      setError("This reset link has expired. Please request a new one.");
    }

    return () => subscription.unsubscribe();
  }, [searchParams]);

  const pwStrength = pwd => {
    let s = 0;
    if (pwd.length >= 8) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    return s;
  };

  const strength = pwStrength(password);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength] || "";
  const strengthColor = ["", "bg-red-400", "bg-amber-400", "bg-blue-400", "bg-emerald-500"][strength] || "";

  async function handleReset(e) {
    e.preventDefault();
    setError("");

    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match. Please check and try again."); return; }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message || "Failed to update password. The link may have expired.");
      setLoading(false);
      return;
    }

    setDone(true);
    setLoading(false);

    // Auto-redirect to dashboard after 2 seconds (user is already logged in)
    setTimeout(() => { window.location.href = "/dashboard"; }, 2000);
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#f0fdfa] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 w-full max-w-md text-center">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="text-xl font-black text-gray-900 mb-2">Password updated!</h2>
          <p className="text-gray-500 text-sm mb-6">Your password has been successfully changed. Taking you to your dashboard...</p>
          <div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  // Expired link
  if (error && error.includes("expired")) {
    return (
      <div className="min-h-screen bg-[#f0fdfa] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 w-full max-w-md text-center">
          <div className="text-4xl mb-4">⏰</div>
          <h2 className="text-xl font-black text-gray-900 mb-2">Link expired</h2>
          <p className="text-gray-500 text-sm mb-6">This password reset link has expired. Please request a new one.</p>
          <Link href="/forgot-password" className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl text-center transition-colors text-sm mb-3">
            Request New Reset Link
          </Link>
          <Link href="/login" className="block text-sm text-gray-400 hover:text-gray-600">Back to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0fdfa] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🔑</div>
            <h2 className="text-xl font-black text-gray-900">Set new password</h2>
            <p className="text-gray-500 text-sm mt-2">Choose a strong password for your account.</p>
          </div>

          {!ready && !error && (
            <div className="text-center py-6">
              <div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-500">Verifying your reset link...</p>
            </div>
          )}

          {ready && (
            <form onSubmit={handleReset} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">New Password</label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition pr-11"
                  />
                  <button type="button" onClick={() => setShowPwd(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1">
                    {showPwd ? "🙈" : "👁️"}
                  </button>
                </div>
                {password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength ? strengthColor : "bg-gray-100"}`} />
                      ))}
                    </div>
                    {strengthLabel && <p className={`text-xs font-semibold mt-1 ${strength <= 1 ? "text-red-500" : strength === 2 ? "text-amber-500" : "text-emerald-600"}`}>{strengthLabel}</p>}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Confirm Password</label>
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="Repeat your password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition ${confirm && password !== confirm ? "border-red-300 focus:ring-red-300" : "border-gray-200 focus:ring-emerald-400"}`}
                />
                {confirm && password !== confirm && (
                  <p className="text-xs text-red-500 font-semibold mt-1">Passwords don't match</p>
                )}
              </div>

              <button type="submit" disabled={loading || !password || password !== confirm}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-bold py-3.5 rounded-xl transition-colors text-sm">
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f0fdfa] flex items-center justify-center"><div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"/></div>}>
      <ResetForm />
    </Suspense>
  );
}
