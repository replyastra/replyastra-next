import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 overflow-hidden relative">
      
      {/* VIBRANT BACKGROUND BLOBS - This makes the colors "Pop" on PC */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-600/30 blur-[140px] rounded-full opacity-60"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-green-500/20 blur-[120px] rounded-full opacity-40"></div>
      <div className="absolute top-[20%] right-[15%] w-[300px] h-[300px] bg-teal-400/20 blur-[100px] rounded-full opacity-30"></div>

      {/* iOS 26 STYLE FROSTED NAVBAR */}
      <nav className="sticky top-6 z-50 max-w-5xl mx-auto px-8 py-4 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.3)] mx-4">
        <div className="text-2xl font-black tracking-tighter italic">
          REPLY<span className="text-emerald-500">ASTRA</span>
        </div>
        <div className="flex items-center gap-8 font-medium">
          <Link href="/login" className="text-sm opacity-60 hover:opacity-100 transition">Login</Link>
          <Link href="/signup" className="bg-gradient-to-br from-emerald-500 to-green-600 text-white px-7 py-3 rounded-full text-sm font-bold shadow-xl shadow-emerald-600/20 hover:scale-105 transition-all active:scale-95">
            Get Started
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="max-w-6xl mx-auto pt-32 pb-24 px-10 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-5 py-2 mb-10 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 backdrop-blur-md">
          🌱 Powered by AI • iOS 26 Aesthetic
        </div>
        
        <h1 className="text-7xl md:text-[6.5rem] font-extrabold tracking-tighter leading-[1] mb-10">
          Automate DMs. <br />
          <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-300 bg-clip-text text-transparent drop-shadow-sm">
            Nature's Speed.
          </span>
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-14 font-medium leading-relaxed">
          Experience the most fluid Instagram automation ever built. Clean, fast, and inspired by the freshness of nature.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link href="/signup" className="w-full sm:w-auto px-12 py-5 bg-white text-black font-black rounded-2xl text-lg shadow-2xl hover:bg-emerald-50 transition-colors">
            Start Free Trial
          </Link>
          <button className="w-full sm:w-auto px-12 py-5 bg-zinc-900/50 backdrop-blur-xl border border-white/10 text-white font-bold rounded-2xl text-lg hover:bg-zinc-800 transition">
            Features
          </button>
        </div>

        {/* GLASS CARD PREVIEW */}
        
        <div className="mt-24 relative p-2 rounded-[3rem] border border-white/5 bg-white/5 backdrop-blur-sm shadow-2xl">
           <div className="bg-[#0a0a0a] rounded-[2.5rem] p-12 border border-white/5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                 <div className="text-left">
                    <div className="text-3xl mb-4">🌿</div>
                    <h3 className="font-bold text-xl mb-2">Organic Growth</h3>
                    <p className="text-gray-500 text-sm">Automate replies that feel human and natural to your followers.</p>
                 </div>
                 <div className="text-left">
                    <div className="text-3xl mb-4">🔋</div>
                    <h3 className="font-bold text-xl mb-2">Energy Efficient</h3>
                    <p className="text-gray-500 text-sm">Built on Next.js 14 for lightning-fast performance across devices.</p>
                 </div>
                 <div className="text-left">
                    <div className="text-3xl mb-4">🛠️</div>
                    <h3 className="font-bold text-xl mb-2">iOS Control</h3>
                    <p className="text-gray-500 text-sm">Manage everything with an intuitive dashboard inspired by Apple.</p>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
