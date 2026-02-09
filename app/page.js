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

     <div className="relative bg-white rounded-3xl p-10 shadow-lg overflow-hidden">

  {/* FLOATING REAL-TIME MESSAGE */}
  <div className="absolute bottom-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-2xl text-sm shadow-xl animate-float flex items-center gap-2">
    <span className="text-emerald-400">▶</span>
    <span>
      <span className="block text-xs text-emerald-400">Real-time Reply</span>
      “Link sent! check your DM ✨”
    </span>
  </div>

  {/* GRAPH HEADER */}
  <div className="mb-6">
    <p className="text-xs text-gray-400 uppercase tracking-wider">
      Active Chats
    </p>
    <p className="text-2xl font-extrabold text-gray-900">+1,400%</p>
  </div>

  {/* GRAPH */}
  <svg viewBox="0 0 420 220" className="w-full h-56">

    {/* GRADIENT */}
    <defs>
      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
      </linearGradient>
    </defs>

    {/* AREA */}
    <path
      d="
        M20 180
        C 80 160, 140 150, 200 120
        C 260 90, 310 80, 380 40
        L380 200
        L20 200
        Z
      "
      fill="url(#areaGradient)"
    />

    {/* LINE */}
    <path
      d="
        M20 180
        C 80 160, 140 150, 200 120
        C 260 90, 310 80, 380 40
      "
      fill="none"
      stroke="#10b981"
      strokeWidth="4"
      strokeLinecap="round"
      className="animate-draw"
    />

    {/* DOTTED INDICATOR */}
    <line
      x1="300"
      y1="40"
      x2="300"
      y2="200"
      stroke="#10b981"
      strokeDasharray="5 6"
      opacity="0.6"
    />

    {/* POINT */}
    <circle cx="300" cy="90" r="6" fill="#10b981" />

  </svg>

  {/* AXIS LABEL */}
  <p className="mt-4 text-xs text-gray-400">PRE-ASTRA → POST-ASTRA</p>

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
