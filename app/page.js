"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Check, MessageSquare, Zap, Target, Shield, ArrowRight, 
  Menu, X, Sparkles, Lock, BarChart4, Instagram 
} from 'lucide-react';
// Check your path: services/supabaseClient or lib/supabase
import { supabase } from '../services/supabaseClient'; 

export default function LandingPage({ session }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [inquiryData, setInquiryData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ type: null, message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmitInquiry = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const { error } = await supabase.from('inquiries').insert([{
        name: inquiryData.name || 'Subscriber',
        email: inquiryData.email,
        message: 'Newsletter/Access Inquiry'
      }]);
      if (error) throw error;
      setStatus({ type: 'success', message: 'Success! You are on the list.' });
      setInquiryData({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Something went wrong.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              Reply<span className="text-emerald-600">Astra</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 font-semibold text-sm">
            <a href="#features" className="text-slate-600 hover:text-emerald-600 transition">Features</a>
            <a href="#pricing" className="text-slate-600 hover:text-emerald-600 transition">Pricing</a>
            {session ? (
              <Link href="/dashboard" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl hover:scale-105 transition-all shadow-lg">Dashboard</Link>
            ) : (
              <Link href="/auth" className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition-all shadow-md">Get Started</Link>
            )}
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="text-slate-900" /> : <Menu className="text-slate-900" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b p-6 space-y-4 shadow-xl animate-in slide-in-from-top">
            <a href="#features" className="block text-slate-600 font-bold" onClick={() => setIsMenuOpen(false)}>Features</a>
            <a href="#pricing" className="block text-slate-600 font-bold" onClick={() => setIsMenuOpen(false)}>Pricing</a>
            <Link href="/auth" className="block text-emerald-600 font-black">Get Started</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-[10px] font-black tracking-widest mb-8 border border-emerald-100 uppercase">
          <Sparkles size={14} /> <span>Intelligent Growth</span>
        </div>
        <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.95] mb-8">
          Fresh approach to <br />
          <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">DM Automation.</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium">
          ReplyAstra brings intelligent automation to Instagram DMs — helping creators reply faster and grow smarter.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link href="/auth" className="w-full sm:w-auto bg-slate-900 text-white px-12 py-5 rounded-3xl font-black text-lg hover:scale-105 transition-all shadow-2xl flex items-center justify-center">
            Start Free Now <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { icon: <Zap className="text-emerald-600" />, label: "Natural Flow" },
            { icon: <Sparkles className="text-teal-600" />, label: "Smart Logic" },
            { icon: <Lock className="text-cyan-600" />, label: "Privacy First" },
            { icon: <BarChart4 className="text-emerald-700" />, label: "Deep Insights" }
          ].map((pill, i) => (
            <div key={i} className="bg-white rounded-3xl p-8 border border-slate-100 flex flex-col items-center hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-4">{pill.icon}</div>
              <p className="text-xs font-black text-slate-800 uppercase tracking-widest">{pill.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tighter">Growth Paths</h2>
          <p className="text-slate-500 font-bold italic">Meta-compliant automation for every stage.</p>
        </div>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Starter Plan */}
          <div className="bg-white p-10 rounded-[3rem] border-4 border-emerald-500 shadow-2xl relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-6 py-1 rounded-full text-[10px] font-black uppercase">Popular</div>
            <h3 className="text-xl font-black mb-2">Starter</h3>
            <div className="text-5xl font-black mb-8">₹199<span className="text-lg text-slate-400">/mo</span></div>
            <ul className="space-y-4 mb-10 text-slate-600 font-bold text-sm">
              <li className="flex items-center"><Check className="text-emerald-500 mr-2" size={18}/> Unlimited Keywords</li>
              <li className="flex items-center"><Check className="text-emerald-500 mr-2" size={18}/> AI-Powered Responses</li>
              <li className="flex items-center"><Check className="text-emerald-500 mr-2" size={18}/> Meta-Safe Integration</li>
            </ul>
            <Link href="/auth" className="block w-full text-center py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-colors uppercase tracking-widest text-xs">Start Now</Link>
          </div>
          {/* Free Plan */}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 flex flex-col">
            <h3 className="text-xl font-black mb-2">Free</h3>
            <div className="text-5xl font-black mb-8">₹0</div>
            <ul className="space-y-4 mb-10 text-slate-500 font-bold text-sm">
              <li className="flex items-center"><Check className="text-emerald-400 mr-2" size={18}/> 100 Auto-replies/mo</li>
              <li className="flex items-center"><Check className="text-emerald-400 mr-2" size={18}/> 1 Account Support</li>
            </ul>
            <Link href="/auth" className="block w-full text-center py-4 border-2 border-slate-200 text-slate-600 font-black rounded-2xl hover:bg-slate-50 transition-colors uppercase tracking-widest text-xs">Join Waitlist</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
