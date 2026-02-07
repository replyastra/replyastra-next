"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Check, MessageSquare, Zap, Target, Shield, ArrowRight, Instagram, Menu, X, Star } from 'lucide-react';
import { supabase } from '../lib/supabase'; // Ensure this path is correct

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [inquiryData, setInquiryData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ type: null, message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmitInquiry = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const { error } = await supabase.from('inquiries').insert([inquiryData]);
      if (error) throw error;
      setStatus({ type: 'success', message: 'Message sent successfully!' });
      setInquiryData({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to send message.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020402] text-white selection:bg-emerald-500/30 overflow-x-hidden relative font-sans">
      
      {/* VIBRANT BACKGROUND MESH - For Windows PC Pop */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#00ff88]/15 blur-[160px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[700px] h-[700px] bg-[#10b981]/10 blur-[140px] rounded-full"></div>
      </div>

      {/* NAVIGATION */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl bg-white/[0.03] backdrop-blur-[40px] border border-white/10 rounded-[3rem] px-8 py-4 flex items-center justify-between shadow-2xl">
        <div className="text-2xl font-black tracking-tighter italic">
          REPLY<span className="text-emerald-400">ASTRA</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 font-semibold text-sm">
          <a href="#features" className="opacity-60 hover:opacity-100 transition">Features</a>
          <a href="#pricing" className="opacity-60 hover:opacity-100 transition">Pricing</a>
          <Link href="/login" className="opacity-60 hover:opacity-100 transition">Login</Link>
          <Link href="/signup" className="bg-[#00ff88] text-black px-6 py-2.5 rounded-full font-bold shadow-[0_0_20px_rgba(0,255,136,0.3)] hover:scale-105 transition-all">
            Get Started
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-48 pb-20 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-10 text-[10px] font-bold uppercase tracking-widest rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 backdrop-blur-md">
          🌱 AI-Powered Instagram Automation
        </div>
        <h1 className="text-6xl md:text-[6rem] font-black tracking-tighter leading-[0.95] mb-10">
          Automate DMs. <br />
          <span className="bg-gradient-to-r from-[#00ff88] via-[#10b981] to-[#34d399] bg-clip-text text-transparent filter drop-shadow-[0_0_15px_rgba(0,255,136,0.2)]">
            Grow 24/7.
          </span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 font-medium">
          ReplyAstra handles your comments and DMs instantly, capturing leads while you sleep.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link href="/signup" className="px-12 py-5 bg-white text-black font-black rounded-2xl text-lg hover:scale-105 transition-all flex items-center justify-center">
            Start Free Trial <ArrowRight className="ml-2" />
          </Link>
        </div>

        {/* MOCKUP PREVIEW */}
        <div className="mt-24 max-w-5xl mx-auto relative group">
          <div className="absolute -inset-1 bg-[#00ff88]/20 rounded-[3rem] blur-2xl group-hover:opacity-40 transition opacity-20"></div>
          <img src="https://picsum.photos/1200/700" alt="Dashboard" className="relative rounded-[2.5rem] border border-white/10 shadow-2xl grayscale-[0.5] hover:grayscale-0 transition duration-700" />
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-20">Fresh Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <MessageSquare className="text-emerald-400" />, title: "AI DM Replies", desc: "Contextual AI that talks just like you." },
            { icon: <Target className="text-emerald-400" />, title: "Lead Gen", desc: "Auto-export interested users to your list." },
            { icon: <Zap className="text-emerald-400" />, title: "Comment Automation", desc: "Instantly DM anyone who comments your keyword." }
          ].map((feature, i) => (
            <div key={i} className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl hover:bg-white/[0.06] transition-all group">
              <div className="mb-6 group-hover:scale-110 transition-transform">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING (Windows Pop Style) */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="p-12 rounded-[3rem] bg-white/[0.02] border border-white/10 backdrop-blur-xl">
            <h3 className="text-2xl font-bold mb-2">Pro Plan</h3>
            <div className="text-5xl font-black mb-6 text-emerald-400">₹299<span className="text-lg text-gray-500">/mo</span></div>
            <ul className="space-y-4 mb-10 text-gray-400">
              <li className="flex items-center gap-2 font-medium"> <Check size={18} className="text-emerald-400"/> AI Responses</li>
              <li className="flex items-center gap-2 font-medium"> <Check size={18} className="text-emerald-400"/> Unlimited Keywords</li>
            </ul>
            <Link href="/signup" className="block w-full text-center py-4 bg-white text-black font-bold rounded-2xl hover:bg-emerald-400 transition-colors">Start Trial</Link>
          </div>
          {/* Add more pricing cards as needed */}
        </div>
      </section>

      {/* INQUIRY FORM */}
      <section className="py-32 px-6 max-w-4xl mx-auto">
        <div className="bg-white/[0.03] p-12 rounded-[3rem] border border-white/10 backdrop-blur-2xl">
          <h2 className="text-3xl font-bold mb-8">Get in touch</h2>
          <form onSubmit={handleSubmitInquiry} className="space-y-6">
            <input 
              type="text" placeholder="Name" 
              className="w-full bg-white/[0.05] border border-white/10 p-4 rounded-2xl focus:border-emerald-400 outline-none"
              onChange={(e) => setInquiryData({...inquiryData, name: e.target.value})}
            />
            <input 
              type="email" placeholder="Email" 
              className="w-full bg-white/[0.05] border border-white/10 p-4 rounded-2xl focus:border-emerald-400 outline-none"
              onChange={(e) => setInquiryData({...inquiryData, email: e.target.value})}
            />
            <textarea 
              rows={4} placeholder="Message" 
              className="w-full bg-white/[0.05] border border-white/10 p-4 rounded-2xl focus:border-emerald-400 outline-none"
              onChange={(e) => setInquiryData({...inquiryData, message: e.target.value})}
            ></textarea>
            <button className="w-full bg-[#00ff88] text-black font-black py-4 rounded-2xl shadow-xl shadow-emerald-600/20 active:scale-95 transition-all">
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}
