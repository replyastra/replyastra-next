import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/10 blur-[120px] -z-10"></div>

      {/* Navigation */}
      <nav className="flex items-center justify-between px-10 py-8 max-w-7xl mx-auto">
        <div className="text-2xl font-black tracking-widest text-white">
          REPLY<span className="text-blue-500">ASTRA</span>
        </div>
        <div className="hidden md:flex gap-10 text-sm font-medium text-gray-400">
          <Link href="#features" className="hover:text-white transition">Features</Link>
          <Link href="#pricing" className="hover:text-white transition">Pricing</Link>
          <Link href="/login" className="hover:text-white transition">Login</Link>
        </div>
        <Link href="/signup" className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-lg shadow-white/5">
          Get Started
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center pt-28 px-6">
        <div className="border border-blue-500/30 bg-blue-500/5 px-4 py-1 rounded-full text-xs font-bold text-blue-400 mb-8 tracking-widest uppercase">
          Next Gen Automation
        </div>
        
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-tight mb-8">
          Automate DMs. <br />
          <span className="bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent">
            Grow Faster.
          </span>
        </h1>

        <p className="max-w-2xl text-gray-400 text-lg md:text-xl mb-12 leading-relaxed">
          Scale your Instagram engagement without lifting a finger. ReplyAstra handles your DMs while you focus on creating.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 mb-24">
          <Link href="/signup" className="px-10 py-4 bg-blue-600 rounded-2xl font-bold text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-600/20">
            Start Free Trial
          </Link>
          <button className="px-10 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl font-bold text-lg hover:bg-zinc-800 transition">
            See Features
          </button>
        </div>

        {/* Floating Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto pb-20">
          <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl backdrop-blur-md text-left">
            <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-500 mb-6">⚡</div>
            <h3 className="text-xl font-bold mb-3">Instant Reply</h3>
            <p className="text-gray-400 text-sm">Never miss a lead. Respond to every DM in milliseconds.</p>
          </div>
          <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl backdrop-blur-md text-left">
            <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center text-indigo-500 mb-6">🎯</div>
            <h3 className="text-xl font-bold mb-3">Smart Keywords</h3>
            <p className="text-gray-400 text-sm">Set custom triggers for specific words or phrases.</p>
          </div>
          <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl backdrop-blur-md text-left">
            <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center text-purple-500 mb-6">📈</div>
            <h3 className="text-xl font-bold mb-3">Growth Analytics</h3>
            <p className="text-gray-400 text-sm">Track how many followers you convert into customers.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
