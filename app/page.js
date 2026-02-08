export default function Page() {
  return (
    <main className="bg-emerald-50 text-slate-900">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center">R</span>
            ReplyAstra
          </div>

          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="/login">Login</a>
          </nav>

          <a
            href="/signup"
            className="bg-emerald-600 text-white px-5 py-2 rounded-full font-semibold"
          >
            Get Started
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="pt-24 pb-20 text-center px-6">
        <span className="inline-block bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-xs font-semibold mb-6">
          INTELLIGENT GROWTH
        </span>

        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
          Fresh approach to <br />
          <span className="text-emerald-600">DM Automation.</span>
        </h1>

        <p className="max-w-2xl mx-auto text-slate-600 text-lg mb-10">
          ReplyAstra brings intelligent automation to Instagram DMs — helping
          creators reply faster and grow smarter.
        </p>

        <div className="flex justify-center gap-4">
          <a
            href="/signup"
            className="bg-emerald-600 text-white px-7 py-3 rounded-full font-semibold"
          >
            Start Free Now →
          </a>
          <a
            href="#pricing"
            className="bg-white px-7 py-3 rounded-full border font-semibold"
          >
            Get Started
          </a>
        </div>

        {/* ICON STRIP */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            "Natural Flow",
            "Smart Logic",
            "Privacy First",
            "Deep Insights",
          ].map((t) => (
            <div key={t} className="bg-white rounded-xl py-4 font-semibold shadow-sm">
              {t}
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 px-6">
        <h2 className="text-center text-4xl font-bold mb-4">
          Designed for modern creators
        </h2>
        <p className="text-center text-slate-600 mb-14">
          Smart automation that helps creators manage conversations without missing important messages.
        </p>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {[
            ["Natural Flow", "Intelligent replies that feel human."],
            ["Smart Logic", "Rule-based automation for common replies."],
            ["Secure Setup", "Built on official Meta standards."],
            ["Clear Visibility", "Track handled messages in real time."],
          ].map(([title, desc]) => (
            <div key={title} className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="font-bold text-lg mb-2">{title}</h3>
              <p className="text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-6 bg-emerald-100/60">
        <h2 className="text-center text-4xl font-bold mb-3">
          Choose your growth path
        </h2>
        <p className="text-center text-slate-600 mb-16">
          Transparent pricing for real influence.
        </p>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

          {/* FREE */}
          <div className="bg-white rounded-3xl p-8 text-center">
            <h3 className="font-bold text-lg mb-2">Free</h3>
            <p className="text-4xl font-extrabold mb-6">₹0</p>
            <ul className="space-y-2 text-sm text-slate-600 mb-6">
              <li>✓ Limited automated replies</li>
              <li>✓ 1 Instagram account</li>
              <li>✓ Basic analytics</li>
              <li>✓ ReplyAstra branding</li>
            </ul>
            <a className="block border rounded-full py-2 font-semibold">Get Started</a>
          </div>

          {/* STARTER */}
          <div className="bg-white rounded-3xl p-8 text-center border-2 border-emerald-600 relative">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs px-4 py-1 rounded-full">
              MOST POPULAR
            </span>
            <h3 className="font-bold text-lg mb-2">Starter</h3>
            <p className="text-4xl font-extrabold mb-6">
              ₹199 <span className="text-sm font-medium text-slate-500">/mo</span>
            </p>
            <ul className="space-y-2 text-sm text-slate-600 mb-6">
              <li>✓ High-volume DM automation</li>
              <li>✓ Unlimited keyword replies</li>
              <li>✓ Welcome & away messages</li>
              <li>✓ Basic analytics</li>
              <li>✓ Email support</li>
            </ul>
            <a className="block bg-emerald-600 text-white rounded-full py-2 font-semibold">
              Start Free Now
            </a>
          </div>

          {/* PRO */}
          <div className="bg-white rounded-3xl p-8 text-center">
            <h3 className="font-bold text-lg mb-2">Pro</h3>
            <p className="text-4xl font-extrabold mb-6">
              ₹399 <span className="text-sm font-medium text-slate-500">/mo</span>
            </p>
            <ul className="space-y-2 text-sm text-slate-600 mb-6">
              <li>✓ Multiple Instagram accounts</li>
              <li>✓ Advanced AI replies</li>
              <li>✓ Priority support</li>
            </ul>
            <a className="block border rounded-full py-2 font-semibold">Start Free Now</a>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto bg-emerald-600 rounded-3xl text-white text-center p-12">
          <h2 className="text-4xl font-extrabold mb-4">Ready to grow?</h2>
          <p className="mb-8 text-emerald-100">
            Join the future of social interaction. No complexity. Just results.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              placeholder="Your Email"
              className="px-5 py-3 rounded-full text-black w-full sm:w-80"
            />
            <button className="bg-white text-emerald-700 font-semibold px-8 py-3 rounded-full">
              Start Free Now
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center text-sm text-slate-500">
        © 2026 ReplyAstra Platform
      </footer>

    </main>
  );
}
