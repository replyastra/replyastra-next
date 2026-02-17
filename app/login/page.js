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

function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    // Handle error params from Supabase email links (otp_expired etc.)
    const errCode = searchParams.get("error_code");
    const errDesc = searchParams.get("error_description");
    if (errCode === "otp_expired") {
      setError("This confirmation link has expired. Please request a new one below or sign in.");
    } else if (errCode) {
      setError(errDesc?.replace(/\+/g, " ") || "An error occurred. Please try again.");
    }

    // If user just confirmed email and was redirected here
    const msg = searchParams.get("message");
    if (msg === "confirmed") setInfo("Email confirmed! You can now log in.");

    // If already logged in, go to dashboard
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) window.location.href = "/dashboard";
    });
  }, [searchParams]);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      // Check if user exists at all — give better message
      const msg = authError.message?.toLowerCase() || "";

      if (msg.includes("invalid login credentials") || msg.includes("invalid credentials")) {
        // Try to distinguish between wrong password vs no account
        const { data: methods } = await supabase.auth.signInWithOtp({ email, shouldCreateUser: false });
        // If email doesn't exist in system, guide them to sign up
        setError("No account found with this email. Please check your email or sign up for a new account.");
      } else if (msg.includes("email not confirmed")) {
        setError("Please confirm your email first. Check your inbox for the confirmation link.");
        setInfo("Didn't get the email? Check spam or sign up again to resend.");
      } else if (msg.includes("too many requests")) {
        setError("Too many attempts. Please wait a few minutes and try again.");
      } else {
        setError("Incorrect password. Please try again or reset your password.");
      }
      setLoading(false);
      return;
    }

    if (data?.user) {
      window.location.href = "/dashboard";
    }
  }

  return (
    <div className="min-h-screen bg-[#f0fdfa] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to home */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
          ← Back to Home
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/">
              <img src="/logo.png" alt="ReplyAstra" className="h-8 mx-auto" onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "block"; }} />
              <span className="text-2xl font-black text-emerald-600 hidden">ReplyAstra</span>
            </Link>
            <p className="text-gray-500 text-sm mt-3">Welcome back. Login to your dashboard.</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-5">
              <p className="text-sm text-red-700 font-medium">{error}</p>
              {error.includes("No account found") && (
                <Link href="/signup" className="text-sm text-emerald-600 font-bold hover:underline mt-1 block">
                  → Create an account for free
                </Link>
              )}
              {error.includes("Incorrect password") && (
                <Link href="/forgot-password" className="text-sm text-emerald-600 font-bold hover:underline mt-1 block">
                  → Reset your password
                </Link>
              )}
            </div>
          )}

          {/* Info */}
          {info && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 mb-5">
              <p className="text-sm text-emerald-700 font-medium">{info}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
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
              <div className="text-right mt-1.5">
                <Link href="/forgot-password" className="text-xs text-emerald-600 hover:underline font-semibold">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-bold py-3.5 rounded-xl transition-colors text-sm">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Don't have an account?{" "}
            <Link href="/signup" className="text-emerald-600 font-bold hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f0fdfa] flex items-center justify-center"><div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"/></div>}>
      <LoginForm />
    </Suspense>
  );
}
