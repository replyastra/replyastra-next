"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-[#f0fdfa] flex items-center justify-center px-4">

      <a href="/" className="fixed top-6 left-6 text-sm font-semibold text-gray-400 hover:text-gray-700 transition-colors">
        ← Back to Home
      </a>

      <div className="w-full max-w-sm">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 px-8 py-10">

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="ReplyAstra" className="h-10 w-auto" />
          </div>

          <p className="text-center text-sm text-gray-500 mb-8">
            Welcome back. Login to your dashboard.
          </p>

          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
              {error}
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
