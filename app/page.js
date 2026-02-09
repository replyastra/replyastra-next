import { ArrowRight, Zap, Shield, BarChart3, MessageSquare } from "lucide-react";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#f8fafc] overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center">
              R
            </div>
            <span className="text-xl font-extrabold">
              <span className="text-gray-900">Reply</span>
              <span className="text-emerald-600">Astra</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 font-semibold text-gray-600">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="/login">Login</a>
            <a
              href="/signup"
              className="bg-emerald-600 text-white px-5 py-2 rounded-full font-bold"
            >
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-40 pb-24 text-center px-6">
        <div className="max-w-4xl mx-auto">
          <span className="pill">INTELLIGENT GROWTH</span>

          <h1 className="mt-6 text-5xl md:text-6xl font-black text-gray-900 leading-tight">
            Fresh approach to <br />
            <span className="text-emerald-600">DM Automation.</span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            ReplyAstra brings intelligent automation to Instagram DMs —
            helping creators reply faster and grow smarter.
          </p>

          <div className="buttons mt-10">
            <a href="/signup" className="btn-dark flex items-center gap-2">
              Start Free Now <ArrowRight size={18} />
            </a>
            <a href="#features" className="btn-light">
              Explore Features
            </a>
          </div>
        </div>
      </section>

      {/* FEATURE PILLS */}
      <section className="pb-24 px-6">
        <div className="features">
          <div className="feature flex flex-col items-center gap-2">
            <Zap className="text-emerald-600" />
            Natural Flow
          </div>
          <div className="feature flex flex-col items-center gap-2">
            <MessageSquare className="text-emerald-600" />
            Smart Logic
          </div>
          <div className="feature flex flex-col items-center gap-2">
            <Shield className="text-emerald-600" />
            Privacy First
          </div>
          <div className="feature flex flex-col items-center gap-2">
            <BarChart3 className="text-emerald-600" />
            Deep Insights
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section id="features" className="features-section">
        <h2>Designed for modern creators</h2>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Natural Flow</h3>
            <p>Replies that match your tone and keep conversations human.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚙️</div>
            <h3>Smart Logic</h3>
            <p>Keyword & intent based automation that just works.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure Setup</h3>
            <p>Meta-approved, safe and compliant integrations.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Clear Visibility</h3>
            <p>Know exactly how many DMs are handled automatically.</p>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="pricing-section">
        <h2>Choose your growth path</h2>
        <p className="subtitle">Transparent pricing for real influence.</p>

        <div className="pricing-grid">
          <div className="pricing-card">
            <h3>Free</h3>
            <div className="price">₹0</div>
            <ul>
              <li>Limited automation</li>
              <li>1 Instagram account</li>
              <li>Basic analytics</li>
            </ul>
            <button className="pricing-btn outline">Get Started</button>
          </div>

          <div className="pricing-card popular">
            <span className="popular-badge">Most Popular</span>
            <h3>Starter</h3>
            <div className="price">₹199</div>
            <ul>
              <li>Unlimited keyword replies</li>
              <li>Welcome & away messages</li>
              <li>Email support</li>
            </ul>
            <button className="pricing-btn">Start Free Now</button>
          </div>

          <div className="pricing-card">
            <h3>Pro</h3>
            <div className="price">₹399</div>
            <ul>
              <li>Multiple Instagram accounts</li>
              <li>Advanced AI replies</li>
              <li>Priority support</li>
            </ul>
            <button className="pricing-btn outline">Start Free Now</button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="flex justify-center px-6 mt-24">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white rounded-[40px] p-16 max-w-3xl w-full text-center shadow-2xl">
          <h2 className="text-4xl font-black mb-4">Ready to grow?</h2>
          <p className="mb-8">
            Join the future of social interaction. No complexity. Just results.
          </p>
          <input
            placeholder="Your Email"
            className="w-full max-w-md mx-auto mb-4 px-6 py-4 rounded-full text-gray-900"
          />
          <button className="w-full max-w-md bg-white text-emerald-700 font-bold py-4 rounded-full">
            START FREE NOW
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-bottom">
          © 2026 ReplyAstra. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
