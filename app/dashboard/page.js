"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabase";

// ── Icons ─────────────────────────────────────────────────────
const I = {
  grid:  <svg className="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  zap:   <svg className="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  bar:   <svg className="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>,
  user:  <svg className="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-5M9 20H4v-2a4 4 0 015-5m6-5a4 4 0 11-8 0 4 4 0 018 0z"/></svg>,
  logout:<svg className="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>,
  plus:  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>,
  trash: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>,
  check: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>,
  spin:  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>,
  ig:    <svg className="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>,
  trend: <svg className="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>,
  bell:  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>,
  menu:  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>,
  close: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>,
  lock:  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>,
  msg:   <svg className="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>,
  crown: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm2 3h10v-2H7v2z"/></svg>,
  warn:  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>,
};

const NAV = [
  {id:"overview",    label:"Overview",    icon:I.grid},
  {id:"automations", label:"Automations", icon:I.zap},
  {id:"analytics",   label:"Analytics",  icon:I.bar},
  {id:"accounts",    label:"Accounts",   icon:I.user},
];

const PLAN_STYLE = {
  free:    {bg:"bg-gray-100",    text:"text-gray-600",    label:"Free"},
  starter: {bg:"bg-blue-100",    text:"text-blue-700",    label:"Starter"},
  pro:     {bg:"bg-emerald-100", text:"text-emerald-700", label:"Pro"},
};

// ── Helpers ───────────────────────────────────────────────────
const api = async (path, opts = {}) => {
  const res = await fetch(path, { ...opts, headers: { "Content-Type": "application/json", ...opts.headers } });
  if (!res.ok) throw new Error((await res.json())?.error || "API error");
  return res.json();
};

function Spinner({ full }) {
  return (
    <div className={`flex items-center justify-center ${full ? "h-screen" : "py-20"}`}>
      <div className="w-7 h-7 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
    </div>
  );
}

function LockedCard({ title, requiredPlan }) {
  return (
    <div className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden min-h-[160px]">
      <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-10 gap-2 rounded-2xl p-4">
        <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">{I.lock}</div>
        <p className="font-bold text-gray-800 text-sm">Upgrade to {requiredPlan}</p>
        <p className="text-xs text-gray-400 text-center">{title} is available on {requiredPlan} plan</p>
        <a href="/pricing" className="mt-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors">Upgrade Now</a>
      </div>
      <div className="h-32 bg-gray-50 rounded-xl m-4" />
    </div>
  );
}

function PlanBadge({ plan }) {
  const s = PLAN_STYLE[plan] || PLAN_STYLE.free;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>
      {plan === "pro" && I.crown}{s.label}
    </span>
  );
}

function StatCard({ label, value, sub, icon, color, warning }) {
  return (
    <div className={`bg-white rounded-2xl border p-4 lg:p-5 transition-shadow hover:shadow-sm ${warning ? "border-amber-200" : "border-gray-100"}`}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color}`}>{icon}</div>
      <p className="text-xl lg:text-2xl font-black text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      {sub && <p className={`text-xs font-semibold mt-1 ${warning ? "text-amber-600" : "text-emerald-600"}`}>{sub}</p>}
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────
function Sidebar({ page, setPage, userEmail, plan, subStatus, open, setOpen }) {
  const initials = userEmail ? userEmail.slice(0,2).toUpperCase() : "RA";
  const ps = PLAN_STYLE[plan] || PLAN_STYLE.free;
  const handleLogout = async () => { await supabase.auth.signOut(); window.location.href = "/"; };

  const Links = ({ onNav }) => (
    <nav className="flex-1 px-3 py-4 space-y-0.5">
      {NAV.map(({id,label,icon}) => (
        <button key={id} onClick={() => { setPage(id); onNav?.(); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${page===id?"bg-emerald-600 text-white shadow-sm":"text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}>
          {icon}{label}
        </button>
      ))}
    </nav>
  );

  const Bottom = () => (
    <div className="px-4 py-4 border-t border-gray-100 space-y-1">
      <div className={`flex items-center justify-between px-3 py-2 rounded-xl ${ps.bg} mb-2`}>
        <PlanBadge plan={plan} />
        {subStatus === "payment_failed" && <span className="text-xs text-red-500 font-bold flex items-center gap-1">{I.warn} Failed</span>}
        {plan !== "pro" && subStatus !== "payment_failed" && <a href="/pricing" className="text-xs font-bold text-emerald-600 hover:underline">{plan==="free"?"₹199/mo ↑":"₹399/mo ↑"}</a>}
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5">
        <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0">{initials}</div>
        <p className="text-xs text-gray-500 truncate flex-1">{userEmail}</p>
      </div>
      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-50 transition-all">
        {I.logout} Log Out
      </button>
    </div>
  );

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setOpen(false)} />}
      {/* Mobile */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 lg:hidden ${open?"translate-x-0":"-translate-x-full"}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <img src="/logo.png" alt="ReplyAstra" className="h-8 w-auto" />
          <button onClick={() => setOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-50">{I.close}</button>
        </div>
        <Links onNav={() => setOpen(false)} />
        <Bottom />
      </div>
      {/* Desktop */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-white border-r border-gray-100 h-screen sticky top-0">
        <div className="px-5 py-4 border-b border-gray-100">
          <img src="/logo.png" alt="ReplyAstra" className="h-8 w-auto" />
        </div>
        <Links />
        <Bottom />
      </aside>
    </>
  );
}

function Topbar({ page, plan, subStatus, setOpen }) {
  const titles = { overview:"Overview", automations:"Automations", analytics:"Analytics", accounts:"Accounts" };
  return (
    <header className="bg-white border-b border-gray-100 px-4 lg:px-6 py-3 flex items-center gap-3 sticky top-0 z-30">
      <button onClick={() => setOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-gray-50 text-gray-500">{I.menu}</button>
      <h1 className="text-base font-black text-gray-900 flex-1">{titles[page]}</h1>
      <div className="flex items-center gap-2">
        {subStatus === "payment_failed" && (
          <a href="/pricing" className="hidden sm:flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors">
            {I.warn} Payment Failed — Fix Now
          </a>
        )}
        <span className="hidden sm:block"><PlanBadge plan={plan} /></span>
        <button className="relative p-2 rounded-xl hover:bg-gray-50 text-gray-400">
          {I.bell}
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}

// ── Overview Page ─────────────────────────────────────────────
function OverviewPage({ plan, subStatus }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api("/api/dashboard/overview")
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const timeAgo = ts => {
    const d = Math.floor((Date.now() - new Date(ts)) / 1000);
    if (d < 60) return `${d}s ago`;
    if (d < 3600) return `${Math.floor(d/60)}m ago`;
    if (d < 86400) return `${Math.floor(d/3600)}h ago`;
    return `${Math.floor(d/86400)}d ago`;
  };

  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-red-400 py-20 text-sm">{error}</p>;

  const { stats, recentActivity, subscription } = data;
  const dmWarnPct = stats.dmLimitPct >= 80;

  return (
    <div className="p-4 lg:p-6 xl:p-8 space-y-5 max-w-7xl mx-auto w-full">

      {/* Payment failed banner */}
      {subStatus === "payment_failed" && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-red-500">{I.warn}</div>
            <div>
              <p className="font-bold text-red-700 text-sm">Payment Failed</p>
              <p className="text-xs text-red-600">Your automations are paused. Update your payment to restore access.</p>
            </div>
          </div>
          <a href="/pricing" className="shrink-0 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors">Fix Now</a>
        </div>
      )}

      {/* Cancellation notice */}
      {subscription?.cancel_at_period_end && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-amber-500">{I.warn}</div>
            <div>
              <p className="font-bold text-amber-700 text-sm">Subscription Cancelled</p>
              <p className="text-xs text-amber-600">
                You have access until {new Date(subscription.current_period_end).toLocaleDateString("en-IN", {day:"numeric",month:"long",year:"numeric"})}.
              </p>
            </div>
          </div>
          <a href="/pricing" className="shrink-0 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors">Renew</a>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard label="Total DMs Sent"     value={stats.totalDMs}          sub={`+${stats.weekDMs} this week`}                                 icon={I.msg}   color="bg-emerald-50 text-emerald-600" />
        <StatCard label="Active Automations" value={stats.activeAutomations}  sub={`of ${data.limits.automations ?? "∞"} allowed`}                icon={I.zap}   color="bg-blue-50 text-blue-500"      />
        <StatCard label="Instagram Accounts" value={stats.totalAccounts}      sub={`of ${data.limits.accounts} allowed`}                          icon={I.ig}    color="bg-pink-50 text-pink-500"      />
        <StatCard label="DMs This Month"     value={stats.monthlyDMs}
          sub={stats.dmLimit ? `${stats.dmLimitPct}% of ${stats.dmLimit} limit` : "Unlimited"}
          warning={dmWarnPct}
          icon={I.trend} color={dmWarnPct ? "bg-amber-50 text-amber-500" : "bg-violet-50 text-violet-500"} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Activity */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-800">Recent Activity</h2>
            <span className="text-xs text-gray-400">{recentActivity.length} events</span>
          </div>
          {recentActivity.length === 0 ? (
            <div className="py-14 text-center">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3 text-gray-300">{I.msg}</div>
              <p className="text-sm text-gray-400">No activity yet — add an automation!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentActivity.map((log, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs ${log.status==="sent"?"bg-emerald-50 text-emerald-500":"bg-red-50 text-red-400"}`}>
                    {log.status === "sent" ? I.check : "✕"}
                  </div>
                  <p className="flex-1 text-xs lg:text-sm text-gray-700 truncate">
                    <span className="font-semibold">"{log.keyword}"</span> → {log.recipient}
                  </p>
                  <span className="text-xs text-gray-400 shrink-0">{timeAgo(log.sent_at)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar cards */}
        <div className="space-y-3">
          {/* Upgrade / Pro card */}
          {plan === "pro" ? (
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-2 text-emerald-100">{I.crown}<span className="text-xs font-bold">Pro Plan Active</span></div>
              <p className="font-bold">You're on Pro 🎉</p>
              <p className="text-xs text-emerald-100 mt-1">All features unlocked.</p>
            </div>
          ) : plan === "starter" ? (
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-2 text-blue-100">{I.crown}<span className="text-xs font-bold">Upgrade to Pro</span></div>
              <p className="font-bold text-sm">Pro — ₹399/mo</p>
              <p className="text-xs text-blue-100 mt-1 mb-4">10 accounts, advanced analytics, priority support</p>
              <a href="/pricing" className="block text-center bg-white text-blue-700 font-bold text-sm py-2 rounded-xl hover:bg-blue-50 transition-colors">Upgrade →</a>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-2 text-emerald-100">{I.crown}<span className="text-xs font-bold">Get Started</span></div>
              <p className="font-bold text-sm">Starter — ₹199/mo</p>
              <p className="text-xs text-emerald-100 mt-1 mb-4">Unlimited keywords, 3 accounts, no watermark</p>
              <a href="/pricing" className="block text-center bg-white text-emerald-700 font-bold text-sm py-2 rounded-xl hover:bg-emerald-50 transition-colors">See Plans →</a>
            </div>
          )}

          {/* DM limit progress (if limited) */}
          {stats.dmLimit && (
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <p className="text-xs font-bold text-gray-500 mb-2">Monthly DMs</p>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-black text-gray-900">{stats.monthlyDMs}</span>
                <span className="text-xs text-gray-400">of {stats.dmLimit}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${stats.dmLimitPct >= 90 ? "bg-red-500" : stats.dmLimitPct >= 70 ? "bg-amber-500" : "bg-emerald-500"}`}
                  style={{ width: `${Math.min(stats.dmLimitPct, 100)}%` }} />
              </div>
              {stats.dmLimitPct >= 80 && (
                <p className="text-xs text-amber-600 font-semibold mt-1.5">Running low — <a href="/pricing" className="underline">upgrade</a></p>
              )}
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Quick Actions</p>
            <div className="space-y-1">
              <button className="w-full text-left text-sm text-gray-600 hover:text-emerald-600 font-medium py-2 flex items-center gap-2 transition-colors">{I.zap} Add Keyword Rule</button>
              <button className="w-full text-left text-sm text-gray-600 hover:text-emerald-600 font-medium py-2 flex items-center gap-2 transition-colors">{I.ig} Connect Instagram</button>
              <a href="/pricing" className="w-full text-left text-sm text-gray-600 hover:text-emerald-600 font-medium py-2 flex items-center gap-2 transition-colors">{I.crown} View Plans</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Automations Page ──────────────────────────────────────────
function AutomationsPage({ plan }) {
  const [list, setList] = useState([]);
  const [limits, setLimits] = useState({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ keyword:"", reply:"" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [autos, overview] = await Promise.all([
        api("/api/automations"),
        api("/api/dashboard/overview"),
      ]);
      setList(autos.automations || []);
      setLimits(overview.limits || {});
    } catch(e) { setErr(e.message); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const atLimit = limits.automations !== null && list.filter(a => a.status !== "disabled_by_system").length >= (limits.automations || 3);

  async function toggle(id, currentActive) {
    try {
      const res = await api(`/api/automations/${id}`, { method:"PATCH", body: JSON.stringify({ active: !currentActive }) });
      setList(p => p.map(a => a.id === id ? res.automation : a));
    } catch(e) { alert(e.message); }
  }

  async function remove(id) {
    if (!confirm("Delete this automation?")) return;
    try {
      await api(`/api/automations/${id}`, { method:"DELETE" });
      setList(p => p.filter(a => a.id !== id));
    } catch(e) { alert(e.message); }
  }

  async function save() {
    if (!form.keyword.trim() || !form.reply.trim()) return;
    setSaving(true);
    try {
      const res = await api("/api/automations", { method:"POST", body: JSON.stringify(form) });
      setList(p => [res.automation, ...p]);
      setForm({ keyword:"", reply:"" });
      setShowForm(false);
    } catch(e) { alert(e.message); }
    setSaving(false);
  }

  if (loading) return <Spinner />;

  const statusColor = { active:"bg-emerald-500", paused_by_user:"bg-gray-300", disabled_by_system:"bg-red-400", error:"bg-amber-400" };
  const statusLabel = { active:"Active", paused_by_user:"Paused", disabled_by_system:"Disabled", error:"Error" };

  return (
    <div className="p-4 lg:p-6 xl:p-8 space-y-5 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-sm text-gray-500">{list.length} / {limits.automations === null ? "∞" : limits.automations} rules</p>
          {atLimit && plan !== "pro" && <p className="text-xs text-amber-600 font-semibold mt-0.5">Limit reached — <a href="/pricing" className="underline">upgrade</a></p>}
        </div>
        <button onClick={() => atLimit ? window.location.href="/pricing" : setShowForm(!showForm)}
          className={`flex items-center gap-2 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors ${atLimit&&plan==="free"?"bg-amber-500 hover:bg-amber-600":"bg-emerald-600 hover:bg-emerald-700"}`}>
          {I.plus}{atLimit&&plan==="free"?"Upgrade — ₹199/mo":"New Automation"}
        </button>
      </div>

      {showForm && !atLimit && (
        <div className="bg-white border border-emerald-100 rounded-2xl p-5 lg:p-6 space-y-4 shadow-sm">
          <p className="text-sm font-bold text-gray-800">New Keyword Rule</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Keyword</label>
              <input placeholder='e.g. "price"' value={form.keyword} onChange={e => setForm({...form,keyword:e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition" />
              <p className="text-xs text-gray-400 mt-1">When someone comments this → auto DM is sent</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Auto-Reply Message</label>
              <textarea placeholder="The DM to send automatically..." rows={3} value={form.reply} onChange={e => setForm({...form,reply:e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none transition" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors">
              {saving ? I.spin : I.check} Save Rule
            </button>
            <button onClick={() => setShowForm(false)} className="text-sm font-semibold text-gray-400 px-4 py-2.5 rounded-xl hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      )}

      {list.length === 0 && !showForm && (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-emerald-500">{I.zap}</div>
          <p className="font-bold text-gray-700 mb-1">No automations yet</p>
          <p className="text-sm text-gray-400">Click "New Automation" to create your first keyword rule</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {list.map(a => (
          <div key={a.id} className={`bg-white rounded-2xl border p-4 lg:p-5 flex items-start gap-3 transition-colors ${a.status==="disabled_by_system"?"border-red-100 bg-red-50/30":"border-gray-100 hover:border-gray-200"}`}>
            <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${statusColor[a.status]||"bg-gray-300"}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-lg font-mono">{a.keyword}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  a.status==="active"?"bg-emerald-50 text-emerald-600":
                  a.status==="error"?"bg-amber-50 text-amber-600":
                  a.status==="disabled_by_system"?"bg-red-50 text-red-500":
                  "bg-gray-50 text-gray-500"
                }`}>{statusLabel[a.status]}</span>
                <span className="text-xs text-gray-400">{a.triggered||0}× sent</span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2">{a.reply}</p>
              {a.last_error && a.status === "disabled_by_system" && (
                <p className="text-xs text-red-500 mt-1">{a.last_error}</p>
              )}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {a.status !== "disabled_by_system" && (
                <button onClick={() => toggle(a.id, a.active)}
                  className={`relative w-10 h-6 rounded-full transition-colors ${a.active?"bg-emerald-500":"bg-gray-200"}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${a.active?"translate-x-4":""}`} />
                </button>
              )}
              <button onClick={() => remove(a.id)} className="p-2 text-gray-300 hover:text-red-400 rounded-xl hover:bg-red-50 transition-colors">{I.trash}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Analytics Page ────────────────────────────────────────────
function AnalyticsPage({ plan }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/api/dashboard/analytics").then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!data) return null;

  const max = Math.max(...(data.bars||[]).map(b => b.dms), 1);

  return (
    <div className="p-4 lg:p-6 xl:p-8 space-y-5 max-w-7xl mx-auto w-full">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 lg:gap-4">
        {[
          {l:"Total DMs",  v:data.stats.total,           s:`${data.stats.week} this week`},
          {l:"This Week",  v:data.stats.week,            s:"last 7 days"},
          {l:"Delivered",  v:`${data.stats.successRate}%`, s:"success rate"},
        ].map(({l,v,s}) => (
          <div key={l} className="bg-white rounded-2xl border border-gray-100 p-3 lg:p-5">
            <p className="text-xs text-gray-400 font-semibold mb-1">{l}</p>
            <p className="text-lg lg:text-3xl font-black text-gray-900">{v}</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">{s}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-bold text-gray-800 mb-5">DMs — Last 7 Days</h2>
          <div className="flex items-end gap-1.5" style={{height:"96px"}}>
            {(data.bars||[]).map((b,i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-400">{b.dms>0?b.dms:""}</span>
                <div className="w-full flex items-end" style={{height:"68px"}}>
                  <div className="w-full bg-emerald-500 hover:bg-emerald-400 rounded-t-md transition-all" style={{height:`${(b.dms/max)*68}px`,minHeight:b.dms>0?"3px":"0"}} />
                </div>
                <span className="text-xs text-gray-400">{b.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-bold text-gray-800 mb-4">Top Keywords</h2>
          {!data.topKeywords?.length ? (
            <p className="text-sm text-gray-400 text-center py-8">No data yet.</p>
          ) : (
            <div className="space-y-3">
              {data.topKeywords.map(({keyword,count,pct}) => (
                <div key={keyword}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-bold text-gray-700 font-mono bg-gray-100 px-2 py-0.5 rounded-lg">{keyword}</span>
                    <span className="text-xs text-gray-400">{count} · {pct}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full"><div className="h-full bg-emerald-500 rounded-full" style={{width:`${pct}%`}} /></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Starter breakdown */}
      {data.breakdown ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-800">Breakdown</h2>
            <PlanBadge plan={plan} />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {l:"Today",    v:data.breakdown.today},
              {l:"This Week",v:data.breakdown.week},
              {l:"All Time", v:data.breakdown.total},
              {l:"Success",  v:`${data.breakdown.successRate}%`},
            ].map(({l,v}) => (
              <div key={l} className="text-center p-3 bg-gray-50 rounded-xl">
                <p className="text-lg font-black text-gray-900">{v}</p>
                <p className="text-xs text-gray-400 mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <LockedCard title="Breakdown Stats (daily/weekly)" requiredPlan="Starter" />
      )}

      {/* Pro advanced */}
      {data.advanced ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-800">30-Day Trend</h2>
              <PlanBadge plan="pro" />
            </div>
            {(() => {
              const m = Math.max(...data.advanced.trend30Days.map(d => d.dms), 1);
              return (
                <div className="flex items-end gap-0.5" style={{height:"80px"}}>
                  {data.advanced.trend30Days.map((d,i) => (
                    <div key={i} className="flex-1 flex items-end" style={{height:"60px"}}>
                      <div className="w-full bg-emerald-400 hover:bg-emerald-300 rounded-sm transition-all" style={{height:`${(d.dms/m)*60}px`,minHeight:d.dms>0?"2px":"0"}} />
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-800">Conversion</h2>
              <PlanBadge plan="pro" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-xs text-gray-500">Comment → DM</span><span className="text-sm font-black text-gray-900">{data.advanced.conversionRates.comment_to_dm}%</span></div>
              {data.advanced.automationStats.slice(0,3).map(a => (
                <div key={a.keyword} className="flex justify-between">
                  <span className="text-xs text-gray-500 font-mono">{a.keyword}</span>
                  <span className="text-sm font-black text-gray-900">{a.triggered} DMs</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <LockedCard title="Advanced Analytics (30-day + conversions)" requiredPlan="Pro" />
      )}
    </div>
  );
}

// ── Accounts Page ─────────────────────────────────────────────
function AccountsPage({ plan }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try { setData(await api("/api/instagram/accounts")); } catch(e) {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function disconnect(id) {
    if (!confirm("Disconnect this account? Its automations will be paused.")) return;
    try {
      await api(`/api/instagram/accounts/${id}`, { method:"DELETE" });
      load();
    } catch(e) { alert(e.message); }
  }

  if (loading) return <Spinner />;
  const { accounts = [], limit = 1, canAddMore = false } = data || {};
  const atLimit = !canAddMore;

  return (
    <div className="p-4 lg:p-6 xl:p-8 space-y-5 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm text-gray-500">{accounts.length} / {limit} accounts</p>
          {atLimit && plan !== "pro" && <p className="text-xs text-amber-600 font-semibold mt-0.5">Limit reached — <a href="/pricing" className="underline">upgrade</a></p>}
        </div>
        <button onClick={() => atLimit ? window.location.href="/pricing" : null}
          className={`flex items-center gap-2 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors ${atLimit?"bg-amber-500 hover:bg-amber-600":"bg-emerald-600 hover:bg-emerald-700"}`}>
          {I.plus}{atLimit?"Upgrade for More":"Connect Instagram"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {accounts.map(acc => (
          <div key={acc.id} className={`bg-white rounded-2xl border p-4 lg:p-5 flex items-center gap-3 transition-colors ${acc.status==="needs_reconnect"?"border-amber-200":"border-gray-100 hover:border-gray-200"}`}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-400 via-rose-400 to-orange-400 flex items-center justify-center text-white font-black text-sm shrink-0">
              {acc.handle?.replace("@","").slice(0,2).toUpperCase()||"IG"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm truncate">{acc.handle}</p>
              <p className="text-xs text-gray-400">{acc.followers?.toLocaleString()} followers</p>
              {acc.status === "needs_reconnect" && <p className="text-xs text-amber-600 font-semibold mt-0.5">⚠️ Token expired — reconnect needed</p>}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                acc.status==="connected"?"bg-emerald-50 border border-emerald-100 text-emerald-700":
                acc.status==="needs_reconnect"?"bg-amber-50 border border-amber-200 text-amber-700":
                "bg-gray-50 border border-gray-200 text-gray-500"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${acc.status==="connected"?"bg-emerald-500":acc.status==="needs_reconnect"?"bg-amber-500":"bg-gray-400"}`} />
                {acc.status==="connected"?"Live":acc.status==="needs_reconnect"?"Reconnect":"Paused"}
              </span>
              <button onClick={() => disconnect(acc.id)} className="p-2 text-gray-300 hover:text-red-400 rounded-xl hover:bg-red-50 transition-colors">{I.trash}</button>
            </div>
          </div>
        ))}
      </div>

      {!atLimit && (
        <button className="w-full border-2 border-dashed border-gray-200 hover:border-emerald-300 rounded-2xl p-8 lg:p-10 flex flex-col items-center gap-3 transition-colors group">
          <div className="w-12 h-12 bg-gray-50 group-hover:bg-emerald-50 rounded-2xl flex items-center justify-center text-gray-300 group-hover:text-emerald-500 transition-colors">{I.ig}</div>
          <p className="text-sm font-bold text-gray-500 group-hover:text-gray-700 transition-colors">Connect an Instagram account</p>
          <p className="text-xs text-gray-400">Manage multiple accounts from one place</p>
        </button>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="text-sm font-bold text-gray-800 mb-4">Account Limits by Plan</h2>
        <div className="grid grid-cols-3 gap-3">
          {[{p:"Free",n:"1 account",c:"bg-gray-50",t:"text-gray-600"},{p:"Starter",n:"3 accounts",c:"bg-blue-50",t:"text-blue-700"},{p:"Pro",n:"10 accounts",c:"bg-emerald-50",t:"text-emerald-700"}].map(({p,n,c,t}) => (
            <div key={p} className={`rounded-xl p-3 text-center ${c} ${plan.toLowerCase()===p.toLowerCase()?"ring-2 ring-emerald-400":""}`}>
              <p className={`text-xs font-bold ${t}`}>{p}</p>
              <p className="text-sm font-black text-gray-900 mt-1">{n}</p>
            </div>
          ))}
        </div>
        {plan !== "pro" && <a href="/pricing" className="block text-center mt-4 text-sm font-bold text-emerald-600 hover:underline">Upgrade your plan →</a>}
      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────
export default function Dashboard() {
  const [page, setPage] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [plan, setPlan] = useState("free");
  const [subStatus, setSubStatus] = useState("inactive");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) { window.location.href = "/login"; return; }
      setUser(data.user);
      try {
        const sub = await api("/api/subscription");
        setPlan(sub.plan || "free");
        setSubStatus(sub.status || "inactive");
      } catch(e) {}
      setLoading(false);
    }
    init();
  }, []);

  if (loading) return <Spinner full />;

  const pages = {
    overview:    <OverviewPage    plan={plan} subStatus={subStatus} />,
    automations: <AutomationsPage plan={plan} />,
    analytics:   <AnalyticsPage  plan={plan} />,
    accounts:    <AccountsPage   plan={plan} />,
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar page={page} setPage={setPage} userEmail={user.email} plan={plan} subStatus={subStatus} open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar page={page} plan={plan} subStatus={subStatus} setOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {pages[page]}
        </main>
      </div>
    </div>
  );
}
