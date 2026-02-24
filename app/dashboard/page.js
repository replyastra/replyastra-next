"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const PLAN_LIMITS = {
  free: { automations: 3, accounts: 1, dms: 500, analytics: 7, contacts: 10, ai: 0, price: 0 },
  starter: { automations: 10, accounts: 3, dms: 3000, analytics: 30, contacts: 999999, ai: 20, price: 199 },
  pro: { automations: 50, accounts: 10, dms: 10000, analytics: 90, contacts: 999999, ai: 150, price: 399 },
};

const PLAN_NAMES = { free: "Free", starter: "Starter", pro: "Pro" };

const TRANSLATIONS = {
  en: {
    welcome: "Welcome", overview: "Overview", automations: "Automations", leads: "Leads",
    settings: "Settings", logout: "Logout", usage: "Usage", sentReplies: "Sent Replies",
    automationHits: "Automation Hits", conversion: "Conversion", engagementVolume: "Engagement Volume",
    conversionSources: "Conversion Sources", storyReply: "Story Reply", commentDM: "Comment DM",
    profile: "Profile", security: "Security", instagramAccounts: "Instagram Accounts",
    billing: "Billing", language: "Language", currentPlan: "Current Plan",
    upgradePlan: "Upgrade", cancelSubscription: "Cancel subscription", monthlyDMs: "monthly DMs",
  },
  kn: {
    welcome: "ಸ್ವಾಗತ", overview: "ಅವಲೋಕನ", automations: "ಸ್ವಯಂಚಾಲನೆಗಳು", leads: "ಲೀಡ್ಸ್",
    settings: "ಸೆಟ್ಟಿಂಗ್ಗಳು", logout: "ಲಾಗ್ಔಟ್", usage: "ಬಳಕೆ",
    sentReplies: "ಕಳುಹಿಸಿದ ಪ್ರತಿಕ್ರಿಯೆಗಳು", automationHits: "ಸ್ವಯಂಚಾಲನೆ ಹಿಟ್ಗಳು",
    conversion: "ಪರಿವರ್ತನೆ", engagementVolume: "ತೊಡಗಿಸಿಕೊಳ್ಳುವಿಕೆ ಪ್ರಮಾಣ",
    conversionSources: "ಪರಿವರ್ತನೆ ಮೂಲಗಳು", storyReply: "ಕಥೆ ಪ್ರತ್ಯುತ್ತರ",
    commentDM: "ಕಾಮೆಂಟ್ DM", profile: "ಪ್ರೊಫೈಲ್", security: "ಸುರಕ್ಷತೆ",
    instagramAccounts: "ಇನ್ಸ್ಟಾಗ್ರಾಮ್ ಖಾತೆಗಳು", billing: "ಬಿಲ್ಲಿಂಗ್", language: "ಭಾಷೆ",
    currentPlan: "ಪ್ರಸ್ತುತ ಯೋಜನೆ", upgradePlan: "ನವೀಕರಿಸಿ",
    cancelSubscription: "ರದ್ದುಗೊಳಿಸಿ", monthlyDMs: "ಮಾಸಿಕ DMs",
  },
};

function Spinner({ full }) {
  return <div className={`flex items-center justify-center ${full ? "h-screen bg-gray-50" : "py-24"}`}><div className="w-10 h-10 border-3 border-gray-200 border-t-blue-600 rounded-full animate-spin" /></div>;
}

const Icons = {
  overview: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>,
  automations: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>,
  leads: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>,
  settings: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>,
  logout: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>,
  search: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35"/></svg>,
  menu: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>,
  crown: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3l3.057 11.834c.17.656.834 1.166 1.518 1.166h4.85c.684 0 1.348-.51 1.518-1.166L19 3m-7 13v5m-4 0h8"/></svg>,
  trendUp: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>,
};

function Sidebar({ page, setPage, plan, monthlyDMs, open, setOpen, lang }) {
  const [search, setSearch] = useState("");
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const lim = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  const dmPct = Math.min(Math.round((monthlyDMs / lim.dms) * 100), 100);

  const NAV = [
    { id: "overview", label: t.overview, Icon: Icons.overview },
    { id: "automations", label: t.automations, Icon: Icons.automations },
    { id: "leads", label: t.leads, Icon: Icons.leads },
    { id: "settings", label: t.settings, Icon: Icons.settings },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6 flex items-center justify-center border-b border-gray-100">
        <img 
          src="https://drive.google.com/uc?export=view&id=1CkhHHcGFCr6BmfoE2TylgYJRlJQkcDEC" 
          alt="ReplyAstra" 
          className="h-8 w-auto object-contain"
        />
      </div>
      
      <div className="p-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icons.search />
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-3 space-y-1">
        {NAV.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => { setPage(id); setOpen?.(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              page === id 
                ? "bg-blue-50 text-blue-600" 
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Icon />{label}
          </button>
        ))}
      </nav>
      
      <div className="p-4 space-y-3 border-t border-gray-100">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">{t.usage}</div>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-gray-900">{PLAN_NAMES[plan]}</span>
            <span className="text-xs text-gray-500">₹{lim.price}/mo</span>
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500" 
                style={{ width: `${dmPct}%` }} 
              />
            </div>
            <div className="text-xs text-gray-600">{monthlyDMs.toLocaleString()} / {lim.dms.toLocaleString()} {t.monthlyDMs}</div>
          </div>
        </div>
        
        <button 
          onClick={() => { setPage("pricing"); setOpen?.(false); }} 
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold py-3 px-4 rounded-lg transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 flex items-center justify-center gap-2"
        >
          <Icons.crown />{t.upgradePlan}
        </button>
        
        <button 
          onClick={async () => { await supabase.auth.signOut(); window.location.href = "/"; }} 
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
        >
          <Icons.logout />{t.logout}
        </button>
      </div>
    </>
  );

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-100 flex flex-col z-50 transition-transform duration-300 lg:hidden ${open ? "translate-x-0" : "-translate-x-full"} shadow-2xl`}>
        <SidebarContent />
      </aside>
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-100 flex-col h-screen sticky top-0">
        <SidebarContent />
      </aside>
    </>
  );
}

function Topbar({ page, user, setOpen, lang }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const titles = { overview: t.welcome, automations: "Automations", leads: "Leads", settings: "Settings" };
  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there";

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Icons.menu />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {titles[page] || t.welcome}{page === "overview" && `, ${name}`}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage your Instagram automation</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-lg">
            {name.slice(0, 2).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold text-gray-900">{name}</div>
            <div className="text-xs text-gray-500">{PLAN_NAMES[user?.plan || "free"]} Plan</div>
          </div>
        </div>
      </div>
    </header>
  );
}

function OverviewPage({ userId, lang }) {
  const [stats, setStats] = useState({ sentReplies: 0, automationHits: 0, convRate: "0.0", leads: 0 });
  const [bars, setBars] = useState([]);
  const [conversion, setConversion] = useState([]);
  const [loading, setLoading] = useState(true);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

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

      const storyCount = 0;
      const commentCount = totalDMs;
      const total = storyCount + commentCount || 1;
      setConversion([
        { label: t.storyReply, pct: Math.round((storyCount / total) * 100), color: "from-blue-500 to-blue-600" },
        { label: t.commentDM, pct: Math.round((commentCount / total) * 100), color: "from-purple-500 to-purple-600" },
      ]);

      setLoading(false);
    }
    load();
  }, [userId, t]);

  if (loading) return <Spinner />;
  const maxBar = Math.max(...bars.map(b => b.dms), 1);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: t.sentReplies, value: stats.sentReplies.toLocaleString(), change: "+24%", gradient: "from-blue-500 to-blue-600" },
          { label: t.automationHits, value: stats.automationHits, change: "+18%", gradient: "from-purple-500 to-purple-600" },
          { label: t.conversion, value: `${stats.convRate}%`, change: "+3.2%", gradient: "from-green-500 to-green-600" },
          { label: t.leads, value: stats.leads, change: "+14", gradient: "from-orange-500 to-orange-600" },
        ].map(({ label, value, change, gradient }) => (
          <div key={label} className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{label}</p>
                <div className="flex items-center gap-1 text-green-600 text-xs font-bold">
                  <Icons.trendUp />
                  {change}
                </div>
              </div>
              <p className="text-4xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900">{t.engagementVolume}</h3>
            <p className="text-sm text-gray-500 mt-1">Last 7 days activity</p>
          </div>
          <div className="flex items-end gap-3 h-56">
            {bars.map((b, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                {b.dms > 0 && <span className="text-xs font-semibold text-gray-600">{b.dms}</span>}
                <div 
                  className="w-full bg-gradient-to-t from-blue-600 to-blue-500 rounded-t-xl group-hover:from-blue-700 group-hover:to-blue-600 transition-all cursor-pointer shadow-lg" 
                  style={{ height: `${Math.max((b.dms / maxBar) * 180, b.dms > 0 ? 8 : 0)}px` }} 
                />
                <span className="text-xs font-medium text-gray-500">{b.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900">{t.conversionSources}</h3>
            <p className="text-sm text-gray-500 mt-1">Traffic breakdown</p>
          </div>
          <div className="space-y-4">
            {conversion.map(({ label, pct, color }) => (
              <div key={label}>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="font-medium text-gray-700">{label}</span>
                  <span className="font-bold text-gray-900">{pct}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-500 shadow-sm`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AutomationsPage() { 
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center">
        <Icons.automations />
        <p className="text-xl font-semibold text-gray-400 mt-4">Automations</p>
        <p className="text-sm text-gray-500 mt-2">Coming soon</p>
      </div>
    </div>
  ); 
}

function LeadsPage() { 
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center">
        <Icons.leads />
        <p className="text-xl font-semibold text-gray-400 mt-4">Leads</p>
        <p className="text-sm text-gray-500 mt-2">Coming soon</p>
      </div>
    </div>
  ); 
}

function SettingsPage() { 
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center">
        <Icons.settings />
        <p className="text-xl font-semibold text-gray-400 mt-4">Settings</p>
        <p className="text-sm text-gray-500 mt-2">Coming soon</p>
      </div>
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
  const [lang, setLang] = useState("en");

  const loadProfile = useCallback(async uid => {
    const { data } = await supabase.from("profiles").select("*").eq("id", uid).single();
    setProfile(data || { plan: "free" });
  }, []);

  useEffect(() => {
    const savedLang = localStorage.getItem("replyastra-lang");
    if (savedLang) setLang(savedLang);

    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { window.location.href = "/login"; return; }
      setUser(session.user);
      await loadProfile(session.user.id);

      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar page={page} setPage={setPage} plan={plan} monthlyDMs={monthlyDMs} open={sidebarOpen} setOpen={setSidebarOpen} lang={lang} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar page={page} user={user} setOpen={setSidebarOpen} lang={lang} />
        <main className="flex-1 overflow-y-auto">
          {page === "overview" && <OverviewPage userId={user.id} lang={lang} />}
          {page === "automations" && <AutomationsPage />}
          {page === "leads" && <LeadsPage />}
          {page === "settings" && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}
