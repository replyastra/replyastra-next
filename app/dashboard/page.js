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
const NEXT_PLAN   = { free: "starter", starter: "pro" };

// Only pricing cards get the uplift animation — not the nav
const GLOBAL_CSS = `
  @keyframes cardFloat {
    from { transform: translateY(0px) scale(1); box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
    to   { transform: translateY(-6px) scale(1.02); box-shadow: 0 20px 40px rgba(0,0,0,0.12); }
  }
  .plan-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
  .plan-card:hover { transform: translateY(-6px) scale(1.02); box-shadow: 0 20px 40px rgba(0,0,0,0.12); }
`;

function Spinner({ full }) {
  return (
    <div className={`flex items-center justify-center ${full ? "h-screen bg-gray-50" : "py-24"}`}>
      <div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
    </div>
  );
}

// ── SVG Icons (professional, no emoji) ────────────────────────
const Icons = {
  overview:    () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  automations: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>,
  analytics:   () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>,
  accounts:    () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>,
  upgrade:     () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7"/></svg>,
  settings:    () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>,
  help:        () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3m.08 4h.01"/></svg>,
  logout:      () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>,
  eye:         () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>,
  eyeOff:      () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>,
  check:       () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>,
  x:           () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>,
  instagram:   () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
};

const NAV = [
  { id: "overview",    label: "Overview",    Icon: Icons.overview    },
  { id: "automations", label: "Automations", Icon: Icons.automations },
  { id: "analytics",   label: "Analytics",   Icon: Icons.analytics   },
  { id: "accounts",    label: "Accounts",    Icon: Icons.accounts    },
  { id: "pricing",     label: "Upgrade",     Icon: Icons.upgrade     },
];

// ── Pricing Page ───────────────────────────────────────────────
function PricingPage({ plan, onClose }) {
  const [billing, setBilling] = useState("monthly");
  const yearly = billing === "yearly";

  const plans = [
    {
      id: "free", name: "Free", tag: "BASE LAYER",
      price: { monthly: 0, yearly: 0 },
      border: "border-gray-200",
      highlight: false,
      features: [
        { text: "500 DMs per month",       ok: true  },
        { text: "3 automation rules",       ok: true  },
        { text: "1 Instagram account",      ok: true  },
        { text: "Basic analytics",          ok: true  },
        { text: "ReplyAstra watermark",     ok: false },
        { text: "Ask to Follow automation", ok: false },
      ],
    },
    {
      id: "starter", name: "Starter", tag: "EXPANSION MODE",
      price: { monthly: 199, yearly: 169 },
      border: "border-emerald-500",
      highlight: true, badge: "MOST POPULAR",
      features: [
        { text: "3,000 DMs per month",      ok: true },
        { text: "10 automation rules",       ok: true },
        { text: "3 Instagram accounts",      ok: true },
        { text: "Ask-to-Follow automation",  ok: true },
        { text: "Unlimited keyword replies", ok: true },
        { text: "No watermark",             ok: true },
      ],
    },
    {
      id: "pro", name: "Pro", tag: "ENTERPRISE CORE",
      price: { monthly: 399, yearly: 339 },
      border: "border-gray-900",
      highlight: false,
      features: [
        { text: "10,000 DMs per month",     ok: true },
        { text: "50 automation rules",       ok: true },
        { text: "10 Instagram accounts",     ok: true },
        { text: "Advanced analytics",        ok: true },
        { text: "Priority support",          ok: true },
        { text: "All Starter features",      ok: true },
      ],
    },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto w-full">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Choose your growth path</h1>
          <p className="text-gray-500 text-sm mt-1">Transparent pricing for real influence.</p>
        </div>
        <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
          ← Back
        </button>
      </div>

      {/* Toggle */}
      <div className="flex items-center justify-center gap-3 mt-8 mb-10">
        <span className={`text-sm font-semibold ${!yearly ? "text-gray-900" : "text-gray-400"}`}>Monthly</span>
        <button onClick={() => setBilling(b => b === "monthly" ? "yearly" : "monthly")}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${yearly ? "bg-emerald-500" : "bg-gray-200"}`}>
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${yearly ? "translate-x-5" : ""}`} />
        </button>
        <span className={`text-sm font-semibold ${yearly ? "text-gray-900" : "text-gray-400"}`}>
          Yearly <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full ml-1">SAVE 15%</span>
        </span>
      </div>

      {/* Cards — pricing uplift only on hover */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map(p => {
          const price = p.price[billing];
          const isCurrent = plan === p.id;
          return (
            <div key={p.id}
              className={`plan-card relative bg-white rounded-2xl border-2 ${p.border} p-6 flex flex-col cursor-default ${p.highlight ? "shadow-md" : "shadow-sm"}`}>
              {p.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="bg-emerald-600 text-white text-xs font-black px-4 py-1 rounded-full tracking-wide">{p.badge}</span>
                </div>
              )}
              <p className="text-xs font-bold text-gray-400 tracking-widest uppercase">{p.tag}</p>
              <h2 className={`text-xl font-black mt-1 ${p.highlight ? "text-emerald-600" : "text-gray-900"}`}>{p.name}</h2>
              <div className="my-5">
                <span className="text-4xl font-black text-gray-900">₹{price}</span>
                <span className="text-gray-400 text-sm ml-1">/mo</span>
                {yearly && price > 0 && (
                  <p className="text-xs text-emerald-600 font-semibold mt-0.5">Billed ₹{price * 12}/yr</p>
                )}
              </div>
              <ul className="space-y-2.5 flex-1 mb-6">
                {p.features.map(f => (
                  <li key={f.text} className="flex items-center gap-2.5 text-sm">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${f.ok ? "bg-emerald-100 text-emerald-600" : "bg-red-50 text-red-400"}`}>
                      {f.ok ? <Icons.check /> : <Icons.x />}
                    </span>
                    <span className={f.ok ? "text-gray-600" : "text-gray-400 line-through"}>{f.text}</span>
                  </li>
                ))}
              </ul>
              {isCurrent ? (
                <div className="w-full text-center bg-gray-100 text-gray-500 font-bold py-3 rounded-xl text-sm">
                  Current Plan
                </div>
              ) : (
                <button
                  onClick={() => alert("Payment integration coming soon! We will notify you via email.")}
                  className={`w-full font-bold py-3.5 rounded-xl text-sm transition-colors ${
                    p.highlight ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-gray-900 hover:bg-gray-700 text-white"
                  }`}>
                  Get Started
                </button>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-center text-xs text-gray-400 mt-8">*Automation volume depends on Instagram's official messaging limits.</p>
    </div>
  );
}

// ── Settings Page ──────────────────────────────────────────────
function SettingsPage({ user, profile, onProfileUpdate }) {
  const [tab, setTab] = useState("profile");
  const [name, setName] = useState(user?.user_metadata?.full_name || "");
  const [email] = useState(user?.email || "");
  const [pw, setPw] = useState({ current: "", new: "", confirm: "" });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
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
    const { error } = await supabase.auth.updateUser({ password: pw.new });
    if (error) { flash("pw", error.message); }
    else { flash("pw", "Password updated successfully. You will be logged in with the new password."); setPw({ current: "", new: "", confirm: "" }); }
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
    <div className="p-6 lg:p-10 max-w-3xl mx-auto w-full">
      <h1 className="text-2xl font-black text-gray-900 mb-6">Settings</h1>

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-gray-200 mb-8 overflow-x-auto">
        {settingsTabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
              tab === t.id ? "border-emerald-600 text-emerald-700" : "border-transparent text-gray-500 hover:text-gray-800"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Profile */}
      {tab === "profile" && (
        <form onSubmit={saveProfile} className="space-y-5">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 font-black text-xl flex items-center justify-center">
              {name?.slice(0, 1).toUpperCase() || "U"}
            </div>
            <div>
              <p className="font-bold text-gray-900">{name || "User"}</p>
              <p className="text-sm text-gray-500">{email}</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
            <input value={email} disabled
              className="w-full border border-gray-100 rounded-xl px-4 py-2.5 text-sm text-gray-400 bg-gray-50 cursor-not-allowed" />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed. Contact support if needed.</p>
          </div>
          {msg.profile && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl px-4 py-3">{msg.profile}</div>
          )}
          <button type="submit" disabled={savingProfile}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors">
            {savingProfile ? "Saving..." : "Save Changes"}
          </button>
        </form>
      )}

      {/* Security */}
      {tab === "security" && (
        <form onSubmit={savePassword} className="space-y-5">
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700">
            Choose a strong password with at least 6 characters.
          </div>
          {[
            { key: "new",     label: "New Password",     ph: "Minimum 6 characters" },
            { key: "confirm", label: "Confirm Password",  ph: "Repeat new password"  },
          ].map(({ key, label, ph }) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
              <div className="relative">
                <input type={showPw[key] ? "text" : "password"} required minLength={key === "new" ? 6 : 1}
                  placeholder={ph} value={pw[key]}
                  onChange={e => setPw(p => ({ ...p, [key]: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition" />
                <button type="button" onClick={() => setShowPw(s => ({ ...s, [key]: !s[key] }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw[key] ? <Icons.eye /> : <Icons.eyeOff />}
                </button>
              </div>
            </div>
          ))}
          {msg.pw && (
            <div className={`border rounded-xl px-4 py-3 text-sm ${msg.pw.includes("successfully") ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-600"}`}>
              {msg.pw}
            </div>
          )}
          <button type="submit" disabled={savingPw}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors">
            {savingPw ? "Updating..." : "Update Password"}
          </button>
        </form>
      )}

      {/* Instagram Accounts */}
      {tab === "accounts" && (
        <div className="space-y-4">
          {accounts.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3 text-gray-400">
                <Icons.instagram />
              </div>
              <p className="font-semibold text-gray-500">No Instagram accounts connected</p>
              <p className="text-xs text-gray-400 mt-1">Go to Accounts to connect your Instagram</p>
            </div>
          ) : (
            accounts.map(acc => (
              <div key={acc.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 via-rose-400 to-orange-400 flex items-center justify-center text-white font-black text-sm shrink-0">
                  {acc.handle?.replace("@", "").slice(0, 2).toUpperCase() || "IG"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm">{acc.handle}</p>
                  <p className="text-xs text-gray-400">{(acc.followers || 0).toLocaleString("en-IN")} followers</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${acc.status === "connected" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${acc.status === "connected" ? "bg-emerald-500" : "bg-amber-400"}`} />
                    {acc.status === "connected" ? "Connected" : "Needs Reconnect"}
                  </span>
                  <button onClick={() => disconnect(acc.id)}
                    className="text-xs font-semibold text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 border border-red-200 transition-colors">
                    Disconnect
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Billing */}
      {tab === "billing" && (
        <div className="space-y-5">
          {/* Current plan card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Current Plan</p>
                <h2 className="text-2xl font-black text-gray-900">{PLAN_NAMES[plan]}</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {plan === "free" ? "Free forever" : `${PLAN_PRICES[plan]}/month · Renews automatically`}
                </p>
              </div>
              <div className={`px-4 py-2 rounded-xl text-sm font-black ${plan === "pro" ? "bg-gray-900 text-white" : plan === "starter" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600"}`}>
                {PLAN_NAMES[plan]}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
              {[
                { l: "DM Limit",      v: PLAN_LIMITS[plan].dms.toLocaleString("en-IN") + "/mo" },
                { l: "Automations",   v: PLAN_LIMITS[plan].automations + " rules" },
                { l: "IG Accounts",   v: PLAN_LIMITS[plan].accounts + " account" + (PLAN_LIMITS[plan].accounts > 1 ? "s" : "") },
              ].map(({ l, v }) => (
                <div key={l} className="text-center">
                  <p className="text-xs text-gray-400">{l}</p>
                  <p className="text-sm font-bold text-gray-800 mt-0.5">{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Upgrade / manage */}
          {plan !== "pro" && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="font-bold text-emerald-900">Upgrade your plan</p>
                <p className="text-sm text-emerald-700 mt-0.5">Get more DMs, automations and Instagram accounts.</p>
              </div>
              <a href="/dashboard" onClick={() => { }} className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors">
                View Plans →
              </a>
            </div>
          )}

          {plan !== "free" && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <p className="font-semibold text-gray-800 mb-1">Cancel subscription</p>
              <p className="text-sm text-gray-500 mb-4">Your plan remains active until the end of the billing period. No refunds for partial months.</p>
              <button onClick={() => window.location.href = "mailto:support@replyastra.online?subject=Cancel Subscription&body=Please cancel my ReplyAstra subscription. Email: " + email}
                className="text-sm font-bold text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-4 py-2 rounded-xl transition-colors">
                Request Cancellation
              </button>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-500">
            For billing questions, email{" "}
            <a href="mailto:support@replyastra.online" className="text-emerald-600 font-semibold hover:underline">support@replyastra.online</a>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sidebar ────────────────────────────────────────────────────
function Sidebar({ page, setPage, email, plan, open, setOpen }) {
  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const NavContent = ({ onNav }) => (
    <>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ id, label, Icon }) => (
          <button key={id} onClick={() => { setPage(id); onNav?.(); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
              page === id
                ? "bg-emerald-600 text-white shadow-sm"
                : id === "pricing"
                  ? "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            }`}>
            <span className="shrink-0 opacity-80"><Icon /></span>
            {label}
          </button>
        ))}
        <div className="pt-2 border-t border-gray-100 mt-2 space-y-0.5">
          <button onClick={() => { setPage("settings"); onNav?.(); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
              page === "settings" ? "bg-emerald-600 text-white shadow-sm" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            }`}>
            <span className="shrink-0 opacity-80"><Icons.settings /></span>Settings
          </button>
          <a href="https://replyastra.online/contact" target="_blank" rel="noreferrer"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 text-gray-500 hover:bg-gray-100 hover:text-gray-900">
            <span className="shrink-0 opacity-80"><Icons.help /></span>Help & Support
          </a>
        </div>
      </nav>
      <div className="px-3 py-4 border-t border-gray-100">
        <div className="px-3 py-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-black text-xs flex items-center justify-center shrink-0">
              {email?.slice(0, 1).toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 truncate">{email}</p>
              <span className={`text-xs font-bold ${plan === "pro" ? "text-gray-900" : plan === "starter" ? "text-blue-600" : "text-gray-400"}`}>
                {PLAN_NAMES[plan] || "Free"} Plan
              </span>
            </div>
          </div>
        </div>
        <button onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-50 hover:text-red-600 transition-all duration-150">
          <Icons.logout />Log Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setOpen(false)} />}
      <div className={`fixed inset-y-0 left-0 w-56 bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="ReplyAstra" className="h-7 w-auto" />
            <span className="text-base font-black text-gray-900">Reply<span className="text-emerald-500">Astra</span></span>
          </div>
          <button onClick={() => setOpen(false)} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <NavContent onNav={() => setOpen(false)} />
      </div>
      <aside className="hidden lg:flex w-56 shrink-0 flex-col bg-white border-r border-gray-100 h-screen sticky top-0">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
          <img src="/logo.png" alt="ReplyAstra" className="h-7 w-auto" />
          <span className="text-base font-black text-gray-900">Reply<span className="text-emerald-500">Astra</span></span>
        </div>
        <NavContent />
      </aside>
    </>
  );
}

// ── Topbar ─────────────────────────────────────────────────────
function Topbar({ page, plan, setOpen, setPage }) {
  const titles = { overview: "Overview", automations: "Automations", analytics: "Analytics", accounts: "Accounts", pricing: "Plans & Pricing", settings: "Settings" };
  return (
    <header className="bg-white border-b border-gray-100 px-4 lg:px-6 py-3 flex items-center gap-3 sticky top-0 z-30">
      <button onClick={() => setOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-500">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
      <h1 className="text-base font-black text-gray-900 flex-1">{titles[page] || "Overview"}</h1>
      <div className="flex items-center gap-2">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${plan === "pro" ? "bg-gray-900 text-white" : plan === "starter" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
          {PLAN_NAMES[plan] || "Free"}
        </span>
        {plan !== "pro" && (
          <button onClick={() => setPage("pricing")}
            className="flex items-center gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-full transition-colors">
            Upgrade
          </button>
        )}
      </div>
    </header>
  );
}

// ── Overview ───────────────────────────────────────────────────
function OverviewPage({ userId, plan, setPage }) {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
      const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
      const [
        { count: totalDMs },
        { count: weekDMs },
        { count: activeAutos },
        { count: totalAccounts },
        { data: recent },
        { count: monthlyDMs },
      ] = await Promise.all([
        supabase.from("dm_logs").select("*", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("dm_logs").select("*", { count: "exact", head: true }).eq("user_id", userId).gte("sent_at", weekAgo.toISOString()),
        supabase.from("automations").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("status", "active"),
        supabase.from("instagram_accounts").select("*", { count: "exact", head: true }).eq("user_id", userId).neq("status", "disconnected"),
        supabase.from("dm_logs").select("keyword,recipient,status,sent_at").eq("user_id", userId).order("sent_at", { ascending: false }).limit(8),
        supabase.from("dm_logs").select("*", { count: "exact", head: true }).eq("user_id", userId).gte("sent_at", monthStart.toISOString()),
      ]);
      setStats({ totalDMs: totalDMs || 0, weekDMs: weekDMs || 0, activeAutos: activeAutos || 0, totalAccounts: totalAccounts || 0, monthlyDMs: monthlyDMs || 0 });
      setActivity(recent || []);
      setLoading(false);
    }
    load();
  }, [userId]);

  const timeAgo = ts => {
    const s = Math.floor((Date.now() - new Date(ts)) / 1000);
    if (s < 60) return `${s}s ago`;
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
  };

  if (loading) return <Spinner />;
  const lim = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  const dmPct = Math.round((stats.monthlyDMs / lim.dms) * 100);

  return (
    <div className="p-6 lg:p-8 space-y-5 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total DMs Sent",     value: stats.totalDMs,      sub: `+${stats.weekDMs} this week` },
          { label: "Active Automations", value: stats.activeAutos,   sub: `of ${lim.automations} allowed` },
          { label: "Instagram Accounts", value: stats.totalAccounts, sub: `of ${lim.accounts} allowed` },
          { label: "DMs This Month",     value: stats.monthlyDMs,    sub: `${dmPct}% of ${lim.dms}` },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 lg:p-5 hover:shadow-sm transition-shadow">
            <p className="text-2xl lg:text-3xl font-black text-gray-900">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{label}</p>
            <p className="text-xs text-emerald-600 font-semibold mt-0.5">{sub}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-800">Recent Activity</h2>
            <span className="text-xs text-gray-400">{activity.length} events</span>
          </div>
          {activity.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm font-bold text-gray-400 mt-3">No DM activity yet</p>
              <p className="text-xs text-gray-400 mt-1">Add an automation to start sending DMs</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {activity.map((log, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                  <span className={`shrink-0 ${log.status === "sent" ? "text-emerald-500" : "text-red-400"}`}>
                    {log.status === "sent"
                      ? <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                      : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                    }
                  </span>
                  <p className="flex-1 text-sm text-gray-700 truncate"><span className="font-semibold">"{log.keyword}"</span> → {log.recipient}</p>
                  <span className="text-xs text-gray-400 shrink-0">{timeAgo(log.sent_at)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-3">
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex justify-between mb-2">
              <p className="text-xs font-bold text-gray-500">Monthly DMs</p>
              <span className="text-xs text-gray-400">{stats.monthlyDMs} / {lim.dms}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${dmPct >= 90 ? "bg-red-500" : dmPct >= 70 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${Math.min(dmPct, 100)}%` }} />
            </div>
            {dmPct >= 70 && <p className="text-xs text-amber-600 font-semibold mt-2">Running low — <button onClick={() => setPage("pricing")} className="underline">Upgrade</button></p>}
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Quick Actions</p>
            <div className="space-y-0.5">
              <button className="w-full text-left text-sm text-gray-600 hover:text-gray-900 font-medium py-2 px-2 rounded-lg hover:bg-gray-50 transition-colors">Add Keyword Rule →</button>
              <button className="w-full text-left text-sm text-gray-600 hover:text-gray-900 font-medium py-2 px-2 rounded-lg hover:bg-gray-50 transition-colors">Connect Instagram →</button>
              {plan !== "pro" && <button onClick={() => setPage("pricing")} className="w-full text-left text-sm text-emerald-600 hover:text-emerald-700 font-bold py-2 px-2 rounded-lg hover:bg-emerald-50 transition-colors">Upgrade Plan →</button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Automations ─────────────────────────────────────────────────
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
    <div className="p-6 lg:p-8 space-y-5 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-sm text-gray-500">{activeCount} / {lim.automations} rules used</p>
          {atLimit && <p className="text-xs text-amber-600 font-semibold mt-0.5">Limit reached — <button onClick={() => setPage("pricing")} className="underline">upgrade to add more</button></p>}
        </div>
        <button onClick={() => atLimit ? setPage("pricing") : setShowForm(!showForm)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors">
          + New Automation
        </button>
      </div>
      {showForm && !atLimit && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
          <p className="text-sm font-bold text-gray-800">New Keyword Automation</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Trigger Keyword</label>
              <input placeholder='e.g. "price" or "link"' value={form.keyword} onChange={e => setForm({ ...form, keyword: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Auto-DM Message</label>
              <textarea placeholder="Hey! Thanks for commenting..." rows={3} value={form.reply} onChange={e => setForm({ ...form, reply: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none transition" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={save} disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors">
              {saving ? "Saving..." : "Save Rule"}
            </button>
            <button onClick={() => { setShowForm(false); setForm({ keyword: "", reply: "" }); }} className="text-sm font-semibold text-gray-400 px-4 py-2.5 rounded-xl hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      )}
      {list.length === 0 && !showForm ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
          <p className="font-bold text-gray-500 mb-1">No automations yet</p>
          <p className="text-sm text-gray-400 mb-5">Create keyword rules to auto-send DMs when people comment</p>
          <button onClick={() => setShowForm(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors">Create First Automation</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {list.map(a => (
            <div key={a.id} className={`bg-white rounded-2xl border p-4 flex items-start gap-3 ${a.status === "disabled_by_system" ? "border-red-100" : "border-gray-100"}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-xs font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-lg font-mono">{a.keyword}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${a.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                    {a.status === "active" ? "Active" : a.status === "disabled_by_system" ? "Disabled" : "Paused"}
                  </span>
                  <span className="text-xs text-gray-400">{a.triggered || 0}× sent</span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">{a.reply}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {a.status !== "disabled_by_system" && (
                  <button onClick={() => toggle(a.id, a.active)}
                    className={`relative w-10 h-6 rounded-full transition-colors ${a.active ? "bg-emerald-500" : "bg-gray-200"}`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${a.active ? "translate-x-4" : ""}`} />
                  </button>
                )}
                <button onClick={() => remove(a.id)} className="p-1.5 text-gray-300 hover:text-red-400 rounded-lg hover:bg-red-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Analytics ──────────────────────────────────────────────────
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
    <div className="p-6 lg:p-8 space-y-5 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-3 gap-3">
        {[
          { l: "Total DMs",    v: stats.total,             s: "all time"       },
          { l: "Success Rate", v: `${stats.successRate}%`, s: "delivered"      },
          { l: "Top Keyword",  v: keywords[0]?.keyword || "—", s: `${keywords[0]?.count || 0} triggers` },
        ].map(({ l, v, s }) => (
          <div key={l} className="bg-white rounded-2xl border border-gray-100 p-4 lg:p-5">
            <p className="text-xs text-gray-400 font-semibold">{l}</p>
            <p className="text-xl lg:text-3xl font-black text-gray-900 truncate mt-1">{v}</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">{s}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-bold text-gray-800 mb-5">DMs — Last 7 Days</h2>
          <div className="flex items-end gap-2" style={{ height: "100px" }}>
            {bars.map((b, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                {b.dms > 0 && <span className="text-xs text-gray-400">{b.dms}</span>}
                <div className="w-full bg-emerald-500 hover:bg-emerald-400 rounded-t-lg transition-all" style={{ height: `${Math.max((b.dms / maxBar) * 72, b.dms > 0 ? 4 : 0)}px` }} />
                <span className="text-xs text-gray-400">{b.day}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-bold text-gray-800 mb-4">Top Keywords</h2>
          {keywords.length === 0 ? (
            <div className="text-center py-8"><p className="text-sm text-gray-400">No data yet</p></div>
          ) : (
            <div className="space-y-3">
              {keywords.map(({ keyword, count, pct }) => (
                <div key={keyword}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-bold text-gray-700 font-mono bg-gray-100 px-2 py-0.5 rounded-lg">{keyword}</span>
                    <span className="text-xs text-gray-400">{count} · {pct}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {plan !== "pro" && (
        <div className="relative bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
          <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-10 gap-3 p-6">
            <p className="font-bold text-gray-800">Advanced Analytics — Pro Only</p>
            <p className="text-xs text-gray-400 text-center max-w-xs">30-day trends, conversion rates, and detailed breakdowns.</p>
            <button onClick={() => setPage("pricing")} className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors">
              Unlock with Pro — ₹399/mo
            </button>
          </div>
          <div className="p-5 h-32 select-none" />
        </div>
      )}
    </div>
  );
}

// ── Accounts ───────────────────────────────────────────────────
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
    if (!confirm("Disconnect this account? Related automations will be paused.")) return;
    await supabase.from("automations").update({ status: "disabled_by_system", active: false }).eq("account_id", id).eq("user_id", userId);
    await supabase.from("instagram_accounts").update({ status: "disconnected" }).eq("id", id).eq("user_id", userId);
    load();
  }

  if (loading) return <Spinner />;

  return (
    <div className="p-6 lg:p-8 space-y-5 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm text-gray-500">{accounts.length} / {lim.accounts} accounts connected</p>
        <button onClick={() => atLimit ? setPage("pricing") : null}
          className={`text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors ${atLimit ? "bg-amber-500 hover:bg-amber-600" : "bg-emerald-600 hover:bg-emerald-700"}`}>
          {atLimit ? "Upgrade to Connect More" : "+ Connect Instagram"}
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {accounts.map(acc => (
          <div key={acc.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-400 via-rose-400 to-orange-400 flex items-center justify-center text-white font-black text-sm shrink-0">
              {acc.handle?.replace("@", "").slice(0, 2).toUpperCase() || "IG"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm">{acc.handle}</p>
              <p className="text-xs text-gray-400">{(acc.followers || 0).toLocaleString("en-IN")} followers</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${acc.status === "connected" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${acc.status === "connected" ? "bg-emerald-500" : "bg-amber-400"}`} />
                {acc.status === "connected" ? "Connected" : "Reconnect"}
              </span>
              <button onClick={() => disconnect(acc.id)} className="text-xs font-semibold text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 border border-red-200 transition-colors">
                Disconnect
              </button>
            </div>
          </div>
        ))}
      </div>
      {!atLimit && (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-emerald-300 p-10 flex flex-col items-center gap-2 transition-colors cursor-pointer">
          <div className="text-gray-400"><Icons.instagram /></div>
          <p className="text-sm font-bold text-gray-500">Connect an Instagram account</p>
          <p className="text-xs text-gray-400">Secure Meta OAuth — we never ask for your password</p>
        </div>
      )}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="text-sm font-bold text-gray-800 mb-4">Account Limits by Plan</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { p: "free", n: "1 account", price: "₹0/mo", dms: "500 DMs", autos: "3 rules" },
            { p: "starter", n: "3 accounts", price: "₹199/mo", dms: "3,000 DMs", autos: "10 rules" },
            { p: "pro", n: "10 accounts", price: "₹399/mo", dms: "10,000 DMs", autos: "50 rules" },
          ].map(({ p, n, price, dms, autos }) => (
            <div key={p} className={`rounded-xl p-4 text-center transition-all ${plan === p ? "ring-2 ring-emerald-500 bg-emerald-50" : "bg-gray-50"}`}>
              <p className="text-xs font-bold text-gray-400">{PLAN_NAMES[p]}</p>
              <p className="text-sm font-black text-gray-900 mt-1">{n}</p>
              <p className="text-xs text-gray-400">{dms}</p>
              <p className="text-xs text-gray-400">{autos}</p>
              <p className="text-xs text-emerald-600 font-bold mt-1">{price}</p>
            </div>
          ))}
        </div>
        {plan !== "pro" && (
          <button onClick={() => setPage("pricing")} className="block w-full text-center mt-4 text-sm font-bold text-emerald-600 hover:underline">Upgrade your plan →</button>
        )}
      </div>
    </div>
  );
}

// ── Welcome Popup ──────────────────────────────────────────────
function WelcomePopup({ name, plan, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center relative">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100">
          <Icons.x />
        </button>
        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
        </div>
        <h2 className="text-xl font-black text-gray-900">Welcome to ReplyAstra!</h2>
        <p className="text-gray-400 text-sm mt-2 mb-6">Hey <strong className="text-gray-700">{name}</strong>! You're on the <span className="font-bold text-emerald-600">{PLAN_NAMES[plan] || "Free"} plan</span>.</p>
        <div className="space-y-2 text-left mb-6">
          {["Connect your Instagram account", "Add a keyword automation rule", "Watch DMs send automatically"].map((t, i) => (
            <div key={t} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
              <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-black shrink-0">{i + 1}</span>
              <span className="text-sm font-semibold text-gray-700">{t}</span>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-colors">Let's Go!</button>
      </div>
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
  const [showWelcome, setShowWelcome] = useState(false);

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
      try { if (!localStorage.getItem("ra_welcomed_v3")) { setShowWelcome(true); localStorage.setItem("ra_welcomed_v3", "1"); } } catch (_) {}
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
  const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "there";

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {showWelcome && <WelcomePopup name={name} plan={plan} onClose={() => setShowWelcome(false)} />}
        <Sidebar page={page} setPage={setPage} email={user.email} plan={plan} open={sidebarOpen} setOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Topbar page={page} plan={plan} setOpen={setSidebarOpen} setPage={setPage} />
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            {page === "overview"    && <OverviewPage    userId={user.id} plan={plan} setPage={setPage} />}
            {page === "automations" && <AutomationsPage userId={user.id} plan={plan} setPage={setPage} />}
            {page === "analytics"   && <AnalyticsPage   userId={user.id} plan={plan} setPage={setPage} />}
            {page === "accounts"    && <AccountsPage    userId={user.id} plan={plan} setPage={setPage} />}
            {page === "pricing"     && <PricingPage     plan={plan} onClose={() => setPage("overview")} />}
            {page === "settings"    && <SettingsPage    user={user} profile={profile} onProfileUpdate={() => loadProfile(user.id)} />}
          </main>
        </div>
      </div>
    </>
  );
}
