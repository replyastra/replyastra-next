"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { auth: { persistSession: true, autoRefreshToken: true } }
);

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    // If already logged in, go straight to dashboard
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) window.location.href = "/dashboard";
    });
  }, []);

  const pwStrength = pwd => {
    if (!pwd) return { score: 0, label: "", color: "" };
    let s = 0;
    if (pwd.length >= 8) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    const map = [
      { label: "", color: "" },
      { label: "Weak", color: "bg-red-400" },
      { label: "Fair", color: "bg-amber-400" },
      { label: "Good", color: "bg-blue-400" },
      { label: "Strong", color: "bg-emerald-500" },
    ];
    return { score: s, ...map[s] };
  };

  const strength = pwStrength(password);

  async function handleSignup(e) {
    e.preventDefault();
    setError("");

    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }

    setLoading(true);

    // Check if email already registered
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // After confirming email, redirect directly to dashboard
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { plan: "free" },
      },
    });

    if (signUpError) {
      const msg = signUpError.message?.toLowerCase() || "";
      if (msg.includes("already registered") || msg.includes("user already exists")) {
        setError("An account with this email already exists. Please log in instead.");
      } else if (msg.includes("invalid email")) {
        setError("Please enter a valid email address.");
      } else {
        setError(signUpError.message || "Something went wrong. Please try again.");
      }
      setLoading(false);
      return;
    }

    setDone(true);
    setLoading(false);
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#f0fdfa] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl">✅</div>
          <h2 className="text-xl font-black text-gray-900 mb-2">Check your email!</h2>
          <p className="text-gray-500 text-sm mb-1">We sent a confirmation link to</p>
          <p className="font-bold text-gray-800 mb-4">{email}</p>
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-6 text-left space-y-2">
            <p className="text-sm font-bold text-emerald-700">What happens next:</p>
            <div className="flex items-center gap-2 text-sm text-emerald-600">
              <span>1️⃣</span> Click the link in the email
            </div>
            <div className="flex items-center gap-2 text-sm text-emerald-600">
              <span>2️⃣</span> You will be taken directly to your dashboard
            </div>
            <div className="flex items-center gap-2 text-sm text-emerald-600">
              <span>3️⃣</span> Start automating your Instagram DMs!
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-4">Can't find it? Check your spam folder.</p>
          <Link href="/login" className="text-sm text-emerald-600 font-bold hover:underline">
            Already confirmed? Log in →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0fdfa] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
          ← Back to Home
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <Link href="/">
              <img src="/logo.png" alt="ReplyAstra" className="h-8 mx-auto" onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "block"; }} />
              <span className="text-2xl font-black text-emerald-600 hidden">ReplyAstra</span>
            </Link>
            <p className="text-gray-500 text-sm mt-3">Create your free account. No credit card needed.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-5">
              <p className="text-sm text-red-700 font-medium">{error}</p>
              {error.includes("already exists") && (
                <Link href="/login" className="text-sm text-emerald-600 font-bold hover:underline mt-1 block">
                  → Log in to your account
                </Link>
              )}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
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
              {/* Password strength bar */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength.score ? strength.color : "bg-gray-100"}`} />
                    ))}
                  </div>
                  {strength.label && <p className={`text-xs font-semibold mt-1 ${strength.score <= 1 ? "text-red-500" : strength.score === 2 ? "text-amber-500" : "text-emerald-600"}`}>{strength.label}</p>}
                </div>
              )}
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-bold py-3.5 rounded-xl transition-colors text-sm">
              {loading ? "Creating account..." : "Create Free Account"}
            </button>
          </form>

          <div className="mt-5 text-center space-y-2">
            <p className="text-xs text-gray-400">
              By signing up you agree to our{" "}
              <Link href="/terms" className="text-emerald-600 hover:underline">Terms</Link>
              {" & "}
              <Link href="/privacy-policy" className="text-emerald-600 hover:underline">Privacy Policy</Link>
            </p>
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="text-emerald-600 font-bold hover:underline">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
