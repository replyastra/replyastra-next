"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const PLAN_LIMITS = {
  free:    { automations: 3,  accounts: 1,  dms: 500,   analytics: 7,  contacts: 10,     ai: 0,   price: 0   },
  starter: { automations: 10, accounts: 3,  dms: 3000,  analytics: 30, contacts: 999999, ai: 20,  price: 199 },
  pro:     { automations: 50, accounts: 10, dms: 10000, analytics: 90, contacts: 999999, ai: 150, price: 399 },
};
const PLAN_NAMES  = { free: "Free", starter: "Starter", pro: "Pro" };
const PLAN_PRICES = { free: 0,      starter: 199,        pro: 399      };

const TRANSLATIONS = {
  en: {
    welcome:"Welcome", overview:"Overview", automations:"Automations", leads:"Leads",
    upgrade:"Upgrade", settings:"Settings", logout:"Logout", usage:"USAGE",
    sentReplies:"SENT REPLIES", automationHits:"AUTOMATION HITS", conversion:"CONVERSION",
    leadsLabel:"LEADS", engagementVolume:"Engagement Volume", last7:"LAST 7 DAYS ACTIVITY",
    conversionSources:"Conversion Sources", storyReply:"Story Reply", commentDM:"Comment DM",
    flows:"Flows", capturedGrowth:"Captured Growth", console:"Console", elevate:"Elevate",
    newFlow:"NEW FLOW", configureKeyword:"CONFIGURE KEYWORD TRIGGERS",
    growthCaptured:"GROWTH CAPTURED THROUGH AUTOMATION",
    handle:"HANDLE", status:"STATUS", source:"SOURCE", date:"DATE",
    profile:"Profile", security:"Security", instagramAccounts:"Instagram Accounts",
    billingPlan:"Billing & Plan", language:"Language", fullName:"FULL NAME",
    emailAddress:"EMAIL ADDRESS", saveChanges:"SAVE CHANGES", oldPassword:"OLD PASSWORD",
    newPassword:"NEW PASSWORD", confirmNew:"CONFIRM NEW", updatePassword:"UPDATE PASSWORD",
    connectedViaMeta:"CONNECTED VIA META", connectNewAccount:"+ CONNECT NEW ACCOUNT",
    disconnect:"DISCONNECT", currentPlan:"CURRENT PLAN", upgradePlan:"UPGRADE PLAN",
    cancelSubscription:"CANCEL SUBSCRIPTION", monthlyDMs:"monthly DMs",
    monthly:"MONTHLY", yearly:"YEARLY", savePercent:"SAVE 16%",
    popular:"POPULAR", currentPlanBtn:"CURRENT PLAN",
    upgradeToStarter:"UPGRADE TO STARTER", upgradeToPro:"UPGRADE TO PRO",
    dmPerMonth:"DMs per month", automationRules:"automation rules",
    instagramAccountsCount:"Instagram accounts", analytics:"analytics",
    leadPreview:"Lead preview", multiLang:"Multi-language dashboard",
    watermark:"ReplyAstra watermark", communitySupport:"Community support",
    emailSupport:"Email support", prioritySupport:"Priority support",
    leadGenMgmt:"Lead generation & mgmt", aiGen:"ReplyAstra AI",
    aiGenPro:"ReplyAstra AI Pro",
  },
  kn: {
    welcome:"ಸ್ವಾಗತ", overview:"ಅವಲೋಕನ", automations:"ಸ್ವಯಂಚಾಲನೆಗಳು", leads:"ಲೀಡ್ಸ್",
    upgrade:"ನವೀಕರಿಸಿ", settings:"ಸೆಟ್ಟಿಂಗ್ಗಳು", logout:"ಲಾಗ್ಔಟ್", usage:"ಬಳಕೆ",
    sentReplies:"ಕಳುಹಿಸಿದ ಪ್ರತಿಕ್ರಿಯೆಗಳು", automationHits:"ಸ್ವಯಂಚಾಲನೆ ಹಿಟ್ಗಳು",
    conversion:"ಪರಿವರ್ತನೆ", leadsLabel:"ಲೀಡ್ಸ್",
    engagementVolume:"ತೊಡಗಿಸಿಕೊಳ್ಳುವಿಕೆ ಪ್ರಮಾಣ", last7:"ಕಳೆದ 7 ದಿನಗಳ ಚಟುವಟಿಕೆ",
    conversionSources:"ಪರಿವರ್ತನೆ ಮೂಲಗಳು", storyReply:"ಕಥೆ ಪ್ರತ್ಯುತ್ತರ", commentDM:"ಕಾಮೆಂಟ್ DM",
    flows:"ಫ್ಲೋಸ್", capturedGrowth:"ಕ್ಯಾಪ್ಚರ್ಡ್ ಗ್ರೋಥ್", console:"ಕನ್ಸೋಲ್", elevate:"ಎಲಿವೇಟ್",
    newFlow:"ಹೊಸ ಫ್ಲೋ", configureKeyword:"ಕೀವರ್ಡ್ ಟ್ರಿಗ್ಗರ್ಸ್ ಕಾನ್ಫಿಗರ್ ಮಾಡಿ",
    growthCaptured:"ಸ್ವಯಂಚಾಲನೆ ಮೂಲಕ ಕ್ಯಾಪ್ಚರ್ ಆದ ಬೆಳವಣಿಗೆ",
    handle:"ಹ್ಯಾಂಡಲ್", status:"ಸ್ಥಿತಿ", source:"ಮೂಲ", date:"ದಿನಾಂಕ",
    profile:"ಪ್ರೊಫೈಲ್", security:"ಸುರಕ್ಷತೆ", instagramAccounts:"ಇನ್ಸ್ಟಾಗ್ರಾಮ್ ಖಾತೆಗಳು",
    billingPlan:"ಬಿಲ್ಲಿಂಗ್ & ಯೋಜನೆ", language:"ಭಾಷೆ", fullName:"ಪೂರ್ಣ ಹೆಸರು",
    emailAddress:"ಇಮೇಲ್ ವಿಳಾಸ", saveChanges:"ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ",
    oldPassword:"ಹಳೆ ಪಾಸ್‌ವರ್ಡ್", newPassword:"ಹೊಸ ಪಾಸ್‌ವರ್ಡ್",
    confirmNew:"ಹೊಸದನ್ನು ದೃಢೀಕರಿಸಿ", updatePassword:"ಪಾಸ್‌ವರ್ಡ್ ಅಪ್‌ಡೇಟ್ ಮಾಡಿ",
    connectedViaMeta:"ಮೆಟಾ ಮೂಲಕ ಸಂಪರ್ಕಿಸಲಾಗಿದೆ",
    connectNewAccount:"+ ಹೊಸ ಖಾತೆ ಸಂಪರ್ಕಿಸಿ", disconnect:"ಡಿಸ್ಕನೆಕ್ಟ್",
    currentPlan:"ಪ್ರಸ್ತುತ ಯೋಜನೆ", upgradePlan:"ಯೋಜನೆ ನವೀಕರಿಸಿ",
    cancelSubscription:"ಚಂದಾದಾರಿಕೆ ರದ್ದುಗೊಳಿಸಿ", monthlyDMs:"ಮಾಸಿಕ DMs",
    monthly:"ಮಾಸಿಕ", yearly:"ವಾರ್ಷಿಕ", savePercent:"16% ಉಳಿಸಿ",
    popular:"ಜನಪ್ರಿಯ", currentPlanBtn:"ಪ್ರಸ್ತುತ ಯೋಜನೆ",
    upgradeToStarter:"ಸ್ಟಾರ್ಟರ್‌ಗೆ ನವೀಕರಿಸಿ", upgradeToPro:"ಪ್ರೊಗೆ ನವೀಕರಿಸಿ",
    dmPerMonth:"DMs ಪ್ರತಿ ತಿಂಗಳು", automationRules:"ಸ್ವಯಂಚಾಲನೆ ನಿಯಮಗಳು",
    instagramAccountsCount:"ಇನ್ಸ್ಟಾಗ್ರಾಮ್ ಖಾತೆಗಳು", analytics:"ವಿಶ್ಲೇಷಣೆ",
    leadPreview:"ಲೀಡ್ ಪ್ರಿವ್ಯೂ", multiLang:"ಬಹುಭಾಷಾ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    watermark:"ReplyAstra ವಾಟರ್‌ಮಾರ್ಕ್", communitySupport:"ಸಮುದಾಯ ಬೆಂಬಲ",
    emailSupport:"ಇಮೇಲ್ ಬೆಂಬಲ", prioritySupport:"ಆದ್ಯತೆ ಬೆಂಬಲ",
    leadGenMgmt:"ಲೀಡ್ ಉತ್ಪಾದನೆ & ನಿರ್ವಹಣೆ", aiGen:"ReplyAstra AI",
    aiGenPro:"ReplyAstra AI Pro",
  },
};

const LANGS = [
  { code:"en", label:"English" },
  { code:"kn", label:"Kannada" },
  { code:"hi", label:"Hindi"   },
  { code:"ta", label:"Tamil"   },
  { code:"te", label:"Telugu"  },
  { code:"ml", label:"Malayalam" },
];

/* ─────────────────────────────────────────
   ICONS
───────────────────────────────────────── */
const IC = {
  overview:    () => <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  automations: () => <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>,
  leads:       () => <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
  upgrade:     () => <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>,
  settings:    () => <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>,
  logout:      () => <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>,
  menu:        () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>,
  trash:       () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>,
  ig:          () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>,
  check:       () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>,
  cross:       () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>,
};

/* ─────────────────────────────────────────
   LOGO — text-based, never breaks
───────────────────────────────────────── */
function Logo() {
  return (
    <div className="flex items-center gap-1.5 select-none">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M9.5 1.5L3.5 9h5L6.5 14.5L12.5 7H7.5L9.5 1.5Z"
          fill="#111" stroke="#111" strokeWidth="0.4" strokeLinejoin="round"/>
      </svg>
      <span style={{
        fontFamily: "'Georgia','Times New Roman',serif",
        fontSize: "16px", fontWeight: "700",
        letterSpacing: "-0.02em", color: "#111",
      }}>
        Reply<span style={{ fontStyle:"italic", fontWeight:"400" }}>Astra</span>
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────
   SPINNER
───────────────────────────────────────── */
function Spinner({ full }) {
  return (
    <div className={`flex items-center justify-center ${full ? "h-screen" : "py-20"}`}>
      <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin"/>
    </div>
  );
}

/* ─────────────────────────────────────────
   TOGGLE SWITCH (matching screenshot)
───────────────────────────────────────── */
function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? "bg-gray-900" : "bg-gray-200"
      }`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
        checked ? "translate-x-6" : "translate-x-1"
      }`}/>
    </button>
  );
}

/* ─────────────────────────────────────────
   STAT CARD (Overview)
───────────────────────────────────────── */
function StatCard({ label, value, delta }) {
  const isPositive = delta >= 0;
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">{label}</p>
        <span className={`text-[11px] font-semibold ${isPositive ? "text-green-600" : "text-red-500"}`}>
          {isPositive ? "+" : ""}{delta}%
        </span>
      </div>
      <p style={{ fontFamily:"'Georgia','Times New Roman',serif", fontSize:"28px", fontWeight:"400", color:"#111", lineHeight:1 }}>
        {value}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────
   CUSTOM CHART TOOLTIP
───────────────────────────────────────── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-lg px-3 py-2 shadow-lg text-sm">
      <p className="text-gray-400 text-[11px] mb-0.5">{label}</p>
      <p className="font-semibold text-gray-900">{payload[0].value} DMs</p>
    </div>
  );
}

/* ─────────────────────────────────────────
   ── PAGE: OVERVIEW ──
───────────────────────────────────────── */
function OverviewPage({ userName, stats, chartData, sources, t }) {
  return (
    <div className="p-8 max-w-5xl">
      {/* Heading */}
      <h1 style={{ fontFamily:"'Georgia','Times New Roman',serif", fontSize:"clamp(28px,4vw,42px)", fontStyle:"italic", fontWeight:"400", color:"#111", marginBottom:"32px" }}>
        {t.welcome}, {userName}
      </h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label={t.sentReplies}     value={stats.sentReplies}     delta={stats.sentRepliesDelta}     />
        <StatCard label={t.automationHits}  value={stats.automationHits}  delta={stats.automationHitsDelta}  />
        <StatCard label={t.conversion}      value={`${stats.conversion}%`} delta={stats.conversionDelta}    />
        <StatCard label={t.leadsLabel}      value={stats.leads}           delta={stats.leadsDelta}           />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl p-5">
          <p style={{ fontFamily:"'Georgia','Times New Roman',serif", fontSize:"18px", color:"#111", marginBottom:"2px" }}>
            {t.engagementVolume}
          </p>
          <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-4">{t.last7}</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData} margin={{ top:4, right:4, left:-30, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="day" tick={{ fontSize:10, fill:"#9ca3af" }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:10, fill:"#9ca3af" }} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip />}/>
              <Line type="monotone" dataKey="value" stroke="#111" strokeWidth={1.5} dot={false} activeDot={{ r:4, fill:"#111" }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion Sources */}
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <p style={{ fontFamily:"'Georgia','Times New Roman',serif", fontSize:"18px", color:"#111", marginBottom:"20px" }}>
            {t.conversionSources}
          </p>
          {sources.map((s) => (
            <div key={s.label} className="mb-4">
              <div className="flex justify-between text-[11px] mb-1.5">
                <span className="font-medium text-gray-500 uppercase tracking-wider">{s.label}</span>
                <span className="font-semibold text-gray-900">{s.pct}%</span>
              </div>
              <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gray-900 rounded-full" style={{ width:`${s.pct}%` }}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   ── PAGE: AUTOMATIONS ──
───────────────────────────────────────── */
function AutomationsPage({ automations, setAutomations, plan, t }) {
  const lim = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  const [loading, setLoading] = useState(false);

  const toggleAuto = async (id, current) => {
    const { error } = await supabase
      .from("automations")
      .update({ is_active: !current })
      .eq("id", id);
    if (!error) setAutomations(prev => prev.map(a => a.id === id ? { ...a, is_active: !current } : a));
  };

  const deleteAuto = async (id) => {
    if (!confirm("Delete this automation?")) return;
    const { error } = await supabase.from("automations").delete().eq("id", id);
    if (!error) setAutomations(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="p-8 max-w-3xl">
      <h1 style={{ fontFamily:"'Georgia','Times New Roman',serif", fontSize:"clamp(28px,4vw,42px)", fontStyle:"italic", fontWeight:"400", color:"#111", marginBottom:"32px" }}>
        {t.flows}
      </h1>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <p style={{ fontFamily:"'Georgia','Times New Roman',serif", fontSize:"20px", color:"#111" }}>
              Automations
            </p>
            <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mt-0.5">
              {t.configureKeyword}
            </p>
          </div>
          <a href="/dashboard/new-automation">
            <button className="bg-gray-900 text-white text-[11px] font-semibold tracking-widest px-5 py-2.5 rounded-full hover:bg-gray-700 transition-colors">
              {t.newFlow}
            </button>
          </a>
        </div>

        {loading ? <Spinner /> : automations.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-400 text-sm">No automations yet. Create your first flow!</p>
          </div>
        ) : (
          automations.map((auto) => (
            <div key={auto.id} className="flex items-center gap-4 px-6 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors">
              {/* Icon */}
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  "{auto.keyword}"
                  {auto.hit_count > 0 && (
                    <span className="ml-2 text-[11px] text-gray-400 font-normal">{auto.hit_count} HITS</span>
                  )}
                </p>
                <p className="text-xs text-gray-400 truncate mt-0.5">{auto.response_message || "No reply set"}</p>
              </div>
              {/* Toggle */}
              <Toggle checked={!!auto.is_active} onChange={() => toggleAuto(auto.id, auto.is_active)} />
              {/* Delete */}
              <button onClick={() => deleteAuto(auto.id)} className="text-gray-300 hover:text-red-400 transition-colors ml-1">
                <IC.trash />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Usage note */}
      <p className="text-xs text-gray-400 mt-4 text-right">
        {automations.length} / {lim.automations} automations used
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────
   ── PAGE: LEADS ──
───────────────────────────────────────── */
function LeadsPage({ leads, t }) {
  const statusStyles = {
    hot:  "bg-red-50 text-red-600 border border-red-100",
    warm: "bg-amber-50 text-amber-600 border border-amber-100",
    cold: "bg-blue-50 text-blue-600 border border-blue-100",
  };

  return (
    <div className="p-8 max-w-4xl">
      <h1 style={{ fontFamily:"'Georgia','Times New Roman',serif", fontSize:"clamp(28px,4vw,42px)", fontStyle:"italic", fontWeight:"400", color:"#111", marginBottom:"32px" }}>
        {t.capturedGrowth}
      </h1>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <p style={{ fontFamily:"'Georgia','Times New Roman',serif", fontSize:"20px", color:"#111" }}>Leads</p>
          <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mt-0.5">{t.growthCaptured}</p>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-4 px-6 py-3 bg-gray-50 border-b border-gray-100">
          {[t.handle, t.status, t.source, t.date].map(h => (
            <p key={h} className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">{h}</p>
          ))}
        </div>

        {leads.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-400 text-sm">No leads captured yet. Set up automations to start capturing leads!</p>
          </div>
        ) : (
          leads.map((lead) => (
            <div key={lead.id} className="grid grid-cols-4 px-6 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors items-center">
              <p className="text-sm font-medium text-gray-900">@{lead.ig_handle}</p>
              <div>
                <span className={`text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full ${statusStyles[lead.status] || "bg-gray-100 text-gray-500"}`}>
                  {lead.status}
                </span>
              </div>
              <p className="text-sm text-gray-500">{lead.source}</p>
              <p className="text-sm text-gray-400">{lead.created_at ? new Date(lead.created_at).toLocaleDateString() : "—"}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   ── PAGE: SETTINGS ──
───────────────────────────────────────── */
function SettingsPage({ user, igAccounts, plan, billingRenewal, setIgAccounts, lang, setLang, t }) {
  const [fullName,   setFullName]   = useState(user?.user_metadata?.full_name || "");
  const [email,      setEmail]      = useState(user?.email || "");
  const [oldPass,    setOldPass]    = useState("");
  const [newPass,    setNewPass]    = useState("");
  const [confPass,   setConfPass]   = useState("");
  const [savingProf, setSavingProf] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [profMsg,    setProfMsg]    = useState("");
  const [passMsg,    setPassMsg]    = useState("");

  const lim = PLAN_LIMITS[plan] || PLAN_LIMITS.free;

  const saveProfile = async () => {
    setSavingProf(true); setProfMsg("");
    const { error } = await supabase.auth.updateUser({ data: { full_name: fullName } });
    setSavingProf(false);
    setProfMsg(error ? "Error saving." : "Saved!");
    setTimeout(() => setProfMsg(""), 3000);
  };

  const updatePassword = async () => {
    if (newPass !== confPass) { setPassMsg("Passwords don't match."); return; }
    setSavingPass(true); setPassMsg("");
    const { error } = await supabase.auth.updateUser({ password: newPass });
    setSavingPass(false);
    setPassMsg(error ? "Error updating password." : "Password updated!");
    setOldPass(""); setNewPass(""); setConfPass("");
    setTimeout(() => setPassMsg(""), 3000);
  };

  const disconnectIG = async (id) => {
    if (!confirm("Disconnect this Instagram account?")) return;
    const { error } = await supabase.from("instagram_accounts").delete().eq("id", id);
    if (!error) setIgAccounts(prev => prev.filter(a => a.id !== id));
  };

  const inputCls = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-white";
  const labelCls = "block text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-1.5";

  const Section = ({ title, children }) => (
    <div className="bg-white border border-gray-100 rounded-xl p-6 mb-4">
      <p style={{ fontFamily:"'Georgia','Times New Roman',serif", fontSize:"20px", color:"#111", marginBottom:"20px" }}>{title}</p>
      {children}
    </div>
  );

  return (
    <div className="p-8 max-w-2xl">
      <h1 style={{ fontFamily:"'Georgia','Times New Roman',serif", fontSize:"clamp(28px,4vw,42px)", fontStyle:"italic", fontWeight:"400", color:"#111", marginBottom:"32px" }}>
        {t.console}
      </h1>

      {/* Profile */}
      <Section title={t.profile}>
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className={labelCls}>{t.fullName}</label>
            <input className={inputCls} value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your name"/>
          </div>
          <div>
            <label className={labelCls}>{t.emailAddress}</label>
            <input className={inputCls} value={email} disabled placeholder="your@email.com" style={{ opacity:0.6, cursor:"not-allowed" }}/>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={saveProfile} disabled={savingProf}
            className="bg-gray-900 text-white text-[11px] font-semibold tracking-widest px-6 py-2.5 rounded-full hover:bg-gray-700 transition-colors disabled:opacity-60">
            {savingProf ? "SAVING..." : t.saveChanges}
          </button>
          {profMsg && <span className="text-sm text-green-600">{profMsg}</span>}
        </div>
      </Section>

      {/* Security */}
      <Section title={t.security}>
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[[t.oldPassword, oldPass, setOldPass], [t.newPassword, newPass, setNewPass], [t.confirmNew, confPass, setConfPass]].map(([lbl, val, set]) => (
            <div key={lbl}>
              <label className={labelCls}>{lbl}</label>
              <input className={inputCls} type="password" value={val} onChange={e => set(e.target.value)} placeholder="••••••••"/>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={updatePassword} disabled={savingPass}
            className="bg-gray-900 text-white text-[11px] font-semibold tracking-widest px-6 py-2.5 rounded-full hover:bg-gray-700 transition-colors disabled:opacity-60">
            {savingPass ? "UPDATING..." : t.updatePassword}
          </button>
          {passMsg && <span className={`text-sm ${passMsg.includes("Error") || passMsg.includes("match") ? "text-red-500" : "text-green-600"}`}>{passMsg}</span>}
        </div>
      </Section>

      {/* Instagram Accounts */}
      <Section title={t.instagramAccounts}>
        {igAccounts.length === 0 ? (
          <p className="text-sm text-gray-400 mb-4">No Instagram accounts connected yet.</p>
        ) : (
          igAccounts.map(acc => (
            <div key={acc.id} className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                  <IC.ig />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">@{acc.username}</p>
                  <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">{t.connectedViaMeta}</p>
                </div>
              </div>
              <button onClick={() => disconnectIG(acc.id)}
                className="text-[11px] font-semibold tracking-widest text-red-500 hover:text-red-700 transition-colors uppercase">
                {t.disconnect}
              </button>
            </div>
          ))
        )}
        <a href="/dashboard/connect-instagram">
          <button className="border border-gray-200 text-gray-600 text-[11px] font-semibold tracking-widest px-5 py-2.5 rounded-full hover:border-gray-400 hover:text-gray-900 transition-colors">
            {t.connectNewAccount}
          </button>
        </a>
      </Section>

      {/* Billing & Plan */}
      <Section title={t.billingPlan}>
        <div className="bg-gray-900 text-white rounded-xl px-6 py-5 mb-5">
          <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-1">{t.currentPlan}</p>
          <div className="flex items-end justify-between">
            <div>
              <p style={{ fontFamily:"'Georgia','Times New Roman',serif", fontSize:"24px", fontStyle:"italic" }}>
                {PLAN_NAMES[plan]} Plan
              </p>
              {billingRenewal && <p className="text-xs text-gray-400 mt-0.5">Renews on {billingRenewal}</p>}
            </div>
            <p className="text-2xl font-bold">₹{PLAN_PRICES[plan]}<span className="text-sm font-normal text-gray-400">/mo</span></p>
          </div>
        </div>
        <div className="flex gap-3">
          <a href="/dashboard/pricing">
            <button className="bg-gray-900 text-white text-[11px] font-semibold tracking-widest px-6 py-2.5 rounded-full hover:bg-gray-700 transition-colors">
              {t.upgradePlan}
            </button>
          </a>
          <button className="border border-gray-200 text-gray-500 text-[11px] font-semibold tracking-widest px-6 py-2.5 rounded-full hover:border-gray-400 hover:text-gray-700 transition-colors">
            {t.cancelSubscription}
          </button>
        </div>
      </Section>

      {/* Language */}
      <Section title={t.language}>
        <div className="grid grid-cols-3 gap-2">
          {LANGS.map(({ code, label }) => (
            <button key={code} onClick={() => setLang(code)}
              className={`py-2.5 px-3 rounded-xl text-sm font-medium border transition-all ${
                lang === code
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}>
              {label}
            </button>
          ))}
        </div>
      </Section>
    </div>
  );
}

/* ─────────────────────────────────────────
   ── PAGE: PRICING ──
───────────────────────────────────────── */
function PricingPage({ plan, t }) {
  const [billing, setBilling] = useState("monthly");

  const PLANS = [
    {
      key: "free", name: "Free",
      monthly: 0, yearly: 0,
      features: [
        { text: `500 ${t.dmPerMonth}`,       included: true  },
        { text: `3 ${t.automationRules}`,    included: true  },
        { text: `1 ${t.instagramAccountsCount}`, included: true  },
        { text: `7-day ${t.analytics}`,      included: true  },
        { text: `${t.leadPreview} (10 contacts)`, included: true  },
        { text: t.multiLang,                 included: false },
        { text: t.watermark,                 included: false },
        { text: t.communitySupport,          included: true  },
      ],
    },
    {
      key: "starter", name: "Starter", popular: true,
      monthly: 199, yearly: Math.round(199 * 0.84),
      features: [
        { text: `3,000 ${t.dmPerMonth}`,      included: true  },
        { text: `10 ${t.automationRules}`,    included: true  },
        { text: `3 ${t.instagramAccountsCount}`, included: true },
        { text: `30-day ${t.analytics}`,      included: true  },
        { text: `${t.aiGen} (20 gen/mo)`,    included: true  },
        { text: t.leadGenMgmt,               included: true  },
        { text: t.multiLang,                 included: true  },
        { text: t.emailSupport,              included: true  },
      ],
    },
    {
      key: "pro", name: "Pro",
      monthly: 399, yearly: Math.round(399 * 0.84),
      features: [
        { text: `10,000 ${t.dmPerMonth}`,    included: true  },
        { text: `50 ${t.automationRules}`,   included: true  },
        { text: `10 ${t.instagramAccountsCount}`, included: true },
        { text: `90-day ${t.analytics}`,     included: true  },
        { text: `${t.aiGenPro} (150 gen/mo)`, included: true  },
        { text: "Advanced lead insights",    included: true  },
        { text: t.multiLang,                 included: true  },
        { text: t.prioritySupport,           included: true  },
      ],
    },
  ];

  return (
    <div className="p-8 max-w-4xl">
      <h1 style={{ fontFamily:"'Georgia','Times New Roman',serif", fontSize:"clamp(28px,4vw,42px)", fontStyle:"italic", fontWeight:"400", color:"#111", marginBottom:"32px" }}>
        {t.elevate}
      </h1>

      {/* Billing toggle */}
      <div className="flex items-center gap-1 mb-10 bg-gray-100 w-fit rounded-full p-1">
        {["monthly","yearly"].map(b => (
          <button key={b} onClick={() => setBilling(b)}
            className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              billing === b ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-700"
            }`}>
            {b === "monthly" ? t.monthly : t.yearly}
            {b === "yearly" && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                {t.savePercent}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map(p => {
          const price = billing === "monthly" ? p.monthly : p.yearly;
          const isCurrent = plan === p.key;
          return (
            <div key={p.key} className={`relative bg-white rounded-2xl border-2 p-6 flex flex-col transition-shadow hover:shadow-md ${
              p.popular ? "border-gray-900" : "border-gray-100"
            }`}>
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold tracking-widest px-3 py-1 rounded-full uppercase">
                  {t.popular}
                </div>
              )}
              <p style={{ fontFamily:"'Georgia','Times New Roman',serif", fontSize:"22px", fontStyle:"italic", color:"#111", marginBottom:"6px" }}>
                {p.name}
              </p>
              <div className="flex items-end gap-1 mb-6">
                <span style={{ fontFamily:"'Georgia','Times New Roman',serif", fontSize:"36px", fontWeight:"400", color:"#111" }}>
                  ₹{price}
                </span>
                <span className="text-gray-400 text-sm mb-1">/mo</span>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 flex-1 mb-6">
                {p.features.map(f => (
                  <li key={f.text} className={`flex items-start gap-2.5 text-sm ${f.included ? "text-gray-700" : "text-gray-300"}`}>
                    <span className={`mt-0.5 flex-shrink-0 ${f.included ? "text-gray-700" : "text-gray-200"}`}>
                      {f.included ? <IC.check /> : <IC.cross />}
                    </span>
                    {f.text}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {isCurrent ? (
                <button disabled className="w-full border border-gray-200 text-gray-400 text-[11px] font-semibold tracking-widest py-3 rounded-full cursor-not-allowed">
                  {t.currentPlanBtn}
                </button>
              ) : (
                <a href={`/dashboard/checkout?plan=${p.key}&billing=${billing}`}>
                  <button className={`w-full text-[11px] font-semibold tracking-widest py-3 rounded-full transition-colors ${
                    p.popular
                      ? "bg-gray-900 text-white hover:bg-gray-700"
                      : "border border-gray-200 text-gray-700 hover:border-gray-900 hover:text-gray-900"
                  }`}>
                    {p.key === "starter" ? t.upgradeToStarter : t.upgradeToPro}
                  </button>
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   ── SIDEBAR ──
───────────────────────────────────────── */
function Sidebar({ page, setPage, plan, monthlyDMs, mobileOpen, setMobileOpen, t }) {
  const lim   = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  const dmPct = Math.min(Math.round((monthlyDMs / lim.dms) * 100), 100);

  const NAV = [
    { id:"overview",    label:t.overview,    Icon:IC.overview    },
    { id:"automations", label:t.automations, Icon:IC.automations },
    { id:"leads",       label:t.leads,       Icon:IC.leads       },
    { id:"pricing",     label:t.upgrade,     Icon:IC.upgrade     },
    { id:"settings",    label:t.settings,    Icon:IC.settings    },
  ];

  const Inner = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <Logo />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ id, label, Icon }) => (
          <button key={id} onClick={() => { setPage(id); setMobileOpen(false); }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all ${
              page === id
                ? "bg-gray-900 text-white font-medium"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            }`}>
            <span className={page === id ? "text-white" : "text-gray-400"}><Icon /></span>
            {label}
          </button>
        ))}
      </nav>

      {/* Usage + Logout */}
      <div className="px-4 pb-5 pt-3 border-t border-gray-100">
        <div className="mb-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">{t.usage}</span>
            <span className="text-[10px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">
              {PLAN_NAMES[plan]}
            </span>
          </div>
          <div className="h-[3px] bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-700 ${
              dmPct >= 90 ? "bg-red-500" : dmPct >= 70 ? "bg-amber-500" : "bg-gray-900"
            }`} style={{ width:`${dmPct}%` }}/>
          </div>
          <p className="text-[10px] text-gray-400">
            {monthlyDMs.toLocaleString()} / {lim.dms.toLocaleString()} {t.monthlyDMs}
          </p>
        </div>
        <button onClick={async () => { await supabase.auth.signOut(); window.location.href = "/"; }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all">
          <IC.logout />{t.logout}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col w-[165px] min-h-screen bg-white border-r border-gray-100 fixed top-0 left-0 z-30">
        <Inner />
      </aside>

      {/* Mobile */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setMobileOpen(false)}/>
          <aside className="fixed top-0 left-0 h-full w-[200px] bg-white z-50 shadow-xl lg:hidden">
            <Inner />
          </aside>
        </>
      )}
    </>
  );
}

/* ─────────────────────────────────────────
   ── TOPBAR ──
───────────────────────────────────────── */
function Topbar({ user, plan, setMobileOpen }) {
  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const initials = name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2);
  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20">
      <button className="lg:hidden text-gray-500" onClick={() => setMobileOpen(true)}>
        <IC.menu />
      </button>
      <div className="flex-1"/>
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-gray-900">{name}</p>
          <p className="text-[11px] text-gray-400">{PLAN_NAMES[plan]} account</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold">
          {initials}
        </div>
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────
   ── ROOT DASHBOARD ──
───────────────────────────────────────── */
export default function DashboardPage() {
  const [user,        setUser]        = useState(null);
  const [page,        setPage]        = useState("overview");
  const [plan,        setPlan]        = useState("free");
  const [monthlyDMs,  setMonthlyDMs]  = useState(0);
  const [automations, setAutomations] = useState([]);
  const [leads,       setLeads]       = useState([]);
  const [igAccounts,  setIgAccounts]  = useState([]);
  const [stats,       setStats]       = useState({
    sentReplies:0, sentRepliesDelta:24,
    automationHits:0, automationHitsDelta:18,
    conversion:0, conversionDelta:3.2,
    leads:0, leadsDelta:14,
  });
  const [chartData,   setChartData]   = useState([]);
  const [sources,     setSources]     = useState([]);
  const [billingRenewal, setBillingRenewal] = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [lang,        setLang]        = useState("en");
  const [mobileOpen,  setMobileOpen]  = useState(false);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  /* ── Fetch all data ── */
  const fetchAll = useCallback(async () => {
    const { data: { user: u } } = await supabase.auth.getUser();
    if (!u) { window.location.href = "/"; return; }
    setUser(u);

    // Profile / plan
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, monthly_dm_count, billing_renewal, preferred_language")
      .eq("id", u.id)
      .single();

    if (profile) {
      setPlan(profile.plan || "free");
      setMonthlyDMs(profile.monthly_dm_count || 0);
      setBillingRenewal(profile.billing_renewal || null);
      if (profile.preferred_language) setLang(profile.preferred_language);
    }

    // Automations
    const { data: autos } = await supabase
      .from("automations")
      .select("*")
      .eq("user_id", u.id)
      .order("created_at", { ascending:false });
    setAutomations(autos || []);

    // Leads
    const { data: leadsData } = await supabase
      .from("leads")
      .select("*")
      .eq("user_id", u.id)
      .order("created_at", { ascending:false });
    setLeads(leadsData || []);

    // Instagram accounts
    const { data: igData } = await supabase
      .from("instagram_accounts")
      .select("*")
      .eq("user_id", u.id);
    setIgAccounts(igData || []);

    // Analytics / stats
    const { data: analyticsData } = await supabase
      .from("analytics")
      .select("*")
      .eq("user_id", u.id)
      .order("date", { ascending:true })
      .limit(7);

    if (analyticsData?.length) {
      const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
      setChartData(analyticsData.map(r => ({
        day:   days[new Date(r.date).getDay()],
        value: r.dm_count || 0,
      })));

      const totalDMs    = analyticsData.reduce((s,r) => s + (r.dm_count||0), 0);
      const totalAutoHits = analyticsData.reduce((s,r) => s + (r.automation_hits||0), 0);
      const totalLeads  = leadsData?.length || 0;
      const conversion  = totalDMs > 0 ? ((totalLeads / totalDMs) * 100).toFixed(1) : "0.0";

      setStats(prev => ({
        ...prev,
        sentReplies: totalDMs,
        automationHits: totalAutoHits,
        leads: totalLeads,
        conversion,
      }));

      const storyPct   = analyticsData.reduce((s,r) => s + (r.story_reply_pct||0), 0) / (analyticsData.length || 1);
      const commentPct = analyticsData.reduce((s,r) => s + (r.comment_dm_pct||0), 0) / (analyticsData.length || 1);
      setSources([
        { label: "Story Reply",  pct: Math.round(storyPct)   },
        { label: "Comment DM",   pct: Math.round(commentPct) },
      ]);
    } else {
      // Fallback empty chart
      setChartData(["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => ({ day:d, value:0 })));
      setSources([{ label:"Story Reply", pct:0 }, { label:"Comment DM", pct:0 }]);
    }

    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Persist language preference
  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").update({ preferred_language: lang }).eq("id", user.id);
  }, [lang, user]);

  if (loading) return <Spinner full />;

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        page={page} setPage={setPage}
        plan={plan} monthlyDMs={monthlyDMs}
        mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}
        t={t}
      />

      {/* Main */}
      <div className="flex-1 lg:ml-[165px] flex flex-col min-h-screen">
        <Topbar user={user} plan={plan} setMobileOpen={setMobileOpen} />

        <main className="flex-1 overflow-y-auto">
          {page === "overview" && (
            <OverviewPage
              userName={userName} stats={stats}
              chartData={chartData} sources={sources} t={t}
            />
          )}
          {page === "automations" && (
            <AutomationsPage
              automations={automations}
              setAutomations={setAutomations}
              plan={plan} t={t}
            />
          )}
          {page === "leads" && (
            <LeadsPage leads={leads} t={t} />
          )}
          {page === "pricing" && (
            <PricingPage plan={plan} t={t} />
          )}
          {page === "settings" && (
            <SettingsPage
              user={user} igAccounts={igAccounts}
              plan={plan} billingRenewal={billingRenewal}
              setIgAccounts={setIgAccounts}
              lang={lang} setLang={setLang} t={t}
            />
          )}
        </main>
      </div>
    </div>
  );
}
