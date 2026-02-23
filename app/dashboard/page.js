"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { auth: { persistSession: true, autoRefreshToken: true, storageKey: "replyastra-auth" } }
);

// Plan limits with AI features
const PLAN_LIMITS = {
  free: {
    automations: 3,
    accounts: 1,
    dms: 500,
    analytics: 7,
    ai: false,
    aiGenerations: 0,
    price: 0,
  },
  starter: {
    automations: 10,
    accounts: 3,
    dms: 3000,
    analytics: 30,
    ai: "basic",
    aiGenerations: 20,
    price: 199,
  },
  pro: {
    automations: 50,
    accounts: 10,
    dms: 10000,
    analytics: 90,
    ai: "pro",
    aiGenerations: 150,
    price: 399,
  },
};

const PLAN_NAMES = { free: "Free", starter: "Starter", pro: "Pro" };

// Multi-language translations
const TRANSLATIONS = {
  en: {
    welcome: "Welcome",
    overview: "Overview",
    automations: "Automations",
    leads: "Leads",
    settings: "Settings",
    logout: "Logout",
    usage: "Usage",
    sentReplies: "Sent Replies",
    automationHits: "Automation Hits",
    conversion: "Conversion",
    engagementVolume: "Engagement Volume",
    conversionSources: "Conversion Sources",
    storyReply: "Story Reply",
    commentDM: "Comment DM",
    profile: "Profile",
    security: "Security",
    instagramAccounts: "Instagram Accounts",
    billing: "Billing",
    language: "Language",
    currentPlan: "Current Plan",
    upgradePlan: "Upgrade Plan",
    cancelSubscription: "Cancel subscription",
    monthlyDMs: "monthly DMs",
  },
  kn: {
    welcome: "ಸ್ವಾಗತ",
    overview: "ಅವಲೋಕನ",
    automations: "ಸ್ವಯಂಚಾಲನೆಗಳು",
    leads: "ಲೀಡ್ಸ್",
    settings: "ಸೆಟ್ಟಿಂಗ್ಗಳು",
    logout: "ಲಾಗ್ಔಟ್",
    usage: "ಬಳಕೆ",
    sentReplies: "ಕಳುಹಿಸಿದ ಪ್ರತಿಕ್ರಿಯೆಗಳು",
    automationHits: "ಸ್ವಯಂಚಾಲನೆ ಹಿಟ್ಗಳು",
    conversion: "ಪರಿವರ್ತನೆ",
    engagementVolume: "ತೊಡಗಿಸಿಕೊಳ್ಳುವಿಕೆ ಪ್ರಮಾಣ",
    conversionSources: "ಪರಿವರ್ತನೆ ಮೂಲಗಳು",
    storyReply: "ಕಥೆ ಪ್ರತ್ಯುತ್ತರ",
    commentDM: "ಕಾಮೆಂಟ್ DM",
    profile: "ಪ್ರೊಫೈಲ್",
    security: "ಸುರಕ್ಷತೆ",
    instagramAccounts: "ಇನ್ಸ್ಟಾಗ್ರಾಮ್ ಖಾತೆಗಳು",
    billing: "ಬಿಲ್ಲಿಂಗ್",
    language: "ಭಾಷೆ",
    currentPlan: "ಪ್ರಸ್ತುತ ಯೋಜನೆ",
    upgradePlan: "ಯೋಜನೆಯನ್ನು ನವೀಕರಿಸಿ",
    cancelSubscription: "ಚಂದಾದಾರಿಕೆಯನ್ನು ರದ್ದುಗೊಳಿಸಿ",
    monthlyDMs: "ಮಾಸಿಕ DMs",
  },
  hi: {
    welcome: "स्वागत",
    overview: "अवलोकन",
    automations: "स्वचालन",
    leads: "लीड्स",
    settings: "सेटिंग्स",
    logout: "लॉगआउट",
    usage: "उपयोग",
    sentReplies: "भेजे गए उत्तर",
    automationHits: "ऑटोमेशन हिट्स",
    conversion: "रूपांतरण",
    engagementVolume: "जुड़ाव मात्रा",
    conversionSources: "रूपांतरण स्रोत",
    storyReply: "स्टोरी रिप्लाई",
    commentDM: "कमेंट DM",
    profile: "प्रोफ़ाइल",
    security: "सुरक्षा",
    instagramAccounts: "इंस्टाग्राम खाते",
    billing: "बिलिंग",
    language: "भाषा",
    currentPlan: "वर्तमान योजना",
    upgradePlan: "योजना अपग्रेड करें",
    cancelSubscription: "सदस्यता रद्द करें",
    monthlyDMs: "मासिक DMs",
  },
  ta: {
    welcome: "வரவேற்பு",
    overview: "மேலோட்டம்",
    automations: "தானியங்கு",
    leads: "லீட்ஸ்",
    settings: "அமைப்புகள்",
    logout: "வெளியேறு",
    usage: "பயன்பாடு",
    sentReplies: "அனுப்பிய பதில்கள்",
    automationHits: "தானியங்கு ஹிட்ஸ்",
    conversion: "மாற்றம்",
    engagementVolume: "ஈடுபாடு அளவு",
    conversionSources: "மாற்ற ஆதாரங்கள்",
    storyReply: "கதை பதில்",
    commentDM: "கருத்து DM",
    profile: "சுயவிவரம்",
    security: "பாதுகாப்பு",
    instagramAccounts: "இன்ஸ்டாகிராம் கணக்குகள்",
    billing: "பில்லிங்",
    language: "மொழி",
    currentPlan: "தற்போதைய திட்டம்",
    upgradePlan: "திட்டத்தை மேம்படுத்து",
    cancelSubscription: "சந்தாவை ரத்து செய்",
    monthlyDMs: "மாதாந்திர DMs",
  },
  te: {
    welcome: "స్వాగతం",
    overview: "అవలోకనం",
    automations: "ఆటోమేషన్లు",
    leads: "లీడ్స్",
    settings: "సెట్టింగులు",
    logout: "లాగౌట్",
    usage: "వినియోగం",
    sentReplies: "పంపిన రిప్లైలు",
    automationHits: "ఆటోమేషన్ హిట్స్",
    conversion: "మార్పిడి",
    engagementVolume: "ఎంగేజ్మెంట్ వాల్యూమ్",
    conversionSources: "మార్పిడి మూలాలు",
    storyReply: "స్టోరీ రిప్లై",
    commentDM: "కామెంట్ DM",
    profile: "ప్రొఫైల్",
    security: "భద్రత",
    instagramAccounts: "ఇన్స్టాగ్రామ్ ఖాతాలు",
    billing: "బిల్లింగ్",
    language: "భాష",
    currentPlan: "ప్రస్తుత ప్లాన్",
    upgradePlan: "ప్లాన్ అప్గ్రేడ్ చేయండి",
    cancelSubscription: "సబ్స్క్రిప్షన్ రద్దు చేయండి",
    monthlyDMs: "నెలవారీ DMs",
  },
  ml: {
    welcome: "സ്വാഗതം",
    overview: "അവലോകനം",
    automations: "ഓട്ടോമേഷനുകൾ",
    leads: "ലീഡുകൾ",
    settings: "ക്രമീകരണങ്ങൾ",
    logout: "പുറത്തുകടക്കുക",
    usage: "ഉപയോഗം",
    sentReplies: "അയച്ച മറുപടികൾ",
    automationHits: "ഓട്ടോമേഷൻ ഹിറ്റുകൾ",
    conversion: "പരിവർത്തനം",
    engagementVolume: "എൻഗേജ്മെന്റ് വോളിയം",
    conversionSources: "പരിവർത്തന സ്രോതസ്സുകൾ",
    storyReply: "സ്റ്റോറി റിപ്ലൈ",
    commentDM: "കമന്റ് DM",
    profile: "പ്രൊഫൈൽ",
    security: "സുരക്ഷ",
    instagramAccounts: "ഇൻസ്റ്റാഗ്രാം അക്കൗണ്ടുകൾ",
    billing: "ബില്ലിംഗ്",
    language: "ഭാഷ",
    currentPlan: "നിലവിലെ പ്ലാൻ",
    upgradePlan: "പ്ലാൻ അപ്ഗ്രേഡ് ചെയ്യുക",
    cancelSubscription: "സബ്സ്ക്രിപ്ഷൻ റദ്ദാക്കുക",
    monthlyDMs: "പ്രതിമാസ DMs",
  },
};

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
  .serif { font-family: 'Libre Baskerville', serif; }
`;

function Spinner({ full }) {
  return (
    <div className={`flex items-center justify-center ${full ? "h-screen bg-white" : "py-24"}`}>
      <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
    </div>
  );
}

const Icons = {
  overview: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  automations: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>,
  leads: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>,
  settings: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>,
  pricing: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.12-3 2.5S10.343 13 12 13s3 1.12 3 2.5S13.657 18 12 18m0-10V6m0 12v-2M4 5h16M4 19h16"/></svg>,
  replyAI: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.75h4.5m-2.25 0v3m-6.75 3h13.5M6.75 9.75v7.5a3 3 0 003 3h4.5a3 3 0 003-3v-7.5M8.25 14.25h.008v.008H8.25v-.008zm3.75 0h.008v.008H12v-.008zm3.75 0h.008v.008h-.008v-.008z"/></svg>,
  upgrade: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 7-7"/><path strokeLinecap="round" strokeLinejoin="round" d="M14 8h6v6"/></svg>,
  logout: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>,
  search: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35"/></svg>,
  eye: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>,
  eyeOff: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>,
  menu: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>,
  check: () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>,
  x: () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>,
};

// Pricing Page with ALL features
function PricingPage({ plan, onClose, onUpgrade, lang = "en" }) {
  const [billing, setBilling] = useState("monthly");
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const plans = [
    {
      id: "free",
      name: "Free",
      price: 0,
      features: [
        { text: "500 DMs per month", included: true },
        { text: "3 automation rules", included: true },
        { text: "1 Instagram account", included: true },
        { text: "7-day analytics", included: true },
        { text: "Multi-language dashboard", included: true },
        { text: "ReplyAstra watermark", included: false },
        { text: "Community support", included: true },
        { text: "ReplyAstra AI", included: false },
      ],
    },
    {
      id: "starter",
      name: "Starter",
      price: 199,
      popular: true,
      features: [
        { text: "3,000 DMs per month", included: true },
        { text: "10 automation rules", included: true },
        { text: "3 Instagram accounts", included: true },
        { text: "30-day analytics", included: true },
        { text: "Multi-language dashboard", included: true },
        { text: "ReplyAstra AI — Caption & reply assistant", included: true },
        { text: "20 AI generations per month", included: true },
        { text: "Email support", included: true },
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: 399,
      features: [
        { text: "10,000 DMs per month", included: true },
        { text: "50 automation rules", included: true },
        { text: "10 Instagram accounts", included: true },
        { text: "90-day advanced analytics", included: true },
        { text: "Multi-language dashboard", included: true },
        { text: "ReplyAstra AI Pro — Advanced growth assistant", included: true },
        { text: "150 AI generations per month", included: true },
        { text: "Priority support", included: true },
      ],
    },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="serif text-2xl lg:text-3xl text-gray-900">Choose your plan</h1>
          <p className="text-sm text-gray-500 mt-1">Transparent pricing for real growth</p>
        </div>
        <button onClick={onClose} className="text-sm text-gray-600 hover:text-gray-900 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 border border-gray-200">
          ← Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {plans.map(p => (
          <div
            key={p.id}
            className={`relative bg-white rounded-2xl border-2 p-6 hover:shadow-lg transition-all ${
              p.popular ? "border-black" : "border-gray-200"
            } ${plan === p.id ? "ring-2 ring-emerald-500" : ""}`}
          >
            {p.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-bold px-4 py-1 rounded-full">
                MOST POPULAR
              </div>
            )}
            <div className="mb-6">
              <h3 className="text-xl font-black text-gray-900">{p.name}</h3>
              <div className="mt-4">
                <span className="text-4xl font-black text-gray-900">₹{p.price}</span>
                <span className="text-gray-500 text-sm">/month</span>
              </div>
            </div>
            <ul className="space-y-3 mb-6">
              {p.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${f.included ? "bg-emerald-100 text-emerald-600" : "bg-red-50 text-red-400"}`}>
                    {f.included ? <Icons.check /> : <Icons.x />}
                  </span>
                  <span className={f.included ? "text-gray-700" : "text-gray-400 line-through"}>{f.text}</span>
                </li>
              ))}
            </ul>
            {plan === p.id ? (
              <div className="w-full text-center bg-gray-100 text-gray-500 font-bold py-3 rounded-xl text-sm">
                Current Plan
              </div>
            ) : (
              <button
                onClick={() => onUpgrade(p.id)}
                className={`w-full font-bold py-3 rounded-xl text-sm transition-colors ${
                  p.popular ? "bg-black hover:bg-gray-800 text-white" : "bg-gray-900 hover:bg-gray-700 text-white"
                }`}
              >
                Get Started
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Settings with Language selector
function SettingsPage({ user, profile, onProfileUpdate, lang, setLang }) {
  const [tab, setTab] = useState("profile");
  const [name, setName] = useState(user?.user_metadata?.full_name || "");
  const [pw, setPw] = useState({ old: "", new: "", confirm: "" });
  const [showPw, setShowPw] = useState({ old: false, new: false, confirm: false });
  const [accounts, setAccounts] = useState([]);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [msg, setMsg] = useState({ profile: "", pw: "" });
  const plan = profile?.plan || "free";
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

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

  const settingsTabs = [
    { id: "profile", label: t.profile },
    { id: "security", label: t.security },
    { id: "accounts", label: t.instagramAccounts },
    { id: "billing", label: t.billing },
    { id: "language", label: t.language },
  ];

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-4xl mx-auto">
      <div className="serif text-lg text-gray-900">Console</div>

      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
        {settingsTabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              tab === t.id ? "border-black text-black" : "border-transparent text-gray-400 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <div className="bg-white border border-gray-100 rounded-lg p-6 space-y-4">
          <form onSubmit={saveProfile} className="space-y-4">
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="Full Name"
              className="w-full border-0 border-b border-gray-200 px-0 py-2 text-sm focus:outline-none focus:border-black transition-colors"
            />
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
      )}

      {tab === "security" && (
        <div className="bg-white border border-gray-100 rounded-lg p-6 space-y-4">
          <form onSubmit={savePassword} className="space-y-4">
            {[
              { key: "old", label: "Current Password", ph: "Enter current password" },
              { key: "new", label: "New Password", ph: "Minimum 6 characters" },
              { key: "confirm", label: "Confirm Password", ph: "Repeat new password" },
            ].map(({ key, label, ph }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{label}</label>
                <div className="relative">
                  <input
                    type={showPw[key] ? "text" : "password"}
                    required={key !== "old"}
                    minLength={key === "new" ? 6 : 1}
                    placeholder={ph}
                    value={pw[key]}
                    onChange={e => setPw(p => ({ ...p, [key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(s => ({ ...s, [key]: !s[key] }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    {showPw[key] ? <Icons.eye /> : <Icons.eyeOff />}
                  </button>
                </div>
              </div>
            ))}
            {msg.pw && <div className={`text-xs ${msg.pw.includes("successfully") ? "text-emerald-600" : "text-red-600"}`}>{msg.pw}</div>}
            <button
              type="submit"
              disabled={savingPw}
              className="bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              {savingPw ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      )}

      {tab === "accounts" && (
        <div className="bg-white border border-gray-100 rounded-lg p-6 space-y-4">
          {accounts.length === 0 ? (
            <p className="text-sm text-gray-400">No accounts connected</p>
          ) : (
            <div className="space-y-2">
              {accounts.map(acc => (
                <div key={acc.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full flex items-center justify-center text-white text-xs font-bold">IG</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{acc.handle}</div>
                    <div className="text-xs text-gray-400">Connected</div>
                  </div>
                  <button onClick={() => disconnect(acc.id)} className="text-xs font-semibold text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-white border border-red-200">
                    Disconnect
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "billing" && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 lg:p-7 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">{t.currentPlan}</p>
                <h2 className="text-2xl font-black text-gray-900">{PLAN_NAMES[plan]}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {plan === "free" ? "Free forever" : `₹${PLAN_LIMITS[plan].price}/month`}
                </p>
              </div>
              <div className={`px-4 py-2 rounded-xl text-sm font-black ${plan === "pro" ? "bg-gray-900 text-white" : plan === "starter" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600"}`}>
                {PLAN_NAMES[plan]}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
              {[
                { l: "DMs", v: PLAN_LIMITS[plan].dms.toLocaleString() + "/mo" },
                { l: "Automations", v: PLAN_LIMITS[plan].automations + " rules" },
                { l: "Accounts", v: PLAN_LIMITS[plan].accounts },
              ].map(({ l, v }) => (
                <div key={l} className="text-center bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">{l}</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">{v}</p>
                </div>
              ))}
            </div>
          </div>

          {plan !== "free" && (
            <div className="bg-white border border-gray-200 rounded-3xl p-6 lg:p-7 shadow-sm">
              <p className="font-bold text-gray-900 mb-2">{t.cancelSubscription}</p>
              <p className="text-sm text-gray-500 mb-4">Your plan remains active until the end of the billing period.</p>
              <button
                onClick={() => window.location.href = `mailto:support@replyastra.online?subject=Cancel Subscription&body=Email: ${user.email}`}
                className="text-sm font-bold text-red-500 hover:text-red-700 border border-red-200 px-4 py-2 rounded-lg"
              >
                Request Cancellation
              </button>
            </div>
          )}
        </div>
      )}

      {tab === "language" && (
        <div className="bg-white border border-gray-200 rounded-3xl p-6 lg:p-7 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Select Dashboard Language</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { code: "en", name: "English", native: "English" },
              { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
              { code: "hi", name: "Hindi", native: "हिंदी" },
              { code: "ta", name: "Tamil", native: "தமிழ்" },
              { code: "te", name: "Telugu", native: "తెలుగు" },
              { code: "ml", name: "Malayalam", native: "മലയാളം" },
            ].map(l => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); localStorage.setItem("replyastra-lang", l.code); }}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  lang === l.code ? "border-black bg-black text-white" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-bold text-sm">{l.native}</div>
                <div className="text-xs opacity-70">{l.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Sidebar
function Sidebar({ page, setPage, plan, monthlyDMs, open, setOpen, lang }) {
  const [search, setSearch] = useState("");
  const [logoFailed, setLogoFailed] = useState(false);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const lim = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  const dmPct = Math.min(Math.round((monthlyDMs / lim.dms) * 100), 100);

  const NAV = [
    { id: "overview", label: t.overview, Icon: Icons.overview },
    { id: "automations", label: t.automations, Icon: Icons.automations },
    { id: "contacts", label: "Leads", Icon: Icons.leads },
    { id: "replyastra-ai", label: "ReplyAstra AI", Icon: Icons.replyAI },
    { id: "upgrade", label: "Upgrade", Icon: Icons.upgrade },
    { id: "settings", label: t.settings, Icon: Icons.settings },
  ];

  const SidebarContent = () => (
    <>
      <div className="px-6 py-6 border-b border-gray-100">
        <a href="/dashboard" className="inline-flex items-center">
          {!logoFailed ? (
            <img
              src="https://drive.google.com/uc?export=view&id=1CkhHHcGFCr6BmfoE2TylgYJRlJQkcDEC"
              alt="ReplyAstra"
              className="h-8 w-auto"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <span className="text-lg font-black text-gray-900">ReplyAstra</span>
          )}
        </a>
      </div>
      <div className="px-4 pt-4 pb-2">
        <div className="relative">
          <input
            type="text"
            placeholder={`${t.search || "Search"}...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs border-0 bg-gray-50 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-200 text-gray-600 placeholder-gray-400"
          />
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <Icons.search />
          </div>
        </div>
      </div>
      <nav className="flex-1 px-4 py-2">
        {NAV.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => { setPage(id); setOpen?.(false); }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors mb-0.5 ${
              page === id ? "bg-black text-white" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Icon />{label}
          </button>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-gray-100 space-y-2">
        <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold px-3">{t.usage}</div>
        <div className="bg-gray-50 rounded-lg px-3 py-2">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-500 font-medium">{PLAN_NAMES[plan]}</span>
            <span className="text-gray-400">₹{PLAN_LIMITS[plan].price}/mo</span>
          </div>
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-black rounded-full transition-all" style={{ width: `${dmPct}%` }} />
          </div>
          <div className="text-xs text-gray-400 mt-1">{monthlyDMs} / {lim.dms.toLocaleString()} {t.monthlyDMs}</div>
        </div>
        <button onClick={logout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors">
          <Icons.logout />{t.logout}
        </button>
      </div>
    </>
  );

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 w-56 bg-white border-r border-gray-200 flex flex-col z-50 transition-transform duration-300 lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <SidebarContent />
      </aside>
      <aside className="hidden lg:flex w-52 bg-white border-r border-gray-200 flex-col h-screen sticky top-0">
        <SidebarContent />
      </aside>
    </>
  );
}

// Topbar
function Topbar({ page, user, setOpen, lang, planType }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const titles = {
    overview: t.welcome,
    automations: "Flows",
    contacts: "Captured Growth",
    "replyastra-ai": "ReplyAstra AI",
    settings: "Console",
    upgrade: "Elevate",
  };
  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there";
  const currentPlanType = planType || user?.plan_type || "free";

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-10 py-5">
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => setOpen(true)} className="lg:hidden p-1 text-gray-600">
          <Icons.menu />
        </button>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-xl text-xs font-black ${currentPlanType === "pro" ? "bg-gray-900 text-white" : currentPlanType === "starter" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600"}`}>
            {PLAN_NAMES[currentPlanType] || PLAN_NAMES.free}
          </div>
          <div className="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold">
            {name.slice(0, 2).toUpperCase()}
          </div>
          <div className="text-xs hidden sm:block">
            <div className="font-semibold text-gray-900">{name}</div>
          </div>
        </div>
      </div>
      <h1 className="serif text-2xl sm:text-4xl text-gray-900 font-normal italic">
        {titles[page] || t.welcome}{page === "overview" && `, ${name}`}
      </h1>
    </header>
  );
}

// Overview - FIXED conversion sources sizing
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
        { label: t.storyReply, pct: Math.round((storyCount / total) * 100), color: "bg-gray-900" },
        { label: t.commentDM, pct: Math.round((commentCount / total) * 100), color: "bg-gray-600" },
      ]);

      setLoading(false);
    }
    load();
  }, [userId, t]);

  if (loading) return <Spinner />;
  const maxBar = Math.max(...bars.map(b => b.dms), 1);

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t.sentReplies, value: stats.sentReplies.toLocaleString(), change: "+24%" },
          { label: t.automationHits, value: stats.automationHits, change: "+18%" },
          { label: t.conversion, value: `${stats.convRate}%`, change: "+3.2%" },
          { label: t.leads, value: stats.leads, change: "+14" },
        ].map(({ label, value, change }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-3xl p-5 lg:p-6 shadow-sm">
            <div className="flex justify-between mb-3">
              <div className="text-xs text-gray-400 uppercase tracking-wide font-medium">{label}</div>
              <span className="text-xs font-semibold text-emerald-600">{change}</span>
            </div>
            <div className="serif text-2xl lg:text-3xl text-gray-900">{value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-1">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-3xl p-6 lg:p-7 shadow-sm">
          <div className="mb-6">
            <div className="serif text-lg text-gray-900 mb-1">{t.engagementVolume}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Last 7 days activity</div>
          </div>
          <div className="flex items-end gap-2 h-52">
            {bars.map((b, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                {b.dms > 0 && <span className="text-xs text-gray-400">{b.dms}</span>}
                <div className="w-full bg-gray-900 hover:bg-gray-700 rounded-t-xl transition-all" style={{ height: `${Math.max((b.dms / maxBar) * 160, b.dms > 0 ? 4 : 0)}px` }} />
                <span className="text-xs text-gray-400">{b.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-6 lg:p-7 shadow-sm">
          <div className="mb-6">
            <div className="serif text-lg text-gray-900 mb-1">{t.conversionSources}</div>
          </div>
          <div className="space-y-4">
            {conversion.map(({ label, pct, color }) => (
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

// Remaining pages abbreviated for token limit...
function AutomationsPage() {
  const [loading, setLoading] = useState(true);
  const [automations, setAutomations] = useState([]);

  useEffect(() => {
    async function loadAutomations() {
      const res = await fetch('/api/automations');
      const data = await res.json();
      setAutomations(data.automations || []);
      setLoading(false);
    }
    loadAutomations();
  }, []);

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl border border-gray-200 p-5 lg:p-7 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="serif text-4xl italic text-gray-900">Automations</h2>
            <p className="text-xs uppercase tracking-[0.18em] text-gray-400 mt-1">Configure keyword triggers</p>
          </div>
          <button className="px-6 py-2.5 rounded-full bg-black text-white text-xs font-bold tracking-wide">New Flow</button>
        </div>

        <div className="mt-6 space-y-3">
          {loading ? (
            <div className="text-sm text-gray-500">Loading flows...</div>
          ) : automations.length === 0 ? (
            <div className="text-sm text-gray-500">No automations yet.</div>
          ) : automations.map((a) => (
            <div key={a.id} className="rounded-3xl border border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-4 min-w-0">
                <div className="h-10 w-10 rounded-xl bg-black text-white flex items-center justify-center text-xs font-bold">⚡</div>
                <div className="min-w-0">
                  <p className="serif italic text-2xl text-gray-900 truncate">"{a.keyword || 'untitled'}"</p>
                  <p className="text-xs uppercase tracking-[0.16em] text-gray-400">{a.triggered || 0} hits</p>
                </div>
              </div>
              <button className="h-6 w-10 rounded-full bg-gray-900" aria-label="status" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function ContactsPage() {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [query, setQuery] = useState("");
  const [meta, setMeta] = useState({ limitedPreview: false, features: {} });
  const [error, setError] = useState("");

  async function loadContacts(q = "") {
    setLoading(true);
    const res = await fetch(`/api/contacts${q ? `?q=${encodeURIComponent(q)}` : ""}`);
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Unable to load contacts");
      setLoading(false);
      return;
    }
    setContacts(data.contacts || []);
    setMeta({ limitedPreview: data.limitedPreview, features: data.features || {} });
    setError("");
    setLoading(false);
  }

  useEffect(() => { loadContacts(); }, []);

  async function exportCsv() {
    const res = await fetch('/api/contacts/export');
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'replyastra-contacts.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl border border-gray-200 p-5 lg:p-7 shadow-sm">
        <h2 className="serif text-2xl text-gray-900">Lead Management</h2>
        <p className="text-sm text-gray-500 mt-1">Track relationships and interactions from your automations.</p>
        {meta.limitedPreview && <div className="mt-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">Lead preview limit reached for free plan. Upgrade to unlock full CRM.</div>}
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 p-5 lg:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search by username" className="w-full md:max-w-sm px-3 py-2 border border-gray-200 rounded-xl text-sm" />
          <div className="flex gap-2">
            <button onClick={() => loadContacts(query)} className="px-4 py-2 rounded-xl text-sm font-bold bg-gray-900 text-white">Search</button>
            <button onClick={exportCsv} disabled={!meta.features.canExportContacts} className="px-4 py-2 rounded-xl text-sm font-bold bg-gray-100 text-gray-700 disabled:opacity-50">Export CSV</button>
          </div>
        </div>
        {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
        {loading ? <div className="mt-4 text-sm text-gray-500">Loading contacts...</div> : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead><tr className="text-left text-gray-500 border-b"><th className="py-2">Username</th><th>Interactions</th><th>Follows You</th><th>You Follow</th><th>Score</th></tr></thead>
              <tbody>
                {contacts.map(c => (
                  <tr key={c.id} className="border-b border-gray-100 text-gray-800">
                    <td className="py-2">@{c.instagram_username}</td><td>{c.interaction_count}</td><td>{c.follows_you ? 'Yes':'No'}</td><td>{c.you_follow ? 'Yes':'No'}</td><td>{meta.features.canSeeEngagementScore ? (c.engagement_score || 0) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function ReplyAstraAIPage() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [remaining, setRemaining] = useState({ today: null, month: null });

  async function generate() {
    setLoading(true);
    setError('');
    setResult('');
    const res = await fetch('/api/replyastra-ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }) });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Generation failed');
      setLoading(false);
      return;
    }
    setResult(data.text || '');
    setRemaining({ today: data.remaining_today, month: data.remaining_month });
    setLoading(false);
  }

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-4">
      <div className="bg-white rounded-3xl border border-gray-200 p-5 lg:p-7 shadow-sm">
        <h2 className="serif text-2xl text-gray-900">ReplyAstra AI</h2>
        <p className="text-sm text-gray-500 mt-1">Generate captions, replies and hashtags for your campaigns.</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6 space-y-3">
        <textarea value={prompt} onChange={(e)=>setPrompt(e.target.value)} rows={5} className="w-full rounded-xl border border-gray-200 p-3 text-sm" placeholder="Describe your post, niche, and tone..." />
        <button onClick={generate} disabled={loading || !prompt.trim()} className="px-5 py-2.5 rounded-xl text-sm font-bold bg-gray-900 text-white disabled:opacity-50">{loading ? 'Generating...' : 'Generate'}</button>
        {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</div>}
        {result && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
            <div className="whitespace-pre-wrap text-sm text-gray-800">{result}</div>
            <div className="mt-3 text-xs text-gray-500">Remaining today: {remaining.today ?? '—'} · Remaining month: {remaining.month ?? '—'}</div>
            <p className="mt-2 text-xs text-amber-700">ReplyAstra AI can make mistakes. Please review before publishing.</p>
          </div>
        )}
      </div>
    </div>
  );
}


// Root
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

  async function handleUpgrade(newPlan) {
    if (newPlan === plan) return; // Already on this plan

    const currentPlanData = PLAN_LIMITS[plan];
    const newPlanData = PLAN_LIMITS[newPlan];

    // Calculate prorated pricing for display
    let amountToPay = newPlanData.price;
    let upgradeMessage = `Upgrade to ${PLAN_NAMES[newPlan]} for ₹${newPlanData.price}/month?`;

    if (plan !== "free") {
      // Calculate days remaining
      const now = new Date();
      const subscriptionStart = new Date(profile?.subscription_start_date || now);
      const nextBillingDate = new Date(subscriptionStart);
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

      const totalDaysInCycle = Math.ceil((nextBillingDate - subscriptionStart) / (1000 * 60 * 60 * 24));
      const daysRemaining = Math.ceil((nextBillingDate - now) / (1000 * 60 * 60 * 24));

      if (daysRemaining > 0) {
        const unusedAmount = (currentPlanData.price / totalDaysInCycle) * daysRemaining;
        const newPlanProrated = (newPlanData.price / totalDaysInCycle) * daysRemaining;
        amountToPay = Math.max(Math.round(newPlanProrated - unusedAmount), 0);

        upgradeMessage = `Upgrade to ${PLAN_NAMES[newPlan]}?\n\n${daysRemaining} days remaining in current cycle.\nProrated amount: ₹${amountToPay}\n\n(Payment will be enabled after domain setup)`;
      }
    }

    if (!confirm(upgradeMessage)) return;

    // Temporary: Update plan directly without payment
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          plan: newPlan,
          subscription_start_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        alert("Plan update failed. Please try again.");
        console.error(error);
      } else {
        alert(`Successfully upgraded to ${PLAN_NAMES[newPlan]}!\n\n(This is a test upgrade. Payment integration will be added after domain is ready.)`);
        window.location.reload();
      }
    } catch (error) {
      console.error("Upgrade error:", error);
      alert("Upgrade failed. Please try again.");
    }
  }

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        <Sidebar page={page} setPage={setPage} plan={plan} monthlyDMs={monthlyDMs} open={sidebarOpen} setOpen={setSidebarOpen} lang={lang} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Topbar page={page} user={user} setOpen={setSidebarOpen} lang={lang} planType={profile?.plan_type || profile?.plan} />
          <main className="flex-1 overflow-y-auto">
            {page === "overview" && <OverviewPage userId={user.id} lang={lang} />}
            {page === "automations" && <AutomationsPage />}
            {page === "contacts" && <ContactsPage />}
            {page === "replyastra-ai" && <ReplyAstraAIPage />}
            {page === "settings" && <SettingsPage user={user} profile={profile} onProfileUpdate={() => loadProfile(user.id)} lang={lang} setLang={setLang} />}
            {page === "upgrade" && <PricingPage plan={plan} onClose={() => setPage("overview")} onUpgrade={handleUpgrade} lang={lang} />}
          </main>
        </div>
      </div>
    </>
  );
}
