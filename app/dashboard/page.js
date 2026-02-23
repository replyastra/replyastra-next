"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { auth: { persistSession: true, autoRefreshToken: true, storageKey: "replyastra-auth" } }
);

// Plan limits with ALL features as specified
const PLAN_LIMITS = {
  free: {
    automations: 3,
    accounts: 1,
    dms: 500,
    analytics: 7,
    contacts: 10,
    ai: false,
    aiGenerations: 0,
    price: 0,
  },
  starter: {
    automations: 10,
    accounts: 3,
    dms: 3000,
    analytics: 30,
    contacts: 999999,
    ai: "basic",
    aiGenerations: 20,
    price: 199,
  },
  pro: {
    automations: 50,
    accounts: 10,
    dms: 10000,
    analytics: 90,
    contacts: 999999,
    ai: "pro",
    aiGenerations: 150,
    price: 399,
  },
};

const PLAN_NAMES = { free: "Free", starter: "Starter", pro: "Pro" };

// Multi-language translations - COMPLETE
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
    chooseYourPlan: "Choose your plan",
    transparentPricing: "Transparent pricing for real growth",
    back: "Back",
    mostPopular: "MOST POPULAR",
    perMonth: "per month",
    getStarted: "Get Started",
    search: "Search",
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
    chooseYourPlan: "ನಿಮ್ಮ ಯೋಜನೆಯನ್ನು ಆರಿಸಿ",
    transparentPricing: "ನಿಜವಾದ ಬೆಳವಣಿಗೆಗಾಗಿ ಪಾರದರ್ಶಕ ಬೆಲೆ",
    back: "ಹಿಂದೆ",
    mostPopular: "ಅತ್ಯಂತ ಜನಪ್ರಿಯ",
    perMonth: "ತಿಂಗಳಿಗೆ",
    getStarted: "ಪ್ರಾರಂಭಿಸಿ",
    search: "ಹುಡುಕಿ",
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
    chooseYourPlan: "अपनी योजना चुनें",
    transparentPricing: "वास्तविक विकास के लिए पारदर्शी मूल्य निर्धारण",
    back: "वापस",
    mostPopular: "सबसे लोकप्रिय",
    perMonth: "प्रति माह",
    getStarted: "शुरू करें",
    search: "खोजें",
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
    chooseYourPlan: "உங்கள் திட்டத்தைத் தேர்ந்தெடுக்கவும்",
    transparentPricing: "உண்மையான வளர்ச்சிக்கான வெளிப்படையான விலை",
    back: "பின்",
    mostPopular: "மிகவும் பிரபலமான",
    perMonth: "மாதத்திற்கு",
    getStarted: "தொடங்குங்கள்",
    search: "தேடு",
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
    chooseYourPlan: "మీ ప్లాన్ను ఎంచుకోండి",
    transparentPricing: "నిజమైన వృద్ధి కోసం పారదర్శక ధర",
    back: "వెనుకకు",
    mostPopular: "అత్యంత ప్రజాదరణ",
    perMonth: "నెలకు",
    getStarted: "ప్రారంభించండి",
    search: "శోధించు",
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
    chooseYourPlan: "നിങ്ങളുടെ പ്ലാൻ തിരഞ്ഞെടുക്കുക",
    transparentPricing: "യഥാർത്ഥ വളർച്ചയ്ക്കുള്ള സുതാര്യമായ വിലനിർണ്ണയം",
    back: "തിരികെ",
    mostPopular: "ഏറ്റവും പ്രചാരമുള്ളത്",
    perMonth: "പ്രതിമാസം",
    getStarted: "ആരംഭിക്കുക",
    search: "തിരയുക",
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
  logout: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>,
  search: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35"/></svg>,
  eye: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>,
  eyeOff: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>,
  menu: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>,
  check: () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>,
 x: () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>,
  crown: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3l3.057 11.834c.17.656.834 1.166 1.518 1.166h4.85c.684 0 1.348-.51 1.518-1.166L19 3m-7 13v5m-4 0h8"/></svg>,
};

// Pricing Page with UPDATED features
function PricingPage({ plan, onClose, onUpgrade, lang = "en" }) {
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
        { text: "Lead preview (up to 10 contacts)", included: true },
        { text: "Multi-language dashboard", included: true },
        { text: "ReplyAstra watermark", included: true },
        { text: "Community support", included: true },
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
        { text: "ReplyAstra AI (20 generations/month)", included: true },
        { text: "Lead generation & contact management", included: true },
        { text: "Multi-language dashboard", included: true },
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
        { text: "ReplyAstra AI Pro (150 generations/month)", included: true },
        { text: "Advanced lead insights & automation", included: true },
        { text: "Multi-language dashboard", included: true },
        { text: "Priority support", included: true },
      ],
    },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="serif text-2xl lg:text-3xl text-gray-900">{t.chooseYourPlan}</h1>
          <p className="text-sm text-gray-500 mt-1">{t.transparentPricing}</p>
        </div>
        <button onClick={onClose} className="text-sm text-gray-600 hover:text-gray-900 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 border border-gray-200">
          {t.back}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {plans.map(p => (
          <div
            key={p.id}
            className={`relative bg-white rounded-2xl border-2 p-6 hover:shadow-lg transition-all ${
              p.popular ? "border-black" : "border-gray-200"
            }`}
          >
            {p.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-bold px-4 py-1 rounded-full">
                {t.mostPopular}
              </div>
            )}
            
            {/* Current Plan Badge */}
            {plan === p.id && (
              <div className="absolute -top-3 right-6 bg-emerald-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                {t.currentPlan}
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="text-xl font-black text-gray-900">{p.name}</h3>
              <div className="mt-4">
                <span className="text-4xl font-black text-gray-900">₹{p.price}</span>
                <span className="text-gray-500 text-sm">/{t.perMonth}</span>
              </div>
            </div>
            <ul className="space-y-3 mb-6">
              {p.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600">
                    <Icons.check />
                  </span>
                  <span className="text-gray-700">{f.text}</span>
                </li>
              ))}
            </ul>
            
            {/* Button always shows - no "Current Plan" on button */}
            <button
              onClick={() => onUpgrade(p.id)}
              disabled={plan === p.id}
              className={`w-full font-bold py-3 rounded-xl text-sm transition-colors ${
                plan === p.id 
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : p.popular 
                    ? "bg-black hover:bg-gray-800 text-white" 
                    : "bg-gray-900 hover:bg-gray-700 text-white"
              }`}
            >
              {t.getStarted}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Settings (keep existing)
function SettingsPage({ user, profile, onProfileUpdate, lang, setLang }) {
  // [Your existing Settings code - keeping it as is]
  return <div className="p-8"><p>Settings</p></div>;
}

// Sidebar with UPGRADE BUTTON
function Sidebar({ page, setPage, plan, monthlyDMs, open, setOpen, lang }) {
  const [search, setSearch] = useState("");
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
    { id: "leads", label: t.leads, Icon: Icons.leads },
    { id: "settings", label: t.settings, Icon: Icons.settings },
  ];

  const SidebarContent = () => (
    <>
      <div className="px-6 py-6 border-b border-gray-100">
        <img src="https://drive.google.com/uc?export=view&id=1CkhHHcGFCr6BmfoE2TylgYJRlJQkcDEC" alt="ReplyAstra" className="h-6 w-auto" />
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
        
        {/* UPGRADE BUTTON - ALWAYS visible for ALL users */}
        <button
          onClick={() => { setPage("pricing"); setOpen?.(false); }}
          className="w-full bg-black hover:bg-gray-800 text-white text-xs font-bold py-2.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Icons.crown />{t.upgradePlan}
        </button>
        
        <button onClick={logout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors">
          <Icons.logout />{t.logout}
        </button>
      </div>
    </>
  );

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-100 flex flex-col z-50 transition-transform duration-300 lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <SidebarContent />
      </aside>
      <aside className="hidden lg:flex w-44 bg-white border-r border-gray-100 flex-col h-screen sticky top-0">
        <SidebarContent />
      </aside>
    </>
  );
}

// Topbar
function Topbar({ page, user, setOpen, lang }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const titles = {
    overview: t.welcome,
    automations: "Flows",
    leads: "Captured Growth",
    settings: "Console",
    pricing: t.chooseYourPlan,
  };
  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there";

  return (
    <header className="bg-white border-b border-gray-100 px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => setOpen(true)} className="lg:hidden p-1 text-gray-600">
          <Icons.menu />
        </button>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold">
            {name.slice(0, 2).toUpperCase()}
          </div>
          <div className="text-xs hidden sm:block">
            <div className="font-semibold text-gray-900">{name}</div>
          </div>
        </div>
      </div>
      <h1 className="serif text-2xl sm:text-4xl text-gray-900 font-normal italic">
        {page === "overview" ? `${t.welcome}, ${name}` : titles[page] || t.welcome}
      </h1>
    </header>
  );
}

// Overview (keep existing)
function OverviewPage({ userId, lang }) {
  // [Your existing Overview code]
  return <div className="p-8"><p>Overview</p></div>;
}

// Root with UPGRADE LOGIC
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

  // BACKEND UPGRADE LOGIC
  async function handleUpgrade(newPlan) {
    if (newPlan === plan) return;

    const currentPlanData = PLAN_LIMITS[plan];
    const newPlanData = PLAN_LIMITS[newPlan];

    let amountToPay = newPlanData.price;
    let upgradeMessage = `Upgrade to ${PLAN_NAMES[newPlan]} for ₹${newPlanData.price}/month?`;

    if (plan !== "free") {
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

        upgradeMessage = `Upgrade to ${PLAN_NAMES[newPlan]}?\n\n${daysRemaining} days remaining.\nProrated amount: ₹${amountToPay}`;
      }
    }

    if (!confirm(upgradeMessage)) return;

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
        alert(`Successfully upgraded to ${PLAN_NAMES[newPlan]}!`);
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
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar page={page} setPage={setPage} plan={plan} monthlyDMs={monthlyDMs} open={sidebarOpen} setOpen={setSidebarOpen} lang={lang} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Topbar page={page} user={user} setOpen={setSidebarOpen} lang={lang} />
          <main className="flex-1 overflow-y-auto">
            {page === "overview" && <OverviewPage userId={user.id} lang={lang} />}
            {page === "automations" && <div className="p-8">Automations</div>}
            {page === "leads" && <div className="p-8">Leads</div>}
            {page === "settings" && <SettingsPage user={user} profile={profile} onProfileUpdate={() => loadProfile(user.id)} lang={lang} setLang={setLang} />}
            {page === "pricing" && <PricingPage plan={plan} onClose={() => setPage("overview")} onUpgrade={handleUpgrade} lang={lang} />}
          </main>
        </div>
      </div>
    </>
  );
}
