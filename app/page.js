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
  TrendingUp,
  Check,
  MousePointer2,
} from "lucide-react";

import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  Tooltip 
} from 'recharts';

export default function Page() {
  const [open, setOpen] = useState(false);
  
  const growthData = [
    { name: 'W1', volume: 400 },
    { name: 'W2', volume: 900 },
    { name: 'W3', volume: 1500 },
    { name: 'W4', volume: 2800 },
    { name: 'W5', volume: 4200 },
  ];

  return (
    <main className="min-h-screen bg-[#f8fafc] overflow-x-hidden">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center">
              R
            </div>
            <span className="text-xl font-extrabold">
              <span className="text-gray-900">Reply</span>
              <span className="text-emerald-600">Astra</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 font-semibold text-gray-600">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#pricing">Pricing</a>
            <a href="/login">Login</a>
            <a href="/signup" className="bg-emerald-600 text-white px-5 py-2 rounded-full">
              Get Started
            </a>
          </div>

          <button onClick={() => setOpen(!open)} className="md:hidden text-gray-800">
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden bg-white shadow-lg border-b">
            <div className="flex flex-col px-6 py-4 gap-4 font-semibold text-gray-700">
              <a onClick={() => setOpen(false)} href="#features">Features</a>
              <a onClick={() => setOpen(false)} href="#how-it-works">How it works</a>
              <a onClick={() => setOpen(false)} href="#pricing">Pricing</a>
              <a onClick={() => setOpen(false)} href="/login">Login</a>
              <a onClick={() => setOpen(false)} href="/signup" className="bg-emerald-600 text-white px-4 py-2 rounded-full text-center">
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

      {/* FEATURES SECTION */}
      <section id="features" className="py-32 px-6 bg-[#f0fdfa]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">Designed for modern creators</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Smart automation that helps creators manage conversations without missing important messages.</p>
          <div className="grid md:grid-cols-4 gap-8 mt-16">
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <MessageSquare className="text-emerald-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">Natural Flow</h3>
              <p className="text-gray-600">Intelligent replies that capture your tone and feel human.</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <Zap className="text-emerald-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">Smart Logic</h3>
              <p className="text-gray-600">Simple triggers to automate common responses.</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <Shield className="text-emerald-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">Secure Setup</h3>
              <p className="text-gray-600">Meta-approved integrations to keep your account safe.</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <BarChart3 className="text-emerald-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">Clear Visibility</h3>
              <p className="text-gray-600">See exactly how many DMs are handled automatically.</p>
            </div>
          </div>
        </div>
      </section>

      {/* GROWTH VISUALIZATION */}
      <section className="py-12 md:py-24 px-4 md:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] md:rounded-[4rem] border border-white shadow-2xl p-6 md:p-20 relative">
            <div className="grid lg:grid-cols-5 gap-10 md:gap-16 items-center">
              <div className="lg:col-span-2 space-y-6 md:space-y-8">
                <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-[10px] font-black uppercase">
                  <TrendingUp size={14} />
                  <span>Accelerated Engagement</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900">Watch your <br /><span className="text-emerald-600">community thrive</span></h2>
                <div className="space-y-3">
                  {["Instant response", "Automated delivery", "Welcome sequences"].map((item, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white"><Check size={12} strokeWidth={4} /></div>
                      <span className="text-slate-700 font-bold">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-3 w-full">
                <div className="relative w-full bg-white/40 rounded-[2rem] p-4 md:p-8">
                  <div className="h-[200px] md:h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={growthData}>
                        <defs>
                          <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Tooltip />
                        <Area type="monotone" dataKey="volume" stroke="#10b981" strokeWidth={4} fill="url(#colorVolume)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-28 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-16">Simple setup. Real results.</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#f8fafc] rounded-3xl p-10 text-left">
              <h3 className="text-xl font-bold mb-3">01. Connect</h3>
              <p>Securely link your Instagram account with one click using Meta APIs.</p>
            </div>
            <div className="bg-[#f8fafc] rounded-3xl p-10 text-left">
              <h3 className="text-xl font-bold mb-3">02. Set Rules</h3>
              <p>Choose keywords like “price” or “link” and set your auto-replies.</p>
            </div>
            <div className="bg-[#f8fafc] rounded-3xl p-10 text-left">
              <h3 className="text-xl font-bold mb-3">03. Scale</h3>
              <p>ReplyAstra handles DMs 24/7 while you sleep or create content.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-28 px-6 bg-[#f0fdfa]">
        <PricingSection />
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-white border-t border-gray-100 text-center">
        <p className="text-gray-500 font-bold">© 2026 ReplyAstra Platform</p>
      </footer>
    </main>
  );
}

function PricingSection() {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="max-w-6xl mx-auto text-center">
      <h2 className="text-4xl md:text-5xl font-black text-gray-900">Choose your growth path</h2>
      <div className="mt-8 flex items-center justify-center gap-3 font-semibold">
        <span>Monthly</span>
        <button onClick={() => setYearly(!yearly)} className={`w-14 h-7 rounded-full px-1 flex items-center transition ${yearly ? "bg-emerald-600" : "bg-gray-300"}`}>
          <span className={`w-5 h-5 bg-white rounded-full transition-transform ${yearly ? "translate-x-7" : ""}`} />
        </button>
        <span>Yearly <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">SAVE 15%</span></span>
      </div>

      <div className="mt-16 grid md:grid-cols-3 gap-8">
        {/* FREE */}
        <div className="bg-white rounded-3xl p-10 shadow-sm">
          <h3 className="font-bold text-lg">Free</h3>
          <div className="text-5xl font-black my-6">₹0</div>
          <ul className="text-left space-y-3 mb-8">
            <li>✔ 1 Instagram account</li>
            <li>✔ Basic analytics</li>
          </ul>
          <button className="w-full py-3 rounded-full border border-emerald-600 text-emerald-600 font-bold">GET STARTED</button>
        </div>
        {/* STARTER */}
        <div className="bg-white rounded-3xl p-10 border-2 border-emerald-600 shadow-xl scale-105">
          <h3 className="font-bold text-lg">Starter</h3>
          <div className="text-5xl font-black my-6">₹{yearly ? 169 : 199}</div>
          <ul className="text-left space-y-3 mb-8">
            <li>✔ 3 Instagram accounts</li>
            <li>✔ Unlimited keyword replies</li>
          </ul>
          <button className="w-full py-3 rounded-full bg-emerald-600 text-white font-bold">GET STARTED</button>
        </div>
        {/* PRO */}
        <div className="bg-white rounded-3xl p-10 shadow-sm">
          <h3 className="font-bold text-lg">Pro</h3>
          <div className="text-5xl font-black my-6">₹{yearly ? 339 : 399}</div>
          <ul className="text-left space-y-3 mb-8">
            <li>✔ 10 Instagram accounts</li>
            <li>✔ Priority support</li>
          </ul>
          <button className="w-full py-3 rounded-full border border-emerald-600 text-emerald-600 font-bold">GET STARTED</button>
        </div>
      </div>
    </div>
  );
}
