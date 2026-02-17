"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { auth: { persistSession: true, autoRefreshToken: true, storageKey: "replyastra-auth" } }
);

// ── Plan config — updated limits as requested ─────────────────
const PLAN_LIMITS = {
  free:    { automations: 3,   accounts: 1,  dms: 500,   analytics: false },
  starter: { automations: 10,  accounts: 3,  dms: 3000,  analytics: false },
  pro:     { automations: 50,  accounts: 10, dms: 10000, analytics: true  },
};
const PLAN_NAMES  = { free: "Free", starter: "Starter", pro: "Pro" };
const PLAN_PRICES = { free: "₹0",   starter: "₹199",    pro: "₹399" };
const NEXT_PLAN   = { free: "starter", starter: "pro" };

// ── Global fluid hover CSS injected once ─────────────────────
const HOVER_STYLE = `
  @keyframes fluidWobble {
    0%   { transform: translateX(0) rotate(0deg); }
    20%  { transform: translateX(-3px) rotate(-0.8deg); }
    40%  { transform: translateX(3px)  rotate(0.8deg); }
    60%  { transform: translateX(-2px) rotate(-0.4deg); }
    80%  { transform: translateX(2px)  rotate(0.4deg); }
    100% { transform: translateX(0)    rotate(0deg); }
  }
  .nav-item:hover { animation: fluidWobble 0.45s ease-in-out; }
`;

function Spinner({ full }) {
  return (
    <div className={`flex items-center justify-center ${full ? "h-screen" : "py-24"}`}>
      <div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
    </div>
  );
}

// ── Full Pricing PAGE (inside dashboard — like ZapDM) ─────────
function PricingPage({ plan, onClose }) {
  const [billing, setBilling] = useState("monthly"); // monthly | yearly
  const yearly = billing === "yearly";

  const plans = [
    {
      id: "free",
      name: "Free",
      tag: "BASE LAYER",
      price: { monthly: 0, yearly: 0 },
      color: "border-gray-200",
      highlight: false,
      features: [
        { text: "500 DMs per month",        ok: true },
        { text: "3 automation rules",        ok: true },
        { text: "1 Instagram account",       ok: true },
        { text: "Basic analytics",           ok: true },
        { text: "ReplyAstra watermark",      ok: false, red: true },
        { text: "Ask to Follow automation",  ok: false, red: true },
      ],
    },
    {
      id: "starter",
      name: "Starter",
      tag: "EXPANSION MODE",
      price: { monthly: 199, yearly: 169 },
      color: "border-emerald-500",
      highlight: true,
      badge: "MOST POPULAR",
      features: [
        { text: "3,000 DMs per month",       ok: true },
        { text: "10 automation rules",        ok: true },
        { text: "3 Instagram accounts",       ok: true },
        { text: "Ask-to-Follow automation",   ok: true },
        { text: "Unlimited keyword replies",  ok: true },
        { text: "No watermark",              ok: true },
      ],
    },
    {
      id: "pro",
      name: "Pro",
      tag: "ENTERPRISE CORE",
      price: { monthly: 399, yearly: 339 },
      color: "border-gray-200",
      highlight: false,
      features: [
        { text: "10,000 DMs per month",      ok: true },
        { text: "50 automation rules",        ok: true },
        { text: "10 Instagram accounts",      ok: true },
        { text: "Advanced analytics",         ok: true },
        { text: "Priority support",           ok: true },
        { text: "All Starter features",       ok: true },
      ],
    },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Choose your growth path</h1>
          <p className="text-gray-500 text-sm mt-1">Transparent pricing for real influence.</p>
        </div>
        <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-600 font-semibold px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors">
          ← Back
        </button>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3 mt-6 mb-8">
        <span className={`text-sm font-semibold ${!yearly ? "text-gray-900" : "text-gray-400"}`}>Monthly</span>
        <button
          onClick={() => setBilling(b => b === "monthly" ? "yearly" : "monthly")}
          className={`relative w-12 h-6 rounded-full transition-colors ${yearly ? "bg-emerald-500" : "bg-gray-200"}`}>
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${yearly ? "translate-x-6" : ""}`} />
        </button>
        <span className={`text-sm font-semibold ${yearly ? "text-gray-900" : "text-gray-400"}`}>
          Yearly <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full ml-1">SAVE 15%</span>
        </span>
      </div>

      {/* Plan cards — horizontal row like ZapDM */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map(p => {
          const price = p.price[billing];
          const isCurrent = plan === p.id;
          return (
            <div key={p.id}
              className={`relative bg-white rounded-3xl border-2 p-6 flex flex-col transition-all hover:shadow-lg ${p.color} ${p.highlight ? "shadow-md scale-[1.02]" : ""}`}>
              {/* Popular badge */}
              {p.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-emerald-600 text-white text-xs font-black px-4 py-1 rounded-full">{p.badge}</span>
                </div>
              )}

              <p className="text-xs font-bold text-gray-400 tracking-widest">{p.tag}</p>
              <h2 className={`text-xl font-black mt-1 ${p.highlight ? "text-emerald-600" : "text-gray-900"}`}>{p.name}</h2>

              <div className="my-4">
                <span className="text-4xl font-black text-gray-900">₹{price}</span>
                <span className="text-gray-400 text-sm">/mo</span>
                {yearly && price > 0 && (
                  <p className="text-xs text-emerald-600 font-semibold mt-1">
                    Billed ₹{price * 12}/yr
                  </p>
                )}
              </div>

              <ul className="space-y-2.5 flex-1 mb-6">
                {p.features.map(f => (
                  <li key={f.text} className="flex items-center gap-2.5 text-sm">
                    {f.ok
                      ? <span className="w-4 h-4 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                      : <span className="w-4 h-4 bg-red-100 text-red-400 rounded-full flex items-center justify-center text-xs font-bold shrink-0">✕</span>
                    }
                    <span className={f.red ? "text-red-400" : "text-gray-600"}>{f.text}</span>
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <div className="w-full text-center bg-gray-100 text-gray-500 font-bold py-3 rounded-2xl text-sm">
                  Current Plan
                </div>
              ) : (
                <button
                  onClick={() => alert("Payment integration coming soon! We will notify you when ready.")}
                  className={`w-full font-bold py-3.5 rounded-2xl text-sm transition-colors ${
                    p.highlight
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-gray-900 hover:bg-gray-800 text-white"
                  }`}>
                  GET STARTED
                </button>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-gray-400 mt-6">
        *Automation volume depends on Instagram's official messaging limits.
      </p>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────
const NAV = [
  { id: "overview",    label: "Overview",    emoji: "🏠" },
  { id: "automations", label: "Automations", emoji: "⚡" },
  { id: "analytics",   label: "Analytics",   emoji: "📊" },
  { id: "accounts",    label: "Accounts",    emoji: "📸" },
  { id: "pricing",     label: "Upgrade",     emoji: "👑" },
];

function Sidebar({ page, setPage, email, plan, open, setOpen }) {
  const initials = email ? email.slice(0, 2).toUpperCase() : "RA";
  const next = NEXT_PLAN[plan];

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const Content = ({ onNav }) => (
    <>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ id, label, emoji }) => (
          <button key={id}
            onClick={() => { setPage(id); onNav?.(); }}
            className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              page === id
                ? "bg-emerald-600 text-white shadow-sm"
                : id === "pricing"
                  ? "text-emerald-600 hover:bg-emerald-50 font-bold"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            }`}>
            <span>{emoji}</span>{label}
          </button>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-gray-100 space-y-2">
        <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-gray-50">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${plan === "pro" ? "bg-emerald-100 text-emerald-700" : plan === "starter" ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-600"}`}>
            {plan === "pro" && "👑 "}{PLAN_NAMES[plan] || "Free"}
          </span>
          {next && (
            <button onClick={() => setPage("pricing")} className="text-xs font-bold text-emerald-600 hover:underline">
              {PLAN_PRICES[next]}/mo ↑
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 px-3 py-1">
          <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0">
            {initials}
          </div>
          <p className="text-xs text-gray-500 truncate flex-1">{email}</p>
        </div>
        <button onClick={logout}
          className="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-50 transition-all cursor-pointer">
          🚪 Log Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setOpen(false)} />}
      <div className={`fixed inset-y-0 left-0 w-60 bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="text-lg font-black text-emerald-600">ReplyAstra</span>
          <button onClick={() => setOpen(false)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100">✕</button>
        </div>
        <Content onNav={() => setOpen(false)} />
      </div>
      <aside className="hidden lg:flex w-56 shrink-0 flex-col bg-white border-r border-gray-100 h-screen sticky top-0">
        <div className="px-5 py-4 border-b border-gray-100">
          <span className="text-lg font-black text-emerald-600">ReplyAstra</span>
        </div>
        <Content />
      </aside>
    </>
  );
}

// ── Topbar ────────────────────────────────────────────────────
function Topbar({ page, plan, setOpen, setPage }) {
  const titles = { overview: "Overview", automations: "Automations", analytics: "Analytics", accounts: "Accounts", pricing: "Plans & Pricing" };
  return (
    <header className="bg-white border-b border-gray-100 px-4 lg:px-6 py-3 flex items-center gap-3 sticky top-0 z-30">
      <button onClick={() => setOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-gray-50 text-gray-500 text-xl">☰</button>
      <h1 className="text-base font-black text-gray-900 flex-1">{titles[page] || "Overview"}</h1>
      <div className="flex items-center gap-2">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${plan === "pro" ? "bg-emerald-100 text-emerald-700" : plan === "starter" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
          {plan === "pro" && "👑 "}{PLAN_NAMES[plan] || "Free"}
        </span>
        {plan !== "pro" && (
          <button onClick={() => setPage("pricing")}
            className="nav-item flex items-center gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-full transition-colors cursor-pointer">
            👑 Upgrade
          </button>
        )}
      </div>
    </header>
  );
}

// ── Overview Page ─────────────────────────────────────────────
function OverviewPage({ userId, plan, profile, setPage }) {
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
  const dmWarn = dmPct >= 80;

  return (
    <div className="p-4 lg:p-6 xl:p-8 space-y-5 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total DMs Sent",     value: stats.totalDMs,      sub: `+${stats.weekDMs} this week`,                                          emoji: "💬", warn: false },
          { label: "Active Automations", value: stats.activeAutos,   sub: `of ${lim.automations} allowed`,                                        emoji: "⚡", warn: false },
          { label: "Instagram Accounts", value: stats.totalAccounts, sub: `of ${lim.accounts} allowed`,                                           emoji: "📸", warn: false },
          { label: "DMs This Month",     value: stats.monthlyDMs,    sub: `${dmPct}% of ${lim.dms}`,                                              emoji: "📈", warn: dmWarn },
        ].map(({ label, value, sub, emoji, warn }) => (
          <div key={label} className={`bg-white rounded-2xl border p-4 lg:p-5 hover:shadow-sm transition-shadow ${warn ? "border-amber-200" : "border-gray-100"}`}>
            <div className="text-2xl mb-3">{emoji}</div>
            <p className="text-2xl lg:text-3xl font-black text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            <p className={`text-xs font-semibold mt-1 ${warn ? "text-amber-600" : "text-emerald-600"}`}>{sub}</p>
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
              <p className="text-3xl mb-3">💬</p>
              <p className="text-sm font-bold text-gray-500">No DM activity yet</p>
              <p className="text-xs text-gray-400 mt-1">Add an automation to start sending DMs</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {activity.map((log, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                  <span className={`text-sm ${log.status === "sent" ? "text-emerald-500" : "text-red-400"}`}>{log.status === "sent" ? "✓" : "✕"}</span>
                  <p className="flex-1 text-sm text-gray-700 truncate">
                    <span className="font-semibold">"{log.keyword}"</span> → {log.recipient}
                  </p>
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
              <div className={`h-full rounded-full transition-all ${dmPct >= 90 ? "bg-red-500" : dmPct >= 70 ? "bg-amber-500" : "bg-emerald-500"}`}
                style={{ width: `${Math.min(dmPct, 100)}%` }} />
            </div>
            {dmWarn && (
              <p className="text-xs text-amber-600 font-semibold mt-2">
                Running low! <button onClick={() => setPage("pricing")} className="underline">Upgrade now</button>
              </p>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Quick Actions</p>
            <div className="space-y-0.5">
              <button className="nav-item w-full text-left text-sm text-gray-600 hover:text-emerald-600 font-medium py-2.5 px-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">⚡ Add Keyword Rule</button>
              <button className="nav-item w-full text-left text-sm text-gray-600 hover:text-emerald-600 font-medium py-2.5 px-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">📸 Connect Instagram</button>
              {plan !== "pro" && (
                <button onClick={() => setPage("pricing")} className="nav-item w-full text-left text-sm text-emerald-600 hover:text-emerald-700 font-bold py-2.5 px-2 rounded-xl hover:bg-emerald-50 transition-colors cursor-pointer">👑 Upgrade Plan</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Automations Page ──────────────────────────────────────────
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
    const { data, error } = await supabase.from("automations")
      .insert([{ user_id: userId, keyword: form.keyword.trim().toLowerCase(), reply: form.reply.trim(), status: "active", active: true }])
      .select().single();
    if (!error) { setList(p => [data, ...p]); setForm({ keyword: "", reply: "" }); setShowForm(false); }
    setSaving(false);
  }

  async function toggle(id, active) {
    const ns = active ? "paused_by_user" : "active";
    await supabase.from("automations").update({ active: !active, status: ns }).eq("id", id).eq("user_id", userId);
    setList(p => p.map(a => a.id === id ? { ...a, active: !active, status: ns } : a));
  }

  async function remove(id) {
    if (!confirm("Delete this automation?")) return;
    await supabase.from("automations").delete().eq("id", id).eq("user_id", userId);
    setList(p => p.filter(a => a.id !== id));
  }

  if (loading) return <Spinner />;

  return (
    <div className="p-4 lg:p-6 xl:p-8 space-y-5 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-sm text-gray-500">{activeCount} / {lim.automations} rules used</p>
          {atLimit && (
            <p className="text-xs text-amber-600 font-semibold mt-0.5">
              Limit reached — <button onClick={() => setPage("pricing")} className="underline">upgrade to add more</button>
            </p>
          )}
        </div>
        <button
          onClick={() => atLimit ? setPage("pricing") : setShowForm(!showForm)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors">
          ＋ New Automation
        </button>
      </div>

      {showForm && !atLimit && (
        <div className="bg-white border border-emerald-100 rounded-2xl p-5 lg:p-6 space-y-4 shadow-sm">
          <p className="text-sm font-bold text-gray-800">New Keyword Automation</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Trigger Keyword</label>
              <input placeholder='e.g. "price" or "link"' value={form.keyword}
                onChange={e => setForm({ ...form, keyword: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Auto-DM Message</label>
              <textarea placeholder="Hey! Thanks for commenting..." rows={3} value={form.reply}
                onChange={e => setForm({ ...form, reply: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none transition" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={save} disabled={saving}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors">
              {saving ? "Saving..." : "✓ Save Rule"}
            </button>
            <button onClick={() => { setShowForm(false); setForm({ keyword: "", reply: "" }); }}
              className="text-sm font-semibold text-gray-400 px-4 py-2.5 rounded-xl hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      )}

      {list.length === 0 && !showForm && (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
          <p className="text-4xl mb-3">⚡</p>
          <p className="font-bold text-gray-700 mb-1">No automations yet</p>
          <p className="text-sm text-gray-400 mb-5">Create keyword rules to auto-send DMs when people comment</p>
          <button onClick={() => setShowForm(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors">
            Create First Automation
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {list.map(a => (
          <div key={a.id} className={`bg-white rounded-2xl border p-4 lg:p-5 flex items-start gap-3 ${a.status === "disabled_by_system" ? "border-red-100 bg-red-50/20" : "border-gray-100"}`}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-lg font-mono">{a.keyword}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${a.status === "active" ? "bg-emerald-50 text-emerald-700" : a.status === "disabled_by_system" ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-500"}`}>
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
              <button onClick={() => remove(a.id)} className="p-2 text-gray-300 hover:text-red-400 rounded-xl hover:bg-red-50 transition-colors text-sm">🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Analytics Page ────────────────────────────────────────────
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
        const { count } = await supabase.from("dm_logs").select("*", { count: "exact", head: true })
          .eq("user_id", userId).gte("sent_at", s.toISOString()).lte("sent_at", e.toISOString());
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
    <div className="p-4 lg:p-6 xl:p-8 space-y-5 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-3 gap-3">
        {[
          { l: "Total DMs",    v: stats.total,             s: "all time" },
          { l: "Success Rate", v: `${stats.successRate}%`, s: "delivered" },
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
                <div className="w-full bg-emerald-500 hover:bg-emerald-400 rounded-t-lg transition-all"
                  style={{ height: `${Math.max((b.dms / maxBar) * 72, b.dms > 0 ? 4 : 0)}px` }} />
                <span className="text-xs text-gray-400">{b.day}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-bold text-gray-800 mb-4">Top Keywords</h2>
          {keywords.length === 0 ? (
            <div className="text-center py-8"><p className="text-2xl mb-2">📊</p><p className="text-sm text-gray-400">No data yet</p></div>
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
        <div className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center z-10 gap-3 p-6">
            <p className="text-3xl">🔒</p>
            <p className="font-bold text-gray-800">Advanced Analytics — Pro Only</p>
            <p className="text-xs text-gray-400 text-center max-w-xs">30-day trends, conversion rates, and detailed breakdowns.</p>
            <button onClick={() => setPage("pricing")}
              className="mt-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors">
              Unlock with Pro — ₹399/mo
            </button>
          </div>
          <div className="p-5 blur-sm pointer-events-none select-none h-40 bg-gray-50 rounded-xl m-4" />
        </div>
      )}
    </div>
  );
}

// ── Accounts Page ─────────────────────────────────────────────
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
    if (!confirm("Disconnect this Instagram account?")) return;
    await supabase.from("automations").update({ status: "disabled_by_system", active: false }).eq("account_id", id).eq("user_id", userId);
    await supabase.from("instagram_accounts").update({ status: "disconnected" }).eq("id", id).eq("user_id", userId);
    load();
  }

  if (loading) return <Spinner />;

  return (
    <div className="p-4 lg:p-6 xl:p-8 space-y-5 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm text-gray-500">{accounts.length} / {lim.accounts} accounts connected</p>
          {atLimit && (
            <p className="text-xs text-amber-600 font-semibold mt-0.5">
              Limit reached — <button onClick={() => setPage("pricing")} className="underline">upgrade for more</button>
            </p>
          )}
        </div>
        <button
          onClick={() => atLimit ? setPage("pricing") : null}
          className={`flex items-center gap-2 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors ${atLimit ? "bg-amber-500 hover:bg-amber-600" : "bg-emerald-600 hover:bg-emerald-700"}`}>
          {atLimit ? "👑 Upgrade to Connect More" : "＋ Connect Instagram"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {accounts.map(acc => (
          <div key={acc.id} className={`bg-white rounded-2xl border p-4 lg:p-5 flex items-center gap-3 ${acc.status === "needs_reconnect" ? "border-amber-200" : "border-gray-100"}`}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-400 via-rose-400 to-orange-400 flex items-center justify-center text-white font-black text-sm shrink-0">
              {acc.handle?.replace("@", "").slice(0, 2).toUpperCase() || "IG"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm">{acc.handle}</p>
              <p className="text-xs text-gray-400">{(acc.followers || 0).toLocaleString("en-IN")} followers</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${acc.status === "connected" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${acc.status === "connected" ? "bg-emerald-500" : "bg-amber-400"}`} />
                {acc.status === "connected" ? "Live" : "Reconnect"}
              </span>
              <button onClick={() => disconnect(acc.id)} className="p-2 text-gray-300 hover:text-red-400 rounded-xl hover:bg-red-50 transition-colors text-sm">🗑</button>
            </div>
          </div>
        ))}
      </div>

      {!atLimit && (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-emerald-300 p-10 flex flex-col items-center gap-3 transition-colors cursor-pointer">
          <p className="text-3xl">📸</p>
          <p className="text-sm font-bold text-gray-500">Connect an Instagram account</p>
          <p className="text-xs text-gray-400">Secure Meta OAuth — we never ask for your password</p>
        </div>
      )}

      {/* Plan limits table */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="text-sm font-bold text-gray-800 mb-4">Account Limits by Plan</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { p: "free",    n: "1 account",   price: "₹0/mo",   dms: "500 DMs",     autos: "3 automations"  },
            { p: "starter", n: "3 accounts",  price: "₹199/mo", dms: "3,000 DMs",   autos: "10 automations" },
            { p: "pro",     n: "10 accounts", price: "₹399/mo", dms: "10,000 DMs",  autos: "50 automations" },
          ].map(({ p, n, price, dms, autos }) => (
            <div key={p} className={`rounded-xl p-4 text-center bg-gray-50 transition-all ${plan === p ? "ring-2 ring-emerald-500 bg-emerald-50" : ""}`}>
              <p className="text-xs font-bold text-gray-500">{PLAN_NAMES[p]}</p>
              <p className="text-sm font-black text-gray-900 mt-1">{n}</p>
              <p className="text-xs text-gray-400 mt-0.5">{dms}</p>
              <p className="text-xs text-gray-400">{autos}</p>
              <p className="text-xs text-emerald-600 font-bold mt-1">{price}</p>
            </div>
          ))}
        </div>
        {plan !== "pro" && (
          <button onClick={() => setPage("pricing")} className="block w-full text-center mt-4 text-sm font-bold text-emerald-600 hover:underline">
            Upgrade your plan →
          </button>
        )}
      </div>
    </div>
  );
}

// ── Welcome Popup ─────────────────────────────────────────────
function WelcomePopup({ name, plan, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center relative">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 text-lg">✕</button>
        <div className="text-5xl mb-4">👋</div>
        <h2 className="text-xl font-black text-gray-900">Welcome to ReplyAstra!</h2>
        <p className="text-gray-500 text-sm mt-2 mb-1">Hey <strong className="text-gray-800">{name}</strong>!</p>
        <p className="text-gray-400 text-xs mb-6">
          You are on the <span className="font-bold text-emerald-600">{PLAN_NAMES[plan] || "Free"} plan</span>. Let us automate your Instagram growth.
        </p>
        <div className="space-y-2.5 text-left mb-6">
          {["1️⃣ Connect your Instagram account", "2️⃣ Add a keyword automation rule", "3️⃣ Watch DMs send automatically"].map(t => (
            <div key={t} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
              <span className="text-sm font-semibold text-gray-700">{t}</span>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-colors">
          Let's Go! 🚀
        </button>
      </div>
    </div>
  );
}

// ── Root Dashboard ────────────────────────────────────────────
export default function Dashboard() {
  const [page, setPage] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { window.location.href = "/login"; return; }
      setUser(session.user);
      const { data: p } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      setProfile(p || { plan: "free" });
      try {
        if (!localStorage.getItem("ra_welcomed_v2")) {
          setShowWelcome(true);
          localStorage.setItem("ra_welcomed_v2", "1");
        }
      } catch (_) {}
      setLoading(false);
    }
    init();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) window.location.href = "/login";
    });
    return () => subscription.unsubscribe();
  }, []);

  const plan = profile?.plan || "free";

  if (loading) return <Spinner full />;

  const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "there";

  return (
    <>
      {/* Inject fluid wobble CSS */}
      <style>{HOVER_STYLE}</style>

      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {showWelcome && <WelcomePopup name={name} plan={plan} onClose={() => setShowWelcome(false)} />}

        <Sidebar page={page} setPage={setPage} email={user.email} plan={plan} open={sidebarOpen} setOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Topbar page={page} plan={plan} setOpen={setSidebarOpen} setPage={setPage} />
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            {page === "overview"    && <OverviewPage    userId={user.id} plan={plan} profile={profile} setPage={setPage} />}
            {page === "automations" && <AutomationsPage userId={user.id} plan={plan} setPage={setPage} />}
            {page === "analytics"   && <AnalyticsPage   userId={user.id} plan={plan} setPage={setPage} />}
            {page === "accounts"    && <AccountsPage    userId={user.id} plan={plan} setPage={setPage} />}
            {page === "pricing"     && <PricingPage     plan={plan} onClose={() => setPage("overview")} />}
          </main>
        </div>
      </div>
    </>
  );
}
