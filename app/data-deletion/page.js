"use client";

import { useState } from "react";
import { Trash2, CheckCircle, Mail, AlertCircle } from "lucide-react";

export default function DataDeletion() {
  const [form, setForm] = useState({ email: "", instagram: "", reason: "" });
  const [status, setStatus] = useState(null); // null | "success" | "error"
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Replace with your actual API call or Supabase insert:
      // const { error } = await supabase.from("deletion_requests").insert([form]);
      await new Promise((res) => setTimeout(res, 1000)); // simulate request
      setStatus("success");
      setForm({ email: "", instagram: "", reason: "" });
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#f0fdfa] min-h-screen px-6 py-32">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block mb-4 bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-xs font-bold">
            LEGAL
          </span>
          <h1 className="text-5xl font-black text-gray-900">Data Deletion</h1>
          <p className="mt-4 text-gray-500 text-sm">Last updated: February 15, 2026</p>
        </div>

        {/* Info card */}
        <div className="bg-white rounded-3xl shadow-sm p-10 md:p-16 space-y-10 text-gray-700 leading-relaxed mb-10">

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">Your Right to Delete</h2>
            </div>
            <p>
              You have the right to request deletion of your personal data from ReplyAstra at any time.
              When you submit a deletion request, we will remove all data associated with your account
              within <strong>30 days</strong>, including your profile, Instagram connection, automation
              history, and any stored messages.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">What We Delete</h2>
            </div>
            <ul className="space-y-2">
              {[
                "Your account credentials and profile information",
                "Connected Instagram account data and tokens",
                "All automation rules, keywords, and DM templates",
                "Message history and analytics data",
                "Any payment information (handled via Stripe — we do not store card details)",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-600">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">What We May Retain</h2>
            <p>
              We may retain certain data as required by law or for legitimate business purposes,
              such as records of transactions for tax compliance. This data is kept securely and
              never used for marketing purposes.
            </p>
          </section>

        </div>

        {/* Request Form */}
        <div className="bg-white rounded-3xl shadow-sm p-10 md:p-16">
          <h2 className="text-2xl font-black text-gray-900 mb-2">Submit a Deletion Request</h2>
          <p className="text-gray-500 text-sm mb-8">
            Fill out the form below and we'll process your request within 30 days.
          </p>

          {/* Success message */}
          {status === "success" && (
            <div className="mb-8 flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
              <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold text-emerald-800">Request Received!</p>
                <p className="text-emerald-700 text-sm mt-1">
                  We've received your data deletion request and will process it within 30 days.
                  You'll receive a confirmation email shortly.
                </p>
              </div>
            </div>
          )}

          {/* Error message */}
          {status === "error" && (
            <div className="mb-8 flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-5">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold text-red-800">Something went wrong</p>
                <p className="text-red-700 text-sm mt-1">
                  Please try again or email us directly at{" "}
                  <a href="mailto:support@replyastra.online" className="underline">
                    support@replyastra.online
                  </a>
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
              />
            </div>

            {/* Instagram */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Instagram Username <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400 transition">
                <span className="px-4 py-3 bg-gray-50 text-gray-400 font-semibold border-r border-gray-200">@</span>
                <input
                  type="text"
                  required
                  value={form.instagram}
                  onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                  placeholder="yourhandle"
                  className="flex-1 px-4 py-3 text-gray-700 focus:outline-none"
                />
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Reason (optional)
              </label>
              <textarea
                rows={4}
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                placeholder="Let us know why you'd like your data deleted..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition resize-none"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-bold py-4 rounded-xl transition-colors"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Submit Deletion Request
                </>
              )}
            </button>

            <p className="text-xs text-gray-400 text-center">
              By submitting, you confirm this is your account and you understand deletion is irreversible.
            </p>
          </form>
        </div>

        {/* Contact fallback */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Prefer email?{" "}
            <a
              href="mailto:support@replyastra.online"
              className="text-emerald-600 font-semibold hover:underline"
            >
              support@replyastra.online
            </a>
          </p>
        </div>

      </div>
    </main>
  );
}
