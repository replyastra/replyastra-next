"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";


function EyeIcon({ open }) {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const errCode = searchParams.get("error_code");
    if (errCode === "otp_expired") {
      setError("This link has expired. Please log in again or reset your password.");
    } else if (errCode) {
      setError("The link was invalid or expired. Please try again.");
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) window.location.href = "/dashboard";
    });
  }, [searchParams]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    if (authError) {
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
          <p className="text-center text-sm text-gray-500 mb-8">Welcome back. Login to your dashboard.</p>

          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
              {error}
              {error.includes("No account found") && (
                <a href="/signup" className="block mt-1 text-emerald-600 font-bold hover:underline text-xs">→ Create a free account</a>
              )}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input
                type="email" required placeholder="you@email.com" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"} required placeholder="••••••••" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-0.5">
                  <EyeIcon open={showPw} />
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <a href="/forgot-password" className="text-xs text-emerald-600 font-semibold hover:underline">Forgot password?</a>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
              {loading ? (
                <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Logging in...</>
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
    <Suspense fallback={<div className="min-h-screen bg-[#f0fdfa] flex items-center justify-center"><div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
