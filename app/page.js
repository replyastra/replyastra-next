import React from 'react';
import { CheckCircle2, MessageSquare, Zap, Shield, BarChart3, Clock, Users, Globe } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 text-gray-900 font-sans">
      {/* Navigation - Fixed to remove the gap you marked */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-lg shadow-sm border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="text-2xl font-bold">
              <span className="text-gray-900">Reply</span>
              <span className="text-emerald-600">Astra</span>
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8 font-medium text-gray-600">
            <a href="#features" className="hover:text-emerald-600 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-emerald-600 transition-colors">Pricing</a>
            <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-700 transition-all shadow-md">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Matching exact content */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-emerald-100/50 border border-emerald-200 px-4 py-2 rounded-full mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-800 text-sm font-semibold uppercase tracking-wider">New: AI-Powered Automation</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-8 leading-tight">
            Fresh approach to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">DM Automation</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Automate your Instagram DMs with intelligent logic. Engage followers, 
            capture leads, and close sales 24/7 with the most advanced automation tool.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="w-full sm:w-auto bg-emerald-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 hover:scale-105 transition-all shadow-xl">
              Get Started for Free
            </button>
            <button className="w-full sm:w-auto bg-white text-gray-900 border-2 border-emerald-100 px-10 py-4 rounded-xl font-bold text-lg hover:bg-emerald-50 transition-all shadow-sm">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Feature Pills - Matching exact content */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Zap className="w-5 h-5" />, label: "Natural Flow" },
              { icon: <Shield className="w-5 h-5" />, label: "Privacy First" },
              { icon: <BarChart3 className="w-5 h-5" />, label: "Deep Insights" },
              { icon: <MessageSquare className="w-5 h-5" />, label: "Smart Logic" }
            ].map((pill, idx) => (
              <div key={idx} className="flex items-center justify-center space-x-2 bg-white/60 backdrop-blur-sm border border-emerald-100 py-4 rounded-2xl shadow-sm">
                <div className="text-emerald-600">{pill.icon}</div>
                <span className="font-semibold text-gray-700">{pill.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - Exact same content and price */}
      <section id="pricing" className="py-24 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Simple, Transparent Pricing</h2>
            <p className="text-gray-600">No hidden fees. Choose the plan that works for you.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <PricingCard title="Free" price="0" features={["100 DMs/month", "Basic Automation", "1 Instagram Account"]} />
            <PricingCard title="Starter" price="199" features={["1,000 DMs/month", "Advanced Logic", "3 Instagram Accounts"]} highlighted={true} />
            <PricingCard title="Pro" price="399" features={["Unlimited DMs", "AI Responses", "10 Instagram Accounts"]} />
          </div>
        </div>
      </section>
    </div>
  );
}

function PricingCard({ title, price, features, highlighted = false }) {
  return (
    <div className={`p-8 rounded-3xl border-2 transition-all hover:scale-105 ${highlighted ? 'border-emerald-500 bg-white shadow-2xl relative' : 'border-emerald-100 bg-white/80'}`}>
      {highlighted && <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold">MOST POPULAR</span>}
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold">₹{price}</span>
        <span className="text-gray-500">/month</span>
      </div>
      <ul className="space-y-4 mb-8">
        {features.map((f, i) => (
          <li key={i} className="flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span className="text-gray-600">{f}</span>
          </li>
        ))}
      </ul>
      <button className={`w-full py-4 rounded-xl font-bold transition-all ${highlighted ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}>
        Choose Plan
      </button>
    </div>
  );
}
