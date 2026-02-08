"use client";
import React, { useState } from 'react';
import Link from 'next/link';
// Importing specific icons to prevent build errors
import { Sparkles, ArrowRight, Check, Instagram } from 'lucide-react';
// I am using '../lib/supabaseClient' - Change 'lib' to 'services' if your folder is named services
import { supabase } from '../lib/supabaseClient'; 

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleJoin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // This sends the email to your Supabase 'inquiries' table
      const { error } = await supabase.from('inquiries').insert([{ email }]);
      if (error) throw error;
      
      setMessage("Success! You're on the list.");
      setEmail('');
    } catch (err) {
      console.error(err);
      setMessage("Error: Make sure you have a table named 'inquiries' in Supabase.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-emerald-100">
      {/* Top Navigation */}
      <nav className="p-6 flex justify-between items-center border-b border-gray-50 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="font-bold text-2xl tracking-tighter">REPLY<span className="text-emerald-600">ASTRA</span></div>
        <div className="flex gap-4 items-center">
          <Link href="/auth" className="text-sm font-bold text-gray-600 hover:text-black">Login</Link>
          <Link href="/auth" className="bg-emerald-600 text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-emerald-700 transition">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto pt-24 pb-20 px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest mb-8 uppercase border border-emerald-100">
          <Sparkles size={14}/> Next-Gen Automation
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-8">
          Automate your <br/>
          <span className="text-emerald-600">Instagram.</span>
        </h1>
        
        <p className="text-gray-500 text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
          ReplyAstra handles your DMs and comments automatically, helping creators capture leads 24/7.
        </p>
        
        {/* Waitlist Form */}
        <form onSubmit={handleJoin} className="flex flex-col md:flex-row gap-3 max-w-md mx-auto bg-gray-50 p-2 rounded-[2rem] border border-gray-100">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="flex-1 bg-transparent p-4 pl-6 rounded-2xl outline-none font-semibold text-gray-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button 
            disabled={loading}
            className="bg-black text-white px-8 py-4 rounded-[1.5rem] font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Join Waitlist"} <ArrowRight size={18}/>
          </button>
        </form>
        
        {message && (
          <p className={`mt-6 font-bold text-sm uppercase tracking-widest ${message.includes('Error') ? 'text-red-500' : 'text-emerald-600'}`}>
            {message}
          </p>
        )}

        <div className="mt-20 pt-10 border-t border-gray-50 flex justify-center gap-12 opacity-40 grayscale">
           <Instagram size={24} />
           <div className="font-bold tracking-widest text-xs uppercase">Meta-Safe</div>
           <Check size={24} />
        </div>
      </main>
    </div>
  );
}
