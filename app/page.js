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
  TrendingUp,    // Added this
  Check,         // Added this
  MousePointer2, // Added this
} from "lucide-react";

// Add these imports for the Graph to work
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  Tooltip 
} from 'recharts';

import FAQSection from "./FAQSection";
import Footer from "./Footer";

export default function Page() {
  const [open, setOpen] = useState(false);
  
  // Also add this sample data for the graph
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
  <a href="/#features" className="hover:text-emerald-600 transition-colors">Features</a>
  <a href="/#how-it-works" className="hover:text-emerald-600 transition-colors">How it works</a>
  <a href="/#pricing" className="hover:text-emerald-600 transition-colors">Pricing</a>
  <a href="/login" className="hover:text-emerald-600 transition-colors">Login</a>
  
  <a href="/signup" className="bg-emerald-600 text-white px-5 py-2 rounded-full hover:bg-emerald-700 transition-all shadow-md">
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
          <a onClick={() => setOpen(false)} href="#how-it-works">How it works</a>



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
  <div className="max-w-7xl mx-auto flex justify-center">
    {/* 'flex-nowrap' forces everything to stay in one line */}
    <div className="flex flex-row flex-nowrap items-center justify-center gap-2 md:gap-6">
      
      <div className="flex items-center gap-2 bg-white px-4 py-2 md:px-6 md:py-3 rounded-2xl shadow-sm border border-gray-50 whitespace-nowrap">
        <Zap className="text-emerald-600 w-4 h-4 md:w-5 md:h-5" /> 
        <span className="font-semibold text-gray-700 text-sm md:text-base">Natural Flow</span>
      </div>

      <div className="flex items-center gap-2 bg-white px-4 py-2 md:px-6 md:py-3 rounded-2xl shadow-sm border border-gray-50 whitespace-nowrap">
        <MessageSquare className="text-emerald-600 w-4 h-4 md:w-5 md:h-5" /> 
        <span className="font-semibold text-gray-700 text-sm md:text-base">Smart Logic</span>
      </div>

      <div className="flex items-center gap-2 bg-white px-4 py-2 md:px-6 md:py-3 rounded-2xl shadow-sm border border-gray-50 whitespace-nowrap">
        <Shield className="text-emerald-600 w-4 h-4 md:w-5 md:h-5" /> 
        <span className="font-semibold text-gray-700 text-sm md:text-base">Privacy First</span>
      </div>

      <div className="flex items-center gap-2 bg-white px-4 py-2 md:px-6 md:py-3 rounded-2xl shadow-sm border border-gray-50 whitespace-nowrap">
        <BarChart3 className="text-emerald-600 w-4 h-4 md:w-5 md:h-5" /> 
        <span className="font-semibold text-gray-700 text-sm md:text-base">Deep Insights</span>
      </div>

    </div>
  </div>
</section>

{/* DESIGNED FOR MODERN CREATORS */}
<section id="features"

  
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

{/* Growth Visualization Section */}
<section className="py-12 md:py-24 px-4 md:px-6 overflow-hidden">
  <div className="max-w-7xl mx-auto">
    <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] md:rounded-[4rem] border border-white shadow-2xl p-6 md:p-20 relative">
      <div className="grid lg:grid-cols-5 gap-10 md:gap-16 items-center">
        
        {/* Text Side */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-[10px] font-black tracking-[0.2em] uppercase">
            <TrendingUp size={14} />
            <span>Accelerated Engagement</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
            Watch your <br />
            <span className="gradient-text">community thrive</span>
          </h2>
          <p className="text-slate-500 text-base md:text-lg font-semibold">
            Creators using ReplyAstra see a significant lift in response rates within 30 days.
          </p>
          
          <div className="space-y-3">
            {["Instant response", "Automated delivery", "Welcome sequences"].map((item, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                  <Check size={12} strokeWidth={4} />
                </div>
                <span className="text-slate-700 font-bold text-sm md:text-base">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Graph Side - FIXED FOR MOBILE */}
        <div className="lg:col-span-3 w-full">
          <div className="relative w-full bg-white/40 backdrop-blur-sm rounded-[2rem] md:rounded-[3rem] border border-white shadow-inner p-4 md:p-8">
            
            
            {/* THIS BOX CONTROLS THE SIZE */}
            <div className="h-[200px] md:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  <Area 
                    type="monotone" 
                    dataKey="volume" 
                    stroke="#10b981" 
                    strokeWidth={4} 
                    fill="url(#colorVolume)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Floating UI element - Now visible on mobile but smaller */}
<div className="absolute -bottom-4 right-2 md:-bottom-6 md:-right-6 bg-slate-900 text-white p-3 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl animate-float z-20">
  <div className="flex items-center space-x-2 md:space-x-4">
    <div className="w-8 h-8 md:w-12 md:h-12 bg-white/10 rounded-xl flex items-center justify-center">
      <MousePointer2 className="text-emerald-400 w-4 h-4 md:w-6 md:h-6" />
    </div>
    <div>
      <p className="text-[8px] md:text-xs font-bold text-emerald-400">Real-time Reply</p>
      <p className="text-[10px] md:text-sm font-black italic">"Link sent! check DM ✨"</p>
    </div>
  </div>
</div>
        </div>
</div>
      </div>
    </div>
  </div>
</section>

{/* HOW IT WORKS */}
<section id="how-it-works"


  className="py-28 px-6 bg-white"
>
  <div className="max-w-6xl mx-auto text-center">

    <span className="inline-block mb-4 bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-xs font-bold">
      HOW IT WORKS
    </span>

    <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
      Simple setup. Real results.
    </h2>

    <p className="text-gray-600 max-w-2xl mx-auto mb-16">
      Get started in minutes. ReplyAstra works quietly in the background
      while your engagement grows.
    </p>

    <div className="grid md:grid-cols-3 gap-8">

      {/* STEP 1 */}
      <div className="
  bg-[#f8fafc] rounded-3xl p-10 text-left relative
  transition-all duration-300 ease-out
  hover:-translate-y-2
  hover:shadow-2xl
  hover:bg-[#f0fdfa]
  hover:border hover:border-emerald-200
  group
">

        <div className="absolute top-6 right-6 text-emerald-100 text-4xl font-extrabold">
          01
        </div>

        <div className="
  w-12 h-12 rounded-xl
  bg-emerald-100 text-emerald-600
  flex items-center justify-center mb-6 text-xl
  transition-transform duration-300
  group-hover:scale-110
">

          📸
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-3">
          Connect
        </h3>

        <p className="text-gray-600 leading-relaxed">
          Securely link your Instagram account with one click.
          We use official Meta APIs so your password stays private.
        </p>
      </div>

      {/* STEP 2 */}
      <div className="
  bg-[#f8fafc] rounded-3xl p-10 text-left relative
  transition-all duration-300 ease-out
  hover:-translate-y-2
  hover:shadow-2xl
  hover:bg-[#f0fdfa]
  hover:border hover:border-emerald-200
  group
">

        <div className="absolute top-6 right-6 text-emerald-100 text-4xl font-extrabold">
          02
        </div>

        <div className="
  w-12 h-12 rounded-xl
  bg-emerald-100 text-emerald-600
  flex items-center justify-center mb-6 text-xl
  transition-transform duration-300
  group-hover:scale-110
">

          ✍️
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-3">
          Set Rules
        </h3>

        <p className="text-gray-600 leading-relaxed">
          Choose keywords like e.g “price” or “link” and set your auto-replies.
          Takes less than 30 seconds.
        </p>
      </div>

      {/* STEP 3 */}
<div className="
  bg-[#f8fafc] rounded-3xl p-10 text-left relative
  transition-all duration-300 ease-out
  hover:-translate-y-2
  hover:shadow-2xl
  hover:bg-[#f0fdfa]
  hover:border hover:border-emerald-200
  group
">

  <div className="absolute top-6 right-6 text-emerald-100 text-4xl font-extrabold">
    03
  </div>

  <div className="
    w-12 h-12 rounded-xl
    bg-emerald-100 text-emerald-600
    flex items-center justify-center mb-6 text-xl
    transition-transform duration-300
    group-hover:scale-110
  ">
    ⚡
  </div>

  <h3 className="text-xl font-bold text-gray-900 mb-3">
    Scale
  </h3>

  <p className="text-gray-600 leading-relaxed">
    ReplyAstra handles your DMs 24/7. Engagement grows while
    you sleep or create new content.
  </p>
</div>
</div>
</div>      
</section>

{/* 1. ADD THIS LINE HERE */}
<section id="pricing" className="py-28 px-6 bg-[#f0fdfa]">
      <PricingSection />
      </section>

<FAQSection />

 
  


    </main>
  );
}



function PricingSection() {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="max-w-6xl mx-auto text-center">
      <h2 className="text-4xl md:text-5xl font-black text-gray-900">
        Choose your growth path
      </h2>
      <p className="mt-4 text-gray-600">
        Transparent pricing for real influence.
      </p>

      {/* TOGGLE */}
      <div className="mt-8 flex items-center justify-center gap-3 text-sm font-semibold">
        <span className={!yearly ? "text-gray-900" : "text-gray-400"}>
          Monthly
        </span>

        <button
          onClick={() => setYearly(!yearly)}
          className={`w-14 h-7 rounded-full px-1 flex items-center transition ${
            yearly ? "bg-emerald-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`w-5 h-5 bg-white rounded-full transition-transform ${
              yearly ? "translate-x-7" : ""
            }`}
          />
        </button>

        <span className={yearly ? "text-gray-900" : "text-gray-400"}>
          Yearly
        </span>
        <span className="ml-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
          SAVE 15%
        </span>
      </div>

      {/* CARDS */}
      <div className="mt-16 grid md:grid-cols-3 gap-8">
        {/* FREE */}
        <div className="bg-white rounded-3xl p-10 shadow-sm">
          <h3 className="font-bold text-lg">Free</h3>
          <p className="text-xs text-gray-400 mb-6">BASE LAYER</p>

          <div className="text-5xl font-black mb-6">
            ₹0<span className="text-base text-gray-400">/mo</span>
          </div>

          <ul className="space-y-3 text-left text-sm">
            <li>✔ Limited automated replies</li>
            <li className="text-red-500">✖ Ask to Follow Automation</li>
            <li>✔ 1 Instagram account</li>
            <li>✔ Basic analytics</li>
            <li className="italic">✔ ReplyAstra Watermark</li>
          </ul>

          <a href="/signup"className="mt-12 block w-full py-4 rounded-2xl bg-emerald-600 text-white font-bold text-center hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-200">
            GET STARTED
          </a>
        </div>

        {/* STARTER */}
        <div className="relative bg-white rounded-3xl p-10 border-2 border-emerald-600 shadow-xl scale-[1.03]">
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs px-4 py-1 rounded-full font-bold">
            MOST POPULAR
          </span>

          <h3 className="font-bold text-lg">Starter</h3>
          <p className="text-xs text-emerald-600 mb-6">EXPANSION MODE</p>

          <div className="text-5xl font-black mb-6">
            ₹{yearly ? 169 : 199}
            <span className="text-base text-gray-400">/mo</span>
          </div>

          <ul className="space-y-3 text-left text-sm">
            <li>✔ High-volume DM automation</li>
            <li>✔ Ask to Follow Automation</li>
            <li>✔ 3 Instagram accounts</li>
            <li>✔ Unlimited keyword replies</li>
            <li>✔ Basic analytics</li>
            <li className="italic">✔ No Watermark</li>
          </ul>

        <a href="/signup"className="mt-12 block w-full py-4 rounded-2xl bg-emerald-600 text-white font-bold text-center hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-200">
            GET STARTED
          </a>
        </div>

        {/* PRO */}
        <div className="bg-white rounded-3xl p-10 shadow-sm">
          <h3 className="font-bold text-lg">Pro</h3>
          <p className="text-xs text-gray-400 mb-6">ENTERPRISE CORE</p>

          <div className="text-5xl font-black mb-6">
            ₹{yearly ? 339 : 399}
            <span className="text-base text-gray-400">/mo</span>
          </div>

          <ul className="space-y-3 text-left text-sm">
            <li>✔ High-volume DM automation</li>
            <li>✔ 10 Instagram accounts</li>
            <li>✔ Advanced analytics</li>
            <li>✔ Priority support</li>
            <li className="italic">✔ All Starter features</li>
          </ul>

          <a href="/signup"className="mt-12 block w-full py-4 rounded-2xl bg-emerald-600 text-white font-bold text-center hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-200">
            GET STARTED
          </a>
        </div>
      </div>

      <p className="mt-10 text-xs text-gray-400 italic">
        *Automation volume depends on Instagram’s official messaging limits.
      </p>
      </div>

      );

      }





    

    


