"use client";

import { useState } from "react";
import {
  Menu,
  X,
  ArrowRight,
  Zap,
  MessageSquare,
  Shield,
  BarChart3,
} from "lucide-react";

export default function Page() {
  const [open, setOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#f8fafc] overflow-x-hidden">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* LOGO */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center">
              R
            </div>
            <span className="text-xl font-extrabold">
              <span className="text-gray-900">Reply</span>
              <span className="text-emerald-600">Astra</span>
            </span>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8 font-semibold text-gray-600">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="/login">Login</a>
            <a href="/signup" className="bg-emerald-600 text-white px-5 py-2 rounded-full">
              Get Started
            </a>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button onClick={() => setOpen(!open)} className="md:hidden">
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {open && (
          <div className="md:hidden bg-white border-t">
            <div className="flex flex-col px-6 py-4 gap-4 font-semibold text-gray-700">
              <a onClick={() => setOpen(false)} href="#features">Features</a>
              <a onClick={() => setOpen(false)} href="#pricing">Pricing</a>
              <a onClick={() => setOpen(false)} href="/login">Login</a>
              <a
                onClick={() => setOpen(false)}
                href="/signup"
                className="bg-emerald-600 text-white px-4 py-2 rounded-full text-center"
              >
                Get Started
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="pt-40 pb-24 text-center px-6">
        <h1 className="text-5xl md:text-6xl font-black text-gray-900">
          Fresh approach to <br />
          <span className="text-emerald-600">DM Automation.</span>
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          Intelligent Instagram DM automation built for real creators.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <a href="/signup" className="btn-dark flex items-center gap-2">
            Start Free Now <ArrowRight size={18} />
          </a>
          <a href="#features" className="btn-light">Explore Features</a>
        </div>
      </section>

      {/* ✅ FEATURES SECTION (THIS WAS MISSING) */}
      <section
        id="features"
        className="scroll-mt-32 pt-32 pb-24 bg-[#f0fdfa] px-6"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-gray-900">
            Designed for modern creators
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Smart automation that helps creators manage conversations
            without missing important messages.
          </p>

          <div className="grid md:grid-cols-4 gap-6 mt-16">
            <Feature icon={<MessageSquare />} title="Natural Flow" desc="Human-like replies that match your tone." />
            <Feature icon={<Zap />} title="Smart Logic" desc="Triggers that automate common responses." />
            <Feature icon={<Shield />} title="Secure Setup" desc="Meta-approved & compliant integrations." />
            <Feature icon={<BarChart3 />} title="Clear Visibility" desc="Real-time analytics, no guesswork." />
          </div>
        </div>
      </section>

      {/* GROWTH */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-extrabold">
              Watch your community <span className="text-emerald-600">thrive</span>
            </h2>
            <ul className="mt-6 space-y-3 font-semibold text-gray-700">
              <li>✅ Instant DM replies</li>
              <li>✅ Auto-link delivery</li>
              <li>✅ Natural welcome flows</li>
            </ul>
          </div>

          <div className="relative bg-white rounded-3xl p-8 shadow-lg">
            <div className="absolute -top-6 right-6 animate-float bg-gray-900 text-white px-4 py-2 rounded-xl text-sm">
              ✨ Link sent! check your DM
            </div>

            <svg viewBox="0 0 300 160" className="w-full h-40">
              <path
                d="M10 130 Q80 110 140 90 T290 30"
                fill="none"
                stroke="#10b981"
                strokeWidth="4"
                className="animate-draw"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="scroll-mt-32 pricing-section">
        <h2>Choose your growth path</h2>
      </section>

      {/* FOOTER */}
      <footer className="py-12 text-center text-gray-500">
        © 2026 ReplyAstra Platform
      </footer>

    </main>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm text-left">
      <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-gray-600 mt-2">{desc}</p>
    </div>
  );
}
