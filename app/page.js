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

    "use client";
import React, { useState, useEffect } from 'react';
import { MousePointer2 } from 'lucide-react';

export default function GraphSection() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [stats, setStats] = useState({ replies: 1240, leads: 85 });

  // Handle mouse movement for the interactive effect
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
    
    // Subtly change numbers based on mouse position
    setStats({
      replies: 1240 + Math.floor(x * 20),
      leads: 85 + Math.floor(y * 5)
    });
  };

  return (
    <section className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div 
          onMouseMove={handleMouseMove}
          className="relative bg-slate-900 rounded-[3rem] p-8 md:p-16 overflow-hidden shadow-2xl group cursor-none"
        >
          {/* Custom Cursor Dot */}
          <div 
            className="fixed pointer-events-none z-50 w-4 h-4 bg-emerald-400 rounded-full blur-[2px] transition-transform duration-75 ease-out hidden group-hover:block"
            style={{ left: `${mousePos.x * 100}%`, top: `${mousePos.y * 100}%`, transform: 'translate(-50%, -50%)' }}
          />

          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Watch your growth <br />
                <span className="text-emerald-400">in real-time.</span>
              </h2>
              <div className="flex gap-8">
                <div>
                  <p className="text-slate-400 font-bold uppercase tracking-wider text-xs mb-1">Total Replies</p>
                  <p className="text-3xl font-black text-white tabular-nums">{stats.replies.toLocaleString()}</p>
                </div>
                <div className="w-px h-12 bg-slate-800" />
                <div>
                  <p className="text-slate-400 font-bold uppercase tracking-wider text-xs mb-1">Leads Captured</p>
                  <p className="text-3xl font-black text-emerald-400 tabular-nums">{stats.leads}%</p>
                </div>
              </div>
            </div>

            {/* THE GRAPH AREA */}
            <div className="relative h-64 bg-slate-800/50 rounded-2xl border border-slate-700 p-6 overflow-hidden">
              {/* Animated Background Lines */}
              <svg className="absolute inset-0 w-full h-full opacity-20">
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* THE GRAPH LINE - Moves with Mouse */}
              <svg className="absolute inset-0 w-full h-full">
                <path 
                  d={`M0,100 Q${mousePos.x * 500},${150 - (mousePos.y * 50)} 600,80`} 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="4" 
                  className="transition-all duration-300 ease-out"
                />
              </svg>

              {/* FLOATING PILL: "Link sent! check your DM ✨" */}
              <div 
                className="absolute bg-white shadow-xl px-4 py-2 rounded-full flex items-center gap-2 border border-emerald-100 transition-all duration-500 ease-out"
                style={{ 
                  left: `${20 + (mousePos.x * 10)}%`, 
                  top: `${40 + (mousePos.y * 15)}%`,
                  transform: `translateY(${Math.sin(Date.now() / 1000) * 5}px)` // Gentle floating
                }}
              >
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-sm font-bold text-slate-800 tracking-tight">
                  Link sent! check your DM ✨
                </span>
              </div>

              {/* REAL-TIME REPLY LABEL */}
              <div className="absolute bottom-4 left-4 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-md">
                <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Real-time Reply</span>
              </div>
            </div>
          </div>

          {/* Background Glow that follows mouse */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-30 transition-opacity duration-500 group-hover:opacity-50"
            style={{ 
              background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)` 
            }}
          />
        </div>
      </div>
    </section>
  );
}

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
