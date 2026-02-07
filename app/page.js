import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f2f2f7] dark:bg-[#000] text-black dark:text-white selection:bg-green-500/30 overflow-hidden">
      {/* iOS Style Background Blobs */}
      <div className="fixed -top-[10%] -left-[10%] w-[50%] h-[50%] bg-green-400/20 blur-[120px] rounded-full animate-pulse"></div>
      <div className="fixed top-[40%] -right-[10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[100px] rounded-full"></div>

      {/* iOS 26 Blur Header */}
      <nav className="sticky top-4 z-50 max-w-4xl mx-auto px-6 py-3 mx-4 md:mx-auto bg-white/60 dark:bg-black/60 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-[2.5rem] flex items-center justify-between shadow-2xl shadow-black/5">
        <div className="text-xl font-bold tracking-tight px-2">
          Reply<span className="text-emerald-600">Astra</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-semibold opacity-70 hover:opacity-100 transition">Login</Link>
          <Link href="/signup" className="bg-emerald-600 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-emerald-500/30 hover:scale-105 transition-all">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto pt-24 pb-20 px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-xs font-bold uppercase tracking-widest rounded-full bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50">
          🌱 Intelligent Instagram Growth
        </div>
        
        <h1 className="text-6xl md:text-[5.5rem] font-black tracking-tight leading-[1.1] mb-8">
          Fresh approach to <br />
          <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-teal-400 bg-clip-text text-transparent">
            DM Automation.
          </span>
        </h1>

        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
          ReplyAstra brings the elegance of iOS 26 to your social media workflow. Simple, powerful, and natural.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link href="/signup" className="w-full sm:w-auto px-10 py-5 bg-black dark:bg-white text-white dark:text-black font-bold rounded-[2rem] text-lg shadow-2xl hover:scale-[1.02] transition">
            Start Free Now
          </Link>
          <button className="w-full sm:w-auto px-10 py-5 bg-white/40 dark:bg-white/10 backdrop-blur-md border border-white/20 dark:border-white/10 font-bold rounded-[2rem] text-lg hover:bg-white/60 dark:hover:bg-white/20 transition">
            Explore Features
          </button>
        </div>

        {/* Feature Grid - iOS App Icon Style */}
        <div className="mt-28 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: '🍀', label: 'Natural Flow' },
            { icon: '🧩', label: 'Smart Logic' },
            { icon: '🛡️', label: 'Privacy First' },
            { icon: '📊', label: 'Deep Insights' }
          ].map((item, idx) => (
            <div key={idx} className="p-6 bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-[2.5rem] flex flex-col items-center gap-3 hover:translate-y-[-5px] transition-all">
              <div className="text-4xl mb-2">{item.icon}</div>
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
