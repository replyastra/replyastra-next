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
  @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
  .serif { font-family: 'Libre Baskerville', serif; }
  .plan-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
  .plan-card:hover { transform: translateY(-8px); box-shadow: 0 20px 50px rgba(0,0,0,0.08); }
  * { -webkit-tap-highlight-color: transparent; }
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`;

function Spinner({ full }) {
  return (
    <div className={\`flex items-center justify-center \${full ? "h-screen bg-white" : "py-24"}\`}>
      <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
    </div>
  );
}

const Icons = {
  overview:    () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  automations: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>,
  leads:       () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>,
  settings:    () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>,
  pricing:     () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"/></svg>,
  logout:      () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>,
  search:      () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35"/></svg>,
  eye:         () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>,
  eyeOff:      () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>,
  menu:        () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>,
  close:       () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>,
  check:       () => <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>,
  x:           () => <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>,
  crown:       () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 16L3 6l5.5 4L12 3l3.5 7L21 6l-2 10H5z"/></svg>,
  arrowRight:  () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>,
  info:        () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
};

const NAV = [
  { id: "overview",    label: "Overview",    Icon: Icons.overview    },
  { id: "automations", label: "Automations", Icon: Icons.automations },
  { id: "leads",       label: "Leads",       Icon: Icons.leads       },
  { id: "pricing",     label: "Upgrade",     Icon: Icons.pricing     },
  { id: "settings",    label: "Settings",    Icon: Icons.settings    },
];

function Sidebar({ page, setPage, plan, monthlyDMs, open, setOpen }) {
  const [search, setSearch] = useState("");

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const lim = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  const dmPct = Math.min(Math.round((monthlyDMs / lim.dms) * 100), 100);
  const filteredNav = search.trim()
    ? NAV.filter(n => n.label.toLowerCase().includes(search.toLowerCase()))
    : NAV;

  const SidebarContent = () => (
    <>
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0">
        <img src="https://drive.google.com/uc?export=view&id=1eSoaEk0AOQUph0sMB80RsO6ck3rvVW7T" alt="ReplyAstra" className="h-7 w-auto brightness-0" />
        <button onClick={() => setOpen(false)} className="lg:hidden p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-50">
          <Icons.close />
        </button>
      </div>
      <div className="px-4 pt-4 pb-2 shrink-0">
        <div className="relative">
          <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs border-0 bg-gray-50 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-200 text-gray-600 placeholder-gray-400" />
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"><Icons.search /></div>
        </div>
      </div>
      <nav className="flex-1 px-4 py-2 overflow-y-auto no-scrollbar">
        {filteredNav.map(({ id, label, Icon }) => (
          <button key={id} onClick={() => { setPage(id); setOpen?.(false); }}
            className={\`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors mb-0.5 \${
              page === id ? "bg-black text-white"
              : id === "pricing" ? "text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-dashed border-gray-200"
              : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }\`}>
            <Icon />
            {label}
            {id === "pricing" && plan !== "pro" && page !== "pricing" && (
              <span className="ml-auto text-[10px] font-black bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">PRO</span>
            )}
          </button>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-gray-100 space-y-2 shrink-0">
        <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold px-3">Usage</div>
        <div className="bg-gray-50 rounded-xl px-3 py-2.5">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-gray-600 font-semibold">{PLAN_NAMES[plan]}</span>
            <span className="text-gray-400">{PLAN_PRICES[plan]}/mo</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className={\`h-full rounded-full transition-all duration-700 \${dmPct >= 90 ? "bg-red-500" : dmPct >= 70 ? "bg-amber-500" : "bg-black"}\`} style={{ width: \`\${dmPct}%\` }} />
          </div>
          <div className="text-xs text-gray-400 mt-1.5">{monthlyDMs.toLocaleString()} / {lim.dms.toLocaleString()} DMs</div>
          {dmPct >= 80 && plan !== "pro" && (
            <button onClick={() => { setPage("pricing"); setOpen?.(false); }}
              className="mt-2 w-full text-xs font-bold text-white bg-gray-900 rounded-lg py-1.5 hover:bg-gray-700 transition-colors">
              Upgrade Plan
            </button>
          )}
        </div>
        <button onClick={logout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors">
          <Icons.logout />Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm" onClick={() => setOpen(false)} />}
      <aside className={\`fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-100 flex flex-col z-50 transition-transform duration-300 ease-in-out lg:hidden \${open ? "translate-x-0 shadow-2xl" : "-translate-x-full"}\`}>
        <SidebarContent />
      </aside>
      <aside className="hidden lg:flex w-48 bg-white border-r border-gray-100 flex-col h-screen sticky top-0 shrink-0">
        <SidebarContent />
      </aside>
    </>
  );
}

function Topbar({ page, user, plan, setOpen, setPage }) {
  const titles = { overview: "Welcome", automations: "Flows", leads: "Captured Growth", pricing: "Plans", settings: "Console" };
  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there";
  return (
    <header className="bg-white border-b border-gray-100 px-4 lg:px-8 py-3 lg:py-4 shrink-0">
      <div className="flex items-center justify-between mb-1.5 relative">
        <button onClick={() => setOpen(true)} className="lg:hidden p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors" aria-label="Open menu">
          <Icons.menu />
        </button>
        <div className="lg:hidden absolute left-1/2 -translate-x-1/2">
          <img src="https://drive.google.com/uc?export=view&id=1eSoaEk0AOQUph0sMB80RsO6ck3rvVW7T" alt="ReplyAstra" className="h-6 w-auto brightness-0" />
        </div>
        <div className="flex items-center gap-2 ml-auto">
          {plan !== "pro" && (
            <button onClick={() => setPage("pricing")} className="hidden sm:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-gray-900 text-white hover:bg-gray-700 transition-colors">
              <Icons.crown />Upgrade
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
              {name.slice(0, 2).toUpperCase()}
            </div>
            <div className="text-xs hidden sm:block">
              <div className="font-semibold text-gray-900 truncate max-w-[110px]">{name}</div>
              <div className="text-gray-400">{PLAN_NAMES[plan]} plan</div>
            </div>
          </div>
        </div>
      </div>
      <h1 className="serif text-2xl sm:text-3xl lg:text-4xl text-gray-900 font-normal italic leading-tight">
        {titles[page] || "Welcome"}{page === "overview" && \`, \${name}\`}
      </h1>
    </header>
  );
}

function OverviewPage({ userId, plan, setPage }) {
  const [stats, setStats] = useState({ sentReplies: 0, automationHits: 0, convRate: "0.0", leads: 0 });
  const [bars, setBars] = useState([]);
  const [conversion, setConversion] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [{ count: totalDMs }, { count: activeAutos }, { count: leads }, { count: success }] = await Promise.all([
        supabase.from("dm_logs").select("*", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("automations").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("status", "active"),
        supabase.from("dm_logs").select("*", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("dm_logs").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("status", "sent"),
      ]);
      const convRate = totalDMs > 0 ? ((success / totalDMs) * 100).toFixed(1) : "0.0";
      setStats({ sentReplies: totalDMs || 0, automationHits: activeAutos || 0, convRate, leads: leads || 0 });
      const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d; });
      const barData = await Promise.all(days.map(async d => {
        const s = new Date(d); s.setHours(0, 0, 0, 0);
        const e = new Date(d); e.setHours(23, 59, 59, 999);
        const { count } = await supabase.from("dm_logs").select("*", { count: "exact", head: true }).eq("user_id", userId).gte("sent_at", s.toISOString()).lte("sent_at", e.toISOString());
        return { day: d.toLocaleDateString("en", { weekday: "short" }), dms: count || 0 };
      }));
      setBars(barData);
      const commentCount = totalDMs; const total = commentCount || 1;
      setConversion([
        { label: "Story Reply", pct: 0, color: "bg-gray-900" },
        { label: "Comment DM",  pct: Math.round((commentCount / total) * 100), color: "bg-gray-500" },
      ]);
      setLoading(false);
    }
    load();
  }, [userId]);

  if (loading) return <Spinner />;
  const maxBar = Math.max(...bars.map(b => b.dms), 1);

  return (
    <div className="p-4 lg:p-8 space-y-5 max-w-7xl mx-auto">
      {plan !== "pro" && (
        <div className="bg-gray-900 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-white shrink-0"><Icons.crown /></span>
            <p className="text-white text-xs font-medium truncate">
              {plan === "free" ? "Unlock 10,000 DMs, 50 automations & Pro analytics" : "Upgrade to Pro for 10x capacity & full analytics"}
            </p>
          </div>
          <button onClick={() => setPage("pricing")} className="shrink-0 text-xs font-bold text-gray-900 bg-white px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1">
            Upgrade <Icons.arrowRight />
          </button>
        </div>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Sent Replies", value: stats.sentReplies.toLocaleString(), change: "+24%", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg> },
          { label: "Active Flows", value: stats.automationHits, change: "+18%", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> },
          { label: "Conversion",   value: \`\${stats.convRate}%\`, change: "+3.2%", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg> },
          { label: "Leads",        value: stats.leads, change: "+14", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg> },
        ].map(({ label, value, change, icon }) => (
          <div key={label} className="bg-white border border-gray-100 rounded-xl p-4 lg:p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-3"><div className="text-gray-400">{icon}</div><span className="text-xs font-semibold text-emerald-600">{change}</span></div>
            <div className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">{label}</div>
            <div className="serif text-2xl lg:text-3xl text-gray-900">{value}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl p-5 lg:p-6">
          <div className="mb-5"><div className="serif text-lg text-gray-900 mb-0.5">Engagement Volume</div><div className="text-xs text-gray-400 uppercase tracking-wide">Last 7 days activity</div></div>
          <div className="flex items-end gap-1.5 sm:gap-2 h-36 sm:h-44">
            {bars.map((b, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                {b.dms > 0 && <span className="text-xs text-gray-400 hidden sm:block">{b.dms}</span>}
                <div className="w-full bg-gray-900 hover:bg-gray-700 rounded-t-lg transition-all cursor-default" style={{ height: \`\${Math.max((b.dms / maxBar) * 130, b.dms > 0 ? 4 : 0)}px\` }} title={\`\${b.dms} DMs\`} />
                <span className="text-xs text-gray-400">{b.day.slice(0, 2)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-5 lg:p-6">
          <div className="mb-5"><div className="serif text-lg text-gray-900 mb-0.5">Conversion Sources</div><div className="text-xs text-gray-400 uppercase tracking-wide">Traffic breakdown</div></div>
          <div className="space-y-4">
            {conversion.map(({ label, pct, color }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1.5"><span className="text-gray-600 font-medium">{label}</span><span className="text-gray-900 font-semibold">{pct}%</span></div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className={\`h-full \${color} rounded-full transition-all duration-700\`} style={{ width: \`\${pct}%\` }} /></div>
              </div>
            ))}
          </div>
          {!PLAN_LIMITS[plan]?.analytics && (
            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400 mb-2">Detailed analytics on Pro</p>
              <button onClick={() => setPage("pricing")} className="text-xs font-bold text-white bg-black px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors">Unlock Analytics</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
    <div className="p-4 lg:p-8 space-y-5 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-3">
        <div><div className="serif text-lg text-gray-900 mb-0.5">Automations</div><div className="text-xs text-gray-400 uppercase tracking-wide">{activeCount} / {lim.automations} rules used</div></div>
        <button onClick={() => atLimit ? setPage("pricing") : setShowForm(!showForm)}
          className={\`shrink-0 text-xs font-semibold px-4 py-2 rounded-lg transition-colors \${atLimit ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100" : "bg-black hover:bg-gray-800 text-white"}\`}>
          {atLimit ? "Upgrade to Add More" : showForm ? "Cancel" : "New Flow"}
        </button>
      </div>
      {atLimit && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-3">
          <div><p className="text-sm font-semibold text-amber-800">Automation limit reached</p><p className="text-xs text-amber-600 mt-0.5">Upgrade your plan to create more keyword flows</p></div>
          <button onClick={() => setPage("pricing")} className="shrink-0 text-xs font-bold bg-amber-600 text-white px-3 py-1.5 rounded-lg hover:bg-amber-700 transition-colors">Upgrade</button>
        </div>
      )}
      {showForm && !atLimit && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <div className="text-sm font-semibold text-gray-800">Create New Flow</div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Trigger Keyword</label>
              <input placeholder='"PRICING"' value={form.keyword} onChange={e => setForm({ ...form, keyword: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Auto Response</label>
              <textarea placeholder="Our starter plan is ₹199/mo..." rows={2} value={form.reply} onChange={e => setForm({ ...form, reply: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 resize-none" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={save} disabled={saving || !form.keyword.trim() || !form.reply.trim()} className="bg-black hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">{saving ? "Saving..." : "Save Rule"}</button>
            <button onClick={() => { setShowForm(false); setForm({ keyword: "", reply: "" }); }} className="text-xs font-semibold text-gray-400 px-4 py-2 rounded-lg hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      )}
      {list.length === 0 && !showForm ? (
        <div className="bg-white border border-gray-100 rounded-xl p-12 sm:p-20 text-center">
          <p className="serif text-xl text-gray-400 mb-2">No automations yet</p>
          <p className="text-xs text-gray-400">Create keyword rules to auto-send DMs when someone comments</p>
          <button onClick={() => setShowForm(true)} className="mt-4 text-xs font-semibold bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">Create First Flow</button>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map(a => (
            <div key={a.id} className="bg-white border border-gray-100 rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 hover:shadow-sm transition-shadow">
              <div className={\`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-white shrink-0 \${a.active ? "bg-black" : "bg-gray-300"}\`}><Icons.automations /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="text-sm font-bold text-gray-900 uppercase">&quot;{a.keyword}&quot;</span>
                  <span className="text-xs text-gray-400">{a.triggered || 0} hits</span>
                  {a.status === "disabled_by_system" && <span className="text-xs font-semibold bg-red-50 text-red-600 px-1.5 py-0.5 rounded-full">Disabled</span>}
                  {a.status === "paused_by_user" && <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">Paused</span>}
                </div>
                <p className="text-xs text-gray-500 truncate">{a.reply}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {a.status !== "disabled_by_system" && (
                  <button onClick={() => toggle(a.id, a.active)} className={\`relative w-10 h-5 rounded-full transition-colors \${a.active ? "bg-black" : "bg-gray-200"}\`} aria-label={a.active ? "Pause" : "Activate"}>
                    <span className={\`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform \${a.active ? "translate-x-5" : ""}\`} />
                  </button>
                )}
                <button onClick={() => remove(a.id)} className="p-1.5 text-gray-300 hover:text-red-400 rounded-lg hover:bg-red-50 transition-colors" aria-label="Delete">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
      setLeads(data || []); setLoading(false);
    }
    load();
  }, [userId]);

  if (loading) return <Spinner />;

  return (
    <div className="p-4 lg:p-8 space-y-5 max-w-7xl mx-auto">
      <div><div className="serif text-lg text-gray-900 mb-0.5">Leads</div><div className="text-xs text-gray-400 uppercase tracking-wide">Growth captured through automation</div></div>
      {leads.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-12 sm:p-20 text-center"><p className="serif text-xl text-gray-400 mb-2">No leads captured yet</p><p className="text-xs text-gray-400">Leads appear here once automations start sending DMs</p></div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <div className="sm:hidden divide-y divide-gray-50">
            {leads.map((lead, i) => (
              <div key={i} className="px-4 py-3.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-900">@{lead.recipient}</span>
                  <span className={\`text-xs font-semibold px-2 py-0.5 rounded-full \${lead.status === "sent" ? "bg-gray-100 text-gray-700" : "bg-amber-50 text-amber-700"}\`}>{lead.status === "sent" ? "Hot" : "Warm"}</span>
                </div>
                <div className="flex items-center justify-between"><span className="text-xs text-gray-500 uppercase font-medium">#{lead.keyword}</span><span className="text-xs text-gray-400">{new Date(lead.sent_at).toLocaleDateString()}</span></div>
              </div>
            ))}
          </div>
          <table className="w-full hidden sm:table">
            <thead className="border-b border-gray-100 bg-gray-50/50"><tr>{["Handle","Status","Source","Date"].map(h => <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-50">
              {leads.map((lead, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">@{lead.recipient}</td>
                  <td className="px-6 py-3"><span className={\`text-xs font-semibold px-2.5 py-1 rounded-full \${lead.status === "sent" ? "bg-gray-100 text-gray-700" : "bg-amber-50 text-amber-700"}\`}>{lead.status === "sent" ? "Hot" : "Warm"}</span></td>
                  <td className="px-6 py-3 text-xs text-gray-500 uppercase font-medium">#{lead.keyword}</td>
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

function PricingPage({ plan, user }) {
  const plans = [
    { id: "free", name: "Free", price: "₹0", period: "forever", description: "Get started with automation",
      features: [{ text: "3 keyword automations", ok: true }, { text: "1 Instagram account", ok: true }, { text: "500 DMs / month", ok: true }, { text: "Basic lead tracking", ok: true }, { text: "Analytics dashboard", ok: false }, { text: "Priority support", ok: false }],
      cta: "Free Forever", highlight: false, paymentLink: null },
    { id: "starter", name: "Starter", price: "₹199", period: "/ month", description: "For creators growing fast",
      features: [{ text: "10 keyword automations", ok: true }, { text: "3 Instagram accounts", ok: true }, { text: "3,000 DMs / month", ok: true }, { text: "Advanced lead tracking", ok: true }, { text: "Analytics dashboard", ok: false }, { text: "Email support", ok: true }],
      cta: "Get Starter", highlight: false, paymentLink: "https://rzp.io/l/replyastra-starter" },
    { id: "pro", name: "Pro", price: "₹399", period: "/ month", description: "For serious creators & brands",
      features: [{ text: "50 keyword automations", ok: true }, { text: "10 Instagram accounts", ok: true }, { text: "10,000 DMs / month", ok: true }, { text: "Advanced lead tracking", ok: true }, { text: "Full analytics", ok: true }, { text: "Priority support", ok: true }],
      cta: "Get Pro", highlight: true, paymentLink: "https://rzp.io/l/replyastra-pro" },
  ];

  function handleUpgrade(p) {
    if (p.id === plan || !p.paymentLink) return;
    window.open(\`\${p.paymentLink}?prefill_email=\${encodeURIComponent(user?.email || "")}\`, "_blank");
  }

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-6 lg:mb-8"><div className="serif text-lg text-gray-900 mb-0.5">Choose your plan</div><div className="text-xs text-gray-400 uppercase tracking-wide">Upgrade anytime · Cancel anytime</div></div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        {plans.map(p => {
          const isCurrent = p.id === plan;
          return (
            <div key={p.id} className={\`plan-card relative rounded-2xl border p-5 lg:p-6 flex flex-col \${p.highlight ? "bg-gray-900 border-gray-900 shadow-xl" : "bg-white border-gray-200"}\`}>
              {p.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap"><span className="bg-white text-gray-900 text-xs font-black px-3 py-1 rounded-full shadow border border-gray-200">MOST POPULAR</span></div>}
              {isCurrent && <div className="absolute -top-3 right-4"><span className="bg-emerald-500 text-white text-xs font-black px-3 py-1 rounded-full">CURRENT</span></div>}
              <div className="mb-5">
                <div className={\`text-xs font-black uppercase tracking-widest mb-2 \${p.highlight ? "text-gray-400" : "text-gray-400"}\`}>{p.name}</div>
                <div className="flex items-end gap-1 mb-1.5">
                  <span className={\`serif text-3xl lg:text-4xl \${p.highlight ? "text-white" : "text-gray-900"}\`}>{p.price}</span>
                  <span className={\`text-xs mb-1.5 \${p.highlight ? "text-gray-400" : "text-gray-400"}\`}>{p.period}</span>
                </div>
                <p className={\`text-xs \${p.highlight ? "text-gray-400" : "text-gray-500"}\`}>{p.description}</p>
              </div>
              <ul className="space-y-2.5 flex-1 mb-6">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className={\`shrink-0 w-4 h-4 rounded-full flex items-center justify-center \${f.ok ? p.highlight ? "bg-white/15" : "bg-gray-100" : "opacity-30"}\`}>
                      {f.ok ? <span className={p.highlight ? "text-white" : "text-gray-700"}><Icons.check /></span> : <span className="text-gray-400"><Icons.x /></span>}
                    </span>
                    <span className={\`text-xs \${f.ok ? p.highlight ? "text-gray-200" : "text-gray-700" : p.highlight ? "text-gray-600" : "text-gray-300"}\`}>{f.text}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => handleUpgrade(p)} disabled={isCurrent}
                className={\`w-full py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 \${isCurrent ? p.highlight ? "bg-white/10 text-gray-400 cursor-default" : "bg-gray-100 text-gray-400 cursor-default" : p.highlight ? "bg-white text-gray-900 hover:bg-gray-100" : "bg-gray-900 text-white hover:bg-gray-700"}\`}>
                {isCurrent ? "Current Plan" : p.cta}
              </button>
            </div>
          );
        })}
      </div>
      <div className="mt-6 bg-white border border-gray-100 rounded-xl p-5">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Payment & Billing</div>
        <div className="space-y-2">
          {["Payments are processed securely via Razorpay","Plans activate instantly after successful payment","To cancel, email support@replyastra.online from your registered address","No refunds for partial months after cancellation"].map((t, i) => (
            <div key={i} className="flex items-start gap-2"><span className="text-gray-400 mt-0.5 shrink-0"><Icons.info /></span><p className="text-xs text-gray-500">{t}</p></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SettingsPage({ user, profile, onProfileUpdate, setPage }) {
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
    supabase.from("instagram_accounts").select("*").eq("user_id", user.id).neq("status", "disconnected").order("connected_at", { ascending: false }).then(({ data }) => setAccounts(data || []));
  }, [user.id]);

  const flash = (key, text) => { setMsg(m => ({ ...m, [key]: text })); setTimeout(() => setMsg(m => ({ ...m, [key]: "" })), 3500); };

  async function saveProfile(e) {
    e.preventDefault(); if (!name.trim()) return;
    setSavingProfile(true);
    await supabase.auth.updateUser({ data: { full_name: name.trim() } });
    await supabase.from("profiles").update({ full_name: name.trim() }).eq("id", user.id);
    onProfileUpdate?.(); flash("profile", "Profile updated successfully."); setSavingProfile(false);
  }

  async function savePassword(e) {
    e.preventDefault();
    if (pw.new.length < 6) { flash("pw", "Password must be at least 6 characters."); return; }
    if (pw.new !== pw.confirm) { flash("pw", "New passwords do not match."); return; }
    setSavingPw(true);
    const { error } = await supabase.auth.updateUser({ password: pw.new });
    if (error) flash("pw", error.message); else { flash("pw", "Password updated successfully."); setPw({ old: "", new: "", confirm: "" }); }
    setSavingPw(false);
  }

  async function disconnect(id) {
    if (!confirm("Disconnect? Related automations will be paused.")) return;
    await supabase.from("automations").update({ status: "disabled_by_system", active: false }).eq("account_id", id).eq("user_id", user.id);
    await supabase.from("instagram_accounts").update({ status: "disconnected" }).eq("id", id).eq("user_id", user.id);
    setAccounts(a => a.filter(x => x.id !== id));
  }

  const settingsTabs = [{ id: "profile", label: "Profile" }, { id: "security", label: "Security" }, { id: "accounts", label: "IG Accounts" }, { id: "billing", label: "Billing" }];

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-3xl mx-auto">
      <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar">
        {settingsTabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={\`px-3 sm:px-4 py-2.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap \${tab === t.id ? "border-black text-black" : "border-transparent text-gray-400 hover:text-gray-700"}\`}>{t.label}</button>
        ))}
      </div>

      {tab === "profile" && (
        <div className="bg-white border border-gray-100 rounded-xl p-5 lg:p-6 space-y-5">
          <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Profile</div>
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center text-base font-bold shrink-0">{(name || email).slice(0, 2).toUpperCase()}</div>
            <div className="min-w-0"><div className="text-sm font-semibold text-gray-900 truncate">{name || "Your Name"}</div><div className="text-xs text-gray-400 truncate">{email}</div></div>
          </div>
          <form onSubmit={saveProfile} className="space-y-4">
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Full Name</label><input value={name} onChange={e => setName(e.target.value)} required placeholder="Full Name" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300" /></div>
            <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Email</label><input value={email} disabled className="w-full border border-gray-100 bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-400 cursor-not-allowed" /></div>
            {msg.profile && <div className="text-xs text-emerald-600 font-medium">{msg.profile}</div>}
            <button type="submit" disabled={savingProfile} className="bg-black hover:bg-gray-800 disabled:bg-gray-300 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">{savingProfile ? "Saving..." : "Save Changes"}</button>
          </form>
        </div>
      )}

      {tab === "security" && (
        <div className="bg-white border border-gray-100 rounded-xl p-5 lg:p-6 space-y-4">
          <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Change Password</div>
          <form onSubmit={savePassword} className="space-y-4">
            {[{ key: "old", label: "Current Password", ph: "Enter current password" }, { key: "new", label: "New Password", ph: "Minimum 6 characters" }, { key: "confirm", label: "Confirm Password", ph: "Repeat new password" }].map(({ key, label, ph }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{label}</label>
                <div className="relative">
                  <input type={showPw[key] ? "text" : "password"} required={key !== "old"} minLength={key === "new" ? 6 : 1} placeholder={ph} value={pw[key]} onChange={e => setPw(p => ({ ...p, [key]: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300" />
                  <button type="button" onClick={() => setShowPw(s => ({ ...s, [key]: !s[key] }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">{showPw[key] ? <Icons.eye /> : <Icons.eyeOff />}</button>
                </div>
              </div>
            ))}
            {msg.pw && <div className={\`text-xs font-medium \${msg.pw.includes("successfully") ? "text-emerald-600" : "text-red-600"}\`}>{msg.pw}</div>}
            <button type="submit" disabled={savingPw} className="bg-black hover:bg-gray-800 disabled:bg-gray-300 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">{savingPw ? "Updating..." : "Update Password"}</button>
          </form>
        </div>
      )}

      {tab === "accounts" && (
        <div className="bg-white border border-gray-100 rounded-xl p-5 lg:p-6 space-y-4">
          <div className="flex items-center justify-between"><div className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Instagram Accounts</div><span className="text-xs text-gray-400">{accounts.length} / {PLAN_LIMITS[plan].accounts}</span></div>
          {accounts.length === 0 ? (
            <div className="text-center py-8"><p className="text-sm text-gray-400 mb-1">No accounts connected</p><p className="text-xs text-gray-300">Connect via the Instagram integration flow</p></div>
          ) : (
            <div className="space-y-2">
              {accounts.map(acc => (
                <div key={acc.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-9 h-9 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">IG</div>
                  <div className="flex-1 min-w-0"><div className="text-sm font-semibold text-gray-900 truncate">{acc.handle}</div><div className="text-xs text-gray-400">Connected</div></div>
                  <button onClick={() => disconnect(acc.id)} className="text-xs font-semibold text-red-500 hover:text-red-700 px-2.5 sm:px-3 py-1.5 rounded-lg hover:bg-white border border-red-200 transition-colors shrink-0">Disconnect</button>
                </div>
              ))}
            </div>
          )}
          {accounts.length >= PLAN_LIMITS[plan].accounts && plan !== "pro" && (
            <div className="bg-amber-50 rounded-xl p-3 flex items-center justify-between gap-2">
              <p className="text-xs text-amber-700">Account limit reached for your plan</p>
              <button onClick={() => setPage("pricing")} className="text-xs font-bold text-white bg-amber-600 px-3 py-1.5 rounded-lg hover:bg-amber-700 transition-colors shrink-0">Upgrade</button>
            </div>
          )}
        </div>
      )}

      {tab === "billing" && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-100 rounded-xl p-5 lg:p-6">
            <div className="flex items-start justify-between mb-4 gap-3">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Current Plan</p>
                <h2 className="text-2xl font-black text-gray-900">{PLAN_NAMES[plan]}</h2>
                <p className="text-sm text-gray-500 mt-1">{plan === "free" ? "Free forever" : \`\${PLAN_PRICES[plan]}/month · Renews automatically\`}</p>
              </div>
              <div className={\`shrink-0 px-3 py-1.5 rounded-xl text-sm font-black \${plan === "pro" ? "bg-gray-900 text-white" : plan === "starter" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600"}\`}>{PLAN_NAMES[plan]}</div>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100">
              {[{ l: "DM Limit", v: PLAN_LIMITS[plan].dms.toLocaleString() + "/mo" }, { l: "Automations", v: PLAN_LIMITS[plan].automations + " rules" }, { l: "Accounts", v: PLAN_LIMITS[plan].accounts + (PLAN_LIMITS[plan].accounts > 1 ? " accounts" : " account") }].map(({ l, v }) => (
                <div key={l} className="text-center bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-500">{l}</p><p className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5">{v}</p></div>
              ))}
            </div>
            {plan !== "pro" && (
              <button onClick={() => setPage("pricing")} className="mt-4 w-full bg-black text-white text-sm font-bold py-2.5 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                <Icons.crown /> Upgrade Plan
              </button>
            )}
          </div>
          {plan !== "free" && (
            <div className="bg-white border border-gray-100 rounded-xl p-5 lg:p-6">
              <p className="font-bold text-gray-900 mb-1.5">Cancel subscription</p>
              <p className="text-sm text-gray-500 mb-4">Your plan remains active until the end of the billing period. No refunds for partial months.</p>
              <button onClick={() => window.location.href = \`mailto:support@replyastra.online?subject=Cancel Subscription&body=Email: \${email}\`} className="text-sm font-bold text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-4 py-2 rounded-lg transition-colors">Request Cancellation</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [page, setPage] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [monthlyDMs, setMonthlyDMs] = useState(0);
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
      const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
      const { count } = await supabase.from("dm_logs").select("*", { count: "exact", head: true }).eq("user_id", session.user.id).gte("sent_at", monthStart.toISOString());
      setMonthlyDMs(count || 0);
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
        <Sidebar page={page} setPage={setPage} plan={plan} monthlyDMs={monthlyDMs} open={sidebarOpen} setOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Topbar page={page} user={user} plan={plan} setOpen={setSidebarOpen} setPage={setPage} />
          <main className="flex-1 overflow-y-auto">
            {page === "overview"    && <OverviewPage    userId={user.id} plan={plan} setPage={setPage} />}
            {page === "automations" && <AutomationsPage userId={user.id} plan={plan} setPage={setPage} />}
            {page === "leads"       && <LeadsPage       userId={user.id} />}
            {page === "pricing"     && <PricingPage     plan={plan} user={user} />}
            {page === "settings"    && <SettingsPage    user={user} profile={profile} onProfileUpdate={() => loadProfile(user.id)} setPage={setPage} />}
          </main>
        </div>
      </div>
    </>
  );
}
