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

 {/* Growth Visualization Section - Copy from here */}
<section className="py-24 px-6 overflow-hidden">
  <div className="max-w-7xl mx-auto">
    <div className="bg-white/60 backdrop-blur-xl rounded-[4rem] border border-white shadow-2xl p-12 md:p-20 relative">
      <div className="grid lg:grid-cols-5 gap-16 items-center">
        <div className="lg:col-span-2 space-y-8">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-[10px] font-black tracking-[0.2em] uppercase">
            <TrendingUp size={14} />
            <span>Accelerated Engagement</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
            Watch your <br />
            <span className="text-emerald-600">community thrive</span> while you sleep.
          </h2>
          <p className="text-slate-500 text-lg font-semibold leading-relaxed">
            Creators using ReplyAstra see a significant lift in response rates within the first 30 days. Our intelligent logic ensures no follower is left on read.
          </p>
          <div className="space-y-4">
            {[
              "Instant response to 'how much' queries",
              "Automated link delivery to story reactions",
              "Natural-sounding welcome sequences"
            ].map((item, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                  <Check size={14} strokeWidth={4} />
                </div>
                <span className="text-slate-700 font-bold">{item}</span>
              </div>
            ))}
          </div>
          <div className="pt-6">
            <button className="inline-flex items-center text-emerald-600 font-black text-lg group">
              Start Free Now <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-3 h-[450px] relative group">
          <div className="absolute inset-0 bg-emerald-500/5 blur-[100px] rounded-full group-hover:bg-emerald-500/10 transition-colors"></div>
          <div className="w-full h-full bg-white/40 backdrop-blur-sm rounded-[3rem] border border-white shadow-inner p-8 relative z-10">
            <div className="flex justify-between items-center mb-8">
              <div className="flex space-x-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Chats</span>
                  <span className="text-2xl font-black text-slate-900">+1,400%</span>
                </div>
              </div>
              <div className="flex space-x-2">
                 <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                 <div className="w-3 h-3 bg-teal-500 rounded-full opacity-30"></div>
              </div>
            </div>
            
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { name: 'Week 1', volume: 400 },
                  { name: 'Week 2', volume: 700 },
                  { name: 'Week 3', volume: 1200 },
                  { name: 'Week 4', volume: 2100 },
                  { name: 'Week 5', volume: 3800 },
                ]} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '24px', 
                      border: '1px solid #f1f5f9', 
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
                      padding: '12px 16px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="volume" 
                    stroke="#10b981" 
                    strokeWidth={6}
                    fillOpacity={1} 
                    fill="url(#colorVolume)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-100 pt-6">
              <span>Pre-Astra</span>
              <span className="text-emerald-600">Peak Influence</span>
            </div>
          </div>
          
          {/* Floating UI element */}
          <div className="absolute -bottom-6 -right-6 bg-slate-900 text-white p-6 rounded-[2rem] shadow-2xl animate-bounce hidden md:block z-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <MousePointer2 className="text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-400">Real-time Reply</p>
                <p className="text-sm font-black italic">"Link sent! check your DM ✨"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


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
