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

// Elegant serif + sans-serif typography
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
  .serif { font-family: 'Libre Baskerville', serif; }
  .plan-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
  .plan-card:hover { transform: translateY(-8px); box-shadow: 0 20px 50px rgba(0,0,0,0.08); }
`;

function Spinner({ full }) {
  return (
    <div className={`flex items-center justify-center ${full ? "h-screen bg-white" : "py-24"}`}>
      <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
    </div>
  );
}

// Minimalist icons
const Icons = {
  overview:    () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  automations: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>,
  leads:       () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>,
  settings:    () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>,
  logout:      () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>,
  search:      () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35"/></svg>,
  eye:         () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>,
  eyeOff:      () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>,
  check:       () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>,
  x:           () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>,
};

const NAV = [
  { id: "overview",    label: "Overview",    Icon: Icons.overview    },
  { id: "automations", label: "Automations", Icon: Icons.automations },
  { id: "leads",       label: "Leads",       Icon: Icons.leads       },
  { id: "settings",    label: "Settings",    Icon: Icons.settings    },
];

// ── Elegant White Sidebar ──────────────────────────────────────
function Sidebar({ page, setPage, email, plan }) {
  const [search, setSearch] = useState("");

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <aside className="w-44 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-100">
        <img src="https://drive.google.com/uc?export=view&id=1eSoaEk0AOQUph0sMB80RsO6ck3rvVW7T" alt="Astra" className="h-8 w-auto" />
      </div>

      {/* Search */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative">
          <Icons.search />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs border-0 bg-gray-50 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-200 text-gray-600 placeholder-gray-400"
            style={{ position: "relative" }}
          />
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icons.search />
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-2">
        {NAV.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setPage(id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors mb-0.5 ${
              page === id
                ? "bg-black text-white"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Icon />
            {label}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-4 py-4 border-t border-gray-100 space-y-2">
        <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold px-3">Usage</div>
        <div className="bg-gray-50 rounded-lg px-3 py-2">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-500 font-medium">{PLAN_NAMES[plan]}</span>
            <span className="text-gray-400">{plan === "free" ? "₹0/mo" : PLAN_PRICES[plan] + "/mo"}</span>
          </div>
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-black rounded-full" style={{ width: "32%" }} />
          </div>
          <div className="text-xs text-gray-400 mt-1">1.2k / 10k monthly DMs</div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
        >
          <Icons.logout />
          Logout
        </button>
      </div>
    </aside>
  );
}

// ── Elegant Topbar ─────────────────────────────────────────────
function Topbar({ page, user }) {
  const titles = {
    overview: "Welcome",
    automations: "Flows",
    leads: "Captured Growth",
    settings: "Console",
    pricing: "Plans & Pricing",
    support: "How can we help?",
  };

  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there";
  const now = new Date();
  const synced = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

  return (
    <header className="bg-white border-b border-gray-100 px-8 py-4">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
          <span className="uppercase tracking-wide font-medium">Session: {user?.email?.split("@")[0]}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span>Synced: {synced}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold">
              {name.slice(0, 2).toUpperCase()}
            </div>
            <div className="text-xs">
              <div className="font-semibold text-gray-900">{name}</div>
              <div className="text-gray-400">Pro account</div>
            </div>
          </div>
        </div>
      </div>
      <h1 className="serif text-4xl text-gray-900 font-normal italic">
        {titles[page] || "Welcome"}{page === "overview" && `, ${name}`}
      </h1>
    </header>
  );
}

// ── Overview Page ──────────────────────────────────────────────
function OverviewPage({ userId }) {
  const [stats, setStats] = useState({ sentReplies: 0, automationHits: 0, convRate: "0.0", leads: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [
        { count: totalDMs },
        { count: activeAutos },
        { count: leads },
      ] = await Promise.all([
        supabase.from("dm_logs").select("*", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("automations").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("status", "active"),
        supabase.from("dm_logs").select("*", { count: "exact", head: true }).eq("user_id", userId),
      ]);
      setStats({
        sentReplies: totalDMs || 0,
        automationHits: activeAutos || 0,
        convRate: "12.4",
        leads: leads || 0,
      });
      setLoading(false);
    }
    load();
  }, [userId]);

  if (loading) return <Spinner />;

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Sent Replies",     value: stats.sentReplies.toLocaleString(), change: "+24%", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg> },
          { label: "Automation Hits",  value: stats.automationHits,                change: "+18%", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> },
          { label: "Conversion",       value: `${stats.convRate}%`,               change: "+3.2%", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg> },
          { label: "Leads",            value: stats.leads,                         change: "+14",  icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg> },
        ].map(({ label, value, change, icon }) => (
          <div key={label} className="bg-white border border-gray-100 rounded-lg p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="text-gray-400">{icon}</div>
              <span className="text-xs font-semibold text-emerald-600">{change}</span>
            </div>
            <div className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">{label}</div>
            <div className="serif text-3xl text-gray-900">{value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white border border-gray-100 rounded-lg p-6">
          <div className="mb-6">
            <div className="serif text-lg text-gray-900 mb-1">Engagement Volume</div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Last 7 days activity</div>
          </div>
          <div className="h-48 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-100" />
        </div>

        <div className="bg-white border border-gray-100 rounded-lg p-6">
          <div className="mb-6">
            <div className="serif text-lg text-gray-900 mb-1">Conversion Sources</div>
          </div>
          <div className="space-y-4">
            {[
              { label: "Story Reply", pct: 45, color: "bg-gray-900" },
              { label: "Comment DM", pct: 30, color: "bg-gray-600" },
              { label: "Direct Search", pct: 15, color: "bg-gray-400" },
              { label: "Ads", pct: 10, color: "bg-gray-300" },
            ].map(({ label, pct, color }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-600 font-medium">{label}</span>
                  <span className="text-gray-900 font-semibold">{pct}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
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

// ── Automations Page ───────────────────────────────────────────
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
          <div className="serif text-lg text-gray-900 mb-1">Automations</div>
          <div className="text-xs text-gray-400 uppercase tracking-wide">Configure keyword triggers</div>
        </div>
        <button
          onClick={() => atLimit ? setPage("pricing") : setShowForm(!showForm)}
          className="bg-black hover:bg-gray-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          New Flow
        </button>
      </div>

      {showForm && !atLimit && (
        <div className="bg-white border border-gray-100 rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">If Keyword</label>
              <input
                placeholder='"PRICING"'
                value={form.keyword}
                onChange={e => setForm({ ...form, keyword: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Response</label>
              <textarea
                placeholder="Our starter plan is ₹199/mo..."
                rows={2}
                value={form.reply}
                onChange={e => setForm({ ...form, reply: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 resize-none"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={save}
              disabled={saving}
              className="bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              {saving ? "Saving..." : "Save Rule"}
            </button>
            <button
              onClick={() => { setShowForm(false); setForm({ keyword: "", reply: "" }); }}
              className="text-xs font-semibold text-gray-400 px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {list.length === 0 && !showForm ? (
        <div className="bg-white border border-gray-100 rounded-lg p-20 text-center">
          <p className="serif text-xl text-gray-400 mb-2">No automations yet</p>
          <p className="text-xs text-gray-400">Create keyword rules to auto-send DMs</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map(a => (
            <div key={a.id} className="bg-white border border-gray-100 rounded-lg p-5 flex items-center gap-4 hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white shrink-0">
                <Icons.automations />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-gray-900 uppercase">&quot;{a.keyword}&quot;</span>
                  <span className="text-xs text-gray-400">{a.triggered || 0} hits</span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-1">{a.reply}</p>
              </div>
              <div className="flex items-center gap-2">
                {a.status !== "disabled_by_system" && (
                  <button
                    onClick={() => toggle(a.id, a.active)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${a.active ? "bg-black" : "bg-gray-200"}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${a.active ? "translate-x-5" : ""}`} />
                  </button>
                )}
                <button
                  onClick={() => remove(a.id)}
                  className="p-1.5 text-gray-300 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Leads Page ─────────────────────────────────────────────────
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
        <div className="serif text-lg text-gray-900 mb-1">Leads</div>
        <div className="text-xs text-gray-400 uppercase tracking-wide">Growth captured through automation</div>
      </div>

      {leads.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-lg p-20 text-center">
          <p className="serif text-xl text-gray-400">No leads captured yet</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Handle</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Source</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {leads.map((lead, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">@{lead.recipient}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${lead.status === "sent" ? "bg-gray-100 text-gray-700" : "bg-amber-50 text-amber-700"}`}>
                      {lead.status === "sent" ? "Hot" : "Warm"}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-xs text-gray-500 uppercase">#{lead.keyword}</td>
                  <td className="px-6 py-3 text-xs text-gray-400">{new Date(lead.sent_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Settings Page ──────────────────────────────────────────────
function SettingsPage({ user, profile, onProfileUpdate }) {
  const [name, setName] = useState(user?.user_metadata?.full_name || "");
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
    const { error } = await supabase.auth.updateUser({ password: pw.new });
    if (error) { flash("pw", error.message); }
    else { flash("pw", "Password updated successfully."); setPw({ old: "", new: "", confirm: "" }); }
    setSavingPw(false);
  }

  async function disconnect(id) {
    if (!confirm("Disconnect? Related automations will be paused.")) return;
    await supabase.from("automations").update({ status: "disabled_by_system", active: false }).eq("account_id", id).eq("user_id", user.id);
    await supabase.from("instagram_accounts").update({ status: "disconnected" }).eq("id", id).eq("user_id", user.id);
    setAccounts(a => a.filter(x => x.id !== id));
  }

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div>
        <div className="serif text-lg text-gray-900 mb-1">Console</div>
      </div>

      {/* Profile */}
      <div className="bg-white border border-gray-100 rounded-lg p-6 space-y-4">
        <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Profile</div>
        <form onSubmit={saveProfile} className="space-y-4">
          <div>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full border-0 border-b border-gray-200 px-0 py-2 text-sm focus:outline-none focus:border-black transition-colors"
              placeholder="Demo Creator"
            />
          </div>
          {msg.profile && <div className="text-xs text-emerald-600">{msg.profile}</div>}
          <button
            type="submit"
            disabled={savingProfile}
            className="bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            {savingProfile ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Security */}
      <div className="bg-white border border-gray-100 rounded-lg p-6 space-y-4">
        <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Security</div>
        <form onSubmit={savePassword} className="space-y-4">
          {[
            { key: "old", label: "Current Password", ph: "••••••••" },
            { key: "new", label: "New Password", ph: "••••••••" },
            { key: "confirm", label: "Confirm Password", ph: "••••••••" },
          ].map(({ key, label, ph }) => (
            <div key={key} className="relative">
              <input
                type={showPw[key] ? "text" : "password"}
                required={key !== "old"}
                minLength={key === "new" ? 6 : 1}
                placeholder={ph}
                value={pw[key]}
                onChange={e => setPw(p => ({ ...p, [key]: e.target.value }))}
                className="w-full border-0 border-b border-gray-200 px-0 py-2 pr-8 text-sm focus:outline-none focus:border-black transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPw(s => ({ ...s, [key]: !s[key] }))}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                {showPw[key] ? <Icons.eye /> : <Icons.eyeOff />}
              </button>
            </div>
          ))}
          {msg.pw && (
            <div className={`text-xs ${msg.pw.includes("successfully") ? "text-emerald-600" : "text-red-600"}`}>{msg.pw}</div>
          )}
          <button
            type="submit"
            disabled={savingPw}
            className="bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            {savingPw ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      {/* Connected Accounts */}
      <div className="bg-white border border-gray-100 rounded-lg p-6 space-y-4">
        <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Instagram Accounts</div>
        {accounts.length === 0 ? (
          <p className="text-sm text-gray-400">No accounts connected</p>
        ) : (
          <div className="space-y-2">
            {accounts.map(acc => (
              <div key={acc.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  IG
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">{acc.handle}</div>
                  <div className="text-xs text-gray-400">Connected</div>
                </div>
                <button
                  onClick={() => disconnect(acc.id)}
                  className="text-xs font-semibold text-gray-400 hover:text-gray-700 px-3 py-1 rounded-lg hover:bg-white transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Root ───────────────────────────────────────────────────────
export default function Dashboard() {
  const [page, setPage] = useState("overview");
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async uid => {
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
        <Sidebar page={page} setPage={setPage} email={user.email} plan={plan} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Topbar page={page} user={user} />
          <main className="flex-1 overflow-y-auto">
            {page === "overview" && <OverviewPage userId={user.id} />}
            {page === "automations" && <AutomationsPage userId={user.id} plan={plan} setPage={setPage} />}
            {page === "leads" && <LeadsPage userId={user.id} />}
            {page === "settings" && <SettingsPage user={user} profile={profile} onProfileUpdate={() => loadProfile(user.id)} />}
          </main>
        </div>
      </div>
    </>
  );
}
