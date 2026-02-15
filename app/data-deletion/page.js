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
      // Replace with your actual Supabase insert or API call
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
          <span className="inline-block mb-4 bg-red-100 text-red-600 px-4 py-1 rounded-full text-xs font-bold">
            DATA RIGHTS
          </span>
          <h1 className="text-5xl font-black text-gray-900">Data Deletion Request</h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            You have the right to request deletion of all personal data ReplyAstra holds about you,
            including data collected via your Instagram account connection.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">

          {/* What gets deleted */}
          <div className="bg-white rounded-3xl p-10 shadow-sm">
            <h2 className="text-2xl font-black text-gray-900 mb-6">What We Delete</h2>
            <div className="space-y-4">
              {[
                "Your ReplyAstra account and login credentials",
                "Your connected Instagram account tokens",
                "All automation rules and keyword triggers you configured",
                "Your DM analytics and usage history",
                "Your billing information (payment records retained for legal compliance only)",
                "Any support tickets or messages you sent us",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={18} />
                  <p className="text-gray-700 text-sm">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="font-bold text-amber-800 text-sm">Important Note</p>
                  <p className="text-amber-700 text-sm mt-1">
                    Deletion is permanent and irreversible. Your active subscription will also be
                    cancelled with no refund. Billing records may be retained for up to 5 years
                    as required by Indian tax law.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-emerald-50 rounded-2xl p-5">
              <p className="text-emerald-800 text-sm font-semibold">⏱ Processing Time</p>
              <p className="text-emerald-700 text-sm mt-1">
                We will process your request and delete all data within <strong>30 days</strong> of
                receiving your request. You will receive a confirmation email when complete.
              </p>
            </div>
          </div>

          {/* Request Form */}
          <div className="bg-white rounded-3xl p-10 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <Trash2 className="text-red-500" size={20} />
              </div>
              <h2 className="text-2xl font-black text-gray-900">Submit Request</h2>
            </div>

            {status === "success" ? (
              <div className="text-center py-10">
                <CheckCircle className="text-emerald-500 mx-auto mb-4" size={48} />
                <h3 className="text-xl font-black text-gray-900">Request Received</h3>
                <p className="text-gray-600 mt-2">
                  We've received your data deletion request. You'll receive a confirmation email
                  shortly. All data will be deleted within 30 days.
                </p>
                <p className="text-gray-500 text-sm mt-4">
                  Reference: DR-{Date.now().toString().slice(-8)}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Email used for your ReplyAstra account"
                    className="w-full p-4 rounded-xl bg-gray-100 outline-none text-sm"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Instagram Username *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="@yourinstagram"
                    className="w-full p-4 rounded-xl bg-gray-100 outline-none text-sm"
                    value={form.instagram}
                    onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Reason (optional)
                  </label>
                  <textarea
                    placeholder="Let us know why you're leaving (optional)..."
                    className="w-full p-4 rounded-xl bg-gray-100 outline-none text-sm h-24 resize-none"
                    value={form.reason}
                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  />
                </div>

                <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500">
                  By submitting this form, you confirm you are the account owner and consent to
                  permanent deletion of all associated data.
                </div>

                {status === "error" && (
                  <p className="text-red-500 text-sm text-center">
                    Something went wrong. Please email us directly at{" "}
                    <a href="mailto:privacy@replyastra.online" className="underline">
                      privacy@replyastra.online
                    </a>
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                >
                  <Trash2 size={18} />
                  {loading ? "Submitting..." : "Request Data Deletion"}
                </button>
              </form>
            )}

            {/* Alternative email option */}
            <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-3">
              <Mail className="text-gray-400 shrink-0" size={18} />
              <p className="text-gray-500 text-sm">
                Or email us directly:{" "}
                <a href="mailto:privacy@replyastra.online" className="text-emerald-600 underline font-semibold">
                  privacy@replyastra.online
                </a>
              </p>
            </div>
          </div>

        </div>

        {/* Meta specific note */}
        <div className="mt-10 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-900 text-lg mb-3">
            Disconnecting ReplyAstra from Instagram
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            You can also revoke ReplyAstra's access to your Instagram account directly through Meta
            without submitting a deletion request here. To do this:
          </p>
          <ol className="list-decimal pl-6 mt-3 space-y-2 text-sm text-gray-600">
            <li>Go to your <strong>Facebook Settings</strong></li>
            <li>Click on <strong>Security and Login → Business Integrations</strong></li>
            <li>Find <strong>ReplyAstra</strong> and click <strong>Remove</strong></li>
          </ol>
          <p className="mt-3 text-sm text-gray-500">
            This will immediately revoke our API access but will not delete your ReplyAstra account data.
            Submit the form above to delete all data permanently.
          </p>
        </div>

      </div>
    </main>
  );
}
