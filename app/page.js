import React from 'react';
import { CheckCircle2, Zap, Shield, BarChart3, MessageSquare, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      
      {/* 1. FIXED NAVBAR (Matches Studio Site) */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg relative">
              <span className="text-white font-bold text-xl">R</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-gray-900">Reply</span>
              <span className="text-emerald-600">Astra</span>
            </span>
          </div>
          
          <div className="flex items-center space-x-8">
            <a href="#features" className="hidden md:block text-gray-600 font-semibold hover:text-emerald-600 transition-colors">Features</a>
            <a href="#pricing" className="hidden md:block text-gray-600 font-semibold hover:text-emerald-600 transition-colors">Pricing</a>
            <div className="flex items-center space-x-6">
              {/* Added the Login button you mentioned was missing */}
              <a href="/login" className="text-gray-700 font-bold hover:text-emerald-600">Login</a>
              <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-md">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION (Aligned to top, no extra gaps) */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 px-4 py-2 rounded-full mb-8">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            <span className="text-emerald-800 text-xs font-black uppercase tracking-widest">New: AI-Powered Automation</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-[1.1]">
            Fresh approach to <br />
            <span className="text-emerald-600 italic">DM Automation</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Automate your Instagram DMs with intelligent logic. Engage followers, capture leads, and close sales 24/7 with the most advanced automation tool.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto bg-gray-900 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-black hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-2">
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto bg-emerald-700 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-emerald-800 transition-all shadow-lg">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* 3. FEATURE PILLS (Like the Studio Row) */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Zap />, label: "Natural Flow" },
            { icon: <Shield />, label: "Privacy First" },
            { icon: <BarChart3 />, label: "Deep Insights" },
            { icon: <MessageSquare />, label: "Smart Logic" }
          ].map((item, i) => (
            <div key={i} className="bg-white border border-gray-100 p-6 rounded-2xl flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all">
              <div className="text-emerald-600 mb-3">{item.icon}</div>
              <span className="font-bold text-gray-800">{item.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
