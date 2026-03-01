
"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import Image from "next/image";

/* ─────────────────────────────────────────
   PLAN LIMITS (matches planLimits.js)
───────────────────────────────────────── */
const PLAN_LIMITS = {
  free: { automations: 3, accounts: 1, dms: 500, analytics: 7, contacts: 10, ai: 0, aiDaily: 0, price: 0 },
  starter: { automations: 10, accounts: 3, dms: 3000, analytics: 30, contacts: 999999, ai: 20, aiDaily: 3, price: 199 },
  pro: { automations: 50, accounts: 10, dms: 10000, analytics: 90, contacts: 999999, ai: 150, aiDaily: 10, price: 399 },
};
const PLAN_NAMES = { free: "Free", starter: "Starter", pro: "Pro" };
const PLAN_PRICES = { free: 0, starter: 199, pro: 399 };
const YEARLY_PRICES = { free: 0, starter: 169, pro: 339 };

/* ─────────────────────────────────────────
   TRANSLATIONS — full coverage all 6 langs
───────────────────────────────────────── */
const T = {
  en: {
    // Nav
    overview: "Overview", automations: "Automations", contacts: "Contacts",
    replyastraAI: "ReplyAstra AI", upgrade: "Upgrade", settings: "Settings",
    logout: "Logout", usage: "USAGE", monthlyDMs: "monthly DMs",
    // Page headings
    welcome: "Welcome", flows: "Flows", capturedGrowth: "Captured Growth",
    elevate: "Elevate", console: "Console", aiPageTitle: "ReplyAstra AI", dailyLimit: "Daily Limit", monthlyLimit: "Monthly Limit",
    recentConversations: "Recent Conversations", newChat: "New chat", noHistory: "No history yet", historySyncText: "History syncs across devices · kept for", daysText: "days", aiInputPlaceholder: "Ask about captions, hashtags, DM replies...",
    aiConfigTitle: "AI Configuration", aiConfigSubtitle: "Customize how Astra AI responds to comments and DMs.",
    // Overview stats
    sentReplies: "SENT REPLIES", automationHits: "AUTOMATION HITS",
    conversion: "CONVERSION", leadsLabel: "CONTACTS",
    engagementVolume: "Engagement Volume", last7: "LAST 7 DAYS ACTIVITY",
    conversionSources: "Conversion Sources", storyReply: "Story Reply", commentDM: "Comment DM",
    // Automations
    configureKeyword: "CONFIGURE KEYWORD TRIGGERS", newFlow: "NEW FLOW",
    noAutomations: "No automations yet. Create your first flow!",
    automationsUsed: "automations used",
    // Contacts
    contactMgmt: "CONTACT MANAGEMENT", searchPlaceholder: "Search by username...",
    exportCSV: "EXPORT CSV", handle: "HANDLE", engagementScore: "ENGAGEMENT SCORE",
    tags: "TAGS", source: "SOURCE", date: "DATE",
    timeline: "Timeline", analyticsSummary: "Analytics Summary",
    avgEngagement: "AVG ENGAGEMENT", topSource: "TOP SOURCE",
    noContacts: "No contacts yet. Set up automations to capture contacts!",
    notFollowed: "NOT FOLLOWED", following: "FOLLOWING",
    contactLimitReached: "You've reached your 10 contact preview limit.",
    upgradeForContacts: "Upgrade to unlock unlimited contacts",
    // AI Page
    enterPrompt: "ENTER YOUR PROMPT FOR REPLYASTRA AI",
    aiPlaceholder: "e.g. Write a witty reply to a follower asking about my skincare routine...",
    aiDisclaimer: "ReplyAstra AI can make mistakes. Check important info.",
    generateResponse: "GENERATE RESPONSE", generating: "GENERATING...",
    aiResponse: "AI Response", copyResponse: "Copy",
    aiNotAvailable: "ReplyAstra AI is not available on the Free plan.",
    upgradeForAI: "Upgrade to Starter or Pro to use AI.",
    remainingToday: "remaining today", remainingMonth: "remaining this month",
    // AI Config
    toneSelection: "TONE SELECTION", replyLength: "REPLY LENGTH",
    emojiLevel: "EMOJI LEVEL", customInstruction: "CUSTOM INSTRUCTION",
    customInstructionPlaceholder: "Example: Always add a call-to-action. Keep tone energetic. Use brand voice.",
    enableAutoCommentReply: "Enable Auto Comment Reply",
    enableAutoCommentReplyDesc: "Automatically respond to public comments.",
    enableAutoDMReply: "Enable Auto DM Reply",
    enableAutoDMReplyDesc: "Automatically respond to private messages.",
    saveConfiguration: "SAVE CONFIGURATION", saving: "SAVING...",
    configSaved: "Configuration saved!", configError: "Error saving configuration.",
    tones: ["Professional", "Friendly", "Funny", "Sales-focused", "Gen-Z", "Custom"],
    lengths: ["Short", "Medium", "Long"],
    emojiLevels: ["Low", "Medium", "High"],
    // Settings
    profile: "Profile", security: "Security", instagramAccounts: "Instagram Accounts",
    billingPlan: "Billing & Plan", language: "Language",
    fullName: "FULL NAME", emailAddress: "EMAIL ADDRESS",
    saveChanges: "SAVE CHANGES", saving: "SAVING...", saved: "Saved!",
    oldPassword: "OLD PASSWORD", newPassword: "NEW PASSWORD", confirmNew: "CONFIRM NEW",
    updatePassword: "UPDATE PASSWORD", updating: "UPDATING...",
    passwordUpdated: "Password updated!", passwordMismatch: "Passwords don't match.",
    connectedViaMeta: "CONNECTED VIA META", disconnect: "DISCONNECT",
    connectNewAccount: "+ CONNECT NEW ACCOUNT",
    noIGAccounts: "No Instagram accounts connected yet.",
    currentPlan: "CURRENT PLAN", upgradePlan: "UPGRADE PLAN",
    cancelSubscription: "CANCEL SUBSCRIPTION",
    renewsOn: "Renews on",
    // Pricing
    monthly: "MONTHLY", yearly: "YEARLY", savePercent: "SAVE 15%",
    popular: "POPULAR", currentPlanBtn: "CURRENT PLAN",
    upgradeToStarter: "UPGRADE TO STARTER", upgradeToPro: "UPGRADE TO PRO",
    dmPerMonth: "DMs per month", automationRules: "automation rules",
    instagramAccountsCount: "Instagram accounts", analytics: "analytics",
    leadPreview: "Lead preview", multiLang: "Multi-language dashboard",
    watermark: "ReplyAstra watermark", communitySupport: "Community support",
    emailSupport: "Email support", prioritySupport: "Priority support",
    leadGenMgmt: "Lead generation & mgmt", aiGen: "ReplyAstra AI (20 gen/mo)",
    aiGenPro: "ReplyAstra AI Pro (150 gen/mo)", advancedLeads: "Advanced lead insights",
    // Common
    loading: "Loading...", error: "Error",
  },
  kn: {
    overview: "ಅವಲೋಕನ", automations: "ಸ್ವಯಂಚಾಲನೆಗಳು", contacts: "ಸಂಪರ್ಕಗಳು",
    replyastraAI: "ರಿಪ್ಲೈಅಸ್ಟ್ರಾ AI", upgrade: "ನವೀಕರಿಸಿ", settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    logout: "ಲಾಗ್ಔಟ್", usage: "ಬಳಕೆ", monthlyDMs: "ಮಾಸಿಕ DM ಗಳು",
    welcome: "ಸ್ವಾಗತ", flows: "ಫ್ಲೋಸ್", capturedGrowth: "ಕ್ಯಾಪ್ಚರ್ಡ್ ಗ್ರೋಥ್",
    elevate: "ಎಲಿವೇಟ್", console: "ಕನ್ಸೋಲ್", aiPageTitle: "ರಿಪ್ಲೈಅಸ್ಟ್ರಾ AI", dailyLimit: "ದೈನಂದಿನ ಮಿತಿ", monthlyLimit: "ಮಾಸಿಕ ಮಿತಿ",
    recentConversations: "ಇತ್ತೀಚಿನ ಸಂಭಾಷಣೆಗಳು", newChat: "ಹೊಸ ಚಾಟ್", noHistory: "ಇನ್ನೂ কোনো ಇತಿಹಾಸವಿಲ್ಲ", historySyncText: "ಇತಿಹಾಸವು ಎಲ್ಲಾ ಸಾಧನಗಳಲ್ಲಿ ಸಿಂಕ್ ಆಗುತ್ತದೆ · ಉಳಿಸಲಾಗಿದೆ", daysText: "ದಿನಗಳು", aiInputPlaceholder: "ಕ್ಯಾಪ್ಶನ್ಸ್, ಹ್ಯಾಶ್‌ಟ್ಯಾಗ್‌ಗಳು, DM ಕುರಿತು ಕೇಳಿ...",
    aiConfigTitle: "AI ಕಾನ್ಫಿಗರೇಶನ್", aiConfigSubtitle: "Astra AI ಹೇಗೆ ಪ್ರತಿಕ್ರಿಯಿಸುತ್ತದೆ ಎಂಬುದನ್ನು ಕಸ್ಟಮೈಸ್ ಮಾಡಿ.",
    sentReplies: "ಕಳುಹಿಸಿದ ಪ್ರತ್ಯುತ್ತರಗಳು", automationHits: "ಸ್ವಯಂಚಾಲನೆ ಹಿಟ್‌ಗಳು",
    conversion: "ಪರಿವರ್ತನೆ", leadsLabel: "ಸಂಪರ್ಕಗಳು",
    engagementVolume: "ತೊಡಗಿಸಿಕೊಳ್ಳುವಿಕೆ ಪ್ರಮಾಣ", last7: "ಕಳೆದ 7 ದಿನಗಳ ಚಟುವಟಿಕೆ",
    conversionSources: "ಪರಿವರ್ತನೆ ಮೂಲಗಳು", storyReply: "ಸ್ಟೋರಿ ಪ್ರತ್ಯುತ್ತರ", commentDM: "ಕಾಮೆಂಟ್ DM",
    configureKeyword: "ಕೀವರ್ಡ್ ಟ್ರಿಗ್ಗರ್ಸ್ ಕಾನ್ಫಿಗರ್ ಮಾಡಿ", newFlow: "ಹೊಸ ಫ್ಲೋ",
    noAutomations: "ಯಾವುದೇ ಸ್ವಯಂಚಾಲನೆಗಳಿಲ್ಲ. ನಿಮ್ಮ ಮೊದಲ ಫ್ಲೋ ರಚಿಸಿ!",
    automationsUsed: "ಸ್ವಯಂಚಾಲನೆಗಳು ಬಳಸಲಾಗಿದೆ",
    contactMgmt: "ಸಂಪರ್ಕ ನಿರ್ವಹಣೆ", searchPlaceholder: "ಬಳಕೆದಾರಹೆಸರಿನ ಮೂಲಕ ಹುಡುಕಿ...",
    exportCSV: "CSV ರಫ್ತು ಮಾಡಿ", handle: "ಹ್ಯಾಂಡಲ್", engagementScore: "ಎಂಗೇಜ್ಮೆಂಟ್ ಸ್ಕೋರ್",
    tags: "ಟ್ಯಾಗ್‌ಗಳು", source: "ಮೂಲ", date: "ದಿನಾಂಕ",
    timeline: "ಟೈಮ್‌ಲೈನ್", analyticsSummary: "ವಿಶ್ಲೇಷಣೆ ಸಾರಾಂಶ",
    avgEngagement: "ಸರಾಸರಿ ಎಂಗೇಜ್ಮೆಂಟ್", topSource: "ಉನ್ನತ ಮೂಲ",
    noContacts: "ಯಾವುದೇ ಸಂಪರ್ಕಗಳಿಲ್ಲ. ಸಂಪರ್ಕಗಳನ್ನು ಸೆರೆಹಿಡಿಯಲು ಸ್ವಯಂಚಾಲನೆ ಹೊಂದಿಸಿ!",
    notFollowed: "ಅನುಸರಿಸಿಲ್ಲ", following: "ಅನುಸರಿಸುತ್ತಿದ್ದಾರೆ",
    contactLimitReached: "ನೀವು 10 ಸಂಪರ್ಕ ಪೂರ್ವವೀಕ್ಷಣೆ ಮಿತಿ ತಲುಪಿದ್ದೀರಿ.",
    upgradeForContacts: "ಅನಿಯಮಿತ ಸಂಪರ್ಕಗಳನ್ನು ಅನ್‌ಲಾಕ್ ಮಾಡಲು ನವೀಕರಿಸಿ",
    enterPrompt: "ರಿಪ್ಲೈಅಸ್ಟ್ರಾ AI ಗಾಗಿ ನಿಮ್ಮ ಪ್ರಾಂಪ್ಟ್ ನಮೂದಿಸಿ",
    aiPlaceholder: "ಉದಾ: ನನ್ನ ಸ್ಕಿನ್‌ಕೇರ್ ದಿನಚರಿಯ ಬಗ್ಗೆ ಕೇಳುವ ಅನುಯಾಯಿಗೆ ಚಾಣಾಕ್ಷ ಪ್ರತ್ಯುತ್ತರ ಬರೆಯಿರಿ...",
    aiDisclaimer: "ರಿಪ್ಲೈಅಸ್ಟ್ರಾ AI ತಪ್ಪುಗಳನ್ನು ಮಾಡಬಹುದು. ಮುಖ್ಯ ಮಾಹಿತಿ ಪರಿಶೀಲಿಸಿ.",
    generateResponse: "ಪ್ರತಿಕ್ರಿಯೆ ಉತ್ಪಾದಿಸಿ", generating: "ಉತ್ಪಾದಿಸುತ್ತಿದ್ದೇವೆ...",
    aiResponse: "AI ಪ್ರತಿಕ್ರಿಯೆ", copyResponse: "ನಕಲಿಸಿ",
    aiNotAvailable: "ರಿಪ್ಲೈಅಸ್ಟ್ರಾ AI ಉಚಿತ ಯೋಜನೆಯಲ್ಲಿ ಲಭ್ಯವಿಲ್ಲ.",
    upgradeForAI: "AI ಬಳಸಲು Starter ಅಥವಾ Pro ಗೆ ನವೀಕರಿಸಿ.",
    remainingToday: "ಇಂದು ಉಳಿದಿದೆ", remainingMonth: "ಈ ತಿಂಗಳು ಉಳಿದಿದೆ",
    toneSelection: "ಟೋನ್ ಆಯ್ಕೆ", replyLength: "ಪ್ರತ್ಯುತ್ತರ ಉದ್ದ",
    emojiLevel: "ಎಮೋಜಿ ಮಟ್ಟ", customInstruction: "ಕಸ್ಟಮ್ ಸೂಚನೆ",
    customInstructionPlaceholder: "ಉದಾ: ಯಾವಾಗಲೂ ಕ್ರಿಯಾ ಕರೆ ಸೇರಿಸಿ. ಉತ್ಸಾಹಭರಿತ ಟೋನ್ ಇರಿಸಿ.",
    enableAutoCommentReply: "ಸ್ವಯಂ ಕಾಮೆಂಟ್ ಪ್ರತ್ಯುತ್ತರ ಸಕ್ರಿಯಗೊಳಿಸಿ",
    enableAutoCommentReplyDesc: "ಸಾರ್ವಜನಿಕ ಕಾಮೆಂಟ್‌ಗಳಿಗೆ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಪ್ರತಿಕ್ರಿಯಿಸಿ.",
    enableAutoDMReply: "ಸ್ವಯಂ DM ಪ್ರತ್ಯುತ್ತರ ಸಕ್ರಿಯಗೊಳಿಸಿ",
    enableAutoDMReplyDesc: "ಖಾಸಗಿ ಸಂದೇಶಗಳಿಗೆ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಪ್ರತಿಕ್ರಿಯಿಸಿ.",
    saveConfiguration: "ಕಾನ್ಫಿಗರೇಶನ್ ಉಳಿಸಿ", saving: "ಉಳಿಸುತ್ತಿದ್ದೇವೆ...",
    configSaved: "ಕಾನ್ಫಿಗರೇಶನ್ ಉಳಿಸಲಾಗಿದೆ!", configError: "ಕಾನ್ಫಿಗರೇಶನ್ ಉಳಿಸುವಲ್ಲಿ ದೋಷ.",
    tones: ["ವೃತ್ತಿಪರ", "ಸ್ನೇಹಪರ", "ತಮಾಷೆ", "ಮಾರಾಟ-ಕೇಂದ್ರಿತ", "Gen-Z", "ಕಸ್ಟಮ್"],
    lengths: ["ಚಿಕ್ಕ", "ಮಧ್ಯಮ", "ದೊಡ್ಡ"],
    emojiLevels: ["ಕಡಿಮೆ", "ಮಧ್ಯಮ", "ಹೆಚ್ಚು"],
    profile: "ಪ್ರೊಫೈಲ್", security: "ಸುರಕ್ಷತೆ", instagramAccounts: "ಇನ್‌ಸ್ಟಾಗ್ರಾಮ್ ಖಾತೆಗಳು",
    billingPlan: "ಬಿಲ್ಲಿಂಗ್ & ಯೋಜನೆ", language: "ಭಾಷೆ",
    fullName: "ಪೂರ್ಣ ಹೆಸರು", emailAddress: "ಇಮೇಲ್ ವಿಳಾಸ",
    saveChanges: "ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ", saved: "ಉಳಿಸಲಾಗಿದೆ!",
    oldPassword: "ಹಳೆ ಪಾಸ್‌ವರ್ಡ್", newPassword: "ಹೊಸ ಪಾಸ್‌ವರ್ಡ್",
    confirmNew: "ಹೊಸದನ್ನು ದೃಢೀಕರಿಸಿ", updatePassword: "ಪಾಸ್‌ವರ್ಡ್ ಅಪ್‌ಡೇಟ್ ಮಾಡಿ",
    updating: "ಅಪ್‌ಡೇಟ್ ಮಾಡುತ್ತಿದ್ದೇವೆ...",
    passwordUpdated: "ಪಾಸ್‌ವರ್ಡ್ ಅಪ್‌ಡೇಟ್ ಆಗಿದೆ!", passwordMismatch: "ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ.",
    connectedViaMeta: "ಮೆಟಾ ಮೂಲಕ ಸಂಪರ್ಕಿಸಲಾಗಿದೆ", disconnect: "ಡಿಸ್ಕನೆಕ್ಟ್",
    connectNewAccount: "+ ಹೊಸ ಖಾತೆ ಸಂಪರ್ಕಿಸಿ", noIGAccounts: "ಯಾವುದೇ ಇನ್‌ಸ್ಟಾಗ್ರಾಮ್ ಖಾತೆಗಳು ಸಂಪರ್ಕಿಸಲಾಗಿಲ್ಲ.",
    currentPlan: "ಪ್ರಸ್ತುತ ಯೋಜನೆ", upgradePlan: "ಯೋಜನೆ ನವೀಕರಿಸಿ",
    cancelSubscription: "ಚಂದಾದಾರಿಕೆ ರದ್ದುಗೊಳಿಸಿ", renewsOn: "ಇದರಂದು ನವೀಕರಿಸುತ್ತದೆ",
    monthly: "ಮಾಸಿಕ", yearly: "ವಾರ್ಷಿಕ", savePercent: "15% ಉಳಿಸಿ",
    popular: "ಜನಪ್ರಿಯ", currentPlanBtn: "ಪ್ರಸ್ತುತ ಯೋಜನೆ",
    upgradeToStarter: "ಸ್ಟಾರ್ಟರ್‌ಗೆ ನವೀಕರಿಸಿ", upgradeToPro: "ಪ್ರೊಗೆ ನವೀಕರಿಸಿ",
    dmPerMonth: "DMs ಪ್ರತಿ ತಿಂಗಳು", automationRules: "ಸ್ವಯಂಚಾಲನೆ ನಿಯಮಗಳು",
    instagramAccountsCount: "ಇನ್‌ಸ್ಟಾಗ್ರಾಮ್ ಖಾತೆಗಳು", analytics: "ವಿಶ್ಲೇಷಣೆ",
    leadPreview: "ಲೀಡ್ ಪ್ರಿವ್ಯೂ", multiLang: "ಬಹುಭಾಷಾ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    watermark: "ReplyAstra ವಾಟರ್‌ಮಾರ್ಕ್", communitySupport: "ಸಮುದಾಯ ಬೆಂಬಲ",
    emailSupport: "ಇಮೇಲ್ ಬೆಂಬಲ", prioritySupport: "ಆದ್ಯತೆ ಬೆಂಬಲ",
    leadGenMgmt: "ಲೀಡ್ ಉತ್ಪಾದನೆ & ನಿರ್ವಹಣೆ", aiGen: "ReplyAstra AI (20 gen/mo)",
    aiGenPro: "ReplyAstra AI Pro (150 gen/mo)", advancedLeads: "ಸುಧಾರಿತ ಲೀಡ್ ಒಳನೋಟಗಳು",
    loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...", error: "ದೋಷ",
  },
  hi: {
    overview: "अवलोकन", automations: "स्वचालन", contacts: "संपर्क",
    replyastraAI: "रिप्लाईऐस्ट्रा AI", upgrade: "अपग्रेड करें", settings: "सेटिंग्स",
    logout: "लॉगआउट", usage: "उपयोग", monthlyDMs: "मासिक DM",
    welcome: "स्वागत", flows: "फ्लोज़", capturedGrowth: "कैप्चर्ड ग्रोथ",
    elevate: "एलिवेट", console: "कंसोल", aiPageTitle: "रिप्लाईऐस्ट्रा AI", dailyLimit: "दैनिक सीमा", monthlyLimit: "मासिक सीमा",
    recentConversations: "हाल की बातचीत", newChat: "नई चैट", noHistory: "अभी कोई इतिहास नहीं है", historySyncText: "इतिहास सभी उपकरणों में सिंक होता है · सुरक्षित", daysText: "दिन", aiInputPlaceholder: "कैप्शन, हैशटैग, DM के बारे में पूछें...",
    aiConfigTitle: "AI कॉन्फ़िगरेशन", aiConfigSubtitle: "Astra AI कैसे जवाब देता है, इसे कस्टमाइज़ करें।",
    sentReplies: "भेजे गए उत्तर", automationHits: "ऑटोमेशन हिट्स",
    conversion: "रूपांतरण", leadsLabel: "संपर्क",
    engagementVolume: "जुड़ाव की मात्रा", last7: "पिछले 7 दिन की गतिविधि",
    conversionSources: "रूपांतरण स्रोत", storyReply: "स्टोरी रिप्लाई", commentDM: "कमेंट DM",
    configureKeyword: "कीवर्ड ट्रिगर कॉन्फ़िगर करें", newFlow: "नया फ्लो",
    noAutomations: "कोई स्वचालन नहीं। अपना पहला फ्लो बनाएं!",
    automationsUsed: "स्वचालन उपयोग किए गए",
    contactMgmt: "संपर्क प्रबंधन", searchPlaceholder: "उपयोगकर्तानाम से खोजें...",
    exportCSV: "CSV निर्यात करें", handle: "हैंडल", engagementScore: "एंगेजमेंट स्कोर",
    tags: "टैग", source: "स्रोत", date: "तारीख",
    timeline: "टाइमलाइन", analyticsSummary: "एनालिटिक्स सारांश",
    avgEngagement: "औसत एंगेजमेंट", topSource: "शीर्ष स्रोत",
    noContacts: "कोई संपर्क नहीं। संपर्क कैप्चर करने के लिए स्वचालन सेट करें!",
    notFollowed: "फॉलो नहीं किया", following: "फॉलो कर रहे हैं",
    contactLimitReached: "आप 10 संपर्क पूर्वावलोकन सीमा तक पहुंच गए हैं।",
    upgradeForContacts: "असीमित संपर्क अनलॉक करने के लिए अपग्रेड करें",
    enterPrompt: "रिप्लाईऐस्ट्रा AI के लिए अपना प्रॉम्प्ट दर्ज करें",
    aiPlaceholder: "जैसे: मेरी स्किनकेयर रूटीन के बारे में पूछने वाले फॉलोअर के लिए चतुर जवाब लिखें...",
    aiDisclaimer: "रिप्लाईऐस्ट्रा AI गलतियां कर सकता है। महत्वपूर्ण जानकारी जांचें।",
    generateResponse: "प्रतिक्रिया उत्पन्न करें", generating: "उत्पन्न हो रहा है...",
    aiResponse: "AI प्रतिक्रिया", copyResponse: "कॉपी करें",
    aiNotAvailable: "रिप्लाईऐस्ट्रा AI मुफ्त योजना पर उपलब्ध नहीं है।",
    upgradeForAI: "AI का उपयोग करने के लिए Starter या Pro में अपग्रेड करें।",
    remainingToday: "आज शेष", remainingMonth: "इस महीने शेष",
    toneSelection: "टोन चयन", replyLength: "जवाब की लंबाई",
    emojiLevel: "इमोजी स्तर", customInstruction: "कस्टम निर्देश",
    customInstructionPlaceholder: "उदाहरण: हमेशा कॉल-टू-एक्शन जोड़ें। उत्साहजनक टोन रखें।",
    enableAutoCommentReply: "ऑटो कमेंट रिप्लाई सक्षम करें",
    enableAutoCommentReplyDesc: "सार्वजनिक टिप्पणियों पर स्वचालित रूप से जवाब दें।",
    enableAutoDMReply: "ऑटो DM रिप्लाई सक्षम करें",
    enableAutoDMReplyDesc: "निजी संदेशों पर स्वचालित रूप से जवाब दें।",
    saveConfiguration: "कॉन्फ़िगरेशन सहेजें", saving: "सहेज रहे हैं...",
    configSaved: "कॉन्फ़िगरेशन सहेजा गया!", configError: "कॉन्फ़िगरेशन सहेजने में त्रुटि।",
    tones: ["पेशेवर", "मित्रवत", "मज़ेदार", "बिक्री-केंद्रित", "Gen-Z", "कस्टम"],
    lengths: ["छोटा", "मध्यम", "लंबा"],
    emojiLevels: ["कम", "मध्यम", "अधिक"],
    profile: "प्रोफ़ाइल", security: "सुरक्षा", instagramAccounts: "इंस्टाग्राम खाते",
    billingPlan: "बिलिंग & योजना", language: "भाषा",
    fullName: "पूरा नाम", emailAddress: "ईमेल पता",
    saveChanges: "बदलाव सहेजें", saved: "सहेजा गया!",
    oldPassword: "पुराना पासवर्ड", newPassword: "नया पासवर्ड",
    confirmNew: "नया कन्फर्म करें", updatePassword: "पासवर्ड अपडेट करें",
    updating: "अपडेट हो रहा है...",
    passwordUpdated: "पासवर्ड अपडेट हुआ!", passwordMismatch: "पासवर्ड मेल नहीं खाते।",
    connectedViaMeta: "मेटा के माध्यम से जुड़ा", disconnect: "डिस्कनेक्ट",
    connectNewAccount: "+ नया खाता जोड़ें", noIGAccounts: "कोई इंस्टाग्राम खाता नहीं जोड़ा गया।",
    currentPlan: "वर्तमान योजना", upgradePlan: "योजना अपग्रेड करें",
    cancelSubscription: "सदस्यता रद्द करें", renewsOn: "इस तारीख को नवीनीकृत होता है",
    monthly: "मासिक", yearly: "वार्षिक", savePercent: "15% बचाएं",
    popular: "लोकप्रिय", currentPlanBtn: "वर्तमान योजना",
    upgradeToStarter: "Starter में अपग्रेड करें", upgradeToPro: "Pro में अपग्रेड करें",
    dmPerMonth: "DMs प्रति माह", automationRules: "स्वचालन नियम",
    instagramAccountsCount: "इंस्टाग्राम खाते", analytics: "एनालिटिक्स",
    leadPreview: "लीड पूर्वावलोकन", multiLang: "बहुभाषा डैशबोर्ड",
    watermark: "ReplyAstra वॉटरमार्क", communitySupport: "सामुदायिक सहायता",
    emailSupport: "ईमेल सहायता", prioritySupport: "प्राथमिकता सहायता",
    leadGenMgmt: "लीड जनरेशन & प्रबंधन", aiGen: "ReplyAstra AI (20 gen/mo)",
    aiGenPro: "ReplyAstra AI Pro (150 gen/mo)", advancedLeads: "उन्नत लीड अंतर्दृष्टि",
    loading: "लोड हो रहा है...", error: "त्रुटि",
  },
  ta: {
    overview: "கண்ணோட்டம்", automations: "தானியங்குகள்", contacts: "தொடர்புகள்",
    replyastraAI: "ரிப்ளையாஸ்ட்ரா AI", upgrade: "மேம்படுத்து", settings: "அமைப்புகள்",
    logout: "வெளியேறு", usage: "பயன்பாடு", monthlyDMs: "மாதாந்திர DM",
    welcome: "வரவேற்கிறோம்", flows: "ஃப்ளோக்கள்", capturedGrowth: "பெறப்பட்ட வளர்ச்சி",
    elevate: "உயர்வு", console: "கன்சோல்", aiPageTitle: "ரிப்ளையாஸ்ட்ரா AI", dailyLimit: "தினசரி வரம்பு", monthlyLimit: "மாதாந்திர வரம்பு",
    recentConversations: "சமீபத்திய உரையாடல்கள்", newChat: "புதிய அரட்டை", noHistory: "இன்னும் எந்த வரலாறும் இல்லை", historySyncText: "வரலாறு அனைத்து சாதனங்களிலும் ஒத்திசைக்கப்படுகிறது · சேமிக்கப்பட்டது", daysText: "நாட்கள்", aiInputPlaceholder: "கேப்ஷன்ஸ், ஹேஷ்டேக்ஸ், DM பற்றி கேட்க...",
    aiConfigTitle: "AI கட்டமைப்பு", aiConfigSubtitle: "Astra AI எவ்வாறு பதிலளிக்கிறது என்பதை தனிப்பயனாக்கவும்.",
    sentReplies: "அனுப்பிய பதில்கள்", automationHits: "தானியங்கு ஹிட்கள்",
    conversion: "மாற்றம்", leadsLabel: "தொடர்புகள்",
    engagementVolume: "ஈடுபாடு அளவு", last7: "கடந்த 7 நாட்கள் செயல்பாடு",
    conversionSources: "மாற்ற ஆதாரங்கள்", storyReply: "கதை பதில்", commentDM: "கருத்து DM",
    configureKeyword: "சொல்திறவு தூண்டுதல்களை கட்டமைக்கவும்", newFlow: "புதிய ஃப்ளோ",
    noAutomations: "தானியங்குகள் இல்லை. உங்கள் முதல் ஃப்ளோவை உருவாக்குங்கள்!",
    automationsUsed: "தானியங்குகள் பயன்படுத்தப்பட்டன",
    contactMgmt: "தொடர்பு மேலாண்மை", searchPlaceholder: "பயனர்பெயர் மூலம் தேடுங்கள்...",
    exportCSV: "CSV ஏற்றுமதி", handle: "கைப்பிடி", engagementScore: "ஈடுபாடு மதிப்பெண்",
    tags: "குறிச்சொற்கள்", source: "ஆதாரம்", date: "தேதி",
    timeline: "காலவரிசை", analyticsSummary: "பகுப்பாய்வு சுருக்கம்",
    avgEngagement: "சராசரி ஈடுபாடு", topSource: "முதல் ஆதாரம்",
    noContacts: "தொடர்புகள் இல்லை. தொடர்புகளை பெற தானியங்குகள் அமைக்கவும்!",
    notFollowed: "பின்தொடரவில்லை", following: "பின்தொடர்கிறார்கள்",
    contactLimitReached: "நீங்கள் 10 தொடர்பு முன்னோட்ட வரம்பை அடைந்துவிட்டீர்கள்.",
    upgradeForContacts: "வரம்பற்ற தொடர்புகளை திறக்க மேம்படுத்துங்கள்",
    enterPrompt: "ரிப்ளையாஸ்ட்ரா AI க்கான உங்கள் வரியை உள்ளிடவும்",
    aiPlaceholder: "எ.கா: என் சரும பராமரிப்பு பற்றி கேட்கும் பின்தொடர்பவருக்கு புத்திசாலித்தனமான பதில் எழுதவும்...",
    aiDisclaimer: "ரிப்ளையாஸ்ட்ரா AI தவறுகள் செய்யலாம். முக்கிய தகவலை சரிபார்க்கவும்.",
    generateResponse: "பதிலை உருவாக்கவும்", generating: "உருவாக்குகிறது...",
    aiResponse: "AI பதில்", copyResponse: "நகலெடு",
    aiNotAvailable: "ரிப்ளையாஸ்ட்ரா AI இலவச திட்டத்தில் கிடைக்கவில்லை.",
    upgradeForAI: "AI பயன்படுத்த Starter அல்லது Pro க்கு மேம்படுத்துங்கள்.",
    remainingToday: "இன்று மீதம்", remainingMonth: "இந்த மாதம் மீதம்",
    toneSelection: "தொனி தேர்வு", replyLength: "பதிலின் நீளம்",
    emojiLevel: "எமோஜி அளவு", customInstruction: "தனிப்பயன் வழிமுறை",
    customInstructionPlaceholder: "எ.கா: எப்போதும் செயல் அழைப்பு சேர்க்கவும்.",
    enableAutoCommentReply: "தானியங்கு கருத்து பதில் இயக்கவும்",
    enableAutoCommentReplyDesc: "பொது கருத்துகளுக்கு தானாக பதிலளிக்கவும்.",
    enableAutoDMReply: "தானியங்கு DM பதில் இயக்கவும்",
    enableAutoDMReplyDesc: "தனிப்பட்ட செய்திகளுக்கு தானாக பதிலளிக்கவும்.",
    saveConfiguration: "கட்டமைப்பை சேமிக்கவும்", saving: "சேமிக்கிறது...",
    configSaved: "கட்டமைப்பு சேமிக்கப்பட்டது!", configError: "கட்டமைப்பு சேமிப்பதில் பிழை.",
    tones: ["தொழில்முறை", "நட்பான", "வேடிக்கையான", "விற்பனை-கவனம்", "Gen-Z", "தனிப்பயன்"],
    lengths: ["குறுகிய", "நடுத்தர", "நீண்ட"],
    emojiLevels: ["குறைவு", "நடுத்தர", "அதிக"],
    profile: "சுயவிவரம்", security: "பாதுகாப்பு", instagramAccounts: "இன்ஸ்டாகிராம் கணக்குகள்",
    billingPlan: "பில்லிங் & திட்டம்", language: "மொழி",
    fullName: "முழு பெயர்", emailAddress: "மின்னஞ்சல் முகவரி",
    saveChanges: "மாற்றங்களை சேமி", saved: "சேமிக்கப்பட்டது!",
    oldPassword: "பழைய கடவுச்சொல்", newPassword: "புதிய கடவுச்சொல்",
    confirmNew: "புதியதை உறுதிப்படுத்து", updatePassword: "கடவுச்சொல் புதுப்பி",
    updating: "புதுப்பிக்கிறது...",
    passwordUpdated: "கடவுச்சொல் புதுப்பிக்கப்பட்டது!", passwordMismatch: "கடவுச்சொற்கள் பொருந்தவில்லை.",
    connectedViaMeta: "மெட்டா வழியாக இணைக்கப்பட்டது", disconnect: "துண்டிக்கவும்",
    connectNewAccount: "+ புதிய கணக்கை இணைக்கவும்", noIGAccounts: "இன்ஸ்டாகிராம் கணக்குகள் இல்லை.",
    currentPlan: "தற்போதைய திட்டம்", upgradePlan: "திட்டத்தை மேம்படுத்து",
    cancelSubscription: "சந்தாவை ரத்து செய்", renewsOn: "இந்த தேதியில் புதுப்பிக்கப்படும்",
    monthly: "மாதாந்திர", yearly: "வார்ஷிக", savePercent: "15% சேமிக்கவும்",
    popular: "பிரபலமான", currentPlanBtn: "தற்போதைய திட்டம்",
    upgradeToStarter: "Starter க்கு மேம்படுத்து", upgradeToPro: "Pro க்கு மேம்படுத்து",
    dmPerMonth: "DMs மாதத்திற்கு", automationRules: "தானியங்கு விதிகள்",
    instagramAccountsCount: "இன்ஸ்டாகிராம் கணக்குகள்", analytics: "பகுப்பாய்வு",
    leadPreview: "லீட் முன்னோட்டம்", multiLang: "பல மொழி டாஷ்போர்டு",
    watermark: "ReplyAstra நீர்முத்திரை", communitySupport: "சமூக ஆதரவு",
    emailSupport: "மின்னஞ்சல் ஆதரவு", prioritySupport: "முன்னுரிமை ஆதரவு",
    leadGenMgmt: "லீட் உருவாக்கம் & மேலாண்மை", aiGen: "ReplyAstra AI (20 gen/mo)",
    aiGenPro: "ReplyAstra AI Pro (150 gen/mo)", advancedLeads: "மேம்பட்ட லீட் நுண்ணறிவு",
    loading: "ஏற்றுகிறது...", error: "பிழை",
  },
  te: {
    overview: "అవలోకనం", automations: "ఆటోమేషన్లు", contacts: "పరిచయాలు",
    replyastraAI: "రిప్లైఅస్ట్రా AI", upgrade: "అప్‌గ్రేడ్", settings: "సెట్టింగ్‌లు",
    logout: "లాగౌట్", usage: "వినియోగం", monthlyDMs: "నెలవారీ DM",
    welcome: "స్వాగతం", flows: "ఫ్లోలు", capturedGrowth: "కాప్చర్డ్ గ్రోత్",
    elevate: "ఎలివేట్", console: "కన్సోల్", aiPageTitle: "రిప్లైఅస్ట్రా AI", dailyLimit: "రోజువారీ పరిమితి", monthlyLimit: "నెలవారీ పరిమితి",
    recentConversations: "ఇటీవలి సంభాషణలు", newChat: "కొత్త చాట్", noHistory: "ఇంకా చరిత్ర లేదు", historySyncText: "చరిత్ర అన్ని పరికరాల్లో సమకాలీకరించబడుతుంది · సురక్షితం", daysText: "రోజులు", aiInputPlaceholder: "క్యాప్షన్స్, హ్యాష్‌టాగ్స్, DM గురించి అడగండి...",
    aiConfigTitle: "AI కాన్ఫిగరేషన్", aiConfigSubtitle: "Astra AI ఎలా స్పందిస్తుందో అనుకూలీకరించండి.",
    sentReplies: "పంపిన రిప్లైలు", automationHits: "ఆటోమేషన్ హిట్స్",
    conversion: "మార్పిడి", leadsLabel: "పరిచయాలు",
    engagementVolume: "ఎంగేజ్మెంట్ వాల్యూమ్", last7: "గత 7 రోజుల కార్యకలాపాలు",
    conversionSources: "మార్పిడి మూలాలు", storyReply: "స్టోరీ రిప్లై", commentDM: "కామెంట్ DM",
    configureKeyword: "కీవర్డ్ ట్రిగర్లను కాన్ఫిగర్ చేయండి", newFlow: "కొత్త ఫ్లో",
    noAutomations: "ఆటోమేషన్లు లేవు. మీ మొదటి ఫ్లో సృష్టించండి!",
    automationsUsed: "ఆటోమేషన్లు ఉపయోగించబడ్డాయి",
    contactMgmt: "పరిచయ నిర్వహణ", searchPlaceholder: "వినియోగదారు పేరు ద్వారా శోధించండి...",
    exportCSV: "CSV ఎగుమతి", handle: "హ్యాండిల్", engagementScore: "ఎంగేజ్మెంట్ స్కోర్",
    tags: "ట్యాగ్‌లు", source: "మూలం", date: "తేదీ",
    timeline: "టైమ్‌లైన్", analyticsSummary: "అనలిటిక్స్ సారాంశం",
    avgEngagement: "సగటు ఎంగేజ్మెంట్", topSource: "అగ్ర మూలం",
    noContacts: "పరిచయాలు లేవు. పరిచయాలు సేకరించడానికి ఆటోమేషన్లు సెటప్ చేయండి!",
    notFollowed: "ఫాలో చేయలేదు", following: "ఫాలో చేస్తున్నారు",
    contactLimitReached: "మీరు 10 పరిచయ ప్రివ్యూ పరిమితికి చేరుకున్నారు.",
    upgradeForContacts: "అపరిమిత పరిచయాలను అన్‌లాక్ చేయడానికి అప్‌గ్రేడ్ చేయండి",
    enterPrompt: "రిప్లైఅస్ట్రా AI కోసం మీ ప్రాంప్ట్ నమోదు చేయండి",
    aiPlaceholder: "ఉదా: నా స్కిన్‌కేర్ రొటీన్ గురించి అడిగే అనుచరునికి తెలివైన జవాబు రాయండి...",
    aiDisclaimer: "రిప్లైఅస్ట్రా AI తప్పులు చేయవచ్చు. ముఖ్యమైన సమాచారాన్ని తనిఖీ చేయండి.",
    generateResponse: "ప్రతిస్పందన రూపొందించు", generating: "రూపొందిస్తోంది...",
    aiResponse: "AI ప్రతిస్పందన", copyResponse: "కాపీ",
    aiNotAvailable: "రిప్లైఅస్ట్రా AI ఉచిత ప్లాన్‌లో అందుబాటులో లేదు.",
    upgradeForAI: "AI ఉపయోగించడానికి Starter లేదా Pro కి అప్‌గ్రేడ్ చేయండి.",
    remainingToday: "ఈరోజు మిగిలింది", remainingMonth: "ఈ నెల మిగిలింది",
    toneSelection: "టోన్ ఎంపిక", replyLength: "జవాబు పొడవు",
    emojiLevel: "ఎమోజీ స్థాయి", customInstruction: "కస్టమ్ సూచన",
    customInstructionPlaceholder: "ఉదా: ఎల్లప్పుడూ చర్య పిలుపు జోడించండి.",
    enableAutoCommentReply: "ఆటో కామెంట్ రిప్లై ప్రారంభించు",
    enableAutoCommentReplyDesc: "పబ్లిక్ కామెంట్లకు స్వయంచాలకంగా స్పందించు.",
    enableAutoDMReply: "ఆటో DM రిప్లై ప్రారంభించు",
    enableAutoDMReplyDesc: "ప్రైవేట్ సందేశాలకు స్వయంచాలకంగా స్పందించు.",
    saveConfiguration: "కాన్ఫిగరేషన్ సేవ్ చేయి", saving: "సేవ్ చేస్తోంది...",
    configSaved: "కాన్ఫిగరేషన్ సేవ్ చేయబడింది!", configError: "కాన్ఫిగరేషన్ సేవ్ చేయడంలో లోపం.",
    tones: ["వృత్తిపరంగా", "స్నేహపూర్వకంగా", "హాస్యంగా", "అమ్మకాల-దృష్టి", "Gen-Z", "కస్టమ్"],
    lengths: ["చిన్న", "మధ్యమ", "పొడవైన"],
    emojiLevels: ["తక్కువ", "మధ్యమ", "అధిక"],
    profile: "ప్రొఫైల్", security: "భద్రత", instagramAccounts: "ఇన్‌స్టాగ్రామ్ ఖాతాలు",
    billingPlan: "బిల్లింగ్ & ప్లాన్", language: "భాష",
    fullName: "పూర్తి పేరు", emailAddress: "ఇమెయిల్ చిరునామా",
    saveChanges: "మార్పులు సేవ్ చేయి", saved: "సేవ్ చేయబడింది!",
    oldPassword: "పాత పాస్‌వర్డ్", newPassword: "కొత్త పాస్‌వర్డ్",
    confirmNew: "కొత్తది నిర్ధారించు", updatePassword: "పాస్‌వర్డ్ అప్‌డేట్ చేయి",
    updating: "అప్‌డేట్ చేస్తోంది...",
    passwordUpdated: "పాస్‌వర్డ్ అప్‌డేట్ చేయబడింది!", passwordMismatch: "పాస్‌వర్డ్లు సరిపోలడం లేదు.",
    connectedViaMeta: "మెటా ద్వారా కనెక్ట్ చేయబడింది", disconnect: "డిస్‌కనెక్ట్",
    connectNewAccount: "+ కొత్త ఖాతా కనెక్ట్ చేయండి", noIGAccounts: "ఇన్‌స్టాగ్రామ్ ఖాతాలు కనెక్ట్ చేయబడలేదు.",
    currentPlan: "ప్రస్తుత ప్లాన్", upgradePlan: "ప్లాన్ అప్‌గ్రేడ్ చేయండి",
    cancelSubscription: "సబ్‌స్క్రిప్షన్ రద్దు చేయండి", renewsOn: "ఈ తేదీన రెన్యూ అవుతుంది",
    monthly: "నెలవారీ", yearly: "వార్షిక", savePercent: "15% ఆదా చేయండి",
    popular: "ప్రసిద్ధ", currentPlanBtn: "ప్రస్తుత ప్లాన్",
    upgradeToStarter: "Starter కి అప్‌గ్రేడ్ చేయండి", upgradeToPro: "Pro కి అప్‌గ్రేడ్ చేయండి",
    dmPerMonth: "DMs నెలకు", automationRules: "ఆటోమేషన్ నియమాలు",
    instagramAccountsCount: "ఇన్‌స్టాగ్రామ్ ఖాతాలు", analytics: "అనలిటిక్స్",
    leadPreview: "లీడ్ ప్రివ్యూ", multiLang: "బహుభాష డాష్‌బోర్డ్",
    watermark: "ReplyAstra వాటర్‌మార్క్", communitySupport: "కమ్యూనిటీ సహాయం",
    emailSupport: "ఇమెయిల్ సహాయం", prioritySupport: "ప్రాధాన్యత సహాయం",
    leadGenMgmt: "లీడ్ జనరేషన్ & నిర్వహణ", aiGen: "ReplyAstra AI (20 gen/mo)",
    aiGenPro: "ReplyAstra AI Pro (150 gen/mo)", advancedLeads: "అధునాతన లీడ్ అంతర్దృష్టులు",
    loading: "లోడ్ అవుతోంది...", error: "లోపం",
  },
  ml: {
    overview: "അവലോകനം", automations: "ഓട്ടോമേഷനുകൾ", contacts: "കോൺടാക്റ്റുകൾ",
    replyastraAI: "റിപ്ലൈഅസ്‌ട്രാ AI", upgrade: "അപ്‌ഗ്രേഡ്", settings: "ക്രമീകരണങ്ങൾ",
    logout: "പുറത്തുകടക്കുക", usage: "ഉപയോഗം", monthlyDMs: "പ്രതിമാസ DM",
    welcome: "സ്വാഗതം", flows: "ഫ്ലോകൾ", capturedGrowth: "ക്യാപ്ചർ ചെയ്ത വളർച്ച",
    elevate: "ഉയരം", console: "കൺസോൾ", aiPageTitle: "റിപ്ലൈഅസ്‌ട്രാ AI", dailyLimit: "പ്രതിദിന പരിധി", monthlyLimit: "പ്രതിമാസ പരിധി",
    recentConversations: "സമീപകാല സംഭാഷണങ്ങൾ", newChat: "പുതിയ ചാറ്റ്", noHistory: "ഇതുവരെ ചരിത്രമില്ല", historySyncText: "ചരിത്രം എല്ലാ ഉപകരണങ്ങളിലും സമന്വയിപ്പിക്കുന്നു · സംരക്ഷിച്ചിരിക്കുന്നു", daysText: "ദിവസങ്ങൾ", aiInputPlaceholder: "ക്യാപ്ഷൻസ്, ഹാഷ്‌ടാഗുകൾ, DM എന്നിവയെക്കുറിച്ച് ചോദിക്കുക...",
    aiConfigTitle: "AI കോൺഫിഗറേഷൻ", aiConfigSubtitle: "Astra AI എങ്ങനെ പ്രതികരിക്കുന്നുവെന്ന് ഇഷ്ടാനുസൃതമാക്കുക.",
    sentReplies: "അയച്ച മറുപടികൾ", automationHits: "ഓട്ടോമേഷൻ ഹിറ്റുകൾ",
    conversion: "പരിവർത്തനം", leadsLabel: "കോൺടാക്റ്റുകൾ",
    engagementVolume: "ഇടപഴകൽ വോളിയം", last7: "കഴിഞ്ഞ 7 ദിവസങ്ങളിലെ പ്രവർത്തനം",
    conversionSources: "പരിവർത്തന സ്രോതസ്സുകൾ", storyReply: "സ്റ്റോറി മറുപടി", commentDM: "കമന്റ് DM",
    configureKeyword: "കീവേഡ് ട്രിഗറുകൾ കോൺഫിഗർ ചെയ്യുക", newFlow: "പുതിയ ഫ്ലോ",
    noAutomations: "ഓട്ടോമേഷനുകൾ ഇല്ല. നിങ്ങളുടെ ആദ്യ ഫ്ലോ സൃഷ്ടിക്കുക!",
    automationsUsed: "ഓട്ടോമേഷനുകൾ ഉപയോഗിച്ചു",
    contactMgmt: "കോൺടാക്റ്റ് മാനേജ്മെന്റ്", searchPlaceholder: "ഉപയോക്തൃനാമം ഉപയോഗിച്ച് തിരയുക...",
    exportCSV: "CSV എക്‌സ്‌പോർട്ട്", handle: "ഹാൻഡിൽ", engagementScore: "ഇടപഴകൽ സ്‌കോർ",
    tags: "ടാഗുകൾ", source: "ഉറവിടം", date: "തീയതി",
    timeline: "ടൈംലൈൻ", analyticsSummary: "അനലിറ്റിക്‌സ് സംഗ്രഹം",
    avgEngagement: "ശരാശരി ഇടപഴകൽ", topSource: "മുതൽ ഉറവിടം",
    noContacts: "കോൺടാക്റ്റുകൾ ഇല്ല. കോൺടാക്റ്റുകൾ ക്യാപ്ചർ ചെയ്യാൻ ഓട്ടോമേഷനുകൾ സജ്ജീകരിക്കുക!",
    notFollowed: "ഫോളോ ചെയ്തിട്ടില്ല", following: "ഫോളോ ചെയ്യുന്നു",
    contactLimitReached: "നിങ്ങൾ 10 കോൺടാക്റ്റ് പ്രിവ്യൂ പരിധിയിലെത്തി.",
    upgradeForContacts: "പരിധിയില്ലാത്ത കോൺടാക്റ്റുകൾ അൺലോക്ക് ചെയ്യാൻ അപ്‌ഗ്രേഡ് ചെയ്യുക",
    enterPrompt: "റിപ്ലൈഅസ്‌ട്രാ AI നായി നിങ്ങളുടെ പ്രോംപ്റ്റ് നൽകുക",
    aiPlaceholder: "ഉദാ: എൻ്റെ സ്കിൻകെയർ റൂട്ടീൻ ചോദിക്കുന്ന ഫോളോവർക്ക് മറുപടി എഴുതുക...",
    aiDisclaimer: "റിപ്ലൈഅസ്‌ട്രാ AI തെറ്റുകൾ ചെയ്യാം. പ്രധാന വിവരങ്ങൾ പരിശോധിക്കുക.",
    generateResponse: "പ്രതികരണം ഉണ്ടാക്കുക", generating: "ഉണ്ടാക്കുന്നു...",
    aiResponse: "AI പ്രതികരണം", copyResponse: "പകർത്തുക",
    aiNotAvailable: "റിപ്ലൈഅസ്‌ട്രാ AI സൗജന്യ പ്ലാനിൽ ലഭ്യമല്ല.",
    upgradeForAI: "AI ഉപയോഗിക്കാൻ Starter അല്ലെങ്കിൽ Pro ലേക്ക് അപ്‌ഗ്രേഡ് ചെയ്യുക.",
    remainingToday: "ഇന്ന് ശേഷിക്കുന്നു", remainingMonth: "ഈ മാസം ശേഷിക്കുന്നു",
    toneSelection: "ടോൺ തിരഞ്ഞെടുക്കൽ", replyLength: "മറുപടി ദൈർഘ്യം",
    emojiLevel: "ഇമോജി നില", customInstruction: "ഇഷ്ടാനുസൃത നിർദ്ദേശം",
    customInstructionPlaceholder: "ഉദാ: എപ്പോഴും ആക്‌ഷൻ കോൾ ചേർക്കുക.",
    enableAutoCommentReply: "ഓട്ടോ കമന്റ് മറുപടി പ്രവർത്തനക്ഷമമാക്കുക",
    enableAutoCommentReplyDesc: "പൊതു കമന്റുകൾക്ക് സ്വയം പ്രതികരിക്കുക.",
    enableAutoDMReply: "ഓട്ടോ DM മറുപടി പ്രവർത്തനക്ഷമമാക്കുക",
    enableAutoDMReplyDesc: "സ്വകാര്യ സന്ദേശങ്ങൾക്ക് സ്വയം പ്രതികരിക്കുക.",
    saveConfiguration: "കോൺഫിഗറേഷൻ സംരക്ഷിക്കുക", saving: "സംരക്ഷിക്കുന്നു...",
    configSaved: "കോൺഫിഗറേഷൻ സംരക്ഷിച്ചു!", configError: "കോൺഫിഗറേഷൻ സംരക്ഷിക്കുന്നതിൽ പിശക്.",
    tones: ["പ്രൊഫഷണൽ", "സൗഹൃദം", "രസകരം", "വിൽപ്പന-ശ്രദ്ധ", "Gen-Z", "ഇഷ്ടാനുസൃതം"],
    lengths: ["ചെറിയ", "ഇടത്തരം", "നീണ്ട"],
    emojiLevels: ["കുറഞ്ഞ", "ഇടത്തരം", "ഉയർന്ന"],
    profile: "പ്രൊഫൈൽ", security: "സുരക്ഷ", instagramAccounts: "ഇൻസ്റ്റാഗ്രാം അക്കൗണ്ടുകൾ",
    billingPlan: "ബില്ലിംഗ് & പ്ലാൻ", language: "ഭാഷ",
    fullName: "പൂർണ്ണ പേര്", emailAddress: "ഇമെയിൽ വിലാസം",
    saveChanges: "മാറ്റങ്ങൾ സംരക്ഷിക്കുക", saved: "സംരക്ഷിച്ചു!",
    oldPassword: "പഴയ പാസ്‌വേഡ്", newPassword: "പുതിയ പാസ്‌വേഡ്",
    confirmNew: "പുതിയത് സ്ഥിരീകരിക്കുക", updatePassword: "പാസ്‌വേഡ് അപ്‌ഡേറ്റ് ചെയ്യുക",
    updating: "അപ്‌ഡേറ്റ് ചെയ്യുന്നു...",
    passwordUpdated: "പാസ്‌വേഡ് അപ്‌ഡേറ്റ് ചെയ്തു!", passwordMismatch: "പാസ്‌വേഡുകൾ പൊരുത്തപ്പെടുന്നില്ല.",
    connectedViaMeta: "മെറ്റ വഴി കണക്ട് ചെയ്തു", disconnect: "വിച്ഛേദിക്കുക",
    connectNewAccount: "+ പുതിയ അക്കൗണ്ട് കണക്ട് ചെയ്യുക", noIGAccounts: "ഇൻസ്റ്റാഗ്രാം അക്കൗണ്ടുകൾ ഇല്ല.",
    currentPlan: "നിലവിലെ പ്ലാൻ", upgradePlan: "പ്ലാൻ അപ്‌ഗ്രേഡ് ചെയ്യുക",
    cancelSubscription: "സബ്‌സ്ക്രിപ്ഷൻ റദ്ദാക്കുക", renewsOn: "ഈ തീയതിയിൽ പുതുക്കും",
    monthly: "മാസം", yearly: "വർഷം", savePercent: "15% ലാഭം",
    popular: "ജനപ്രിയം", currentPlanBtn: "നിലവിലെ പ്ലാൻ",
    upgradeToStarter: "Starter ലേക്ക് അപ്‌ഗ്രേഡ്", upgradeToPro: "Pro ലേക്ക് അപ്‌ഗ്രേഡ്",
    dmPerMonth: "DMs മാസം", automationRules: "ഓട്ടോമേഷൻ നിയമങ്ങൾ",
    instagramAccountsCount: "ഇൻസ്റ്റാഗ്രാം അക്കൗണ്ടുകൾ", analytics: "അനലിറ്റിക്‌സ്",
    leadPreview: "ലീഡ് പ്രിവ്യൂ", multiLang: "ബഹുഭാഷ ഡാഷ്ബോർഡ്",
    watermark: "ReplyAstra വാട്ടർമാർക്ക്", communitySupport: "കമ്മ്യൂണിറ്റി സഹായം",
    emailSupport: "ഇമെയിൽ സഹായം", prioritySupport: "മുൻഗണനാ സഹായം",
    leadGenMgmt: "ലീഡ് ജനറേഷൻ & മാനേജ്മെന്റ്", aiGen: "ReplyAstra AI (20 gen/mo)",
    aiGenPro: "ReplyAstra AI Pro (150 gen/mo)", advancedLeads: "നൂതന ലീഡ് ഉൾക്കാഴ്ചകൾ",
    loading: "ലോഡ് ചെയ്യുന്നു...", error: "പിശക്",
  },
};

const LANGS = [
  { code: "en", label: "English" },
  { code: "kn", label: "Kannada" },
  { code: "hi", label: "Hindi" },
  { code: "ta", label: "Tamil" },
  { code: "te", label: "Telugu" },
  { code: "ml", label: "Malayalam" },
];

/* ─────────────────────────────────────────
   ICONS
───────────────────────────────────────── */
const IC = {
  overview: () => <svg className="w-[15px] h-[15px] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>,
  automations: () => <svg className="w-[15px] h-[15px] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  contacts: () => <svg className="w-[15px] h-[15px] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  ai: () => <svg className="w-[15px] h-[15px] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>,
  upgrade: () => <svg className="w-[15px] h-[15px] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>,
  settings: () => <svg className="w-[15px] h-[15px] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><circle cx="12" cy="12" r="3" /></svg>,
  logout: () => <svg className="w-[15px] h-[15px] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  menu: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>,
  close: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>,
  trash: () => <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  ig: () => <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>,
  check: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
  cross: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>,
  copy: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
  filter: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" /></svg>,
  export: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
  user: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  shield: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  card: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
  globe: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
  timeline: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  analytics: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  tone: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>,
  length: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h10M4 14h16M4 18h10" /></svg>,
  emoji: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  spark: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
};

/* ─────────────────────────────────────────
   LOGO — uses public/logo.png
───────────────────────────────────────── */
function Logo() {
  return (
    <div className="flex items-center select-none">
      <img src="/logo.png" alt="ReplyAstra" className="h-8 w-auto object-contain" />
    </div>
  );
}

/* ─────────────────────────────────────────
   SPINNER
───────────────────────────────────────── */
function Spinner({ full }) {
  return (
    <div className={`flex items-center justify-center ${full ? "h-screen" : "py-20"}`}>
      <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
    </div>
  );
}

/* ─────────────────────────────────────────
   TOGGLE
───────────────────────────────────────── */
function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none ${checked ? "bg-gray-900" : "bg-gray-200"}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}

/* ─────────────────────────────────────────
   SERIF HEADING
───────────────────────────────────────── */
const serifStyle = (size = "clamp(28px,4vw,42px)") => ({
  fontFamily: "'Georgia','Times New Roman',serif",
  fontSize: size, fontStyle: "italic", fontWeight: "400", color: "#111",
});

/* ─────────────────────────────────────────
   STAT CARD
───────────────────────────────────────── */
function StatCard({ label, value, delta, icon: Icon }) {
  const pos = delta >= 0;
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 sm:p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {Icon && <span className="text-gray-300"><Icon /></span>}
          <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">{label}</p>
        </div>
        <span className={`text-[11px] font-semibold ${pos ? "text-green-600" : "text-red-500"}`}>
          {pos ? "+" : ""}{delta}%
        </span>
      </div>
      <p style={serifStyle("28px")}>{value}</p>
    </div>
  );
}

/* ─────────────────────────────────────────
   CUSTOM TOOLTIP
───────────────────────────────────────── */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-lg px-3 py-2 shadow-lg text-sm">
      <p className="text-gray-400 text-[11px] mb-0.5">{label}</p>
      <p className="font-semibold text-gray-900">{payload[0].value} DMs</p>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE: OVERVIEW
───────────────────────────────────────── */
function OverviewPage({ userName, stats, chartData, sources, t }) {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <h1 style={serifStyle()} className="mb-6 sm:mb-8">{t.welcome}, {userName}</h1>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <StatCard label={t.sentReplies} value={stats.sentReplies} delta={stats.sentRepliesDelta} />
        <StatCard label={t.automationHits} value={stats.automationHits} delta={stats.automationHitsDelta} />
        <StatCard label={t.conversion} value={`${stats.conversion}%`} delta={stats.conversionDelta} />
        <StatCard label={t.leadsLabel} value={stats.leads} delta={stats.leadsDelta} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl p-4 sm:p-5">
          <p style={serifStyle("18px")}>{t.engagementVolume}</p>
          <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-4">{t.last7}</p>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={chartData} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="value" stroke="#111" strokeWidth={1.5} dot={false} activeDot={{ r: 4, fill: "#111" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 sm:p-5">
          <p style={serifStyle("18px")} className="mb-5">{t.conversionSources}</p>
          {sources.map((s) => (
            <div key={s.label} className="mb-4">
              <div className="flex justify-between text-[11px] mb-1.5">
                <span className="font-medium text-gray-500 uppercase tracking-wider">{s.label}</span>
                <span className="font-semibold text-gray-900">{s.pct}%</span>
              </div>
              <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gray-900 rounded-full" style={{ width: `${s.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE: AUTOMATIONS
───────────────────────────────────────── */
function AutomationsPage({ automations, setAutomations, plan, t }) {
  const lim = PLAN_LIMITS[plan] || PLAN_LIMITS.free;

  const toggleAuto = async (id, current) => {
    const { error } = await supabase.from("automations").update({ is_active: !current }).eq("id", id);
    if (!error) setAutomations(prev => prev.map(a => a.id === id ? { ...a, is_active: !current } : a));
  };
  const deleteAuto = async (id) => {
    if (!confirm("Delete this automation?")) return;
    const { error } = await supabase.from("automations").delete().eq("id", id);
    if (!error) setAutomations(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <h1 style={serifStyle()} className="mb-6 sm:mb-8">{t.flows}</h1>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100">
          <div>
            <p style={serifStyle("20px")}>Automations</p>
            <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mt-0.5">{t.configureKeyword}</p>
          </div>
          <a href="/dashboard/new-automation">
            <button className="bg-gray-900 text-white text-[11px] font-semibold tracking-widest px-5 py-2.5 rounded-full hover:bg-gray-700 transition-colors whitespace-nowrap">
              {t.newFlow}
            </button>
          </a>
        </div>

        {automations.length === 0 ? (
          <div className="py-16 text-center"><p className="text-gray-400 text-sm">{t.noAutomations}</p></div>
        ) : (
          automations.map((auto) => (
            <div key={auto.id} className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  "{auto.keyword}"
                  {auto.hit_count > 0 && <span className="ml-2 text-[11px] text-gray-400 font-normal">{auto.hit_count} HITS</span>}
                </p>
                <p className="text-xs text-gray-400 truncate mt-0.5">{auto.response_message || "No reply set"}</p>
              </div>
              <Toggle checked={!!auto.is_active} onChange={() => toggleAuto(auto.id, auto.is_active)} />
              <button onClick={() => deleteAuto(auto.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                <IC.trash />
              </button>
            </div>
          ))
        )}
      </div>
      <p className="text-xs text-gray-400 mt-4 text-right">{automations.length} / {lim.automations} {t.automationsUsed}</p>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE: CONTACTS
───────────────────────────────────────── */
function ContactsPage({ contacts, plan, t }) {
  const [search, setSearch] = useState("");
  const lim = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  const isLimited = plan === "free";

  const filtered = contacts.filter(c =>
    !search || c.ig_handle?.toLowerCase().includes(search.toLowerCase())
  );

  const displayedContacts = isLimited ? filtered.slice(0, 10) : filtered;

  const totalDMs = contacts.length;
  const avgEngagement = contacts.length > 0
    ? Math.round(contacts.reduce((s, c) => s + (c.engagement_score || 0), 0) / contacts.length)
    : 0;
  const topSrc = contacts.length > 0
    ? contacts.reduce((acc, c) => {
      acc[c.source] = (acc[c.source] || 0) + 1;
      return acc;
    }, {})
    : {};
  const topSource = Object.entries(topSrc).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  const recentTimeline = contacts.slice(0, 3).map((c, i) => ({
    id: i, handle: c.ig_handle, source: c.source, minutes: (i + 1) * 60,
  }));

  const exportCSV = () => {
    const rows = [["Handle", "Engagement Score", "Source", "Date"]];
    contacts.forEach(c => rows.push([`@${c.ig_handle}`, c.engagement_score || 0, c.source || "", c.created_at ? new Date(c.created_at).toLocaleDateString() : ""]));
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "contacts.csv"; a.click();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      {/* Contacts table */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100">
          <div>
            <p style={serifStyle("20px")}>Contacts</p>
            <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mt-0.5">{t.contactMgmt}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 w-full sm:w-44"
              />
            </div>
            <button className="text-gray-400 hover:text-gray-600 p-2 rounded-lg border border-gray-200 hover:border-gray-400 transition-colors"><IC.filter /></button>
            {plan !== "free" && (
              <button onClick={exportCSV} className="flex items-center gap-2 bg-gray-900 text-white text-[11px] font-semibold tracking-widest px-4 py-2.5 rounded-full hover:bg-gray-700 transition-colors">
                <IC.export /> {t.exportCSV}
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-5 px-4 sm:px-6 py-3 bg-gray-50 border-b border-gray-100">
              {[t.handle, t.engagementScore, t.tags, t.source, t.date].map(h => (
                <p key={h} className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">{h}</p>
              ))}
            </div>

            {displayedContacts.length === 0 ? (
              <div className="py-12 text-center"><p className="text-gray-400 text-sm">{t.noContacts}</p></div>
            ) : (
              displayedContacts.map((c) => {
                const initials = (c.ig_handle || "U").slice(0, 2).toUpperCase();
                const score = c.engagement_score || 45;
                return (
                  <div key={c.id} className="grid grid-cols-5 px-4 sm:px-6 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-semibold text-gray-600 flex-shrink-0">{initials}</div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">@@{c.ig_handle}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">{c.is_following ? t.following : t.notFollowed}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 max-w-[80px] h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-900 rounded-full" style={{ width: `${Math.min(score, 100)}%` }} />
                      </div>
                      <span className="text-sm text-gray-600">{score}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                        {c.tag || "LEAD"} +
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">#{c.source || "INFO"}</p>
                    <div>
                      <p className="text-sm text-gray-400">{c.created_at ? new Date(c.created_at).toLocaleDateString() : "—"}</p>
                      <p className="text-[10px] text-gray-300">{c.created_at ? new Date(c.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {isLimited && contacts.length >= 10 && (
          <div className="px-6 py-4 bg-amber-50 border-t border-amber-100 text-center">
            <p className="text-sm text-amber-700">{t.contactLimitReached} <a href="#" onClick={() => { }} className="font-semibold underline">{t.upgradeForContacts}</a></p>
          </div>
        )}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <IC.timeline />
            <p style={serifStyle("20px")}>Timeline</p>
          </div>
          {recentTimeline.length === 0 ? (
            <p className="text-sm text-gray-400">{t.noContacts}</p>
          ) : (
            recentTimeline.map(r => (
              <div key={r.id} className="flex items-start gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-gray-300 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-800">New interaction from @{r.handle}</p>
                  <p className="text-xs text-gray-400">Captured via #{r.source} trigger · {r.minutes / 60}h ago</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <IC.analytics />
            <p style={serifStyle("20px")}>{t.analyticsSummary}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-1">{t.avgEngagement}</p>
              <p style={serifStyle("28px")}>{avgEngagement}%</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-1">{t.topSource}</p>
              <p style={serifStyle("22px")}>#{topSource}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE: REPLYASTRA AI (Premium Assistant UI)
───────────────────────────────────────── */
function AIPage({ plan, user, t }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const scrollRef = useCallback(node => { if (node) node.scrollIntoView({ behavior: "smooth" }); }, []);
  const abortRef = useRef(null);
  const hasAI = plan !== "free";

  const stop = () => {
    if (abortRef.current) { abortRef.current.abort(); abortRef.current = null; }
    setLoading(false);
  };

  // ── History: Supabase (syncs across all devices) ──
  const HISTORY_MAX = 30;
  const HISTORY_DAYS = 7;

  useEffect(() => {
    if (!user?.id) return;
    const loadHistory = async () => {
      try {
        const cutoff = new Date(Date.now() - HISTORY_DAYS * 24 * 60 * 60 * 1000).toISOString();
        // Delete old entries
        await supabase.from("ai_chat_history").delete().eq("user_id", user.id).lt("created_at", cutoff);
        // Load recent
        const { data } = await supabase
          .from("ai_chat_history")
          .select("id, question, answer, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(HISTORY_MAX);
        if (data) setHistory(data.map(h => ({ id: h.id, q: h.question, a: h.answer, ts: new Date(h.created_at).getTime() })));
      } catch { }
    };
    loadHistory();
  }, [user?.id]);

  const saveToHistory = async (userText, aiText) => {
    if (!user?.id) return;
    const entry = { id: Date.now(), q: userText.slice(0, 80), a: aiText, ts: Date.now() };
    setHistory(prev => [entry, ...prev].slice(0, HISTORY_MAX));
    try {
      await supabase.from("ai_chat_history").insert({
        user_id: user.id,
        question: userText.slice(0, 80),
        answer: aiText,
      });
    } catch { }
  };

  const loadFromHistory = (entry) => {
    setMessages([
      { id: entry.ts || entry.id, role: "user", text: entry.q },
      { id: (entry.ts || entry.id) + 1, role: "ai", text: entry.a },
    ]);
    setHistoryOpen(false);
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { id: Date.now(), role: "user", text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        setMessages(prev => [...prev, { id: Date.now() + 1, role: "error", text: "Session expired. Please refresh." }]);
        setLoading(false); return;
      }

      const res = await fetch("/api/replyastra-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, prompt: text }),
        signal: controller.signal,
      });

      const rawText = await res.text();
      let data;
      try { data = JSON.parse(rawText); }
      catch {
        setMessages(prev => [...prev, { id: Date.now() + 1, role: "error", text: `Server error (${res.status})` }]);
        setLoading(false); return;
      }

      if (!res.ok) {
        setMessages(prev => [...prev, { id: Date.now() + 1, role: "error", text: data.error || `Error ${res.status}` }]);
      } else {
        const aiText = data.text || "";
        setMessages(prev => [...prev, { id: Date.now() + 1, role: "ai", text: aiText }]);
        if (data.remaining_today !== undefined) setRemaining({ today: data.remaining_today, month: data.remaining_month });
        saveToHistory(text, aiText);
      }
    } catch (e) {
      if (e?.name === "AbortError") {
        setMessages(prev => [...prev, { id: Date.now() + 1, role: "ai", text: "⏹ Stopped." }]);
      } else {
        setMessages(prev => [...prev, { id: Date.now() + 1, role: "error", text: `Request failed: ${e?.message || e}` }]);
      }
    } finally { setLoading(false); abortRef.current = null; }
  };

  const copyMsg = async (id, text) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id); setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const SUGGESTIONS = [
    "✍️ Write a caption for my new product launch",
    "🏷️ Best hashtags for travel photography",
    "💬 Reply template for new followers",
    "💡 Content ideas for a fitness brand",
    "📱 Reel script for a behind-the-scenes video",
    "📝 Instagram bio for a food blogger",
  ];

  // Custom scrollbar styles
  const scrollStyle = {
    scrollbarWidth: "thin",
    scrollbarColor: "#d1d5db transparent",
  };

  return (
    <div className="flex flex-col h-full w-full relative">
      {/* ── History Panel (slide-in) ── */}
      {historyOpen && (
        <>
          <div className="absolute inset-0 bg-black/20 z-40" onClick={() => setHistoryOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-white z-50 shadow-xl border-r border-gray-100 flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-800">{t.recentConversations}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => { setMessages([]); setHistoryOpen(false); }}
                  className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-200 transition-colors" title={t.newChat}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
                <button onClick={() => setHistoryOpen(false)} className="text-gray-400 hover:text-gray-700">
                  <IC.cross />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5" style={scrollStyle}>
              {history.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-8">{t.noHistory}</p>
              ) : (
                history.map(h => (
                  <button key={h.id} onClick={() => loadFromHistory(h)}
                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group">
                    <p className="text-xs font-medium text-gray-700 truncate">{h.q}</p>
                    <p className="text-[10px] text-gray-400 truncate mt-0.5">{h.a}</p>
                    <p className="text-[9px] text-gray-300 mt-1">{new Date(h.ts).toLocaleDateString()}</p>
                  </button>
                ))
              )}
            </div>
            <div className="p-3 border-t border-gray-100">
              <p className="text-[10px] text-gray-400 text-center">{t.historySyncText} {HISTORY_DAYS} {t.daysText}</p>
            </div>
          </div>
        </>
      )}

      {/* ── Header ── */}
      <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setHistoryOpen(true)}
            className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors" title={t.recentConversations}>
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <h1 style={serifStyle("clamp(20px,3vw,28px)")}>{t.aiPageTitle || "ReplyAstra AI"}</h1>
        </div>
        {remaining && (
          <div className="flex items-center gap-2 text-[11px] text-gray-500">
            <span className="bg-gray-100 px-2.5 py-1 rounded-full">{t.dailyLimit || "Daily Limit"}: {remaining.today}</span>
            <span className="bg-gray-100 px-2.5 py-1 rounded-full">{t.monthlyLimit || "Monthly Limit"}: {remaining.month}</span>
          </div>
        )}
      </div>

      {!hasAI ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><IC.ai /></div>
            <p className="text-gray-700 font-medium mb-1">{t.aiNotAvailable}</p>
            <p className="text-gray-400 text-sm mb-4">{t.upgradeForAI}</p>
            <button className="bg-gray-900 text-white text-[11px] font-semibold tracking-widest px-6 py-3 rounded-full hover:bg-gray-700 transition-colors">UPGRADE NOW</button>
          </div>
        </div>
      ) : (
        <>
          {/* ── Conversation area ── */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6" style={scrollStyle}>
            <div className="max-w-2xl mx-auto py-4">
              {/* Empty state */}
              {messages.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  </div>
                  <h2 style={{ fontFamily: "'Georgia','Times New Roman',serif", fontSize: "20px", fontWeight: 600, color: "#111" }} className="mb-2">
                    What can I create for you?
                  </h2>
                  <p className="text-gray-400 text-sm mb-8">Captions, hashtags, DM templates, content ideas & more</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg mx-auto">
                    {SUGGESTIONS.map(s => (
                      <button key={s} onClick={() => setInput(s.replace(/^[^\s]+\s/, ""))}
                        className="text-left text-xs text-gray-600 bg-white border border-gray-150 px-4 py-3 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages as clean cards */}
              {messages.map(msg => (
                <div key={msg.id} className="mb-5">
                  {msg.role === "user" ? (
                    <div className="flex items-start gap-3 justify-end">
                      <div className="bg-gray-900 text-white rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap max-w-[85%]">
                        {msg.text}
                      </div>
                    </div>
                  ) : msg.role === "error" ? (
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01" />
                        </svg>
                      </div>
                      <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600 max-w-[85%]">
                        {msg.text}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3 group">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap shadow-sm">
                          {msg.text}
                        </div>
                        <button onClick={() => copyMsg(msg.id, msg.text)}
                          className="flex items-center gap-1 mt-1.5 text-[11px] text-gray-400 hover:text-gray-700 transition-colors opacity-0 group-hover:opacity-100">
                          <IC.copy />
                          {copiedId === msg.id ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex items-start gap-3 mb-5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
                    <div className="flex gap-1.5">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={scrollRef} />
            </div>
          </div>

          {/* ── Input bar ── */}
          <div className="flex-shrink-0 px-4 sm:px-6 pb-4 pt-2">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-end gap-2 bg-white border border-gray-200 rounded-xl p-2 focus-within:border-gray-400 transition-all shadow-sm">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t.aiInputPlaceholder}
                  rows={1}
                  className="flex-1 resize-none px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent max-h-24 overflow-y-auto"
                  style={{ minHeight: "36px" }}
                />
                {loading ? (
                  <button
                    onClick={stop}
                    className="flex-shrink-0 w-9 h-9 bg-red-500 text-white rounded-lg flex items-center justify-center hover:bg-red-600 transition-all"
                    title="Stop generating"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="6" y="6" width="12" height="12" rx="2" />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={send}
                    disabled={!input.trim()}
                    className="flex-shrink-0 w-9 h-9 bg-gray-900 text-white rounded-lg flex items-center justify-center hover:bg-gray-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                    </svg>
                  </button>
                )}
              </div>
              <p className="text-[10px] text-gray-400 text-center mt-2">ReplyAstra AI can make mistakes. Please verify important information.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}



/* ─────────────────────────────────────────
   PAGE: AI CONFIG
───────────────────────────────────────── */
function AIConfigPage({ user, plan, t }) {
  const [tone, setTone] = useState("Friendly");
  const [replyLength, setReplyLength] = useState("Medium");
  const [emojiLevel, setEmojiLevel] = useState("Medium");
  const [autoComment, setAutoComment] = useState(false);
  const [autoDM, setAutoDM] = useState(false);
  const [customInstruction, setCustomInstruction] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // Map translated label to English key for storage
  const toneKeys = ["Professional", "Friendly", "Funny", "Sales-focused", "Gen-Z", "Custom"];
  const lengthKeys = ["Short", "Medium", "Long"];
  const emojiKeys = ["Low", "Medium", "High"];

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const { data } = await supabase.from("user_ai_settings").select("*").eq("user_id", user.id).single();
      if (data) {
        setTone(data.tone || "Friendly");
        setReplyLength(data.reply_length || "Medium");
        setEmojiLevel(data.emoji_level || "Medium");
        setAutoComment(data.auto_comment_reply || false);
        setAutoDM(data.auto_dm_reply || false);
        setCustomInstruction(data.custom_instruction || "");
      }
    };
    load();
  }, [user]);

  const save = async () => {
    setSaving(true); setMsg("");
    const { error } = await supabase.from("user_ai_settings").upsert({
      user_id: user.id, tone, reply_length: replyLength,
      emoji_level: emojiLevel, auto_comment_reply: autoComment,
      auto_dm_reply: autoDM, custom_instruction: customInstruction,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
    setSaving(false);
    setMsg(error ? t.configError : t.configSaved);
    setTimeout(() => setMsg(""), 3000);
  };

  const OptionGroup = ({ label, options, value, onChange, Icon }) => (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        {Icon && <span className="text-gray-500"><Icon /></span>}
        <p className="text-[11px] font-semibold tracking-widest text-gray-500 uppercase">{label}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button key={opt} onClick={() => onChange(opt)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${value === opt ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <div className="text-center mb-8">
        <h1 style={{ fontFamily: "'Georgia','Times New Roman',serif", fontSize: "clamp(24px,3vw,32px)", fontWeight: "600", color: "#111" }}>{t.aiConfigTitle}</h1>
        <p className="text-gray-500 text-sm mt-2">{t.aiConfigSubtitle}</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6">
        <OptionGroup label={t.toneSelection} options={t.tones.map((_, i) => toneKeys[i])} value={tone} onChange={setTone} Icon={IC.tone} />
        <div className="border-t border-gray-100 my-4" />
        <OptionGroup label={t.replyLength} options={lengthKeys} value={replyLength} onChange={setReplyLength} Icon={IC.length} />
        <div className="border-t border-gray-100 my-4" />
        <OptionGroup label={t.emojiLevel} options={emojiKeys} value={emojiLevel} onChange={setEmojiLevel} Icon={IC.emoji} />
        <div className="border-t border-gray-100 my-4" />

        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">{t.enableAutoCommentReply}</p>
              <p className="text-xs text-gray-400 mt-0.5">{t.enableAutoCommentReplyDesc}</p>
            </div>
            <Toggle checked={autoComment} onChange={setAutoComment} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">{t.enableAutoDMReply}</p>
              <p className="text-xs text-gray-400 mt-0.5">{t.enableAutoDMReplyDesc}</p>
            </div>
            <Toggle checked={autoDM} onChange={setAutoDM} />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <IC.spark />
            <p className="text-[11px] font-semibold tracking-widest text-gray-500 uppercase">{t.customInstruction}</p>
          </div>
          <textarea
            value={customInstruction} onChange={e => setCustomInstruction(e.target.value)}
            placeholder={t.customInstructionPlaceholder}
            className="w-full border border-gray-200 rounded-xl p-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none h-28 bg-gray-50"
          />
        </div>

        {msg && <p className={`text-sm mb-4 ${msg.includes("Error") ? "text-red-500" : "text-green-600"}`}>{msg}</p>}

        <button onClick={save} disabled={saving}
          className="w-full bg-gray-900 text-white text-[11px] font-semibold tracking-widest py-4 rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-60">
          {saving ? t.saving : t.saveConfiguration}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE: PRICING
───────────────────────────────────────── */
function PricingPage({ plan, t }) {
  const [billing, setBilling] = useState("monthly");

  const PLANS = [
    {
      key: "free", name: "Free", monthly: 0, yearly: 0,
      features: [
        { text: `500 ${t.dmPerMonth}`, ok: true }, { text: `3 ${t.automationRules}`, ok: true },
        { text: `1 ${t.instagramAccountsCount}`, ok: true }, { text: `7-day ${t.analytics}`, ok: true },
        { text: `${t.leadPreview} (10)`, ok: true }, { text: t.multiLang, ok: false },
        { text: t.watermark, ok: false }, { text: t.communitySupport, ok: true },
      ],
    },
    {
      key: "starter", name: "Starter", popular: true, monthly: 199, yearly: 169,
      features: [
        { text: `3,000 ${t.dmPerMonth}`, ok: true }, { text: `10 ${t.automationRules}`, ok: true },
        { text: `3 ${t.instagramAccountsCount}`, ok: true }, { text: `30-day ${t.analytics}`, ok: true },
        { text: t.aiGen, ok: true }, { text: t.leadGenMgmt, ok: true },
        { text: t.multiLang, ok: true }, { text: t.emailSupport, ok: true },
      ],
    },
    {
      key: "pro", name: "Pro", monthly: 399, yearly: 339,
      features: [
        { text: `10,000 ${t.dmPerMonth}`, ok: true }, { text: `50 ${t.automationRules}`, ok: true },
        { text: `10 ${t.instagramAccountsCount}`, ok: true }, { text: `90-day ${t.analytics}`, ok: true },
        { text: t.aiGenPro, ok: true }, { text: t.advancedLeads, ok: true },
        { text: t.multiLang, ok: true }, { text: t.prioritySupport, ok: true },
      ],
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      <h1 style={serifStyle()} className="mb-6 sm:mb-8">{t.elevate}</h1>

      <div className="flex items-center gap-1 mb-8 bg-gray-100 w-fit rounded-full p-1">
        {["monthly", "yearly"].map(b => (
          <button key={b} onClick={() => setBilling(b)}
            className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-all ${billing === b ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-700"
              }`}>
            {b === "monthly" ? t.monthly : t.yearly}
            {b === "yearly" && (
              <span className="absolute -top-2.5 -right-2 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                {t.savePercent}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map(p => {
          const price = billing === "monthly" ? p.monthly : p.yearly;
          const isCurrent = plan === p.key;
          return (
            <div key={p.key} className={`relative bg-white rounded-2xl border-2 p-6 flex flex-col hover:shadow-md transition-shadow ${p.popular ? "border-gray-900" : "border-gray-100"}`}>
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold tracking-widest px-3 py-1 rounded-full uppercase">{t.popular}</div>
              )}
              <p style={serifStyle("22px")} className="mb-1.5">{p.name}</p>
              <div className="flex items-end gap-1 mb-6">
                <span style={serifStyle("36px")}>₹{price}</span>
                <span className="text-gray-400 text-sm mb-1">/mo</span>
              </div>
              <ul className="space-y-2.5 flex-1 mb-6">
                {p.features.map(f => (
                  <li key={f.text} className={`flex items-start gap-2.5 text-sm ${f.ok ? "text-gray-700" : "text-gray-300"}`}>
                    <span className={`mt-0.5 flex-shrink-0 ${f.ok ? "text-gray-700" : "text-gray-200"}`}>
                      {f.ok ? <IC.check /> : <IC.cross />}
                    </span>
                    {f.text}
                  </li>
                ))}
              </ul>
              {isCurrent ? (
                <button disabled className="w-full border border-gray-200 text-gray-400 text-[11px] font-semibold tracking-widest py-3 rounded-full cursor-not-allowed">{t.currentPlanBtn}</button>
              ) : (
                <a href={`/dashboard/checkout?plan=${p.key}&billing=${billing}`}>
                  <button className={`w-full text-[11px] font-semibold tracking-widest py-3 rounded-full transition-colors ${p.popular ? "bg-gray-900 text-white hover:bg-gray-700" : "border border-gray-200 text-gray-700 hover:border-gray-900"}`}>
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
   PAGE: SETTINGS
───────────────────────────────────────── */
function SettingsPage({ user, igAccounts, plan, billingRenewal, setIgAccounts, lang, setLang, t }) {
  const [sub, setSub] = useState("profile");

  const SUBTABS = [
    { id: "profile", label: t.profile, Icon: IC.user },
    { id: "security", label: t.security, Icon: IC.shield },
    { id: "instagram", label: t.instagramAccounts, Icon: IC.ig },
    { id: "billing", label: t.billingPlan, Icon: IC.card },
    { id: "language", label: t.language, Icon: IC.globe },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 style={serifStyle()} className="mb-6 sm:mb-8">Settings</h1>

      <div className="flex flex-col lg:flex-row gap-4 max-w-6xl mx-auto w-full">
        {/* Sub sidebar */}
        <div className="lg:w-52 flex-shrink-0">
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
            {SUBTABS.map(tab => (
              <button key={tab.id} onClick={() => setSub(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm transition-all border-b border-gray-50 last:border-b-0 ${sub === tab.id ? "bg-gray-900 text-white font-medium" : "text-gray-600 hover:bg-gray-50"
                  }`}>
                <span className={sub === tab.id ? "text-white" : "text-gray-400"}><tab.Icon /></span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content panel */}
        <div className="flex-1">
          {sub === "profile" && <ProfilePanel user={user} t={t} />}
          {sub === "security" && <SecurityPanel t={t} />}
          {sub === "instagram" && <IGPanel igAccounts={igAccounts} setIgAccounts={setIgAccounts} plan={plan} t={t} />}
          {sub === "billing" && <BillingPanel plan={plan} billingRenewal={billingRenewal} t={t} />}
          {sub === "language" && <LanguagePanel lang={lang} setLang={setLang} t={t} />}
        </div>
      </div>
    </div>
  );
}

function ProfilePanel({ user, t }) {
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const cls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white";

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ data: { full_name: fullName } });
    setSaving(false);
    setMsg(error ? "Error saving." : t.saved);
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 sm:p-6">
      <p style={serifStyle("22px")} className="mb-6">{t.profile}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-2">{t.fullName}</label>
          <input className={cls} value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your name" />
        </div>
        <div>
          <label className="block text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-2">{t.emailAddress}</label>
          <input className={cls} value={user?.email || ""} disabled style={{ opacity: 0.5, cursor: "not-allowed" }} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={save} disabled={saving} className="bg-gray-900 text-white text-[11px] font-semibold tracking-widest px-6 py-3 rounded-full hover:bg-gray-700 transition-colors disabled:opacity-60">
          {saving ? t.saving : t.saveChanges}
        </button>
        {msg && <span className="text-sm text-green-600">{msg}</span>}
      </div>
    </div>
  );
}

function SecurityPanel({ t }) {
  const [oldP, setOldP] = useState(""); const [newP, setNewP] = useState(""); const [confP, setConfP] = useState("");
  const [saving, setSaving] = useState(false); const [msg, setMsg] = useState("");
  const cls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white";

  const update = async () => {
    if (newP !== confP) { setMsg(t.passwordMismatch); return; }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newP });
    setSaving(false);
    setMsg(error ? "Error: " + error.message : t.passwordUpdated);
    if (!error) { setOldP(""); setNewP(""); setConfP(""); }
    setTimeout(() => setMsg(""), 4000);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 sm:p-6">
      <p style={serifStyle("22px")} className="mb-6">{t.security}</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[[t.oldPassword, oldP, setOldP], [t.newPassword, newP, setNewP], [t.confirmNew, confP, setConfP]].map(([lbl, val, set]) => (
          <div key={lbl}>
            <label className="block text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-2">{lbl}</label>
            <input className={cls} type="password" value={val} onChange={e => set(e.target.value)} placeholder="••••••••" />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <button onClick={update} disabled={saving} className="bg-gray-900 text-white text-[11px] font-semibold tracking-widest px-6 py-3 rounded-full hover:bg-gray-700 transition-colors disabled:opacity-60">
          {saving ? t.updating : t.updatePassword}
        </button>
        {msg && <span className={`text-sm ${msg.includes("Error") || msg.includes("match") || msg.includes("ಹೊಂದ") ? "text-red-500" : "text-green-600"}`}>{msg}</span>}
      </div>
    </div>
  );
}

function IGPanel({ igAccounts, setIgAccounts, plan, t }) {
  const lim = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  const atLimit = igAccounts.length >= lim.accounts;

  const disconnect = async (id) => {
    if (!confirm("Disconnect this Instagram account?")) return;
    const { error } = await supabase.from("instagram_accounts").delete().eq("id", id);
    if (!error) setIgAccounts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 sm:p-6">
      <p style={serifStyle("22px")} className="mb-6">{t.instagramAccounts}</p>
      {igAccounts.length === 0 && <p className="text-sm text-gray-400 mb-4">{t.noIGAccounts}</p>}
      {igAccounts.map(acc => (
        <div key={acc.id} className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3.5 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500"><IC.ig /></div>
            <div>
              <p className="text-sm font-medium text-gray-900">@{acc.username}</p>
              <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">{t.connectedViaMeta}</p>
            </div>
          </div>
          <button onClick={() => disconnect(acc.id)} className="text-[11px] font-semibold tracking-widest text-red-500 hover:text-red-700 uppercase transition-colors">{t.disconnect}</button>
        </div>
      ))}
      {!atLimit ? (
        <a href="/dashboard/connect-instagram">
          <button className="border border-gray-200 text-gray-600 text-[11px] font-semibold tracking-widest px-5 py-2.5 rounded-full hover:border-gray-900 hover:text-gray-900 transition-colors">{t.connectNewAccount}</button>
        </a>
      ) : (
        <p className="text-xs text-amber-600 mt-2">Account limit reached ({lim.accounts}) for your {PLAN_NAMES[plan]} plan.</p>
      )}
    </div>
  );
}

function BillingPanel({ plan, billingRenewal, t }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 sm:p-6">
      <p style={serifStyle("22px")} className="mb-6">{t.billingPlan}</p>
      <div className="bg-gray-900 text-white rounded-xl px-5 py-5 mb-6">
        <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-1">{t.currentPlan}</p>
        <div className="flex items-end justify-between">
          <div>
            <p style={{ fontFamily: "'Georgia','Times New Roman',serif", fontSize: "24px", fontStyle: "italic" }}>{PLAN_NAMES[plan]} Plan</p>
            {billingRenewal && <p className="text-xs text-gray-400 mt-1">{t.renewsOn} {billingRenewal}</p>}
          </div>
          <p className="text-2xl font-bold">₹{PLAN_PRICES[plan]}<span className="text-sm font-normal text-gray-400">/mo</span></p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <a href="/dashboard/pricing">
          <button className="bg-gray-900 text-white text-[11px] font-semibold tracking-widest px-6 py-3 rounded-full hover:bg-gray-700 transition-colors">{t.upgradePlan}</button>
        </a>
        <button className="border border-gray-200 text-gray-500 text-[11px] font-semibold tracking-widest px-6 py-3 rounded-full hover:border-gray-400 hover:text-gray-700 transition-colors">{t.cancelSubscription}</button>
      </div>
    </div>
  );
}

function LanguagePanel({ lang, setLang, t }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 sm:p-6">
      <p style={serifStyle("22px")} className="mb-6">{t.language}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {LANGS.map(({ code, label }) => (
          <button key={code} onClick={() => setLang(code)}
            className={`py-3 px-4 rounded-xl text-sm font-medium border transition-all ${lang === code ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-900 hover:text-gray-900"
              }`}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   SIDEBAR
───────────────────────────────────────── */
function Sidebar({ page, setPage, plan, monthlyDMs, mobileOpen, setMobileOpen, t }) {
  const lim = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  const dmPct = Math.min(Math.round((monthlyDMs / (lim.dms_per_month || lim.dms || 500)) * 100), 100);

  const NAV = [
    { id: "overview", label: t.overview, Icon: IC.overview },
    { id: "automations", label: t.automations, Icon: IC.automations },
    { id: "contacts", label: t.contacts, Icon: IC.contacts },
    { id: "ai", label: t.replyastraAI, Icon: IC.ai },
    { id: "ai-config", label: "AI Config", Icon: IC.ai },
    { id: "upgrade", label: t.upgrade, Icon: IC.upgrade },
    { id: "settings", label: t.settings, Icon: IC.settings },
  ];

  const Inner = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <Logo />
        <button className="lg:hidden text-gray-400 hover:text-gray-700" onClick={() => setMobileOpen(false)}>
          <IC.close />
        </button>
      </div>

      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ id, label, Icon }) => (
          <button key={id} onClick={() => { setPage(id); setMobileOpen(false); }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] transition-all ${page === id ? "bg-gray-900 text-white font-medium" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}>
            <span className={page === id ? "text-white" : "text-gray-400"}><Icon /></span>
            <span className="truncate">{label}</span>
          </button>
        ))}
      </nav>

      <div className="px-4 pb-5 pt-3 border-t border-gray-100">
        <div className="mb-3 bg-white border border-gray-100 rounded-xl p-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">{t.usage}</span>
            <span className="text-[10px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">{PLAN_NAMES[plan] || plan}</span>
          </div>
          <div className="h-[3px] bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-700 ${dmPct >= 90 ? "bg-red-500" : dmPct >= 70 ? "bg-amber-500" : "bg-gray-900"}`} style={{ width: `${dmPct}%` }} />
          </div>
          <p className="text-[10px] text-gray-400">{monthlyDMs.toLocaleString()} / {(lim.dms_per_month || lim.dms || 500).toLocaleString()} {t.monthlyDMs}</p>
        </div>
        <button onClick={async () => { await supabase.auth.signOut(); window.location.href = "/"; }}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-[13px] text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all">
          <IC.logout />{t.logout}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex flex-col w-[168px] h-screen bg-white border-r border-gray-100 fixed top-0 left-0 z-30">
        <Inner />
      </aside>

      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
          <aside className="fixed top-0 left-0 h-full w-[220px] bg-white z-50 shadow-2xl lg:hidden">
            <Inner />
          </aside>
        </>
      )}
    </>
  );
}

/* ─────────────────────────────────────────
   TOPBAR
───────────────────────────────────────── */
function Topbar({ user, plan, setMobileOpen }) {
  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const initials = name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
      <button className="lg:hidden text-gray-500 hover:text-gray-900 transition-colors" onClick={() => setMobileOpen(true)}>
        <IC.menu />
      </button>
      <div className="flex-1" />
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">{name}</p>
          <p className="text-[11px] text-gray-400">{PLAN_NAMES[plan]}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{initials}</div>

      </div>
    </header>
  );
}

/* ─────────────────────────────────────────
   ROOT DASHBOARD
───────────────────────────────────────── */
/* ─────────────────────────────────────────
   ROOT DASHBOARD
───────────────────────────────────────── */
export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("overview");
  const [plan, setPlan] = useState(null);   // null = not yet loaded
  const [monthlyDMs, setMonthlyDMs] = useState(0);
  const [automations, setAutomations] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [igAccounts, setIgAccounts] = useState([]);
  const [stats, setStats] = useState({
    sentReplies: 0, sentRepliesDelta: 24,
    automationHits: 0, automationHitsDelta: 18,
    conversion: 0, conversionDelta: 3.2,
    leads: 0, leadsDelta: 14,
  });
  const [chartData, setChartData] = useState([]);
  const [sources, setSources] = useState([]);
  const [billingRenewal, setBillingRenewal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [lang, setLang] = useState("en");
  const [mobileOpen, setMobileOpen] = useState(false);

  const t = T[lang] || T.en;

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setLoadError("");

    // ── 1. Auth ──────────────────────────────────────────
    const { data: { user: u }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !u) { window.location.href = "/login"; return; }
    setUser(u);

    // ── 2. Profile (strict — no fallback defaults) ───────
    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("plan, plan_type, monthly_dm_count, billing_renewal, preferred_language")
      .eq("id", u.id)
      .single();

    if (profileErr) {
      if (process.env.NODE_ENV === "development") console.error("[Dashboard] Profile fetch failed:", profileErr.code, profileErr.message);

      if (profileErr.code === "PGRST116") {
        // No profile row yet — auto-create for this user
        const { error: insertErr } = await supabase
          .from("profiles")
          .insert({ id: u.id, plan: "free", plan_type: "free", ai_used_today: 0, ai_used_monthly: 0, monthly_dm_count: 0 });
        if (process.env.NODE_ENV === "development" && insertErr) console.error("[Dashboard] Profile insert failed:", insertErr);
        setPlan("free");
      } else {
        // Any other error (RLS issue, network, etc.) — silently degrade to free plan
        // so the dashboard still loads rather than blocking the user entirely
        setPlan("free");
      }
    } else if (profile) {
      const effectivePlan = profile.plan_type || profile.plan || "free";
      setPlan(effectivePlan);
      setMonthlyDMs(profile.monthly_dm_count || 0);
      setBillingRenewal(profile.billing_renewal || null);
      if (profile.preferred_language) setLang(profile.preferred_language);
    } else {
      // profile is null but no error (shouldn't happen with .single(), but be safe)
      setPlan("free");
    }

    // ── 3. Automations ───────────────────────────────────
    const { data: autos, error: autosErr } = await supabase
      .from("automations").select("*").eq("user_id", u.id).order("created_at", { ascending: false });
    if (autosErr && process.env.NODE_ENV === "development") console.error("[Dashboard] Automations:", autosErr);
    setAutomations(autos || []);

    // ── 4. Contacts (uses owner_user_id per schema) ──────
    const { data: contactsData, error: contactsErr } = await supabase
      .from("contacts").select("*").eq("owner_user_id", u.id).order("created_at", { ascending: false });
    if (contactsErr && process.env.NODE_ENV === "development") console.error("[Dashboard] Contacts:", contactsErr);
    setContacts(contactsData || []);

    // ── 5. Instagram accounts ────────────────────────────
    const { data: igData } = await supabase.from("instagram_accounts").select("*").eq("user_id", u.id);
    setIgAccounts(igData || []);

    // ── 6. Analytics ─────────────────────────────────────
    const { data: analyticsData } = await supabase
      .from("analytics").select("*").eq("user_id", u.id)
      .order("date", { ascending: true }).limit(7);

    if (analyticsData?.length) {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      setChartData(analyticsData.map(r => ({ day: days[new Date(r.date).getDay()], value: r.dm_count || 0 })));
      const totalDMs = analyticsData.reduce((s, r) => s + (r.dm_count || 0), 0);
      const totalHits = analyticsData.reduce((s, r) => s + (r.automation_hits || 0), 0);
      const totalLeads = contactsData?.length || 0;
      const conv = totalDMs > 0 ? ((totalLeads / totalDMs) * 100).toFixed(1) : "0.0";
      setStats(prev => ({ ...prev, sentReplies: totalDMs, automationHits: totalHits, leads: totalLeads, conversion: conv }));
      const stPct = analyticsData.reduce((s, r) => s + (r.story_reply_pct || 0), 0) / (analyticsData.length || 1);
      const cmPct = analyticsData.reduce((s, r) => s + (r.comment_dm_pct || 0), 0) / (analyticsData.length || 1);
      setSources([{ label: "Story Reply", pct: Math.round(stPct) }, { label: "Comment DM", pct: Math.round(cmPct) }]);
    } else {
      setChartData(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => ({ day: d, value: 0 })));
      setSources([{ label: "Story Reply", pct: 0 }, { label: "Comment DM", pct: 0 }]);
    }

    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Persist language preference
  useEffect(() => {
    if (!user || !plan) return;
    supabase.from("profiles").update({ preferred_language: lang }).eq("id", user.id);
  }, [lang, user, plan]);

  // ── Loading / error states ────────────────────────────
  if (loading) return <Spinner full />;

  if (loadError) {
    return (
      <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center p-6">
        <div className="bg-white border border-red-100 rounded-2xl p-10 max-w-md w-full text-center shadow-sm">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-gray-800 font-medium mb-1">Failed to load dashboard</p>
          <p className="text-gray-400 text-sm mb-6">{loadError}</p>
          <button onClick={fetchAll} className="bg-gray-900 text-white text-[11px] font-semibold tracking-widest px-8 py-3 rounded-full hover:bg-gray-700 transition-colors">
            RETRY
          </button>
        </div>
      </div>
    );
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const effectivePlan = plan || "free";

  return (
    <div className="h-screen bg-[#f8f8f8] flex overflow-hidden">
      <Sidebar page={page} setPage={setPage} plan={effectivePlan} monthlyDMs={monthlyDMs}
        mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} t={t} />

      <div className="flex-1 lg:ml-[168px] flex flex-col h-screen overflow-hidden">
        <Topbar user={user} plan={effectivePlan} setMobileOpen={setMobileOpen} />

        <main className="flex-1 overflow-y-auto flex flex-col min-h-0">
          {page === "overview" && <OverviewPage userName={userName} stats={stats} chartData={chartData} sources={sources} t={t} />}
          {page === "automations" && <AutomationsPage automations={automations} setAutomations={setAutomations} plan={effectivePlan} t={t} />}
          {page === "contacts" && <ContactsPage contacts={contacts} plan={effectivePlan} t={t} />}
          {page === "ai" && <AIPage plan={effectivePlan} user={user} t={t} />}
          {page === "ai-config" && <AIConfigPage user={user} plan={effectivePlan} t={t} />}
          {page === "upgrade" && <PricingPage plan={effectivePlan} t={t} />}
          {page === "settings" && <SettingsPage user={user} igAccounts={igAccounts} plan={effectivePlan} billingRenewal={billingRenewal} setIgAccounts={setIgAccounts} lang={lang} setLang={setLang} t={t} />}
        </main>
      </div>
    </div>
  );
}

