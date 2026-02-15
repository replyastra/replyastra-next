"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard, Zap, BarChart2, Users, LogOut,
  Bell, Plus, Trash2, ToggleLeft, ToggleRight,
  CheckCircle, AlertCircle, Settings, Instagram
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

// ─── Sidebar ─────────────────────────────────────────────────
function Sidebar({ active, setActive, onLogout }) {
  const links = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "automations", label: "Automations", icon: Zap },
    { id: "analytics", label: "Analytics", icon: BarChart2 },
    { id: "accounts", label: "Accounts", icon: Users },
  ];

  return (
    <aside className="w-56 shrink-0 bg-white border-r border-gray-100 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-gray-100">
        <span className="text-xl font-black text-gray-900">
          Reply<span className="text-emerald-500">Astra</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              active === id
                ? "bg-emerald-50 text-emerald-700"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            }`}
          >
            <Icon size={17} />
            {label}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-gray-100 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-all">
          <Settings size={17} />
          Settings
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-50 transition-all"
        >
          <LogOut size={17} />
          Log Out
        </button>
      </div>
    </aside>
  );
}

// ─── Topbar ──────────────────────────────────────────────────
function Topbar({ page, user }) {
  const titles = {
    overview: "Overview",
    automations: "Automations",
    analytics: "Analytics",
    accounts: "Accounts",
  };
  
  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6">
      <h1 className="text-base font-bold text-gray-800">{titles[page]}</h1>
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg hover:bg-gray-50 text-gray-400">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
          {user?.email?.substring(0, 2).toUpperCase() || "YO"}
        </div>
      </div>
    </header>
  );
}

// ─── Overview Page ───────────────────────────────────────────
function OverviewPage({ userId }) {
  const [stats, setStats] = useState({
    dmsSent: 0,
    automationsRun: 0,
    accounts: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    if (!userId) return;
    
    const fetchData = async () => {
      // Fetch DM logs count
      const { count: dmCount } = await supabase
        .from('dm_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Fetch active automations count
      const { count: autoCount } = await supabase
        .from('automations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('active', true);

      // Fetch accounts count
      const { count: accCount } = await supabase
        .from('accounts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Fetch recent activity
      const { data: logs } = await supabase
        .from('dm_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        dmsSent: dmCount || 0,
        automationsRun: autoCount || 0,
        accounts: accCount || 0,
      });

      setRecentActivity(logs || []);
    };

    fetchData();
  }, [userId]);

  const statsData = [
    { label: "DMs Sent", value: stats.dmsSent.toLocaleString(), change: "+18%", icon: Zap, color: "bg-emerald-50 text-emerald-600" },
    { label: "Automations Run", value: stats.automationsRun.toString(), change: "+12%", icon: Zap, color: "bg-blue-50 text-blue-600" },
    { label: "Accounts", value: stats.accounts.toString(), change: "", icon: Instagram, color: "bg-pink-50 text-pink-600" },
    { label: "Avg. Reply Time", value: "< 1s", change: "instant", icon: BarChart2, color: "bg-purple-50 text-purple-600" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map(({ label, value, change, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon size={18} />
            </div>
            <p className="text-2xl font-black text-gray-900">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            {change && (
              <p className="text-xs text-emerald-600 font-semibold mt-1">{change} this week</p>
            )}
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-sm font-bold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivity.length === 0 ? (
            <p className="text-sm text-gray-400">No activity yet</p>
          ) : (
            recentActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                {item.success ? (
                  <CheckCircle size={15} className="text-emerald-500 mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle size={15} className="text-gray-300 mt-0.5 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 truncate">{item.message}</p>
                </div>
                <span className="text-xs text-gray-400 shrink-0">{item.time_ago}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick tip */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-emerald-800">💡 Pro Tip</p>
          <p className="text-sm text-emerald-700 mt-1">
            Add more keywords to automate common DMs and save hours every week.
          </p>
        </div>
        <button className="shrink-0 text-sm font-bold text-emerald-700 bg-white border border-emerald-200 px-4 py-2 rounded-xl hover:bg-emerald-100 transition-colors">
          Add Keyword
        </button>
      </div>
    </div>
  );
}

// ─── Automations Page ────────────────────────────────────────
function AutomationsPage({ userId }) {
  const [automations, setAutomations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ keyword: "", reply: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    fetchAutomations();
  }, [userId]);

  const fetchAutomations = async () => {
    const { data } = await supabase
      .from('automations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    setAutomations(data || []);
  };

  const toggle = async (id, currentActive) => {
    await supabase
      .from('automations')
      .update({ active: !currentActive })
      .eq('id', id);
    
    fetchAutomations();
  };

  const remove = async (id) => {
    await supabase
      .from('automations')
      .delete()
      .eq('id', id);
    
    fetchAutomations();
  };

  const add = async () => {
    if (!form.keyword || !form.reply) return;
    
    setLoading(true);
    await supabase
      .from('automations')
      .insert([{ 
        user_id: userId, 
        keyword: form.keyword, 
        reply: form.reply,
        active: true,
        triggered: 0
      }]);
    
    setForm({ keyword: "", reply: "" });
    setShowForm(false);
    setLoading(false);
    fetchAutomations();
  };

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{automations.length} automations</p>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
        >
          <Plus size={15} />
          New Automation
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white border border-emerald-200 rounded-2xl p-5 space-y-3">
          <p className="text-sm font-bold text-gray-800">New Keyword Automation</p>
          <input
            placeholder="Keyword (e.g. price)"
            value={form.keyword}
            onChange={(e) => setForm({ ...form, keyword: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <textarea
            placeholder="Auto-reply message..."
            rows={3}
            value={form.reply}
            onChange={(e) => setForm({ ...form, reply: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
          />
          <div className="flex gap-2">
            <button 
              onClick={add} 
              disabled={loading}
              className="bg-emerald-600 text-white text-sm font-bold px-5 py-2 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button 
              onClick={() => setShowForm(false)} 
              className="text-sm font-semibold text-gray-400 px-4 py-2 rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {automations.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <p className="text-gray-400">No automations yet. Create your first one!</p>
          </div>
        ) : (
          automations.map((a) => (
            <div key={a.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full font-mono">
                    "{a.keyword}"
                  </span>
                  <span className="text-xs text-gray-400">{a.triggered} triggered</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{a.reply}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggle(a.id, a.active)} className="text-gray-400 hover:text-emerald-600 transition-colors">
                  {a.active ? (
                    <ToggleRight size={26} className="text-emerald-500" />
                  ) : (
                    <ToggleLeft size={26} />
                  )}
                </button>
                <button onClick={() => remove(a.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Analytics Page ──────────────────────────────────────────
function AnalyticsPage({ userId }) {
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    if (!userId) return;
    
    // Mock weekly data - in production, fetch from Supabase
    setWeeklyData([
      { day: "Mon", dms: 180 },
      { day: "Tue", dms: 220 },
      { day: "Wed", dms: 195 },
      { day: "Thu", dms: 310 },
      { day: "Fri", dms: 280 },
      { day: "Sat", dms: 145 },
      { day: "Sun", dms: 90 },
    ]);
  }, [userId]);

  const max = Math.max(...weeklyData.map((b) => b.dms));

  const topKeywords = [
    { kw: "price", count: 142, pct: 44 },
    { kw: "link", count: 89, pct: 28 },
    { kw: "discount", count: 67, pct: 21 },
    { kw: "collab", count: 23, pct: 7 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "DMs This Week", value: "1,284", sub: "+18% vs last week" },
          { label: "Automations Run", value: "321", sub: "+12% vs last week" },
          { label: "Success Rate", value: "98.4%", sub: "2 failed deliveries" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-xs text-gray-400 font-semibold mb-1">{s.label}</p>
            <p className="text-3xl font-black text-gray-900">{s.value}</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-sm font-bold text-gray-800 mb-6">DMs Sent — Last 7 Days</h2>
        <div className="flex items-end gap-3 h-36">
          {weeklyData.map((b) => (
            <div key={b.day} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs text-gray-400 font-semibold">{b.dms}</span>
              <div
                className="w-full bg-emerald-500 rounded-t-lg transition-all hover:bg-emerald-600"
                style={{ height: `${(b.dms / max) * 100}%` }}
              />
              <span className="text-xs text-gray-400">{b.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Keywords */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-sm font-bold text-gray-800 mb-4">Top Keywords</h2>
        <div className="space-y-4">
          {topKeywords.map((k) => (
            <div key={k.kw}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-gray-700 font-mono">"{k.kw}"</span>
                <span className="text-gray-400">{k.count} DMs · {k.pct}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all"
                  style={{ width: `${k.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Accounts Page ───────────────────────────────────────────
function AccountsPage({ userId }) {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    if (!userId) return;
    fetchAccounts();
  }, [userId]);

  const fetchAccounts = async () => {
    const { data } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', userId);

    setAccounts(data || []);
  };

  const removeAccount = async (id) => {
    await supabase
      .from('accounts')
      .delete()
      .eq('id', id);
    
    fetchAccounts();
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{accounts.length} connected accounts</p>
        <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">
          <Plus size={15} />
          Connect Instagram
        </button>
      </div>

      <div className="space-y-3">
        {accounts.length === 0 ? (
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-emerald-300 transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-gray-50 group-hover:bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-colors">
              <Instagram size={22} className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
            </div>
            <p className="text-sm font-bold text-gray-500 group-hover:text-gray-700">Connect your first Instagram account</p>
            <p className="text-xs text-gray-400 mt-1">Manage automations from one dashboard</p>
          </div>
        ) : (
          <>
            {accounts.map((acc) => (
              <div key={acc.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {acc.avatar || acc.handle.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-sm">{acc.handle}</p>
                  <p className="text-xs text-gray-400">{acc.followers} followers</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block" />
                    Connected
                  </span>
                  <button
                    onClick={() => removeAccount(acc.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-emerald-300 transition-colors cursor-pointer group">
              <div className="w-12 h-12 bg-gray-50 group-hover:bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-colors">
                <Instagram size={22} className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
              </div>
              <p className="text-sm font-bold text-gray-500 group-hover:text-gray-700">Connect another Instagram account</p>
              <p className="text-xs text-gray-400 mt-1">Manage multiple accounts from one dashboard</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────
export default function Dashboard() {
  const [activePage, setActivePage] = useState("overview");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get current user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const pages = {
    overview: <OverviewPage userId={user?.id} />,
    automations: <AutomationsPage userId={user?.id} />,
    analytics: <AnalyticsPage userId={user?.id} />,
    accounts: <AccountsPage userId={user?.id} />,
  };

  // Show loading if no user yet
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <Sidebar active={activePage} setActive={setActivePage} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar page={activePage} user={user} />
        <main className="flex-1 overflow-y-auto">
          {pages[activePage]}
        </main>
      </div>
    </div>
  );
}
