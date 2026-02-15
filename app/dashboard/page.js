"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

// ── Icons (inline SVG so no extra deps needed) ────────────────
const Icon = {
  grid: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  zap:  <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  bar:  <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>,
  user: <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-5M9 20H4v-2a4 4 0 015-5m6-5a4 4 0 11-8 0 4 4 0 018 0z"/></svg>,
  msg:  <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>,
  logout:<svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>,
  plus: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>,
  trash:<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>,
  check:<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>,
  spin: <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>,
  eye:  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>,
  eyeOff:<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>,
  ig:   <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>,
  trend:<svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>,
  bell: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>,
};

// ── Sidebar ───────────────────────────────────────────────────
function Sidebar({ page, setPage, userEmail }) {
  const initials = userEmail ? userEmail.slice(0, 2).toUpperCase() : "RA";
  const nav = [
    { id: "overview",    label: "Overview",    icon: Icon.grid },
    { id: "automations", label: "Automations", icon: Icon.zap  },
    { id: "analytics",   label: "Analytics",   icon: Icon.bar  },
    { id: "accounts",    label: "Accounts",    icon: Icon.user },
  ];
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };
  return (
    <aside className="w-60 shrink-0 flex flex-col h-screen bg-white border-r border-gray-100 sticky top-0">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-gray-100">
        <img src="/logo.png" alt="ReplyAstra" className="h-8 w-auto" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5">
        {nav.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setPage(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
              page === id
                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-200"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            {icon} {label}
          </button>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl mb-1">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0">
            {initials}
          </div>
          <p className="text-xs text-gray-500 truncate flex-1">{userEmail}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-50 transition-all"
        >
          {Icon.logout} Log Out
        </button>
      </div>
    </aside>
  );
}

// ── Topbar ────────────────────────────────────────────────────
function Topbar({ page }) {
  const titles = {
    overview: { title: "Overview", sub: "Here's what's happening today" },
    automations: { title: "Automations", sub: "Manage your keyword rules" },
    analytics: { title: "Analytics", sub: "Track your DM performance" },
    accounts: { title: "Accounts", sub: "Your connected Instagram accounts" },
  };
  return (
    <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-lg font-black text-gray-900">{titles[page].title}</h1>
        <p className="text-xs text-gray-400 mt-0.5">{titles[page].sub}</p>
      </div>
      <button className="relative p-2 rounded-xl hover:bg-gray-50 text-gray-400 transition-colors">
        {Icon.bell}
        <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
      </button>
    </header>
  );
}

// ── Spinner ───────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="w-7 h-7 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, accent }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:shadow-gray-100 transition-shadow">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${accent}`}>
        {icon}
      </div>
      <p className="text-2xl font-black text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-emerald-600 font-semibold mt-1.5">{sub}</p>}
    </div>
  );
}

// ── Overview Page ─────────────────────────────────────────────
function OverviewPage({ userId }) {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const [
        { count: totalDMs },
        { count: weekDMs },
        { count: autoCount },
        { count: accCount },
        { data: logs },
      ] = await Promise.all([
        supabase.from("dm_logs").select("*", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("dm_logs").select("*", { count: "exact", head: true }).eq("user_id", userId).gte("sent_at", weekAgo.toISOString()),
        supabase.from("automations").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("active", true),
        supabase.from("accounts").select("*", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("dm_logs").select("keyword,recipient,status,sent_at").eq("user_id", userId).order("sent_at", { ascending: false }).limit(6),
      ]);

      setStats({ totalDMs: totalDMs || 0, weekDMs: weekDMs || 0, autoCount: autoCount || 0, accCount: accCount || 0 });
      setActivity(logs || []);
      setLoading(false);
    }
    load();
  }, [userId]);

  const timeAgo = (ts) => {
    const d = Math.floor((Date.now() - new Date(ts)) / 1000);
    if (d < 60) return `${d}s ago`;
    if (d < 3600) return `${Math.floor(d / 60)}m ago`;
    if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
    return `${Math.floor(d / 86400)}d ago`;
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-8 space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total DMs Sent"       value={stats.totalDMs}  sub={`+${stats.weekDMs} this week`} icon={Icon.msg}   accent="bg-emerald-50 text-emerald-600" />
        <StatCard label="Active Automations"   value={stats.autoCount} sub="keyword rules active"          icon={Icon.zap}   accent="bg-blue-50 text-blue-500"      />
        <StatCard label="Instagram Accounts"   value={stats.accCount}  sub="connected"                    icon={Icon.ig}    accent="bg-pink-50 text-pink-500"      />
        <StatCard label="Avg. Reply Time"       value="< 1s"            sub="always instant"               icon={Icon.trend} accent="bg-violet-50 text-violet-500"  />
      </div>

      {/* Activity */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="text-sm font-bold text-gray-800">Recent Activity</h2>
        </div>
        {activity.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              {Icon.msg}
            </div>
            <p className="text-sm text-gray-400">No activity yet — add an automation to get started!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {activity.map((log, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 transition-colors">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${log.status === "sent" ? "bg-emerald-50 text-emerald-500" : "bg-gray-100 text-gray-400"}`}>
                  {log.status === "sent" ? Icon.check : "·"}
                </div>
                <p className="flex-1 text-sm text-gray-700 truncate">
                  <span className="font-semibold">&quot;{log.keyword}&quot;</span> → DM {log.status} to <span className="font-semibold">{log.recipient}</span>
                </p>
                <span className="text-xs text-gray-400 shrink-0">{timeAgo(log.sent_at)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tip banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 flex items-center justify-between gap-4">
        <div>
          <p className="font-bold text-white">💡 Tip — Add more keywords</p>
          <p className="text-emerald-100 text-sm mt-1">The more keywords you set, the more DMs get automated for you.</p>
        </div>
        <button className="shrink-0 bg-white text-emerald-700 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-emerald-50 transition-colors whitespace-nowrap">
          Add Keyword
        </button>
      </div>
    </div>
  );
}

// ── Automations Page ──────────────────────────────────────────
function AutomationsPage({ userId }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ keyword: "", reply: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchAll(); }, [userId]);

  async function fetchAll() {
    setLoading(true);
    const { data } = await supabase.from("automations").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    setList(data || []);
    setLoading(false);
  }

  async function toggle(id, current) {
    await supabase.from("automations").update({ active: !current }).eq("id", id);
    setList(p => p.map(a => a.id === id ? { ...a, active: !current } : a));
  }

  async function remove(id) {
    await supabase.from("automations").delete().eq("id", id);
    setList(p => p.filter(a => a.id !== id));
  }

  async function save() {
    if (!form.keyword.trim() || !form.reply.trim()) return;
    setSaving(true);
    const { data, error } = await supabase.from("automations")
      .insert([{ user_id: userId, keyword: form.keyword.trim(), reply: form.reply.trim() }])
      .select().single();
    if (!error && data) { setList(p => [data, ...p]); setForm({ keyword: "", reply: "" }); setShowForm(false); }
    setSaving(false);
  }

  if (loading) return <Spinner />;

  return (
    <div className="p-8 space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{list.length} rule{list.length !== 1 ? "s" : ""}</p>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors">
          {Icon.plus} New Automation
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-emerald-100 rounded-2xl p-6 space-y-4 shadow-sm shadow-emerald-50">
          <p className="text-sm font-bold text-gray-800">Create Keyword Rule</p>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Keyword</label>
            <input
              placeholder='e.g. "price"'
              value={form.keyword}
              onChange={e => setForm({ ...form, keyword: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            />
            <p className="text-xs text-gray-400 mt-1">When someone comments this word, they get an auto DM</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Auto-Reply Message</label>
            <textarea
              placeholder="Type the DM message you want to send..."
              rows={3}
              value={form.reply}
              onChange={e => setForm({ ...form, reply: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none transition"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors">
              {saving ? Icon.spin : Icon.check} Save Rule
            </button>
            <button onClick={() => setShowForm(false)} className="text-sm font-semibold text-gray-400 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {list.length === 0 && !showForm && (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-500">{Icon.zap}</div>
          <p className="font-bold text-gray-700 mb-1">No automations yet</p>
          <p className="text-sm text-gray-400">Click "New Automation" to create your first keyword rule</p>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {list.map(a => (
          <div key={a.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4 hover:border-gray-200 transition-colors">
            {/* Active dot */}
            <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${a.active ? "bg-emerald-500" : "bg-gray-300"}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg font-mono">{a.keyword}</span>
                <span className="text-xs text-gray-400">{a.triggered || 0}× triggered</span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2">{a.reply}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {/* Toggle */}
              <button
                onClick={() => toggle(a.id, a.active)}
                className={`relative w-10 h-6 rounded-full transition-colors ${a.active ? "bg-emerald-500" : "bg-gray-200"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${a.active ? "translate-x-4" : ""}`} />
              </button>
              <button onClick={() => remove(a.id)} className="p-2 text-gray-300 hover:text-red-400 transition-colors rounded-lg hover:bg-red-50">
                {Icon.trash}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Analytics Page ────────────────────────────────────────────
function AnalyticsPage({ userId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d;
      });

      const bars = await Promise.all(days.map(async d => {
        const s = new Date(d); s.setHours(0, 0, 0, 0);
        const e = new Date(d); e.setHours(23, 59, 59, 999);
        const { count } = await supabase.from("dm_logs").select("*", { count: "exact", head: true })
          .eq("user_id", userId).gte("sent_at", s.toISOString()).lte("sent_at", e.toISOString());
        return { day: d.toLocaleDateString("en", { weekday: "short" }), dms: count || 0 };
      }));

      const { count: total } = await supabase.from("dm_logs").select("*", { count: "exact", head: true }).eq("user_id", userId);
      const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
      const { count: week } = await supabase.from("dm_logs").select("*", { count: "exact", head: true }).eq("user_id", userId).gte("sent_at", weekAgo.toISOString());
      const { count: failed } = await supabase.from("dm_logs").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("status", "failed");
      const t = total || 0;
      const rate = t > 0 ? (((t - (failed || 0)) / t) * 100).toFixed(1) : "100.0";

      const { data: logs } = await supabase.from("dm_logs").select("keyword").eq("user_id", userId);
      const kw = {};
      (logs || []).forEach(({ keyword }) => { kw[keyword] = (kw[keyword] || 0) + 1; });
      const topKw = Object.entries(kw).sort((a, b) => b[1] - a[1]).slice(0, 5)
        .map(([k, c]) => ({ k, c, pct: t > 0 ? Math.round((c / t) * 100) : 0 }));

      setData({ bars, total: t, week: week || 0, rate, topKw });
      setLoading(false);
    }
    load();
  }, [userId]);

  if (loading) return <Spinner />;

  const max = Math.max(...data.bars.map(b => b.dms), 1);

  return (
    <div className="p-8 space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { l: "Total DMs Sent",   v: data.total,     s: `${data.week} this week`       },
          { l: "This Week",        v: data.week,       s: "last 7 days"                  },
          { l: "Success Rate",     v: `${data.rate}%`, s: "delivered successfully"       },
        ].map(({ l, v, s }) => (
          <div key={l} className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">{l}</p>
            <p className="text-3xl font-black text-gray-900">{v}</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1.5">{s}</p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-sm font-bold text-gray-800 mb-6">DMs Sent — Last 7 Days</h2>
        <div className="flex items-end gap-2 h-40">
          {data.bars.map((b, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs text-gray-400 font-semibold">{b.dms > 0 ? b.dms : ""}</span>
              <div className="w-full flex items-end justify-center" style={{ height: "100px" }}>
                <div
                  className="w-full bg-emerald-500 hover:bg-emerald-400 rounded-t-lg transition-all cursor-pointer"
                  style={{ height: `${(b.dms / max) * 100}px`, minHeight: b.dms > 0 ? "4px" : "0" }}
                />
              </div>
              <span className="text-xs text-gray-400">{b.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top keywords */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-sm font-bold text-gray-800 mb-5">Top Keywords</h2>
        {data.topKw.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No data yet — DMs will appear here once automations run.</p>
        ) : (
          <div className="space-y-4">
            {data.topKw.map(({ k, c, pct }) => (
              <div key={k}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-gray-700 font-mono bg-gray-100 px-2.5 py-0.5 rounded-lg">{k}</span>
                  <span className="text-xs text-gray-400">{c} DMs · {pct}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Accounts Page ─────────────────────────────────────────────
function AccountsPage({ userId }) {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("accounts").select("*").eq("user_id", userId).order("created_at", { ascending: false });
      setAccounts(data || []);
      setLoading(false);
    }
    load();
  }, [userId]);

  async function remove(id) {
    await supabase.from("accounts").delete().eq("id", id);
    setAccounts(p => p.filter(a => a.id !== id));
  }

  if (loading) return <Spinner />;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{accounts.length} account{accounts.length !== 1 ? "s" : ""} connected</p>
        <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors">
          {Icon.plus} Connect Instagram
        </button>
      </div>

      {/* Account cards */}
      <div className="space-y-3">
        {accounts.map(acc => (
          <div key={acc.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 hover:border-gray-200 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 via-rose-400 to-orange-400 flex items-center justify-center text-white font-black text-sm shrink-0">
              {(acc.avatar || acc.handle?.replace("@", "").slice(0, 2) || "IG").toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900">{acc.handle}</p>
              <p className="text-sm text-gray-400">{acc.followers} followers</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Connected
              </span>
              <button onClick={() => remove(acc.id)} className="p-2 text-gray-300 hover:text-red-400 rounded-xl hover:bg-red-50 transition-colors">
                {Icon.trash}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add card */}
      <button className="w-full border-2 border-dashed border-gray-200 hover:border-emerald-300 rounded-2xl p-10 flex flex-col items-center gap-3 transition-colors group">
        <div className="w-14 h-14 bg-gray-50 group-hover:bg-emerald-50 rounded-2xl flex items-center justify-center text-gray-300 group-hover:text-emerald-500 transition-colors">
          {Icon.ig}
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-gray-500 group-hover:text-gray-700 transition-colors">Connect another Instagram account</p>
          <p className="text-xs text-gray-400 mt-1">Manage multiple accounts from one dashboard</p>
        </div>
      </button>
    </div>
  );
}

// ── Root Dashboard ────────────────────────────────────────────
export default function Dashboard() {
  const [page, setPage] = useState("overview");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) { window.location.href = "/login"; return; }
      setUser(data.user);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  const pages = {
    overview:    <OverviewPage    userId={user.id} />,
    automations: <AutomationsPage userId={user.id} />,
    analytics:   <AnalyticsPage  userId={user.id} />,
    accounts:    <AccountsPage   userId={user.id} />,
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar page={page} setPage={setPage} userEmail={user.email} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar page={page} />
        <main className="flex-1 overflow-y-auto">
          {pages[page]}
        </main>
      </div>
    </div>
  );
}
