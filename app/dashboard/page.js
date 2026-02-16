"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";


const I = {
  grid:   <svg className="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  zap:    <svg className="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  bar:    <svg className="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>,
  user:   <svg className="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-5M9 20H4v-2a4 4 0 015-5m6-5a4 4 0 11-8 0 4 4 0 018 0z"/></svg>,
  logout: <svg className="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>,
  plus:   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>,
  trash:  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>,
  check:  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>,
  spin:   <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>,
  ig:     <svg className="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>,
  trend:  <svg className="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>,
  bell:   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>,
  menu:   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>,
  close:  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>,
  lock:   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>,
  msg:    <svg className="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>,
  crown:  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M2 19h20v2H2v-2zm2-3l3-9 5 5 4-7 4 11H4z"/></svg>,
};

const NAV = [
  { id:"overview",    label:"Overview",    icon:I.grid },
  { id:"automations", label:"Automations", icon:I.zap  },
  { id:"analytics",   label:"Analytics",   icon:I.bar  },
  { id:"accounts",    label:"Accounts",    icon:I.user },
];

const PLAN_STYLES = {
  free:    { bg:"bg-gray-100",    text:"text-gray-600",    label:"Free"    },
  starter: { bg:"bg-blue-100",    text:"text-blue-700",    label:"Starter" },
  pro:     { bg:"bg-emerald-100", text:"text-emerald-700", label:"Pro"     },
};

function Spinner() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="w-7 h-7 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
    </div>
  );
}

function LockedCard({ title, requiredPlan }) {
  return (
    <div className="relative bg-white rounded-2xl border border-gray-100 p-6 overflow-hidden min-h-[160px]">
      <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-10 rounded-2xl gap-2">
        <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">{I.lock}</div>
        <p className="font-bold text-gray-800 text-sm">Upgrade to {requiredPlan}</p>
        <p className="text-xs text-gray-400 text-center max-w-[160px]">{title} is available on {requiredPlan} plan</p>
        <a href="/pricing" className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors">Upgrade Now</a>
      </div>
      <div className="h-28 bg-gray-50 rounded-xl" />
    </div>
  );
}

function PlanBadge({ plan, small }) {
  const s = PLAN_STYLES[plan] || PLAN_STYLES.free;
  return (
    <span className={`inline-flex items-center gap-1 font-bold rounded-full ${s.bg} ${s.text} ${small ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1"}`}>
      {plan==="pro" && I.crown}{s.label}
    </span>
  );
}

function StatCard({ label, value, sub, icon, color }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 lg:p-5">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color}`}>{icon}</div>
      <p className="text-xl lg:text-2xl font-black text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5 leading-tight">{label}</p>
      {sub && <p className="text-xs text-emerald-600 font-semibold mt-1">{sub}</p>}
    </div>
  );
}

function Sidebar({ page, setPage, userEmail, plan, open, setOpen }) {
  const initials = userEmail ? userEmail.slice(0,2).toUpperCase() : "RA";
  const ps = PLAN_STYLES[plan] || PLAN_STYLES.free;

  const handleLogout = async () => { await supabase.auth.signOut(); window.location.href="/"; };

  const Links = ({ onNav }) => (
    <nav className="flex-1 px-3 py-4 space-y-0.5">
      {NAV.map(({id,label,icon}) => (
        <button key={id} onClick={()=>{setPage(id);onNav?.();}}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${page===id?"bg-emerald-600 text-white shadow-sm":"text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}>
          {icon}{label}
        </button>
      ))}
    </nav>
  );

  const Bottom = () => (
    <div className="px-4 py-4 border-t border-gray-100 space-y-1">
      <div className={`flex items-center justify-between px-3 py-2 rounded-xl ${ps.bg} mb-2`}>
        <PlanBadge plan={plan} small />
        {plan!=="pro" && <a href="/pricing" className="text-xs font-bold text-emerald-600 hover:underline">{plan==="free"?"₹199/mo":"₹399/mo"} ↑</a>}
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
      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={()=>setOpen(false)} />}
      {/* Mobile */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 lg:hidden ${open?"translate-x-0":"-translate-x-full"}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <img src="/logo.png" alt="ReplyAstra" className="h-8 w-auto" />
          <button onClick={()=>setOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-50">{I.close}</button>
        </div>
        <Links onNav={()=>setOpen(false)} />
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

function Topbar({ page, setOpen, plan }) {
  const titles = { overview:"Overview", automations:"Automations", analytics:"Analytics", accounts:"Accounts" };
  return (
    <header className="bg-white border-b border-gray-100 px-4 lg:px-6 py-3 flex items-center gap-3 sticky top-0 z-30">
      <button onClick={()=>setOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-gray-50 text-gray-500 shrink-0">{I.menu}</button>
      <h1 className="text-base font-black text-gray-900 flex-1">{titles[page]}</h1>
      <div className="flex items-center gap-2">
        <span className="hidden sm:block"><PlanBadge plan={plan} /></span>
        <button className="relative p-2 rounded-xl hover:bg-gray-50 text-gray-400">
          {I.bell}
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}

function OverviewPage({ userId, plan }) {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    async function load() {
      const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate()-7);
      const [
        {count:totalDMs},{count:weekDMs},{count:autoCount},{count:accCount},{data:logs}
      ] = await Promise.all([
        supabase.from("dm_logs").select("*",{count:"exact",head:true}).eq("user_id",userId),
        supabase.from("dm_logs").select("*",{count:"exact",head:true}).eq("user_id",userId).gte("sent_at",weekAgo.toISOString()),
        supabase.from("automations").select("*",{count:"exact",head:true}).eq("user_id",userId).eq("active",true),
        supabase.from("accounts").select("*",{count:"exact",head:true}).eq("user_id",userId),
        supabase.from("dm_logs").select("keyword,recipient,status,sent_at").eq("user_id",userId).order("sent_at",{ascending:false}).limit(8),
      ]);
      setStats({totalDMs:totalDMs||0,weekDMs:weekDMs||0,autoCount:autoCount||0,accCount:accCount||0});
      setActivity(logs||[]);
      setLoading(false);
    }
    load();
  },[userId]);

  const timeAgo = ts => {
    const d=Math.floor((Date.now()-new Date(ts))/1000);
    if(d<60) return `${d}s ago`;
    if(d<3600) return `${Math.floor(d/60)}m ago`;
    if(d<86400) return `${Math.floor(d/3600)}h ago`;
    return `${Math.floor(d/86400)}d ago`;
  };

  if(loading) return <Spinner />;

  return (
    <div className="p-4 lg:p-6 xl:p-8 space-y-5 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard label="Total DMs Sent"     value={stats.totalDMs}  sub={`+${stats.weekDMs} this week`} icon={I.msg}   color="bg-emerald-50 text-emerald-600" />
        <StatCard label="Active Automations" value={stats.autoCount} sub="keyword rules"                 icon={I.zap}   color="bg-blue-50 text-blue-500"      />
        <StatCard label="Instagram Accounts" value={stats.accCount}  sub="connected"                    icon={I.ig}    color="bg-pink-50 text-pink-500"      />
        <StatCard label="Avg. Reply Time"     value="< 1s"            sub="always instant"               icon={I.trend} color="bg-violet-50 text-violet-500"  />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-800">Recent Activity</h2>
            <span className="text-xs text-gray-400">{activity.length} events</span>
          </div>
          {activity.length===0 ? (
            <div className="py-14 text-center">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3 text-gray-300">{I.msg}</div>
              <p className="text-sm text-gray-400">No activity yet — add an automation!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {activity.map((log,i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs ${log.status==="sent"?"bg-emerald-50 text-emerald-500":"bg-red-50 text-red-400"}`}>
                    {log.status==="sent"?I.check:"✕"}
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

        <div className="space-y-3">
          {plan==="pro" ? (
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-2 text-emerald-100">{I.crown}<span className="text-xs font-bold">Pro Plan Active</span></div>
              <p className="font-bold">You're on Pro 🎉</p>
              <p className="text-xs text-emerald-100 mt-1">All features unlocked. Keep automating!</p>
            </div>
          ) : (
            <div className={`rounded-2xl p-5 text-white ${plan==="starter"?"bg-gradient-to-br from-blue-500 to-blue-600":"bg-gradient-to-br from-emerald-500 to-emerald-600"}`}>
              <div className="flex items-center gap-2 mb-2 opacity-80">{I.crown}<span className="text-xs font-bold">{plan==="starter"?"Upgrade to Pro":"Get Started"}</span></div>
              {plan==="starter" ? (
                <>
                  <p className="font-bold text-sm">Upgrade to Pro — ₹399/mo</p>
                  <p className="text-xs text-blue-100 mt-1 mb-4">10 Instagram accounts, advanced analytics & priority support</p>
                </>
              ) : (
                <>
                  <p className="font-bold text-sm">Starter — ₹199/mo</p>
                  <p className="text-xs text-emerald-100 mt-1 mb-4">Unlimited keywords, 3 accounts, no watermark</p>
                </>
              )}
              <a href="/pricing" className="block text-center bg-white font-bold text-sm py-2 rounded-xl transition-colors text-gray-800 hover:bg-gray-50">See Plans →</a>
            </div>
          )}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Quick Actions</p>
            <div className="space-y-1">
              {[
                {icon:I.zap,  label:"Add New Keyword",    href:null},
                {icon:I.ig,   label:"Connect Instagram",  href:null},
                {icon:I.crown,label:"View Plans",         href:"/pricing"},
              ].map(({icon,label,href},i)=>(
                href ? (
                  <a key={i} href={href} className="w-full text-left text-sm text-gray-600 hover:text-emerald-600 font-medium py-2 flex items-center gap-2 transition-colors">{icon}{label}</a>
                ) : (
                  <button key={i} className="w-full text-left text-sm text-gray-600 hover:text-emerald-600 font-medium py-2 flex items-center gap-2 transition-colors">{icon}{label}</button>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AutomationsPage({ userId, plan }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ keyword:"", reply:"" });
  const [saving, setSaving] = useState(false);

  // Free: limited replies, Starter: unlimited keyword replies, Pro: unlimited
  const LIMITS = { free:3, starter:Infinity, pro:Infinity };
  const limit = LIMITS[plan]||3;
  const atLimit = list.length >= limit;

  useEffect(()=>{fetchAll();},[userId]);

  async function fetchAll(){
    setLoading(true);
    const {data} = await supabase.from("automations").select("*").eq("user_id",userId).order("created_at",{ascending:false});
    setList(data||[]);
    setLoading(false);
  }

  async function toggle(id,current){
    await supabase.from("automations").update({active:!current}).eq("id",id);
    setList(p=>p.map(a=>a.id===id?{...a,active:!current}:a));
  }

  async function remove(id){
    await supabase.from("automations").delete().eq("id",id);
    setList(p=>p.filter(a=>a.id!==id));
  }

  async function save(){
    if(!form.keyword.trim()||!form.reply.trim()||atLimit) return;
    setSaving(true);
    const {data,error} = await supabase.from("automations").insert([{user_id:userId,keyword:form.keyword.trim(),reply:form.reply.trim()}]).select().single();
    if(!error&&data){setList(p=>[data,...p]);setForm({keyword:"",reply:""});setShowForm(false);}
    setSaving(false);
  }

  if(loading) return <Spinner />;

  return (
    <div className="p-4 lg:p-6 xl:p-8 space-y-5 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-sm text-gray-500">{list.length} / {plan==="free" ? "3 (limited)" : "Unlimited"} rules</p>
          {atLimit&&plan==="free"&&<p className="text-xs text-amber-600 font-semibold mt-0.5">Limit reached — <a href="/pricing" className="underline">upgrade</a> for unlimited keywords</p>}
        </div>
        <button onClick={()=>atLimit?window.location.href="/pricing":setShowForm(!showForm)}
          className={`flex items-center gap-2 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors ${atLimit&&plan==="free"?"bg-amber-500 hover:bg-amber-600":"bg-emerald-600 hover:bg-emerald-700"}`}>
          {I.plus}{atLimit&&plan==="free"?"Upgrade — ₹199/mo":"New Automation"}
        </button>
      </div>

      {showForm&&!atLimit&&(
        <div className="bg-white border border-emerald-100 rounded-2xl p-5 lg:p-6 space-y-4 shadow-sm">
          <p className="text-sm font-bold text-gray-800">New Keyword Rule</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Keyword</label>
              <input placeholder='e.g. "price"' value={form.keyword} onChange={e=>setForm({...form,keyword:e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"/>
              <p className="text-xs text-gray-400 mt-1">When someone comments this → auto DM sent</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Auto-Reply Message</label>
              <textarea placeholder="The DM to send..." rows={3} value={form.reply} onChange={e=>setForm({...form,reply:e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none transition"/>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors">
              {saving?I.spin:I.check} Save Rule
            </button>
            <button onClick={()=>setShowForm(false)} className="text-sm font-semibold text-gray-400 px-4 py-2.5 rounded-xl hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      )}

      {list.length===0&&!showForm&&(
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-emerald-500">{I.zap}</div>
          <p className="font-bold text-gray-700 mb-1">No automations yet</p>
          <p className="text-sm text-gray-400">Click "New Automation" to create your first keyword rule</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {list.map(a=>(
          <div key={a.id} className="bg-white rounded-2xl border border-gray-100 p-4 lg:p-5 flex items-start gap-3 hover:border-gray-200 transition-colors">
            <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${a.active?"bg-emerald-500":"bg-gray-300"}`}/>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-lg font-mono">{a.keyword}</span>
                <span className="text-xs text-gray-400">{a.triggered||0}× sent</span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2">{a.reply}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button onClick={()=>toggle(a.id,a.active)} className={`relative w-10 h-6 rounded-full transition-colors ${a.active?"bg-emerald-500":"bg-gray-200"}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${a.active?"translate-x-4":""}`}/>
              </button>
              <button onClick={()=>remove(a.id)} className="p-2 text-gray-300 hover:text-red-400 rounded-xl hover:bg-red-50 transition-colors">{I.trash}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsPage({ userId, plan }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    async function load(){
      const days=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-(6-i));return d;});
      const bars=await Promise.all(days.map(async d=>{
        const s=new Date(d);s.setHours(0,0,0,0);
        const e=new Date(d);e.setHours(23,59,59,999);
        const {count}=await supabase.from("dm_logs").select("*",{count:"exact",head:true}).eq("user_id",userId).gte("sent_at",s.toISOString()).lte("sent_at",e.toISOString());
        return {day:d.toLocaleDateString("en",{weekday:"short"}),dms:count||0};
      }));
      const {count:total}=await supabase.from("dm_logs").select("*",{count:"exact",head:true}).eq("user_id",userId);
      const weekAgo=new Date();weekAgo.setDate(weekAgo.getDate()-7);
      const {count:week}=await supabase.from("dm_logs").select("*",{count:"exact",head:true}).eq("user_id",userId).gte("sent_at",weekAgo.toISOString());
      const {count:failed}=await supabase.from("dm_logs").select("*",{count:"exact",head:true}).eq("user_id",userId).eq("status","failed");
      const t=total||0;
      const rate=t>0?(((t-(failed||0))/t)*100).toFixed(1):"100.0";
      const {data:logs}=await supabase.from("dm_logs").select("keyword").eq("user_id",userId);
      const kw={};
      (logs||[]).forEach(({keyword})=>{kw[keyword]=(kw[keyword]||0)+1;});
      const topKw=Object.entries(kw).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([k,c])=>({k,c,pct:t>0?Math.round((c/t)*100):0}));
      setData({bars,total:t,week:week||0,rate,topKw});
      setLoading(false);
    }
    load();
  },[userId]);

  if(loading) return <Spinner />;
  const max=Math.max(...data.bars.map(b=>b.dms),1);

  return (
    <div className="p-4 lg:p-6 xl:p-8 space-y-5 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-3 gap-3 lg:gap-4">
        {[
          {l:"Total DMs",v:data.total,    s:`${data.week} this week`},
          {l:"This Week", v:data.week,    s:"last 7 days"           },
          {l:"Delivered", v:`${data.rate}%`,s:"success rate"        },
        ].map(({l,v,s})=>(
          <div key={l} className="bg-white rounded-2xl border border-gray-100 p-3 lg:p-5">
            <p className="text-xs text-gray-400 font-semibold mb-1">{l}</p>
            <p className="text-lg lg:text-3xl font-black text-gray-900">{v}</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">{s}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-bold text-gray-800 mb-5">DMs — Last 7 Days</h2>
          <div className="flex items-end gap-1.5" style={{height:"96px"}}>
            {data.bars.map((b,i)=>(
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-400">{b.dms>0?b.dms:""}</span>
                <div className="w-full flex items-end" style={{height:"68px"}}>
                  <div className="w-full bg-emerald-500 hover:bg-emerald-400 rounded-t-md transition-all" style={{height:`${(b.dms/max)*68}px`,minHeight:b.dms>0?"3px":"0"}}/>
                </div>
                <span className="text-xs text-gray-400">{b.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-bold text-gray-800 mb-4">Top Keywords</h2>
          {data.topKw.length===0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No data yet.</p>
          ) : (
            <div className="space-y-3">
              {data.topKw.map(({k,c,pct})=>(
                <div key={k}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-bold text-gray-700 font-mono bg-gray-100 px-2 py-0.5 rounded-lg">{k}</span>
                    <span className="text-xs text-gray-400">{c} · {pct}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full"><div className="h-full bg-emerald-500 rounded-full" style={{width:`${pct}%`}}/></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* STARTER + PRO breakdown */}
      {(plan==="starter"||plan==="pro") ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-800">Breakdown</h2>
            <PlanBadge plan={plan} small />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {l:"Today",     v:data.bars[data.bars.length-1]?.dms||0},
              {l:"This Week", v:data.week},
              {l:"All Time",  v:data.total},
              {l:"Success",   v:`${data.rate}%`},
            ].map(({l,v})=>(
              <div key={l} className="text-center p-3 bg-gray-50 rounded-xl">
                <p className="text-lg font-black text-gray-900">{v}</p>
                <p className="text-xs text-gray-400 mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <LockedCard title="Automation Breakdown (daily/weekly stats)" requiredPlan="Starter" />
      )}

      {/* PRO advanced */}
      {plan==="pro" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-800">30-Day Trend</h2>
              <PlanBadge plan="pro" small />
            </div>
            <div className="flex items-center justify-center h-24 bg-gradient-to-r from-emerald-50 to-transparent rounded-xl">
              <p className="text-sm text-gray-400">30-day chart appears here with real data</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-800">Conversion</h2>
              <PlanBadge plan="pro" small />
            </div>
            <div className="space-y-3">
              {[{l:"Comment → DM",v:"94%"},{l:"DM → Click",v:"38%"},{l:"Click → Sale",v:"12%"}].map(({l,v})=>(
                <div key={l} className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{l}</span>
                  <span className="text-sm font-black text-gray-900">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <LockedCard title="Advanced Analytics (30-day trend, conversion tracking)" requiredPlan="Pro" />
      )}
    </div>
  );
}

function AccountsPage({ userId, plan }) {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const ACC_LIMITS = {free:1,starter:3,pro:10};
  const limit = ACC_LIMITS[plan]||1;

  useEffect(()=>{
    async function load(){
      const {data}=await supabase.from("accounts").select("*").eq("user_id",userId).order("created_at",{ascending:false});
      setAccounts(data||[]);setLoading(false);
    }
    load();
  },[userId]);

  async function remove(id){
    await supabase.from("accounts").delete().eq("id",id);
    setAccounts(p=>p.filter(a=>a.id!==id));
  }

  if(loading) return <Spinner />;
  const atLimit = accounts.length>=limit;

  return (
    <div className="p-4 lg:p-6 xl:p-8 space-y-5 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm text-gray-500">{accounts.length} / {plan==="pro"?"10":limit} accounts</p>
          {atLimit&&plan!=="pro"&&<p className="text-xs text-amber-600 font-semibold mt-0.5">Limit reached — <a href="/pricing" className="underline">upgrade</a></p>}
        </div>
        <button onClick={()=>atLimit?window.location.href="/pricing":null}
          className={`flex items-center gap-2 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors ${atLimit?"bg-amber-500 hover:bg-amber-600":"bg-emerald-600 hover:bg-emerald-700"}`}>
          {I.plus}{atLimit?"Upgrade for More":"Connect Instagram"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {accounts.map(acc=>(
          <div key={acc.id} className="bg-white rounded-2xl border border-gray-100 p-4 lg:p-5 flex items-center gap-3 hover:border-gray-200 transition-colors">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-400 via-rose-400 to-orange-400 flex items-center justify-center text-white font-black text-sm shrink-0">
              {(acc.avatar||acc.handle?.replace("@","").slice(0,2)||"IG").toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm truncate">{acc.handle}</p>
              <p className="text-xs text-gray-400">{acc.followers} followers</p>
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full shrink-0">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"/> Live
            </span>
            <button onClick={()=>remove(acc.id)} className="p-2 text-gray-300 hover:text-red-400 rounded-xl hover:bg-red-50 transition-colors shrink-0">{I.trash}</button>
          </div>
        ))}
      </div>

      {!atLimit&&(
        <button className="w-full border-2 border-dashed border-gray-200 hover:border-emerald-300 rounded-2xl p-8 lg:p-10 flex flex-col items-center gap-3 transition-colors group">
          <div className="w-12 h-12 bg-gray-50 group-hover:bg-emerald-50 rounded-2xl flex items-center justify-center text-gray-300 group-hover:text-emerald-500 transition-colors">{I.ig}</div>
          <p className="text-sm font-bold text-gray-500 group-hover:text-gray-700">Connect an Instagram account</p>
          <p className="text-xs text-gray-400">Manage multiple accounts from one place</p>
        </button>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="text-sm font-bold text-gray-800 mb-4">Account Limits by Plan</h2>
        <div className="grid grid-cols-3 gap-3">
          {[{p:"Free",n:"1 account",c:"bg-gray-50",t:"text-gray-600"},{p:"Starter",n:"3 accounts",c:"bg-blue-50",t:"text-blue-700"},{p:"Pro",n:"10 accounts",c:"bg-emerald-50",t:"text-emerald-700"}].map(({p,n,c,t})=>(
            <div key={p} className={`rounded-xl p-3 text-center ${c} ${plan.toLowerCase()===p.toLowerCase()?"ring-2 ring-emerald-400":""}`}>
              <p className={`text-xs font-bold ${t}`}>{p}</p>
              <p className="text-sm font-black text-gray-900 mt-1">{n}</p>
            </div>
          ))}
        </div>
        {plan!=="pro"&&<a href="/pricing" className="block text-center mt-4 text-sm font-bold text-emerald-600 hover:underline">Upgrade your plan →</a>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [page, setPage] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [plan, setPlan] = useState("free");
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    async function init(){
      const {data}=await supabase.auth.getUser();
      if(!data?.user){window.location.href="/login";return;}
      setUser(data.user);
      const {data:profile}=await supabase.from("profiles").select("plan").eq("id",data.user.id).single();
      setPlan(profile?.plan||"free");
      setLoading(false);
    }
    init();
  },[]);

  if(loading){
    return(
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"/>
      </div>
    );
  }

  const pages = {
    overview:    <OverviewPage    userId={user.id} plan={plan}/>,
    automations: <AutomationsPage userId={user.id} plan={plan}/>,
    analytics:   <AnalyticsPage  userId={user.id} plan={plan}/>,
    accounts:    <AccountsPage   userId={user.id} plan={plan}/>,
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar page={page} setPage={setPage} userEmail={user.email} plan={plan} open={sidebarOpen} setOpen={setSidebarOpen}/>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar page={page} setOpen={setSidebarOpen} plan={plan}/>
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {pages[page]}
        </main>
      </div>
    </div>
  );
}
