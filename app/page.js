import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Instagram
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';

const LandingPage: React.FC<{ session: any }> = ({ session }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [inquiryData, setInquiryData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmitInquiry = async (e: React.FormEvent) => {
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
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Something went wrong.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                  <span className="text-white font-bold text-lg">R</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-2xl font-bold tracking-tight">
                  <span className="text-gray-900">Reply</span>
                  <span className="text-emerald-600">Astra</span>
                </span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8 font-semibold">
              <a href="#features" className="text-slate-600 hover:text-emerald-600 transition">Features</a>
              <a href="#pricing" className="text-slate-600 hover:text-emerald-600 transition">Pricing</a>
              {session ? (
                <Link to="/dashboard" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl hover:bg-slate-800 transition-all hover:scale-105 shadow-xl shadow-slate-200">Dashboard</Link>
              ) : (
                <>
                  <Link to="/auth" className="text-slate-600 hover:text-emerald-600">Login</Link>
                  <Link to="/auth" className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200 transition-all hover:scale-105">Get Started</Link>
                </>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-lg border-b border-slate-200 px-6 py-6 space-y-4 shadow-xl">
            <a href="#features" onClick={() => setIsMenuOpen(false)} className="block text-slate-600 font-medium text-lg">Features</a>
            <a href="#pricing" onClick={() => setIsMenuOpen(false)} className="block text-slate-600 font-medium text-lg">Pricing</a>
            <Link to="/auth" className="block text-emerald-600 font-bold text-lg">Get Started</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-emerald-100/50 text-emerald-700 px-4 py-2 rounded-full text-xs font-black tracking-widest mb-8 shadow-sm backdrop-blur-sm border border-emerald-200/50 uppercase">
            <Sparkles size={14} />
            <span>Intelligent Growth</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tight leading-[0.9] mb-8">
            Fresh approach to <br />
            <span className="gradient-text">DM Automation.</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            ReplyAstra brings intelligent automation to Instagram DMs — helping creators reply faster and grow smarter.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to="/auth" className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-12 py-5 rounded-[1.5rem] font-black text-lg hover:shadow-2xl hover:shadow-emerald-200 transition-all hover:scale-105 flex items-center justify-center group">
              Start Free Now <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#features" className="w-full sm:w-auto bg-white/70 backdrop-blur-md border-2 border-slate-200 text-slate-700 px-12 py-5 rounded-[1.5rem] font-black text-lg hover:bg-white hover:border-emerald-200 transition-all flex items-center justify-center">
              Get Started
            </a>
          </div>

          {/* Feature Pills */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: <Zap className="text-emerald-600" />, label: "Natural Flow" },
              { icon: <Sparkles className="text-teal-600" />, label: "Smart Logic" },
              { icon: <Lock className="text-cyan-600" />, label: "Privacy First" },
              { icon: <BarChart4 className="text-emerald-700" />, label: "Deep Insights" }
            ].map((pill, i) => (
              <div key={i} className="bg-white/40 backdrop-blur-sm rounded-[2.5rem] p-8 hover:shadow-2xl transition-all hover:scale-105 border border-white flex flex-col items-center">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                  {pill.icon}
                </div>
                <p className="text-sm font-black text-slate-800 uppercase tracking-widest">{pill.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto bg-white/40 backdrop-blur-md rounded-[3.5rem] p-12 border border-white shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { text: "Fast Automation" },
              { text: "Real-time Replies" },
              { text: "Meta-safe Setup" },
              { text: "Creator-friendly" }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-black gradient-text tracking-tight">
                  {item.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">Designed for modern creators</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-semibold">
              Smart automation that helps creators manage conversations without missing important messages.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <MessageSquare />, title: "Natural Flow", desc: "Intelligent replies that capture your tone and help you manage incoming messages efficiently." },
              { icon: <Target />, title: "Smart Logic", desc: "Simple triggers to automate common responses so you can focus on creating content." },
              { icon: <Shield />, title: "Secure Setup", desc: "Trustworthy integration built on official standards to keep your account safe and compliant." },
              { icon: <BarChart4 />, title: "Clear Visibility", desc: "Straightforward analytics that show you exactly how many messages are handled automatically." }
            ].map((feature, i) => (
              <div key={i} className="group bg-white rounded-[3rem] p-10 hover:shadow-2xl transition-all duration-500 border border-slate-50 hover:border-emerald-100 hover:-translate-y-2">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <div className="text-emerald-700">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed font-bold text-sm tracking-tight">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-emerald-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">Choose your growth path</h2>
            <p className="text-slate-500 text-lg font-bold">Transparent pricing for real influence.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Free Plan */}
            <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 flex flex-col shadow-sm hover:shadow-xl transition-all">
              <h3 className="text-xl font-black text-slate-900 mb-2">Free</h3>
              <p className="text-slate-400 mb-8 font-bold text-xs uppercase tracking-widest">Base Layer</p>
              <div className="mb-8">
                <span className="text-6xl font-black text-slate-900">₹0</span>
              </div>
              <ul className="space-y-4 mb-10 flex-grow font-bold text-sm text-slate-500">
                <li className="flex items-center"><Check className="text-emerald-500 mr-2" size={18} /> Limited automated replies (Meta-compliant)</li>
                <li className="flex items-center"><Check className="text-emerald-500 mr-2" size={18} /> 1 Instagram account</li>
                <li className="flex items-center"><Check className="text-emerald-500 mr-2" size={18} /> Basic analytics</li>
                <li className="flex items-center"><Check className="text-emerald-500 mr-2" size={18} /> ReplyAstra branding</li>
              </ul>
              <Link to="/auth" className="w-full py-5 rounded-2xl border-2 border-emerald-600 text-emerald-600 font-black hover:bg-emerald-50 transition text-center uppercase tracking-widest text-xs">Get Started</Link>
            </div>

            {/* Starter Plan */}
            <div className="bg-white p-10 rounded-[3.5rem] border-2 border-emerald-500 shadow-2xl shadow-emerald-200/50 flex flex-col relative transform md:-translate-y-4">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">Most Popular</div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Starter</h3>
              <p className="text-emerald-600 mb-8 font-bold text-xs uppercase tracking-widest">Expansion Mode</p>
              <div className="mb-8">
                <span className="text-6xl font-black text-slate-900">₹199</span>
                <span className="text-slate-400 font-bold text-lg"> /mo</span>
              </div>
              <ul className="space-y-4 mb-10 flex-grow font-bold text-sm text-slate-600">
                <li className="flex items-center"><Check className="text-emerald-500 mr-2" size={18} /> High-volume DM automation (Meta-approved)</li>
                <li className="flex items-center"><Check className="text-emerald-500 mr-2" size={18} /> Unlimited keyword-based auto replies</li>
                <li className="flex items-center"><Check className="text-emerald-500 mr-2" size={18} /> Welcome & away messages</li>
                <li className="flex items-center"><Check className="text-emerald-500 mr-2" size={18} /> Basic analytics</li>
                <li className="flex items-center"><Check className="text-emerald-500 mr-2" size={18} /> Email support</li>
              </ul>
              <Link to="/auth" className="w-full py-5 rounded-2xl bg-emerald-600 text-white font-black hover:bg-emerald-700 transition-all hover:scale-105 shadow-xl shadow-emerald-200 text-center uppercase tracking-widest text-xs">Start Free Now</Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 flex flex-col shadow-sm hover:shadow-xl transition-all">
              <h3 className="text-xl font-black text-slate-900 mb-2">Pro</h3>
              <p className="text-slate-400 mb-8 font-bold text-xs uppercase tracking-widest">Enterprise Core</p>
              <div className="mb-8">
                <span className="text-6xl font-black text-slate-900">₹399</span>
                <span className="text-slate-400 font-bold text-lg"> /mo</span>
              </div>
              <ul className="space-y-4 mb-10 flex-grow font-bold text-sm text-slate-500">
                <li className="flex items-center"><Check className="text-emerald-500 mr-2" size={18} /> High-volume DM automation (Meta-approved)</li>
                <li className="flex items-center"><Check className="text-emerald-500 mr-2" size={18} /> Multiple Instagram accounts</li>
                <li className="flex items-center"><Check className="text-emerald-500 mr-2" size={18} /> Advanced AI replies</li>
                <li className="flex items-center"><Check className="text-emerald-500 mr-2" size={18} /> Priority support</li>
              </ul>
              <Link to="/auth" className="w-full py-5 rounded-2xl border-2 border-emerald-600 text-emerald-600 font-black hover:bg-emerald-50 transition text-center uppercase tracking-widest text-xs">Start Free Now</Link>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-slate-400 text-sm font-bold italic tracking-wide">
              *Automation volume depends on Instagram’s official messaging limits.*
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[4rem] p-16 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-40 -mt-40 blur-[100px]"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/20 rounded-full -ml-40 -mb-40 blur-[100px]"></div>
            
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 relative z-10 tracking-tight">Ready to grow?</h2>
            <p className="text-xl text-emerald-50 mb-12 relative z-10 font-bold max-w-lg mx-auto leading-relaxed">
              Join the future of social interaction. No complexity. Just results.
            </p>
            
            <form onSubmit={handleSubmitInquiry} className="max-w-md mx-auto space-y-4 relative z-10">
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Your Email"
                  required
                  value={inquiryData.email}
                  onChange={(e) => setInquiryData({...inquiryData, email: e.target.value})}
                  className="w-full px-8 py-5 rounded-3xl bg-white/20 border border-white/30 text-white placeholder-emerald-100 outline-none focus:bg-white/30 transition shadow-inner font-bold"
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-white text-emerald-700 py-5 rounded-3xl font-black text-lg hover:shadow-2xl hover:scale-[1.02] transition-all uppercase tracking-widest"
              >
                {loading ? 'Processing...' : 'Start Free Now'}
              </button>
              {status.message && (
                <p className={`mt-4 text-xs font-black uppercase tracking-widest ${status.type === 'success' ? 'text-emerald-200' : 'text-red-200'}`}>
                  {status.message}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-emerald-50 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tight">Reply<span className="text-emerald-600">Astra</span></span>
            </div>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Designed for the next generation.</p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <a href="#" className="hover:text-emerald-600 transition">Product</a>
            <a href="#" className="hover:text-emerald-600 transition">Privacy</a>
            <a href="#" className="hover:text-emerald-600 transition">Security</a>
            <a href="#" className="hover:text-emerald-600 transition">API</a>
          </div>
          
          <div className="flex flex-col items-center md:items-end space-y-2">
            <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest">© 2026 ReplyAstra Platform</p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition cursor-pointer"><Instagram size={14} /></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
