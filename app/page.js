"use client";

import React, { useState } from 'react';
// Next.js specific imports
import Link from 'next/link'; 
import { 
  Check, 
  MessageSquare, 
  Zap, 
  Target, 
  Shield, 
  ArrowRight, 
  Menu, 
  X, 
  Sparkles,
  Lock,
  BarChart4,
  Instagram,
  TrendingUp,
  MousePointer2
} from 'lucide-react';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';

// Growth Data
const growthData = [
  { name: 'Week 1', volume: 120, interaction: 80 },
  { name: 'Week 2', volume: 280, interaction: 190 },
  { name: 'Week 3', volume: 450, interaction: 310 },
  { name: 'Week 4', volume: 780, interaction: 520 },
  { name: 'Week 5', volume: 1100, interaction: 890 },
  { name: 'Week 6', volume: 1800, interaction: 1450 },
  { name: 'Week 7', volume: 2400, interaction: 2100 },
];

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isYearly, setIsYearly] = useState(false);
  const [inquiryData, setInquiryData] = useState({ name: '', email: '', message: '' });
 const [status, setStatus] = useState({ type: null, message: '' });
  const [loading, setLoading] = useState(false);

  // Note: Ensure your Supabase client is set up in a separate file (e.g., lib/supabase.js)
  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Logic for Supabase would go here
    setLoading(false);
  };

  const getPrice = (monthly: number) => {
    if (!isYearly) return monthly;
    return Math.floor(monthly * 0.8);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 text-white font-bold text-lg">
                  R
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
              <span className="text-2xl font-bold tracking-tight">
                <span className="text-gray-900">Reply</span>
                <span className="text-emerald-600">Astra</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8 font-semibold">
              <a href="#features" className="text-slate-600 hover:text-emerald-600 transition">Features</a>
              <Link href="/how-it-works" className="text-slate-600 hover:text-emerald-600 transition">How it Works</Link>
              <a href="#pricing" className="text-slate-600 hover:text-emerald-600 transition">Pricing</a>
              <Link href="/auth" className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition-all hover:scale-105 shadow-lg shadow-emerald-200">Get Started</Link>
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white px-6 py-6 space-y-4 border-b border-slate-100 shadow-xl">
            <a href="#features" onClick={() => setIsMenuOpen(false)} className="block text-slate-600 font-medium">Features</a>
            <Link href="/how-it-works" className="block text-slate-600 font-medium">How it Works</Link>
            <a href="#pricing" className="block text-slate-600 font-medium">Pricing</a>
            <Link href="/auth" className="block text-emerald-600 font-bold">Get Started</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-emerald-100/50 text-emerald-700 px-4 py-2 rounded-full text-xs font-black tracking-widest mb-8 border border-emerald-200/50 uppercase">
            <Sparkles size={14} />
            <span>Intelligent Growth</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tight leading-[0.9] mb-8">
            Fresh approach to <br />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">DM Automation.</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12 font-medium">
            ReplyAstra brings intelligent automation to Instagram DMs — helping creators reply faster and grow smarter.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/auth" className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-12 py-5 rounded-[1.5rem] font-black text-lg hover:shadow-2xl transition-all hover:scale-105 flex items-center justify-center group">
              Start Free Now <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/how-it-works" className="w-full sm:w-auto bg-white border-2 border-slate-200 text-slate-700 px-12 py-5 rounded-[1.5rem] font-black text-lg hover:border-emerald-200 transition-all flex items-center justify-center">
              Get Started
            </Link>
          </div>

          {/* Feature Pills */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
            {[
              { icon: <Zap className="text-emerald-600" />, label: "Natural Flow" },
              { icon: <Sparkles className="text-teal-600" />, label: "Smart Logic" },
              { icon: <Lock className="text-cyan-600" />, label: "Privacy First" },
              { icon: <BarChart4 className="text-emerald-700" />, label: "Deep Insights" }
            ].map((pill, i) => (
              <div key={i} className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-100 flex flex-col items-center hover:scale-105 transition-transform">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-4">
                  {pill.icon}
                </div>
                <p className="text-[10px] md:text-xs font-black text-slate-800 uppercase tracking-widest">{pill.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Growth Visualization */}
      <section className="py-12 md:py-24 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-[3rem] md:rounded-[4rem] border border-slate-100 shadow-2xl p-8 md:p-20 relative overflow-hidden">
            <div className="grid lg:grid-cols-5 gap-12 items-center">
              <div className="lg:col-span-2 space-y-6">
                <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase">
                  <TrendingUp size={14} />
                  <span>Accelerated Engagement</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                  Watch your <br />
                  <span className="text-emerald-600">community thrive</span>
                </h2>
                <p className="text-slate-500 text-base md:text-lg font-semibold">
                  Creators using ReplyAstra see a significant lift in response rates within 30 days.
                </p>
                <div className="space-y-3">
                  {["Instant responses", "Automated delivery", "Welcome sequences"].map((item, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                        <Check size={12} strokeWidth={4} />
                      </div>
                      <span className="text-slate-700 font-bold text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Responsive Graph Container */}
              <div className="lg:col-span-3 w-full">
                <div className="bg-slate-50/50 rounded-[2rem] p-4 md:p-8 border border-slate-100 relative h-[300px] md:h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={growthData}>
                      <defs>
                        <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                      <Area 
                        type="monotone" 
                        dataKey="volume" 
                        stroke="#10b981" 
                        strokeWidth={4} 
                        fill="url(#colorVolume)" 
                        animationDuration={2000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                  
                  {/* Floating Pill Fixed for Mobile */}
                  <div className="absolute -bottom-4 right-2 md:-bottom-6 md:-right-6 bg-slate-900 text-white p-4 rounded-[1.5rem] shadow-2xl z-20">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                        <MousePointer2 size={16} className="text-emerald-400" />
                      </div>
                      <p className="text-[10px] md:text-xs font-black italic">"Link sent! check DM ✨"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 bg-white px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold">R</div>
            <span className="text-xl font-black">Reply<span className="text-emerald-600">Astra</span></span>
          </div>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">© 2026 ReplyAstra Platform</p>
          <div className="flex space-x-4">
            <Instagram size={18} className="text-slate-400 hover:text-emerald-600 cursor-pointer" />
          </div>
        </div>
      </footer>

    </div>
  );
}
