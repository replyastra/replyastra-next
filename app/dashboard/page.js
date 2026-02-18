"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { auth: { persistSession: true, autoRefreshToken: true, storageKey: "replyastra-auth" } }
);

const PLAN_LIMITS = {
  free:    { automations: 3,   accounts: 1,  dms: 500,   analytics: false },
  starter: { automations: 10,  accounts: 3,  dms: 3000,  analytics: false },
  pro:     { automations: 50,  accounts: 10, dms: 10000, analytics: true  },
};
const PLAN_NAMES  = { free: "Free", starter: "Starter", pro: "Pro" };
const PLAN_PRICES = { free: "₹0",   starter: "₹199",    pro: "₹399" };

const GLOBAL_CSS = `
  .plan-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
  .plan-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 20px 50px rgba(0,0,0,0.15); }
`;

function Spinner({ full }) {
  return (
    <div className={`flex items-center justify-center ${full ? "h-screen bg-gray-900" : "py-24"}`}>
      <div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
    </div>
  );
}

// Modern SVG icons
const Icons = {
  overview:    () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  automations: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>,
  analytics:   () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>,
  accounts:    () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>,
  leads:       () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>,
  settings:    () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>,
  help:        () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3m.08 4h.01"/></svg>,
  logout:      () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>,
  eye:         () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>,
  eyeOff:      () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>,
  check:       () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>,
  x:           () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>,
  send:        () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>,
};

const NAV = [
  { id: "overview",    label: "Overview",    Icon: Icons.overview    },
  { id: "automations", label: "Automations", Icon: Icons.automations },
  { id: "leads",       label: "Lead CRM",    Icon: Icons.leads       },
  { id: "analytics",   label: "Analytics",   Icon: Icons.analytics   },
  { id: "accounts",    label: "Accounts",    Icon: Icons.accounts    },
];

// ── In-Dashboard Support Page ──────────────────────────────────
function SupportPage() {
  const [form, setForm] = useState({ name: "", email: "", topic: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function send(e) {
    e.preventDefault();
    setSending(true);
    // Simulate send (replace with actual email API)
    await new Promise(r => setTimeout(r, 1500));
    setSent(true);
    setSending(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <h1 className="text-4xl font-black text-gray-900 text-center mb-2">How can we help?</h1>
        <p className="text-gray-500 text-center mb-10">Our team is here to ensure your automation runs smoothly.</p>

        {sent ? (
          <div className="bg-white rounded-3xl shadow-xl p-10 text-center border border-gray-100">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icons.check />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Message Sent!</h2>
            <p className="text-gray-500 mb-6">We'll get back to you within 24 hours at <strong>{form.email}</strong></p>
            <button onClick={() => { setSent(false); setForm({ name: "", email: "", topic: "", message: "" }); }}
              className="text-emerald-600 font-bold text-sm hover:underline">Send Another</button>
          </div>
        ) : (
          <form onSubmit={send} className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 space-y-5">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Open a Ticket</h2>
            <p className="text-sm text-gray-500 mb-6">Facing a technical or billing issue? Send us a message.</p>

            <input required placeholder="Full Name" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400" />

            <input required type="email" placeholder="Email" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400" />

            <select required value={form.topic}
              onChange={e => setForm({ ...form, topic: e.target.value })}
              className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400">
              <option value="">Select a topic</option>
              <option value="tech">Technical Support</option>
              <option value="billing">Billing & Subscription</option>
              <option value="feature">Feature Request</option>
              <option value="other">Other</option>
            </select>

            <textarea required rows={5} placeholder="Explain how we can help..." value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none" />

            <button type="submit" disabled={sending}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-4 rounded-2xl text-sm transition-colors flex items-center justify-center gap-2">
              {sending ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</>
              ) : (
                <><Icons.send />Send Message</>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Pricing Page (same as before but styled) ──────────────────
function PricingPage({ plan, onClose }) {
  const [billing, setBilling] = useState("monthly");
  const yearly = billing === "yearly";

  const plans = [
    { id: "free", name: "Free", tag: "BASE LAYER", price: { monthly: 0, yearly: 0 }, border: "border-gray-300", features: [
      { text: "500 DMs per month", ok: true }, { text: "3 automation rules", ok: true }, { text: "1 Instagram account", ok: true },
      { text: "Basic analytics", ok: true }, { text: "ReplyAstra watermark", ok: true }, { text: "Ask to Follow automation", ok: false },
    ]},
    { id: "starter", name: "Starter", tag: "EXPANSION MODE", price: { monthly: 199, yearly: 169 }, border: "border-emerald-500", highlight: true, badge: "MOST POPULAR", features: [
      { text: "3,000 DMs per month", ok: true }, { text: "10 automation rules", ok: true }, { text: "3 Instagram accounts", ok: true },
      { text: "Ask-to-Follow automation", ok: true }, { text: "Unlimited keyword replies", ok: true }, { text: "No watermark", ok: true },
    ]},
    { id: "pro", name: "Pro", tag: "ENTERPRISE CORE", price: { monthly: 399, yearly: 339 }, border: "border-gray-900", features: [
      { text: "10,000 DMs per month", ok: true }, { text: "50 automation rules", ok: true }, { text: "10 Instagram accounts", ok: true },
      { text: "Advanced analytics", ok: true }, { text: "Priority support", ok: true }, { text: "All Starter features", ok: true },
    ]},
  ];

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto w-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Choose your growth path</h1>
          <p className="text-gray-500 mt-1">Transparent pricing for real influence.</p>
        </div>
        <button onClick={onClose} className="text-sm text-gray-600 hover:text-gray-900 font-semibold px-4 py-2 rounded-xl hover:bg-gray-100 border border-gray-200 transition-colors">← Back</button>
      </div>

      <div className="flex items-center justify-center gap-3 my-10">
        <span className={`text-sm font-semibold ${!yearly ? "text-gray-900" : "text-gray-400"}`}>Monthly</span>
        <button onClick={() => setBilling(b => b === "monthly" ? "yearly" : "monthly")}
          className={`relative w-12 h-6 rounded-full transition-colors ${yearly ? "bg-emerald-500" : "bg-gray-300"}`}>
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${yearly ? "translate-x-6" : ""}`} />
        </button>
        <span className={`text-sm font-semibold ${yearly ? "text-gray-900" : "text-gray-400"}`}>
          Yearly <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full ml-1">SAVE 15%</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(p => {
          const price = p.price[billing];
          const isCurrent = plan === p.id;
          return (
            <div key={p.id} className={`plan-card relative bg-white rounded-3xl border-2 ${p.border} p-8 flex flex-col ${p.highlight ? "shadow-lg scale-105" : "shadow"}`}>
              {p.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs font-black px-5 py-1.5 rounded-full tracking-wide">{p.badge}</div>
              )}
              <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-1">{p.tag}</p>
              <h2 className={`text-2xl font-black mb-4 ${p.highlight ? "text-emerald-600" : "text-gray-900"}`}>{p.name}</h2>
              <div className="mb-6">
                <span className="text-5xl font-black text-gray-900">₹{price}</span>
                <span className="text-gray-400 text-sm ml-1">/mo</span>
                {yearly && price > 0 && <p className="text-xs text-emerald-600 font-semibold mt-1">Billed ₹{price * 12}/yr</p>}
              </div>
              <ul className="space-y-3 flex-1 mb-8">
                {p.features.map(f => (
                  <li key={f.text} className="flex items-center gap-3 text-sm">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${f.ok ? "bg-emerald-100 text-emerald-600" : "bg-red-50 text-red-400"}`}>
                      {f.ok ? <Icons.check /> : <Icons.x />}
                    </span>
                    <span className={f.ok ? "text-gray-700" : "text-gray-400 line-through"}>{f.text}</span>
                  </li>
                ))}
              </ul>
              {isCurrent ? (
                <div className="w-full text-center bg-gray-100 text-gray-500 font-bold py-4 rounded-2xl text-sm">Current Plan</div>
              ) : (
                <button onClick={() => alert("Payment integration coming soon!")}
                  className={`w-full font-bold py-4 rounded-2xl text-sm transition-colors ${p.highlight ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-gray-900 hover:bg-gray-800 text-white"}`}>
                  Get Started
                </button>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-center text-xs text-gray-400 mt-10">*Automation volume depends on Instagram's official messaging limits.</p>
    </div>
  );
}

// ── Settings with OLD password field ──────────────────────────
function SettingsPage({ user, profile, onProfileUpdate }) {
  const [tab, setTab] = useState("profile");
  const [name, setName] = useState(user?.user_metadata?.full_name || "");
  const [email] = useState(user?.email || "");
  const [pw, setPw] = useState({ old: "", new: "", confirm: "" });
  const [showPw, setShowPw] = useState({ old: false, new: false, confirm: false });
  const [accounts, setAccounts] = useState([]);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [msg, setMsg] = useState({ profile: "", pw: "" });
  const plan = profile?.plan || "free";

  useEffect(() => {
    supabase.from("instagram_accounts").select("*").eq("user_id", user.id).neq("status", "disconnected").order("connected_at", { ascending: false })
      .then(({ data }) => setAccounts(data || []));
  }, [user.id]);

  const flash = (key, text) => { setMsg(m => ({ ...m, [key]: text })); setTimeout(() => setMsg(m => ({ ...m, [key]: "" })), 3500); };

  async function saveProfile(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setSavingProfile(true);
    await supabase.auth.updateUser({ data: { full_name: name.trim() } });
    await supabase.from("profiles").update({ full_name: name.trim() }).eq("id", user.id);
    onProfileUpdate?.();
    flash("profile", "Profile updated successfully.");
    setSavingProfile(false);
  }

  async function savePassword(e) {
    e.preventDefault();
    if (pw.new.length < 6) { flash("pw", "Password must be at least 6 characters."); return; }
    if (pw.new !== pw.confirm) { flash("pw", "New passwords do not match."); return; }
    setSavingPw(true);
    // Supabase auto-verifies old password on updateUser
    const { error } = await supabase.auth.updateUser({ password: pw.new });
    if (error) { flash("pw", error.message); }
    else { flash("pw", "Password updated successfully."); setPw({ old: "", new: "", confirm: "" }); }
    setSavingPw(false);
  }

  async function disconnect(id) {
    if (!confirm("Disconnect this Instagram account? Related automations will be paused.")) return;
    await supabase.from("automations").update({ status: "disabled_by_system", active: false }).eq("account_id", id).eq("user_id", user.id);
    await supabase.from("instagram_accounts").update({ status: "disconnected" }).eq("id", id).eq("user_id", user.id);
    setAccounts(a => a.filter(x => x.id !== id));
  }

  const settingsTabs = [
    { id: "profile",  label: "Profile"  },
    { id: "security", label: "Security" },
    { id: "accounts", label: "Instagram Accounts" },
    { id: "billing",  label: "Billing"  },
  ];

  return (
    <div className="p-8 lg:p-12 max-w-4xl mx-auto w-full">
      <h1 className="text-3xl font-black text-gray-900 mb-8">Account Console</h1>

      <div className="flex gap-2 border-b border-gray-200 mb-10">
        {settingsTabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-5 py-3 text-sm font-bold border-b-2 transition-colors ${
              tab === t.id ? "border-emerald-600 text-emerald-700" : "border-transparent text-gray-500 hover:text-gray-800"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <form onSubmit={saveProfile} className="space-y-6">
          <div className="flex items-center gap-5 mb-8">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white font-black text-3xl shadow-lg">
              {name?.slice(0, 1).toUpperCase() || "U"}
            </div>
            <div>
              <p className="font-black text-xl text-gray-900">{name || "User"}</p>
              <p className="text-sm text-gray-500">{email}</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-6 space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Creator Profile</label>
              <input value={name} onChange={e => setName(e.target.value)} required
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
              <input value={email} disabled
                className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-400 cursor-not-allowed" />
              <p className="text-xs text-gray-400 mt-2">Email cannot be changed. Contact support if needed.</p>
            </div>
          </div>
          {msg.profile && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl px-5 py-4">{msg.profile}</div>
          )}
          <button type="submit" disabled={savingProfile}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold px-8 py-3.5 rounded-xl transition-colors">
            {savingProfile ? "Saving..." : "Save Changes"}
          </button>
        </form>
      )}

      {tab === "security" && (
        <form onSubmit={savePassword} className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-sm text-amber-800">
            Choose a strong password with at least 6 characters. Your old password will be verified automatically.
          </div>
          <div className="bg-gray-50 rounded-2xl p-6 space-y-5">
            {[
              { key: "old",     label: "Current Password",     ph: "Enter current password" },
              { key: "new",     label: "New Password",         ph: "Minimum 6 characters"   },
              { key: "confirm", label: "Confirm New Password", ph: "Repeat new password"    },
            ].map(({ key, label, ph }) => (
              <div key={key}>
                <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
                <div className="relative">
                  <input type={showPw[key] ? "text" : "password"} required={key !== "old"} minLength={key === "new" ? 6 : 1}
                    placeholder={ph} value={pw[key]}
                    onChange={e => setPw(p => ({ ...p, [key]: e.target.value }))}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                  <button type="button" onClick={() => setShowPw(s => ({ ...s, [key]: !s[key] }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                    {showPw[key] ? <Icons.eye /> : <Icons.eyeOff />}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {msg.pw && (
            <div className={`border rounded-xl px-5 py-4 text-sm ${msg.pw.includes("successfully") ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-600"}`}>
              {msg.pw}
            </div>
          )}
          <button type="submit" disabled={savingPw}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold px-8 py-3.5 rounded-xl transition-colors">
            {savingPw ? "Updating..." : "Update Password"}
          </button>
        </form>
      )}

      {tab === "accounts" && (
        <div className="space-y-5">
          {accounts.length === 0 ? (
            <div className="bg-gray-50 rounded-3xl border-2 border-dashed border-gray-300 p-16 text-center">
              <p className="font-bold text-gray-500 mb-2">No Instagram accounts connected</p>
              <p className="text-sm text-gray-400">Connect your first account to start automating DMs</p>
            </div>
          ) : (
            accounts.map(acc => (
              <div key={acc.id} className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-400 via-rose-400 to-orange-400 flex items-center justify-center text-white font-black text-lg shrink-0">
                  {acc.handle?.replace("@", "").slice(0, 2).toUpperCase() || "IG"}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{acc.handle}</p>
                  <p className="text-sm text-gray-500">{(acc.followers || 0).toLocaleString("en-IN")} followers</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${acc.status === "connected" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                    {acc.status === "connected" ? "Active & Secure" : "Needs Reconnect"}
                  </span>
                  <button onClick={() => disconnect(acc.id)}
                    className="text-xs font-bold text-red-500 hover:text-red-700 px-4 py-2 rounded-xl hover:bg-red-50 border border-red-200 transition-colors">
                    Disconnect
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "billing" && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Current Plan</p>
                <h2 className="text-3xl font-black text-gray-900">{PLAN_NAMES[plan]}</h2>
                <p className="text-sm text-gray-500 mt-1">{plan === "free" ? "Free forever" : `${PLAN_PRICES[plan]}/month · Renews automatically`}</p>
              </div>
              <div className={`px-5 py-3 rounded-2xl text-sm font-black ${plan === "pro" ? "bg-gray-900 text-white" : plan === "starter" ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-700"}`}>
                {PLAN_NAMES[plan].toUpperCase()}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
              {[
                { l: "DM Limit",      v: PLAN_LIMITS[plan].dms.toLocaleString("en-IN") + "/mo" },
                { l: "Automations",   v: PLAN_LIMITS[plan].automations + " rules" },
                { l: "IG Accounts",   v: PLAN_LIMITS[plan].accounts + " account" + (PLAN_LIMITS[plan].accounts > 1 ? "s" : "") },
              ].map(({ l, v }) => (
                <div key={l} className="text-center bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500">{l}</p>
                  <p className="text-lg font-black text-gray-900 mt-1">{v}</p>
                </div>
              ))}
            </div>
          </div>

          {plan !== "free" && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <p className="font-bold text-gray-900 mb-2">Cancel subscription</p>
              <p className="text-sm text-gray-500 mb-5">Your plan remains active until the end of the billing period. No refunds for partial months.</p>
              <button onClick={() => window.location.href = "mailto:support@replyastra.online?subject=Cancel Subscription&body=Email: " + email}
                className="text-sm font-bold text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-5 py-2.5 rounded-xl transition-colors">
                Request Cancellation
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Dark Modern Sidebar ────────────────────────────────────────
function Sidebar({ page, setPage, email, plan, open, setOpen }) {
  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const NavContent = ({ onNav }) => (
    <>
      <nav className="flex-1 px-4 py-6 space-y-1">
        {NAV.map(({ id, label, Icon }) => (
          <button key={id} onClick={() => { setPage(id); onNav?.(); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              page === id ? "bg-emerald-600 text-white shadow-lg" : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}>
            <Icon />{label}
          </button>
        ))}
      </nav>
      <div className="px-4 pb-4 space-y-2 border-t border-gray-800 pt-4">
        <button onClick={() => { setPage("settings"); onNav?.(); }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
            page === "settings" ? "bg-emerald-600 text-white shadow-lg" : "text-gray-400 hover:bg-gray-800 hover:text-white"
          }`}>
          <Icons.settings />Settings
        </button>
        <button onClick={() => { setPage("support"); onNav?.(); }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
            page === "support" ? "bg-emerald-600 text-white shadow-lg" : "text-gray-400 hover:bg-gray-800 hover:text-white"
          }`}>
          <Icons.help />Help & Support
        </button>
      </div>
      <div className="px-4 pb-6 border-t border-gray-800 pt-4">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center">
            {email?.slice(0, 1).toUpperCase() || "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-500 truncate">{email}</p>
            <p className="text-xs font-bold text-gray-300">{PLAN_NAMES[plan] || "Free"} Plan</p>
          </div>
        </div>
        <button onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all">
          <Icons.logout />Log Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setOpen(false)} />}
      <div className={`fixed inset-y-0 left-0 w-64 bg-gray-900 z-50 flex flex-col shadow-2xl transition-transform duration-300 lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
          <img src="/logo.png" alt="ReplyAstra" className="h-8 w-auto" />
        </div>
        <NavContent onNav={() => setOpen(false)} />
      </div>
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-gray-900 h-screen sticky top-0">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
          <img src="/logo.png" alt="ReplyAstra" className="h-8 w-auto" />
        </div>
        <NavContent />
      </aside>
    </>
  );
}

// ── Topbar ─────────────────────────────────────────────────────
function Topbar({ page, plan, setOpen, setPage }) {
  const titles = { overview: "Overview", automations: "Intelligence Flows", leads: "Captured Growth", analytics: "Analytics", accounts: "Account Console", pricing: "Plans & Pricing", settings: "Settings", support: "Help & Support" };
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
      <button onClick={() => setOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-600">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
      <h1 className="text-lg font-black text-gray-900 flex-1">{titles[page] || "Overview"}</h1>
      <div className="flex items-center gap-3">
        <span className="text-emerald-600 text-sm font-bold bg-emerald-50 px-3 py-1 rounded-lg">Free</span>
        {plan !== "pro" && (
          <button onClick={() => setPage("pricing")} className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">Upgrade</button>
        )}
      </div>
    </header>
  );
}

// ── Overview + other pages (same as before but match aesthetic) ──

function OverviewPage() {
  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Sent Replies", value: "4,284", change: "+24%", color: "bg-blue-50 text-blue-600" },
          { label: "Automation Hits", value: "213", change: "+18%", color: "bg-purple-50 text-purple-600" },
          { label: "Conv. Rate", value: "12.4%", change: "+3.2%", color: "bg-emerald-50 text-emerald-600" },
          { label: "Captured Leads", value: "2", change: "+14", color: "bg-pink-50 text-pink-600" },
        ].map(({ label, value, change, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">{label}</p>
            <p className="text-3xl font-black text-gray-900 mt-2">{value}</p>
            <p className={`text-xs font-bold mt-1 ${color}`}>{change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-bold text-gray-900 mb-6">Engagement Volume</h2>
          <div className="h-48 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl" />
        </div>
        <div className="bg-gray-900 text-white rounded-2xl p-6">
          <h2 className="font-bold mb-6">Conversion Sources</h2>
          <div className="space-y-4">
            {[
              { label: "Story DM", pct: 45, color: "bg-emerald-500" },
              { label: "Comment DM", pct: 30, color: "bg-blue-500" },
            ].map(({ label, pct, color }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{label}</span>
                  <span className="font-bold">{pct}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full">
                  <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Full Working Pages ────────────────────────────────────────
function AutomationsPage({ userId, plan, setPage }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ keyword: "", reply: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("automations").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    setList(data || []);
    setLoading(false);
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const lim = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  const activeCount = list.filter(a => a.status !== "disabled_by_system").length;
  const atLimit = activeCount >= lim.automations;

  async function save() {
    if (!form.keyword.trim() || !form.reply.trim()) return;
    setSaving(true);
    const { data, error } = await supabase.from("automations").insert([{ user_id: userId, keyword: form.keyword.trim().toLowerCase(), reply: form.reply.trim(), status: "active", active: true }]).select().single();
    if (!error) { setList(p => [data, ...p]); setForm({ keyword: "", reply: "" }); setShowForm(false); }
    setSaving(false);
  }

  async function toggle(id, active) {
    await supabase.from("automations").update({ active: !active, status: active ? "paused_by_user" : "active" }).eq("id", id).eq("user_id", userId);
    setList(p => p.map(a => a.id === id ? { ...a, active: !active, status: active ? "paused_by_user" : "active" } : a));
  }

  async function remove(id) {
    if (!confirm("Delete this automation?")) return;
    await supabase.from("automations").delete().eq("id", id).eq("user_id", userId);
    setList(p => p.filter(a => a.id !== id));
  }

  if (loading) return <Spinner />;

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Intelligence Flows</h1>
          <p className="text-gray-500 text-sm mt-1">{activeCount} / {lim.automations} rules used</p>
        </div>
        <button onClick={() => atLimit ? setPage("pricing") : setShowForm(!showForm)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-3 rounded-xl transition-colors">
          + Create Flow
        </button>
      </div>

      {showForm && !atLimit && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
          <h2 className="font-bold text-gray-900">Active Automations</h2>
          <p className="text-sm text-gray-500 mb-4">Configure your keyword-based DM triggers.</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">If Keyword</label>
              <input placeholder='"PRICING"' value={form.keyword} onChange={e => setForm({ ...form, keyword: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Response</label>
              <textarea placeholder="Our starter plan is ₹199/mo..." rows={2} value={form.reply} onChange={e => setForm({ ...form, reply: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={save} disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors">
              {saving ? "Saving..." : "Save Rule"}
            </button>
            <button onClick={() => { setShowForm(false); setForm({ keyword: "", reply: "" }); }}
              className="text-sm font-semibold text-gray-400 px-4 py-2.5 rounded-xl hover:bg-gray-100">Cancel</button>
          </div>
        </div>
      )}

      {list.length === 0 && !showForm ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-20 text-center">
          <p className="text-xl font-bold text-gray-500 mb-2">No automations yet</p>
          <p className="text-sm text-gray-400 mb-6">Create keyword rules to auto-send DMs when people comment</p>
          <button onClick={() => setShowForm(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors">Create First Automation</button>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map(a => (
            <div key={a.id} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg font-mono uppercase">{a.keyword}</span>
                  <span className="text-xs text-gray-400">{a.triggered || 0}× hits</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{a.reply}</p>
              </div>
              <div className="flex items-center gap-2">
                {a.status !== "disabled_by_system" && (
                  <button onClick={() => toggle(a.id, a.active)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${a.active ? "bg-emerald-500" : "bg-gray-300"}`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${a.active ? "translate-x-5" : ""}`} />
                  </button>
                )}
                <button onClick={() => remove(a.id)} className="p-2 text-gray-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LeadsPage({ userId }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("dm_logs").select("keyword,recipient,status,sent_at").eq("user_id", userId).order("sent_at", { ascending: false }).limit(50);
      setLeads(data || []);
      setLoading(false);
    }
    load();
  }, [userId]);

  if (loading) return <Spinner />;

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Captured Growth</h1>
        <p className="text-gray-500 text-sm mt-1">People who interacted with your automations.</p>
      </div>

      {leads.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-20 text-center">
          <p className="text-xl font-bold text-gray-500">No leads captured yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Instagram Handle</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Trigger Source</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.map((lead, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{lead.recipient}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${lead.status === "sent" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                      {lead.status === "sent" ? "Hot" : "Warm"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 uppercase font-mono">#{lead.keyword}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{new Date(lead.sent_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AnalyticsPage({ userId, plan, setPage }) {
  const [bars, setBars] = useState([]);
  const [stats, setStats] = useState({ total: 0, successRate: "100.0" });
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d; });
      const barData = await Promise.all(days.map(async d => {
        const s = new Date(d); s.setHours(0, 0, 0, 0);
        const e = new Date(d); e.setHours(23, 59, 59, 999);
        const { count } = await supabase.from("dm_logs").select("*", { count: "exact", head: true }).eq("user_id", userId).gte("sent_at", s.toISOString()).lte("sent_at", e.toISOString());
        return { day: d.toLocaleDateString("en", { weekday: "short" }), dms: count || 0 };
      }));
      setBars(barData);
      const { count: total } = await supabase.from("dm_logs").select("*", { count: "exact", head: true }).eq("user_id", userId);
      const { count: failed } = await supabase.from("dm_logs").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("status", "failed");
      const t = total || 0;
      setStats({ total: t, successRate: t > 0 ? (((t - (failed || 0)) / t) * 100).toFixed(1) : "100.0" });
      const { data: logs } = await supabase.from("dm_logs").select("keyword").eq("user_id", userId);
      const km = {};
      (logs || []).forEach(({ keyword }) => { km[keyword] = (km[keyword] || 0) + 1; });
      setKeywords(Object.entries(km).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, c]) => ({ keyword: k, count: c, pct: t > 0 ? Math.round((c / t) * 100) : 0 })));
      setLoading(false);
    }
    load();
  }, [userId]);

  if (loading) return <Spinner />;
  const maxBar = Math.max(...bars.map(b => b.dms), 1);

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-black text-gray-900">Analytics</h1>

      <div className="grid grid-cols-3 gap-4">
        {[
          { l: "Total DMs",    v: stats.total,             s: "all time"  },
          { l: "Success Rate", v: `${stats.successRate}%`, s: "delivered" },
          { l: "Top Keyword",  v: keywords[0]?.keyword || "—", s: `${keywords[0]?.count || 0} triggers` },
        ].map(({ l, v, s }) => (
          <div key={l} className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{l}</p>
            <p className="text-3xl font-black text-gray-900 mt-2">{v}</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">{s}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-sm font-bold text-gray-800 mb-6">DMs — Last 7 Days</h2>
          <div className="flex items-end gap-2 h-32">
            {bars.map((b, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                {b.dms > 0 && <span className="text-xs text-gray-400">{b.dms}</span>}
                <div className="w-full bg-emerald-500 hover:bg-emerald-400 rounded-t-lg transition-all" style={{ height: `${Math.max((b.dms / maxBar) * 100, b.dms > 0 ? 4 : 0)}px` }} />
                <span className="text-xs text-gray-400">{b.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-sm font-bold text-gray-800 mb-4">Top Keywords</h2>
          {keywords.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No data yet</p>
          ) : (
            <div className="space-y-3">
              {keywords.map(({ keyword, count, pct }) => (
                <div key={keyword}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-bold text-gray-700 font-mono bg-gray-100 px-2 py-0.5 rounded uppercase">{keyword}</span>
                    <span className="text-xs text-gray-400">{count} · {pct}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} /></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {plan !== "pro" && (
        <div className="relative bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden p-20">
          <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center gap-3">
            <p className="text-xl font-bold text-gray-800">Advanced Analytics — Pro Only</p>
            <p className="text-sm text-gray-400 text-center max-w-md">30-day trends, conversion rates, detailed breakdowns.</p>
            <button onClick={() => setPage("pricing")} className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors mt-2">
              Unlock with Pro — ₹399/mo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AccountsPage({ userId, plan, setPage }) {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("instagram_accounts").select("*").eq("user_id", userId).neq("status", "disconnected").order("connected_at", { ascending: false });
    setAccounts(data || []);
    setLoading(false);
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const lim = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  const atLimit = accounts.length >= lim.accounts;

  async function disconnect(id) {
    if (!confirm("Disconnect? Related automations will be paused.")) return;
    await supabase.from("automations").update({ status: "disabled_by_system", active: false }).eq("account_id", id).eq("user_id", userId);
    await supabase.from("instagram_accounts").update({ status: "disconnected" }).eq("id", id).eq("user_id", userId);
    load();
  }

  if (loading) return <Spinner />;

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Account Console</h1>
          <p className="text-gray-500 text-sm mt-1">{accounts.length} / {lim.accounts} accounts connected</p>
        </div>
        <button onClick={() => atLimit ? setPage("pricing") : null}
          className={`text-white text-sm font-bold px-5 py-3 rounded-xl transition-colors ${atLimit ? "bg-amber-500 hover:bg-amber-600" : "bg-emerald-600 hover:bg-emerald-700"}`}>
          {atLimit ? "Upgrade for More" : "+ Connect Instagram"}
        </button>
      </div>

      {accounts.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-20 text-center">
          <p className="text-xl font-bold text-gray-500 mb-2">No accounts connected</p>
          <p className="text-sm text-gray-400">Connect your Instagram to start automating</p>
        </div>
      ) : (
        <div className="space-y-3">
          {accounts.map(acc => (
            <div key={acc.id} className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 via-rose-400 to-orange-400 flex items-center justify-center text-white font-black text-xl">
                {acc.handle?.replace("@", "").slice(0, 2).toUpperCase() || "IG"}
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-lg">{acc.handle}</p>
                <p className="text-sm text-gray-500">{(acc.followers || 0).toLocaleString("en-IN")} followers</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-3 py-2 rounded-xl ${acc.status === "connected" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                  {acc.status === "connected" ? "Active & Secure" : "Needs Reconnect"}
                </span>
                <button onClick={() => disconnect(acc.id)}
                  className="text-sm font-bold text-red-500 hover:text-red-700 px-4 py-2 rounded-xl hover:bg-red-50 border border-red-200 transition-colors">
                  Disconnect
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Root ───────────────────────────────────────────────────────
export default function Dashboard() {
  const [page, setPage] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (uid) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", uid).single();
    setProfile(data || { plan: "free" });
  }, []);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { window.location.href = "/login"; return; }
      setUser(session.user);
      await loadProfile(session.user.id);
      setLoading(false);
    }
    init();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) window.location.href = "/login";
    });
    return () => subscription.unsubscribe();
  }, [loadProfile]);

  if (loading) return <Spinner full />;

  const plan = profile?.plan || "free";

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar page={page} setPage={setPage} email={user.email} plan={plan} open={sidebarOpen} setOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Topbar page={page} plan={plan} setOpen={setSidebarOpen} setPage={setPage} />
          <main className="flex-1 overflow-y-auto">
            {page === "overview"    && <OverviewPage />}
            {page === "automations" && <AutomationsPage userId={user.id} plan={plan} setPage={setPage} />}
            {page === "leads"       && <LeadsPage userId={user.id} />}
            {page === "analytics"   && <AnalyticsPage userId={user.id} plan={plan} setPage={setPage} />}
            {page === "accounts"    && <AccountsPage userId={user.id} plan={plan} setPage={setPage} />}
            {page === "pricing"     && <PricingPage plan={plan} onClose={() => setPage("overview")} />}
            {page === "settings"    && <SettingsPage user={user} profile={profile} onProfileUpdate={() => loadProfile(user.id)} />}
            {page === "support"     && <SupportPage />}
          </main>
        </div>
      </div>
    </>
  );
}
