import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#020402] text-white selection:bg-green-500/30 overflow-hidden relative font-sans">
      
      {/* 1. MESH GRADIENT BACKGROUND - Idu Windows PC nalli colors "Pop" madutte */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        {/* Top Right Green Glow */}
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#00ff88]/20 blur-[150px] rounded-full"></div>
        {/* Center Emerald Glow */}
        <div className="absolute top-[20%] left-[10%] w-[600px] h-[600px] bg-[#10b981]/15 blur-[120px] rounded-full"></div>
        {/* Bottom Left Teal Glow */}
        <div className="absolute bottom-[-10%] left-[-5%] w-[700px] h-[700px] bg-[#0ea5e9]/10 blur-[130px] rounded-full"></div>
      </div>

      {/* 2. iOS 26 GLASS NAVBAR - High saturation for Windows */}
      <nav className="sticky top-6 z-50 max-w-5xl mx-auto px-8 py-4 bg-white/[0.03] backdrop-blur-[40px] border border-white/10 rounded-[3rem] flex items-center justify-between shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] mx-4">
        <div className="text-2xl font-black tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg"></div>
          REPLY<span className="text-emerald-400">ASTRA</span>
        </div>
        <div className="flex items-center gap-8 font-semibold">
          <Link href="/login" className="text-sm text-gray-400 hover:text-white transition">Login</Link>
          <Link href="/signup" className="bg-[#00ff88] text-black px-8 py-3 rounded-full text-sm font-bold shadow-[0_0_30px_rgba(0,255,136,0.3)] hover:scale-105 transition-all">
            Get Started
          </Link>
        </div>
      </nav>

      {/* 3. HERO SECTION */}
      <main className="max-w-6xl mx-auto pt-36 pb-32 px-10 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-5 py-2 mb-12 text-[11px] font-bold uppercase tracking-[0.25em] rounded-full bg-green-500/10 text-[#00ff88] border border-[#00ff88]/30 backdrop-blur-md">
          🍃 The iOS 26 Experience for Windows
        </div>
        
        <h1 className="text-7xl md:text-[7.5rem] font-black tracking-tighter leading-[0.9] mb-12">
          Automate DMs <br />
          <span className="bg-gradient-to-r from-[#00ff88] via-[#10b981] to-[#34d399] bg-clip-text text-transparent filter drop-shadow-[0_0_20px_rgba(0,255,136,0.2)]">
            Naturally Fast.
          </span>
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-16 font-medium leading-relaxed">
          The first Instagram automation tool that feels as fresh as nature. Built with the fluid design language of the future.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <Link href="/signup" className="w-full sm:w-auto px-14 py-6 bg-white text-black font-black rounded-3xl text-xl shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:bg-[#f0fff0] transition-all transform hover:-translate-y-1">
            Start Free Trial
          </Link>
          <button className="w-full sm:w-auto px-14 py-6 bg-white/[0.05] backdrop-blur-2xl border border-white/10 text-white font-bold rounded-3xl text-xl hover:bg-white/[0.08] transition-all">
            Features
          </button>
        </div>

        {/* 4. VIBRANT PREVIEW CARD */}
        <div className="mt-32 relative p-4 rounded-[4rem] bg-gradient-to-b from-white/10 to-transparent border border-white/10 shadow-2xl overflow-hidden">
          <div className="bg-[#050705] rounded-[3.5rem] p-16 border border-white/5">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="text-left group">
                   <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition">🍀</div>
                   <h3 className="font-bold text-2xl mb-3 text-[#00ff88]">Organic Logic</h3>
                   <p className="text-gray-500 leading-relaxed">Replies that mimic human patterns and natural timing.</p>
                </div>
                <div className="text-left group">
                   <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition">🔋</div>
                   <h3 className="font-bold text-2xl mb-3 text-[#00ff88]">Clean Engine</h3>
                   <p className="text-gray-400 leading-relaxed italic">"Optimized for 2026 browsers and fast Windows hardware."</p>
                </div>
                <div className="text-left group">
                   <div className="w-14 h-14 bg-teal-500/10 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition">🧩</div>
                   <h3 className="font-bold text-2xl mb-3 text-[#00ff88]">Smart Triggers</h3>
                   <p className="text-gray-500 leading-relaxed">Easily setup keywords based on your niche and goals.</p>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
