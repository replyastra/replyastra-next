"use client";
import React, { useState } from 'react';
import Link from 'next/link';
// Basic Lucide Icons
import { Sparkles, ArrowRight } from 'lucide-react';

// FIXED: Changed 'supabaseClient' to 'supabase' to match your filename
import { supabase } from '../lib/supabase'; 

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleJoin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Note: Make sure your table in Supabase is named 'inquiries'
      const { error } = await supabase.from('inquiries').insert([{ email }]);
      if (error) throw error;
      setMessage("Success! You're on the list.");
      setEmail('');
    } catch (err) {
      setMessage("Connected to Supabase, but table 'inquiries' not found.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <nav className="p-6 flex justify-between items-center border-b border-gray-100">
        <div className="font-bold text-2xl tracking-tighter">REPLY<span className="text-emerald-600">ASTRA</span></div>
        <Link href="/auth" className="bg-emerald-600 text-white px-5 py-2 rounded-full font-bold text-sm">Login</Link>
      </nav>

      <main className="max-w-4xl mx-auto pt-32 px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1 rounded-full text-xs font-bold mb-6">
          <Sparkles size={14}/> INSTAGRAM AUTOMATION
        </div>
        <h1 className="text-6xl md:text-8xl font-black leading-none mb-6">Grow your <span className="text-emerald-600">Influence.</span></h1>
        <p className="text-gray-500 text-xl mb-10">Smart DM automation for modern creators.</p>
        
        <form onSubmit={handleJoin} className="flex flex-col md:flex-row gap-3 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="flex-1 border-2 border-gray-100 p-4 rounded-2xl outline-none focus:border-emerald-500 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="bg-black text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
            {loading ? "..." : "Join Waitlist"} <ArrowRight size={18}/>
          </button>
        </form>
        {message && <p className="mt-4 font-bold text-emerald-600 italic">{message}</p>}
      </main>
    </div>
  );
}
