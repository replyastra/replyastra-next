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

          {/* MOBILE HAMBURGER */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-gray-800"
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {open && (
          <div className="md:hidden bg-white shadow-lg border-b">
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
        <div className="max-w-4xl mx-auto">
          <span className="pill">INTELLIGENT GROWTH</span>

          <h1 className="mt-6 text-5xl md:text-6xl font-black text-gray-900 leading-tight">
            Fresh approach to <br />
            <span className="text-emerald-600">DM Automation.</span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            ReplyAstra brings intelligent automation to Instagram DMs —
            helping creators reply faster and grow smarter.
          </p>

          <div className="buttons mt-10">
            <a href="/signup" className="btn-dark flex items-center gap-2">
              Start Free Now <ArrowRight size={18} />
            </a>
            <a href="#features" className="btn-light">
              Explore Features
            </a>
          </div>
        </div>
      </section>

      {/* FEATURE PILLS */}
      <section className="pb-24 px-6">
        <div className="features">
          <div className="feature flex flex-col items-center gap-2">
            <Zap className="text-emerald-600" /> Natural Flow
          </div>
          <div className="feature flex flex-col items-center gap-2">
            <MessageSquare className="text-emerald-600" /> Smart Logic
          </div>
          <div className="feature flex flex-col items-center gap-2">
            <Shield className="text-emerald-600" /> Privacy First
          </div>
          <div className="feature flex flex-col items-center gap-2">
            <BarChart3 className="text-emerald-600" /> Deep Insights
          </div>
        </div>
      </section>

{/* DESIGNED FOR MODERN CREATORS */}
<section
  id="features"
  className="py-32 px-6 bg-[#f0fdfa]"
>
  <div className="max-w-6xl mx-auto text-center">

    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
      Designed for modern creators
    </h2>

    <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
      Smart automation that helps creators manage conversations
      without missing important messages.
    </p>

    <div className="grid md:grid-cols-4 gap-8 mt-16">

      <div className="bg-white rounded-3xl p-8 text-left shadow-sm">
        <div className="w-12 h-12 mb-6 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <MessageSquare />
        </div>
        <h3 className="font-bold text-lg mb-2">Natural Flow</h3>
        <p className="text-gray-600">
          Intelligent replies that capture your tone and feel human.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 text-left shadow-sm">
        <div className="w-12 h-12 mb-6 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <Zap />
        </div>
        <h3 className="font-bold text-lg mb-2">Smart Logic</h3>
        <p className="text-gray-600">
          Simple triggers to automate common responses.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 text-left shadow-sm">
        <div className="w-12 h-12 mb-6 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <Shield />
        </div>
        <h3 className="font-bold text-lg mb-2">Secure Setup</h3>
        <p className="text-gray-600">
          Meta-approved integrations to keep your account safe.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 text-left shadow-sm">
        <div className="w-12 h-12 mb-6 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <BarChart3 />
        </div>
        <h3 className="font-bold text-lg mb-2">Clear Visibility</h3>
        <p className="text-gray-600">
          See exactly how many DMs are handled automatically.
        </p>
      </div>

    </div>
  </div>
</section>

    <div className="relative bg-white rounded-[32px] p-10 shadow-xl overflow-hidden">

  {/* HEADER */}
  <div className="flex items-center justify-between mb-6">
    <div>
      <p className="text-xs uppercase tracking-wider text-gray-400">
        Active Chats
      </p>
      <p className="text-2xl font-extrabold text-gray-900">+1,400%</p>
    </div>
    <div className="flex gap-2">
      <span className="w-2 h-2 rounded-full bg-emerald-500" />
      <span className="w-2 h-2 rounded-full bg-emerald-200" />
    </div>
  </div>

  {/* GRAPH */}
  <svg viewBox="0 0 420 240" className="w-full h-64">

    <defs>
      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
      </linearGradient>
    </defs>

    {/* AREA */}
    <path
      d="
        M20 190
        C 90 175, 140 160, 190 140
        C 240 115, 300 85, 380 45
        L380 220
        L20 220
        Z
      "
      fill="url(#areaGrad)"
      className="opacity-0 animate-area"
    />

    {/* LINE */}
    <path
      d="
        M20 190
        C 90 175, 140 160, 190 140
        C 240 115, 300 85, 380 45
      "
      fill="none"
      stroke="#10b981"
      strokeWidth="4"
      strokeLinecap="round"
      className="animate-line"
    />

    {/* DOTTED GUIDE */}
    <line
      x1="290"
      y1="55"
      x2="290"
      y2="190"
      stroke="#10b981"
      strokeDasharray="4 6"
      opacity="0.5"
    />

    {/* POINT */}
    <circle cx="290" cy="110" r="6" fill="#10b981" />

  </svg>

  {/* TOOLTIP */}
  <div className="absolute top-[46%] left-[58%] bg-white px-4 py-2 rounded-xl shadow-lg text-sm animate-fade">
    <p className="font-bold text-gray-900">5</p>
    <p className="text-xs font-semibold text-emerald-600">
      volume : 1800
    </p>
  </div>

  {/* FLOATING MESSAGE */}
  <div className="absolute bottom-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-xl flex gap-2 items-start animate-float">
    <span className="text-emerald-400 mt-1">▶</span>
    <div className="text-sm leading-tight">
      <p className="text-xs text-emerald-400">Real-time Reply</p>
      <p>“Link sent! check your DM ✨”</p>
    </div>
  </div>

  <p className="mt-4 text-xs text-gray-400">PRE-ASTRA</p>

</div>


      {/* PRICING */}
      <section id="pricing" className="pricing-section">
        <h2>Choose your growth path</h2>
        <p className="subtitle">Transparent pricing for real influence.</p>

        <div className="pricing-grid">
          <div className="pricing-card">
            <h3>Free</h3>
            <div className="price">₹0</div>
            <ul>
              <li>Limited automation</li>
              <li>1 Instagram account</li>
              <li>Basic analytics</li>
            </ul>
            <button className="pricing-btn outline">Get Started</button>
          </div>

          <div className="pricing-card popular">
            <span className="popular-badge">Most Popular</span>
            <h3>Starter</h3>
            <div className="price">₹199</div>
            <ul>
              <li>Unlimited replies</li>
              <li>Welcome flows</li>
              <li>Email support</li>
            </ul>
            <button className="pricing-btn">Start Free Now</button>
          </div>

          <div className="pricing-card">
            <h3>Pro</h3>
            <div className="price">₹399</div>
            <ul>
              <li>Multiple accounts</li>
              <li>Advanced AI replies</li>
              <li>Priority support</li>
            </ul>
            <button className="pricing-btn outline">Start Free Now</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-bottom">
          © 2026 ReplyAstra Platform
        </div>
      </footer>

    </main>
  );
}  
