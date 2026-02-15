"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from '@/lib/supabaseClient';



export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Password reset email sent. Check your inbox.");
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 text-center">

        {/* Back */}
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-emerald-600 mb-6 inline-block"
        >
          ← Back to Home
        </Link>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-emerald-600 mb-2">
          ReplyAstra
        </h1>

        <p className="text-gray-500 mb-8">
          Reset your password and regain access.
        </p>

        {/* Messages */}
        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}
        {message && (
          <p className="text-emerald-600 text-sm mb-4">{message}</p>
        )}

        {/* Form */}
        <form onSubmit={handleReset} className="space-y-6">

          <div className="text-left">
            <label className="text-sm font-semibold text-gray-700">
              Email
            </label>

            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-full font-semibold hover:opacity-90 transition"
          >
            Send Reset Link
          </button>
        </form>

        {/* Bottom Link */}
        <p className="text-sm text-gray-500 mt-6">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-emerald-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </main>
  );
}
