"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

/* ─── Icon helpers ──────────────────────────────────────────── */
const IC = {
    tone: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>,
    length: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h10M4 14h16M4 18h10" /></svg>,
    emoji: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    spark: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
};

/* ─── Toggle ────────────────────────────────────────────────── */
function Toggle({ checked, onChange }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 ${checked ? "bg-gray-900" : "bg-gray-200"}`}
        >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-6" : "translate-x-1"}`} />
        </button>
    );
}

/* ─── Option group (tone / length / emoji) ──────────────────── */
function OptionGroup({ label, options, value, onChange, Icon }) {
    return (
        <div className="mb-0">
            <div className="flex items-center gap-2 mb-3">
                {Icon && <span className="text-gray-400"><Icon /></span>}
                <p className="text-[11px] font-semibold tracking-widest text-gray-500 uppercase">{label}</p>
            </div>
            <div className="flex flex-wrap gap-2">
                {options.map((opt) => (
                    <button
                        key={opt}
                        type="button"
                        onClick={() => onChange(opt)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${value === opt
                                ? "bg-gray-900 text-white border-gray-900"
                                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                            }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
}

/* ─── Upgrade required UI ───────────────────────────────────── */
function UpgradeRequired() {
    return (
        <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center p-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-10 max-w-md w-full text-center shadow-sm">
                <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                </div>
                <h2 style={{ fontFamily: "'Georgia','Times New Roman',serif", fontSize: "24px", fontStyle: "italic", fontWeight: 400, color: "#111" }} className="mb-2">
                    Pro Plan Required
                </h2>
                <p className="text-gray-500 text-sm mb-8">
                    AI Configuration is available on the Pro plan. Upgrade to customise your AI tone, reply length, emoji level and more.
                </p>
                <a href="/dashboard" onClick={() => window.history.back()}>
                    <button className="w-full bg-gray-900 text-white text-[11px] font-semibold tracking-widest py-4 rounded-xl hover:bg-gray-700 transition-colors mb-3">
                        UPGRADE TO PRO
                    </button>
                </a>
                <button onClick={() => window.history.back()} className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
                    ← Back to dashboard
                </button>
            </div>
        </div>
    );
}

/* ─── Error UI ──────────────────────────────────────────────── */
function ErrorState({ message, onRetry }) {
    return (
        <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center p-6">
            <div className="bg-white border border-red-100 rounded-2xl p-10 max-w-md w-full text-center shadow-sm">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <p className="text-gray-800 font-medium mb-1">Something went wrong</p>
                <p className="text-gray-400 text-sm mb-6">{message}</p>
                <button onClick={onRetry} className="bg-gray-900 text-white text-[11px] font-semibold tracking-widest px-8 py-3 rounded-full hover:bg-gray-700 transition-colors">
                    RETRY
                </button>
            </div>
        </div>
    );
}

/* ─── Loading spinner ───────────────────────────────────────── */
function Spinner() {
    return (
        <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN AI CONFIG PAGE
══════════════════════════════════════════════════════════════ */
export default function AIConfigPage() {
    const [loadState, setLoadState] = useState("loading"); // "loading"|"error"|"upgrade"|"ready"
    const [errorMsg, setErrorMsg] = useState("");
    const [user, setUser] = useState(null);

    // Form state
    const [tone, setTone] = useState("Friendly");
    const [replyLength, setReplyLength] = useState("Medium");
    const [emojiLevel, setEmojiLevel] = useState("Medium");
    const [autoComment, setAutoComment] = useState(false);
    const [autoDM, setAutoDM] = useState(false);
    const [customInstruction, setCustomInstruction] = useState("");

    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState({ text: "", type: "" }); // type: "success"|"error"

    const TONES = ["Professional", "Friendly", "Funny", "Sales-focused", "Gen-Z", "Custom"];
    const LENGTHS = ["Short", "Medium", "Long"];
    const EMOJIS = ["Low", "Medium", "High"];

    /* ── Load profile + settings ────────────────────────── */
    const load = async () => {
        setLoadState("loading");
        setErrorMsg("");

        // 1. Auth check
        const { data: { user: u }, error: authErr } = await supabase.auth.getUser();
        if (authErr || !u) {
            window.location.href = "/login";
            return;
        }
        setUser(u);

        // 2. Fetch profile (must exist)
        const { data: profile, error: profileErr } = await supabase
            .from("profiles")
            .select("plan, plan_type")
            .eq("id", u.id)
            .single();

        if (profileErr) {
            if (process.env.NODE_ENV === "development") console.error("Profile fetch error:", profileErr);
            setErrorMsg("Failed to load your profile. Please try again.");
            setLoadState("error");
            return;
        }

        if (!profile) {
            setErrorMsg("Profile not found. Please contact support.");
            setLoadState("error");
            return;
        }

        // 3. Plan gate — Pro only
        const effectivePlan = profile.plan_type || profile.plan || "free";
        if (effectivePlan !== "pro") {
            setLoadState("upgrade");
            return;
        }

        // 4. Load existing AI settings
        const { data: aiSettings, error: aiErr } = await supabase
            .from("user_ai_settings")
            .select("*")
            .eq("user_id", u.id)
            .single();

        if (aiErr && aiErr.code !== "PGRST116") {
            // PGRST116 = row not found (first time — ok)
            if (process.env.NODE_ENV === "development") console.error("AI settings fetch error:", aiErr);
            setErrorMsg("Failed to load AI configuration. Please try again.");
            setLoadState("error");
            return;
        }

        if (aiSettings) {
            setTone(aiSettings.tone || "Friendly");
            setReplyLength(aiSettings.reply_length || "Medium");
            setEmojiLevel(aiSettings.emoji_level || "Medium");
            setAutoComment(aiSettings.auto_comment_reply || false);
            setAutoDM(aiSettings.auto_dm_reply || false);
            setCustomInstruction(aiSettings.custom_instruction || "");
        }

        setLoadState("ready");
    };

    useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

    /* ── Save configuration ─────────────────────────────── */
    const save = async () => {
        if (!user) return;
        setSaving(true);
        setMsg({ text: "", type: "" });

        const { error } = await supabase
            .from("user_ai_settings")
            .upsert({
                user_id: user.id,
                tone,
                reply_length: replyLength,
                emoji_level: emojiLevel,
                auto_comment_reply: autoComment,
                auto_dm_reply: autoDM,
                custom_instruction: customInstruction,
                updated_at: new Date().toISOString(),
            }, { onConflict: "user_id" });

        setSaving(false);

        if (error) {
            if (process.env.NODE_ENV === "development") console.error("Save AI config error:", error);
            setMsg({ text: "Error saving configuration. Please try again.", type: "error" });
        } else {
            setMsg({ text: "Configuration saved!", type: "success" });
            setTimeout(() => setMsg({ text: "", type: "" }), 3000);
        }
    };

    /* ── Render states ──────────────────────────────────── */
    if (loadState === "loading") return <Spinner />;
    if (loadState === "error") return <ErrorState message={errorMsg} onRetry={load} />;
    if (loadState === "upgrade") return <UpgradeRequired />;

    /* ── Ready — full AI Config UI ──────────────────────── */
    return (
        <div className="min-h-screen bg-[#f8f8f8] flex items-start justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-2xl">

                {/* Page header */}
                <div className="text-center mb-8">
                    <h1
                        style={{
                            fontFamily: "'Georgia','Times New Roman',serif",
                            fontSize: "clamp(26px,4vw,34px)",
                            fontStyle: "normal",
                            fontWeight: 600,
                            color: "#111",
                        }}
                    >
                        AI Configuration
                    </h1>
                    <p className="text-gray-500 text-sm mt-2">
                        Customize how Astra AI responds to comments and DMs.
                    </p>
                </div>

                {/* Config card */}
                <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-7 shadow-sm">

                    {/* ── Tone Selection ── */}
                    <OptionGroup
                        label="TONE SELECTION"
                        options={TONES}
                        value={tone}
                        onChange={setTone}
                        Icon={IC.tone}
                    />

                    <div className="border-t border-gray-100 my-5" />

                    {/* ── Reply Length ── */}
                    <OptionGroup
                        label="REPLY LENGTH"
                        options={LENGTHS}
                        value={replyLength}
                        onChange={setReplyLength}
                        Icon={IC.length}
                    />

                    <div className="border-t border-gray-100 my-5" />

                    {/* ── Emoji Level ── */}
                    <OptionGroup
                        label="EMOJI LEVEL"
                        options={EMOJIS}
                        value={emojiLevel}
                        onChange={setEmojiLevel}
                        Icon={IC.emoji}
                    />

                    <div className="border-t border-gray-100 my-5" />

                    {/* ── Auto Reply Toggles ── */}
                    <div className="space-y-5 mb-5">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-900">Enable Auto Comment Reply</p>
                                <p className="text-xs text-gray-400 mt-0.5">Automatically respond to public comments.</p>
                            </div>
                            <Toggle checked={autoComment} onChange={setAutoComment} />
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-900">Enable Auto DM Reply</p>
                                <p className="text-xs text-gray-400 mt-0.5">Automatically respond to private messages.</p>
                            </div>
                            <Toggle checked={autoDM} onChange={setAutoDM} />
                        </div>
                    </div>

                    <div className="border-t border-gray-100 my-5" />

                    {/* ── Custom Instruction ── */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-gray-400"><IC.spark /></span>
                            <p className="text-[11px] font-semibold tracking-widest text-gray-500 uppercase">Custom Instruction</p>
                        </div>
                        <textarea
                            value={customInstruction}
                            onChange={(e) => setCustomInstruction(e.target.value)}
                            placeholder="Example: Always add a call-to-action. Keep tone energetic. Use brand voice."
                            maxLength={500}
                            className="w-full border border-gray-200 rounded-xl p-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none h-28 bg-gray-50 placeholder-gray-300 transition-all"
                        />
                    </div>

                    {/* Status message */}
                    {msg.text && (
                        <p className={`text-sm mb-5 font-medium ${msg.type === "error" ? "text-red-500" : "text-green-600"}`}>
                            {msg.text}
                        </p>
                    )}

                    {/* Save button */}
                    <button
                        type="button"
                        onClick={save}
                        disabled={saving}
                        className="w-full bg-gray-900 text-white text-[11px] font-bold tracking-[0.15em] py-4 rounded-xl hover:bg-gray-700 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {saving ? "SAVING..." : "SAVE CONFIGURATION"}
                    </button>
                </div>

                {/* Back link */}
                <div className="text-center mt-5">
                    <button onClick={() => window.history.back()} className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
                        ← Back to dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
