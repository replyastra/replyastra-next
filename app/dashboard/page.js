"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// Direct Supabase client — bypasses API routes completely (fixes blank pages on Cloudflare)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,           // Stay logged in across browser closes
      autoRefreshToken: true,         // Auto-refresh before expiry
      storageKey: "replyastra-auth",  // Named key for clarity
    },
  }
);

const PLAN_LIMITS = {
  free:    { automations: 3,        accounts: 1,  dms: 100,      analytics: false },
  starter: { automations: Infinity, accounts: 3,  dms: 5000,     analytics: false },
  pro:     { automations: Infinity, accounts: 10, dms: Infinity,  analytics: true  },
};
const PLAN_NAMES  = { free: "Free", starter: "Starter", pro: "Pro" };
const PLAN_PRICES = { free: "₹0/mo", starter: "₹199/mo", pro: "₹399/mo" };
const NEXT_PLAN   = { free: "starter", starter: "pro" };

// ── Spinner ───────────────────────────────────────────────────
function Spinner({ full }) {
  return (
    <div className={`flex items-center justify-center ${full ? "h-screen" : "py-24"}`}>
      <div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
    </div>
  );
}

// ── Plan Badge ────────────────────────────────────────────────
function PlanBadge({ plan }) {
  const styles = {
    free:    "bg-gray-100 text-gray-600",
    starter: "bg-blue-100 text-blue-700",
    pro:     "bg-emerald-100 text-emerald-700",
  };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${styles[plan] || styles.free}`}>
      {plan === "pro" && "👑 "}
      {PLAN_NAMES[plan] || "Free"}
    </span>
  );
}

// ── Upgrade Modal (inline — no redirect needed) ───────────────
function UpgradeModal({ plan, reason, onClose }) {
  const next = NEXT_PLAN[plan] || "starter";
  const features = {
    starter: [
      "Unlimited keyword automation rules",
      "3 Instagram accounts",
      "5,000 DMs per month",
      "Ask-to-Follow automation",
      "No ReplyAstra watermark",
    ],
    pro: [
      "10 Instagram accounts",
      "Unlimited DMs every month",
      "Advanced analytics + 30-day trends",
      "Priority support",
      "All Starter features included",
    ],
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 text-lg">✕</button>

        <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-2xl mb-4">👑</div>
        <h2 className="text-xl font-black text-gray-900">Upgrade to {PLAN_NAMES[next]}</h2>

        {reason && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5 mt-3">
            <p className="text-sm text-amber-700 font-semibold">{reason}</p>
          </div>
        )}

        <p className="text-gray-500 text-sm mt-3 mb-5">Everything you need to grow faster on Instagram</p>

        <ul className="space-y-2.5 mb-6">
          {(features[next] || []).map(f => (
            <li key={f} className="flex items-center gap-3 text-sm text-gray-700">
              <span className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xs shrink-0 font-bold">✓</span>
              {f}
            </li>
          ))}
        </ul>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-5 mb-5 text-center">
          <p className="text-4xl font-black text-emerald-700">{PLAN_PRICES[next]}</p>
          <p className="text-xs text-emerald-600 mt-1">Cancel anytime · No hidden charges · Instant access</p>
        </div>

        {/* When Razorpay is ready, this button will trigger checkout */}
        <button
          onClick={() => { alert("Payment coming soon! We will notify you when ready."); onClose(); }}
          className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-center py-4 rounded-2xl transition-colors text-base"
        >
          Upgrade Now — {PLAN_PRICES[next]}
        </button>
        <button onClick={onClose} className="block w-full text-center text-sm text-gray-400 hover:text-gray-600 mt-3 py-1">
          Maybe later
        </button>
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
        <p className="text-gray-500 text-sm mt-2 mb-1">
          Hey <strong className="text-gray-800">{name}</strong>!
        </p>
        <p className="text-gray-400 text-xs mb-6">
          You are on the <span className="font-bold text-emerald-600">{PLAN_NAMES[plan]} plan</span>. Let us automate your Instagram growth.
        </p>
        <div className="space-y-2.5 text-left mb-6">
          {[
            { e: "1️⃣", t: "Connect your Instagram account" },
            { e: "2️⃣", t: "Add a keyword automation rule" },
            { e: "3️⃣", t: "Watch DMs send automatically" },
          ].map(({ e, t }) => (
            <div key={t} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
              <span className="text-lg">{e}</span>
              <span className="text-sm font-semibold text-gray-700">{t}</span>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-colors">
          Let us Go! 🚀
        </button>
      </div>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────
const NAV = [
  { id: "overview",    label: "Overview",    emoji: "🏠" },
  { id: "automations", label: "Automations", emoji: "⚡" },
  { id: "analytics",   label: "Analytics",   emoji: "📊" },
  { id: "accounts",    label: "Accounts",    emoji: "📸" },
];

function Sidebar({ page, setPage, email, plan, open, setOpen, onUpgrade }) {
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
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              page === id ? "bg-emerald-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            }`}>
            <span>{emoji}</span>{label}
          </button>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-gray-100 space-y-2">
        {/* Plan info */}
        <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-gray-50">
          <PlanBadge plan={plan} />
          {next && (
            <button onClick={onUpgrade} className="text-xs font-bold text-emerald-600 hover:underline">
              {PLAN_PRICES[next]} ↑
            </button>
          )}
        </div>
        {/* User */}
        <div className="flex items-center gap-2 px-3 py-1">
          <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0">
            {initials}
          </div>
          <p className="text-xs text-gray-500 truncate flex-1">{email}</p>
        </div>
        {/* Logout */}
        <button onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-50 transition-all">
          🚪 Log Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Mobile drawer */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="text-lg font-black text-emerald-600">ReplyAstra</span>
          <button onClick={() => setOpen(false)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100">✕</button>
        </div>
        <Content onNav={() => setOpen(false)} />
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-white border-r border-gray-100 h-screen sticky top-0">
        <div className="px-5 py-4 border-b border-gray-100">
          <span className="text-lg font-black text-emerald-600">ReplyAstra</span>
        </div>
        <Content />
      </aside>
    </>
  );
}

// ── Topbar ────────────────────────────────────────────────────
function Topbar({ page, plan, setOpen, onUpgrade }) {
  const titles = { overview: "Overview", automations: "Automations", analytics: "Analytics", accounts: "Accounts" };
  return (
    <header className="bg-white border-b border-gray-100 px-4 lg:px-6 py-3 flex items-center gap-3 sticky top-0 z-30">
      <button onClick={() => setOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-gray-50 text-gray-500 text-xl">☰</button>
      <h1 className="text-base font-black text-gray-900 flex-1">{titles[page]}</h1>
      <div className="flex items-center gap-2">
        <span className="hidden sm:block"><PlanBadge plan={plan} /></span>
        {plan !== "pro" && (
          <button onClick={onUpgrade}
            className="flex items-center gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-full transition-colors">
            👑 Upgrade
          </button>
        )}
      </div>
    </header>
  );
}

// ── Overview Page ─────────────────────────────────────────────
function OverviewPage({ userId, plan, profile, onUpgrade }) {
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
  const dmPct = lim.dms === Infinity ? 0 : Math.round((stats.monthlyDMs / lim.dms) * 100);
  const dmWarn = dmPct >= 80;

  const statCards = [
    { label: "Total DMs Sent",     value: stats.totalDMs,     sub: `+${stats.weekDMs} this week`,                           emoji: "💬", warn: false },
    { label: "Active Automations", value: stats.activeAutos,  sub: `of ${lim.automations === Infinity ? "∞" : lim.automations} allowed`,  emoji: "⚡", warn: false },
    { label: "Instagram Accounts", value: stats.totalAccounts, sub: `of ${lim.accounts} allowed`,                            emoji: "📸", warn: false },
    { label: "DMs This Month",     value: stats.monthlyDMs,   sub: lim.dms === Infinity ? "Unlimited" : `${dmPct}% of ${lim.dms}`,        emoji: "📈", warn: dmWarn },
  ];

  return (
    <div className="p-4 lg:p-6 xl:p-8 space-y-5 max-w-7xl mx-auto w-full">

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map(({ label, value, sub, emoji, warn }) => (
          <div key={label} className={`bg-white rounded-2xl border p-4 lg:p-5 hover:shadow-sm transition-shadow ${warn ? "border-amber-200" : "border-gray-100"}`}>
            <div className="text-2xl mb-3">{emoji}</div>
            <p className="text-2xl lg:text-3xl font-black text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            <p className={`text-xs font-semibold mt-1 ${warn ? "text-amber-600" : "text-emerald-600"}`}>{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Activity feed */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-800">Recent Activity</h2>
            <span className="text-xs text-gray-400">{activity.length} events</span>
          </div>
          {activity.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-3xl mb-3">💬</p>
              <p className="text-sm font-bold text-gray-500">No DM activity yet</p>
              <p className="text-xs text-gray-400 mt-1">Add an automation to start sending DMs automatically</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {activity.map((log, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                  <span className={`text-sm ${log.status === "sent" ? "text-emerald-500" : "text-red-400"}`}>
                    {log.status === "sent" ? "✓" : "✕"}
                  </span>
                  <p className="flex-1 text-sm text-gray-700 truncate">
                    <span className="font-semibold">"{log.keyword}"</span> → {log.recipient}
                  </p>
                  <span className="text-xs text-gray-400 shrink-0">{timeAgo(log.sent_at)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="space-y-3">
          {/* DM usage */}
          {lim.dms !== Infinity && (
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="flex justify-between mb-2">
                <p className="text-xs font-bold text-gray-500">Monthly DMs</p>
                <span className="text-xs text-gray-400">{stats.monthlyDMs} / {lim.dms}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${dmPct >= 90 ? "bg-red-500" : dmPct >= 70 ? "bg-amber-500" : "bg-emerald-500"}`}
                  style={{ width: `${Math.min(dmPct, 100)}%` }} />
              </div>
              {dmWarn && (
                <p className="text-xs text-amber-600 font-semibold mt-2">
                  Running low! <button onClick={() => onUpgrade("You are close to your monthly DM limit.")} className="underline">Upgrade now</button>
                </p>
              )}
            </div>
          )}

          {/* Subscription status */}
          {profile?.cancel_at_period_end && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="text-sm font-bold text-amber-700">⚠️ Subscription Cancelling</p>
              <p className="text-xs text-amber-600 mt-1">
                Access ends {new Date(profile.current_period_end).toLocaleDateString("en-IN", { day: "numeric", month: "long" })}
              </p>
              <button onClick={() => onUpgrade("Renew your subscription to keep your automations running.")}
                className="mt-2 text-xs font-bold text-amber-700 underline">Renew now</button>
            </div>
          )}

          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Quick Actions</p>
            <div className="space-y-0.5">
              <button className="w-full text-left text-sm text-gray-600 hover:text-emerald-600 font-medium py-2.5 px-2 rounded-xl hover:bg-gray-50 transition-colors">⚡ Add Keyword Rule</button>
              <button className="w-full text-left text-sm text-gray-600 hover:text-emerald-600 font-medium py-2.5 px-2 rounded-xl hover:bg-gray-50 transition-colors">📸 Connect Instagram</button>
              {plan !== "pro" && (
                <button onClick={onUpgrade} className="w-full text-left text-sm text-emerald-600 hover:text-emerald-700 font-bold py-2.5 px-2 rounded-xl hover:bg-emerald-50 transition-colors">👑 Upgrade Plan</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Automations Page ──────────────────────────────────────────
function AutomationsPage({ userId, plan, onUpgrade }) {
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
  const atLimit = lim.automations !== Infinity && activeCount >= lim.automations;

  async function save() {
    if (!form.keyword.trim() || !form.reply.trim()) return;
    if (atLimit) {
      onUpgrade(`You have used all ${lim.automations} automation slots on the ${PLAN_NAMES[plan]} plan.`);
      return;
    }
    setSaving(true);
    const { data, error } = await supabase.from("automations")
      .insert([{ user_id: userId, keyword: form.keyword.trim().toLowerCase(), reply: form.reply.trim(), status: "active", active: true }])
      .select().single();
    if (!error) { setList(p => [data, ...p]); setForm({ keyword: "", reply: "" }); setShowForm(false); }
    setSaving(false);
  }

  async function toggle(id, active, status) {
    if (status === "disabled_by_system") return;
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

  const statusBadge = {
    active:            "bg-emerald-50 text-emerald-700",
    paused_by_user:    "bg-gray-100 text-gray-500",
    disabled_by_system:"bg-red-50 text-red-600",
    error:             "bg-amber-50 text-amber-600",
  };
  const statusLabel = { active: "Active", paused_by_user: "Paused", disabled_by_system: "Disabled", error: "Error" };

  return (
    <div className="p-4 lg:p-6 xl:p-8 space-y-5 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-sm text-gray-500">
            {activeCount} / {lim.automations === Infinity ? "∞" : lim.automations} rules used
          </p>
          {atLimit && (
            <p className="text-xs text-amber-600 font-semibold mt-0.5">
              Limit reached —{" "}
              <button onClick={() => onUpgrade(`You have reached the ${lim.automations} automation limit on ${PLAN_NAMES[plan]}.`)} className="underline">upgrade to add more</button>
            </p>
          )}
        </div>
        <button
          onClick={() => atLimit ? onUpgrade(`You have used all ${lim.automations} slots on the ${PLAN_NAMES[plan]} plan.`) : setShowForm(!showForm)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors">
          ＋ New Automation
        </button>
      </div>

      {/* Add form */}
      {showForm && !atLimit && (
        <div className="bg-white border border-emerald-100 rounded-2xl p-5 lg:p-6 space-y-4 shadow-sm">
          <p className="text-sm font-bold text-gray-800">New Keyword Automation</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Trigger Keyword</label>
              <input
                placeholder='e.g. "price" or "link"'
                value={form.keyword}
                onChange={e => setForm({ ...form, keyword: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              />
              <p className="text-xs text-gray-400 mt-1">When someone comments this → auto DM fires</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Auto-DM Message</label>
              <textarea
                placeholder="Hey! Thanks for commenting. Here's the link you asked for..."
                rows={3}
                value={form.reply}
                onChange={e => setForm({ ...form, reply: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none transition"
              />
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

      {/* Empty state */}
      {list.length === 0 && !showForm && (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
          <p className="text-4xl mb-3">⚡</p>
          <p className="font-bold text-gray-700 mb-1">No automations yet</p>
          <p className="text-sm text-gray-400 mb-5">Create keyword rules to auto-send DMs when people comment</p>
          <button onClick={() => setShowForm(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors">
            Create First Automation
          </button>
        </div>
      )}

      {/* List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {list.map(a => (
          <div key={a.id} className={`bg-white rounded-2xl border p-4 lg:p-5 flex items-start gap-3 transition-colors ${a.status === "disabled_by_system" ? "border-red-100 bg-red-50/20" : "border-gray-100 hover:border-gray-200"}`}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-lg font-mono">{a.keyword}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusBadge[a.status] || "bg-gray-100 text-gray-500"}`}>
                  {statusLabel[a.status] || a.status}
                </span>
                <span className="text-xs text-gray-400">{a.triggered || 0}× sent</span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2">{a.reply}</p>
              {a.last_error && a.status === "disabled_by_system" && (
                <p className="text-xs text-red-500 mt-1">{a.last_error}</p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {a.status !== "disabled_by_system" && (
                <button onClick={() => toggle(a.id, a.active, a.status)}
                  className={`relative w-10 h-6 rounded-full transition-colors ${a.active ? "bg-emerald-500" : "bg-gray-200"}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${a.active ? "translate-x-4" : ""}`} />
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
function AnalyticsPage({ userId, plan, onUpgrade }) {
  const [bars, setBars] = useState([]);
  const [stats, setStats] = useState({ total: 0, successRate: "100.0" });
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // 7 day bars
      const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d;
      });
      const barData = await Promise.all(days.map(async d => {
        const s = new Date(d); s.setHours(0, 0, 0, 0);
        const e = new Date(d); e.setHours(23, 59, 59, 999);
        const { count } = await supabase.from("dm_logs").select("*", { count: "exact", head: true })
          .eq("user_id", userId).gte("sent_at", s.toISOString()).lte("sent_at", e.toISOString());
        return { day: d.toLocaleDateString("en", { weekday: "short" }), dms: count || 0 };
      }));
      setBars(barData);

      // Totals
      const { count: total } = await supabase.from("dm_logs").select("*", { count: "exact", head: true }).eq("user_id", userId);
      const { count: failed } = await supabase.from("dm_logs").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("status", "failed");
      const t = total || 0;
      setStats({ total: t, successRate: t > 0 ? (((t - (failed || 0)) / t) * 100).toFixed(1) : "100.0" });

      // Keywords
      const { data: logs } = await supabase.from("dm_logs").select("keyword").eq("user_id", userId);
      const km = {};
      (logs || []).forEach(({ keyword }) => { km[keyword] = (km[keyword] || 0) + 1; });
      const top = Object.entries(km).sort((a, b) => b[1] - a[1]).slice(0, 5)
        .map(([k, c]) => ({ keyword: k, count: c, pct: t > 0 ? Math.round((c / t) * 100) : 0 }));
      setKeywords(top);
      setLoading(false);
    }
    load();
  }, [userId]);

  if (loading) return <Spinner />;

  const maxBar = Math.max(...bars.map(b => b.dms), 1);

  return (
    <div className="p-4 lg:p-6 xl:p-8 space-y-5 max-w-7xl mx-auto w-full">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { l: "Total DMs",   v: stats.total,         s: "all time" },
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
        {/* Bar chart */}
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

        {/* Keywords */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-bold text-gray-800 mb-4">Top Keywords</h2>
          {keywords.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-2xl mb-2">📊</p>
              <p className="text-sm text-gray-400">No data yet — add automations to see stats</p>
            </div>
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

      {/* Locked — Pro only */}
      {plan !== "pro" && (
        <div className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center z-10 gap-3 p-6">
            <p className="text-3xl">🔒</p>
            <p className="font-bold text-gray-800">Advanced Analytics — Pro Only</p>
            <p className="text-xs text-gray-400 text-center max-w-xs">
              30-day trends, automation conversion rates, and detailed breakdowns. Upgrade to Pro to unlock.
            </p>
            <button
              onClick={() => onUpgrade("Advanced analytics are available on the Pro plan.")}
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
function AccountsPage({ userId, plan, onUpgrade }) {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("instagram_accounts").select("*")
      .eq("user_id", userId).neq("status", "disconnected").order("connected_at", { ascending: false });
    setAccounts(data || []);
    setLoading(false);
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const lim = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  const atLimit = accounts.length >= lim.accounts;

  async function disconnect(id) {
    if (!confirm("Disconnect this Instagram account? Its automations will be paused.")) return;
    await supabase.from("automations").update({ status: "disabled_by_system", active: false, last_error: "Instagram account disconnected" }).eq("account_id", id).eq("user_id", userId);
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
              Limit reached —{" "}
              <button onClick={() => onUpgrade(`You have ${accounts.length} of ${lim.accounts} accounts connected on the ${PLAN_NAMES[plan]} plan.`)} className="underline">upgrade for more</button>
            </p>
          )}
        </div>
        <button
          onClick={() => atLimit ? onUpgrade(`Upgrade to connect more than ${lim.accounts} Instagram account${lim.accounts > 1 ? "s" : ""}.`) : null}
          className={`flex items-center gap-2 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors ${atLimit ? "bg-amber-500 hover:bg-amber-600" : "bg-emerald-600 hover:bg-emerald-700"}`}>
          {atLimit ? "👑 Upgrade to Connect More" : "＋ Connect Instagram"}
        </button>
      </div>

      {/* Account cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {accounts.map(acc => (
          <div key={acc.id} className={`bg-white rounded-2xl border p-4 lg:p-5 flex items-center gap-3 transition-colors ${acc.status === "needs_reconnect" ? "border-amber-200" : "border-gray-100 hover:border-gray-200"}`}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-400 via-rose-400 to-orange-400 flex items-center justify-center text-white font-black text-sm shrink-0">
              {acc.handle?.replace("@", "").slice(0, 2).toUpperCase() || "IG"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm">{acc.handle}</p>
              <p className="text-xs text-gray-400">{(acc.followers || 0).toLocaleString("en-IN")} followers</p>
              {acc.status === "needs_reconnect" && <p className="text-xs text-amber-600 font-semibold mt-0.5">⚠️ Token expired — reconnect needed</p>}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${acc.status === "connected" ? "bg-emerald-50 border border-emerald-100 text-emerald-700" : acc.status === "needs_reconnect" ? "bg-amber-50 border border-amber-200 text-amber-700" : "bg-gray-50 border border-gray-200 text-gray-500"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${acc.status === "connected" ? "bg-emerald-500" : acc.status === "needs_reconnect" ? "bg-amber-400" : "bg-gray-400"}`} />
                {acc.status === "connected" ? "Live" : acc.status === "needs_reconnect" ? "Reconnect" : "Paused"}
              </span>
              <button onClick={() => disconnect(acc.id)} className="p-2 text-gray-300 hover:text-red-400 rounded-xl hover:bg-red-50 transition-colors text-sm">🗑</button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty connect button */}
      {!atLimit && (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-emerald-300 p-10 flex flex-col items-center gap-3 transition-colors group cursor-pointer">
          <p className="text-3xl group-hover:scale-110 transition-transform">📸</p>
          <p className="text-sm font-bold text-gray-500 group-hover:text-gray-700">Connect an Instagram account</p>
          <p className="text-xs text-gray-400">Secure Meta OAuth — we never ask for your password</p>
        </div>
      )}

      {/* Plan limits table */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="text-sm font-bold text-gray-800 mb-4">Account Limits by Plan</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { p: "free",    n: "1 account",   price: "₹0/mo"   },
            { p: "starter", n: "3 accounts",  price: "₹199/mo" },
            { p: "pro",     n: "10 accounts", price: "₹399/mo" },
          ].map(({ p, n, price }) => (
            <div key={p} className={`rounded-xl p-4 text-center bg-gray-50 transition-all ${plan === p ? "ring-2 ring-emerald-500 bg-emerald-50" : ""}`}>
              <p className="text-xs font-bold text-gray-500">{PLAN_NAMES[p]}</p>
              <p className="text-base font-black text-gray-900 mt-1">{n}</p>
              <p className="text-xs text-emerald-600 font-bold mt-1">{price}</p>
            </div>
          ))}
        </div>
        {plan !== "pro" && (
          <button onClick={() => onUpgrade()} className="block w-full text-center mt-4 text-sm font-bold text-emerald-600 hover:underline">
            Upgrade your plan →
          </button>
        )}
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
  const [upgradeModal, setUpgradeModal] = useState({ open: false, reason: null });
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    async function init() {
      // getSession uses persisted token — no login needed if session exists
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { window.location.href = "/login"; return; }

      setUser(session.user);

      // Fetch profile
      const { data: p } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      setProfile(p || { plan: "free", subscription_status: "inactive" });

      // Welcome popup — only first ever visit
      try {
        const welcomed = localStorage.getItem("ra_welcomed_v2");
        if (!welcomed) {
          setShowWelcome(true);
          localStorage.setItem("ra_welcomed_v2", "1");
        }
      } catch (_) {}

      setLoading(false);
    }
    init();

    // Auth state listener — auto logout if session ends
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) window.location.href = "/login";
    });
    return () => subscription.unsubscribe();
  }, []);

  const plan = profile?.plan || "free";
  const openUpgrade = (reason = null) => setUpgradeModal({ open: true, reason });

  if (loading) return <Spinner full />;

  const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "there";

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Welcome popup — first visit only */}
      {showWelcome && <WelcomePopup name={name} plan={plan} onClose={() => setShowWelcome(false)} />}

      {/* Upgrade modal — opens inline, no page redirect */}
      {upgradeModal.open && <UpgradeModal plan={plan} reason={upgradeModal.reason} onClose={() => setUpgradeModal({ open: false, reason: null })} />}

      <Sidebar page={page} setPage={setPage} email={user.email} plan={plan} open={sidebarOpen} setOpen={setSidebarOpen} onUpgrade={openUpgrade} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar page={page} plan={plan} setOpen={setSidebarOpen} onUpgrade={openUpgrade} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {page === "overview"    && <OverviewPage    userId={user.id} plan={plan} profile={profile} onUpgrade={openUpgrade} />}
          {page === "automations" && <AutomationsPage userId={user.id} plan={plan} onUpgrade={openUpgrade} />}
          {page === "analytics"   && <AnalyticsPage   userId={user.id} plan={plan} onUpgrade={openUpgrade} />}
          {page === "accounts"    && <AccountsPage    userId={user.id} plan={plan} onUpgrade={openUpgrade} />}
        </main>
      </div>
    </div>
  );
}
