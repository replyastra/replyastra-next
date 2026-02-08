"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Check, MessageSquare, Zap, Target, Shield, ArrowRight, 
  Menu, X, Sparkles, Lock, BarChart4, Instagram 
} from 'lucide-react';
// Using the filename you confirmed: lib/supabase.js
import { supabase } from '../lib/supabase'; 

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' });

  const handleJoin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('inquiries').insert([{ email }]);
      if (error) throw error;
      setStatus({ type: 'success', message: 'Welcome to the inner circle! We will contact you soon.' });
      setEmail('');
    } catch (err) {
      setStatus({ type: 'error', message: 'Error: Make sure "inquiries" table exists in Supabase.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 font-sans">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-lg shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">R</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
              <span className="text-2xl font-bold italic">
                <span className="text-gray-900">Reply</span>
                <span className="text-emerald-600">Astra</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">How it Works</a>
              <Link href="/auth" className="bg-emerald-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-emerald-700 hover:shadow-lg transition-all active:scale-95">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 px-4 py-2 rounded-full text-emerald-700 text-sm font-bold mb-8 animate-bounce">
            <Sparkles size={16} />
            <span>AI-Powered Instagram Growth</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-8">
            Turn Your Instagram DMs Into <br/>
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Automated Sales Machines</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            ReplyAstra uses intelligent AI to handle your DMs, comments, and leads 24/7. Never miss a customer while you sleep.
          </p>

          <form onSubmit={handleJoin} className="max-w-lg mx-auto flex flex-col md:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-6 py-4 rounded-2xl border-2 border-emerald-100 bg-white/80 focus:border-emerald-500 outline-none shadow-sm transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all flex items-center justify-center gap-2">
              {loading ? "Joining..." : "Join Waitlist"} <ArrowRight size={20} />
            </button>
          </form>
          {status.message && (
            <p className={`mt-4 font-bold ${status.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
              {status.message}
            </p>
          )}
        </div>
      </section>

      {/* Feature Cards Section */}
      <section id="features" className="py-24 bg-white/50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-emerald-100/50 border border-emerald-50 hover:scale-105 transition-transform">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                <Zap size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Instant Replies</h3>
              <p className="text-gray-600 leading-relaxed font-medium">Automate common questions and handle leads instantly when they message you.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-emerald-100/50 border border-emerald-50 hover:scale-105 transition-transform">
              <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600 mb-6">
                <Target size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Lead Capture</h3>
              <p className="text-gray-600 leading-relaxed font-medium">Automatically collect emails and phone numbers from interested followers.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-emerald-100/50 border border-emerald-50 hover:scale-105 transition-transform">
              <div className="w-14 h-14 bg-cyan-100 rounded-2xl flex items-center justify-center text-cyan-600 mb-6">
                <Shield size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">100% Meta Safe</h3>
              <p className="text-gray-600 leading-relaxed font-medium">Built using official Instagram APIs. Your account security is our priority.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 px-6 border-t border-gray-100 text-center">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-xl font-bold">Reply<span className="text-emerald-600">Astra</span></span>
          </div>
          <p className="text-gray-500 font-medium">© 2026 ReplyAstra. Built for the next generation of creators.</p>
        </div>
      </footer>
    </div>
  );
}
