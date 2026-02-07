export default function HomePage() {
  return (
    <main className="bg-gradient-to-br from-emerald-50 via-white to-green-50 text-slate-900">

      {/* NAVBAR */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-green-600">ReplyAstra</h1>
        <nav className="flex items-center gap-6">
          <a href="#features" className="text-sm text-slate-600 hover:text-slate-900">Features</a>
          <a href="#pricing" className="text-sm text-slate-600 hover:text-slate-900">Pricing</a>
          <a href="/login" className="text-sm text-slate-600 hover:text-slate-900">Login</a>
          <a
            href="/signup"
            className="rounded-full bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            Get Started
          </a>
        </nav>
      </header>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">
        <span className="inline-block rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-700">
          Intelligent Instagram Growth
        </span>

        <h2 className="mt-6 text-5xl font-bold leading-tight">
          Fresh approach to <br />
          <span className="text-green-600">DM Automation.</span>
        </h2>

        <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600">
          Automate replies, capture leads, and manage conversations
          with a fast, reliable and scalable system.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <a
            href="/signup"
            className="rounded-full bg-black px-8 py-4 text-white font-medium hover:bg-slate-900"
          >
            Start Free Now
          </a>
          <a
            href="#features"
            className="rounded-full border border-slate-300 px-8 py-4 font-medium text-slate-700 hover:bg-white"
          >
            Explore Features
          </a>
        </div>
      </section>

      {/* MINI FEATURES */}
      <section className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-28">
        {[
          ["Natural Flow", "Smooth automated conversations"],
          ["Smart Logic", "Rule based intelligent replies"],
          ["Privacy First", "Secure and compliant system"],
          ["Deep Insights", "Track performance in real time"],
        ].map(([title, desc]) => (
          <div
            key={title}
            className="rounded-2xl bg-white/80 backdrop-blur border border-slate-200 p-6 shadow-sm"
          >
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-slate-600">{desc}</p>
          </div>
        ))}
      </section>

      {/* FEATURES GRID */}
      <section id="features" className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center">
            Everything you need to scale
          </h3>
          <p className="mt-3 text-center text-slate-600">
            Powerful automation tools built for growth
          </p>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              ["AI DM Responses", "Automatic replies based on intent"],
              ["Lead Generation", "Capture and export leads instantly"],
              ["Comment to DM", "Auto DM users from comments"],
              ["Safe & Approved", "Uses official Instagram APIs"],
              ["Analytics Dashboard", "Monitor conversations & growth"],
              ["Multi Account Support", "Manage multiple brands easily"],
            ].map(([title, desc]) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-200 p-8 hover:shadow-md transition"
              >
                <h4 className="font-semibold">{title}</h4>
                <p className="mt-2 text-sm text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center">Simple Pricing</h3>
          <p className="mt-3 text-center text-slate-600">
            Choose a plan that fits your business
          </p>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* FREE */}
            <div className="rounded-2xl bg-white p-8 border">
              <h4 className="font-semibold">Free</h4>
              <p className="mt-2 text-3xl font-bold">₹0</p>
              <ul className="mt-6 space-y-2 text-sm text-slate-600">
                <li>Limited automation</li>
                <li>Basic features</li>
                <li>1 Instagram account</li>
              </ul>
              <a href="/signup" className="block mt-6 text-center rounded-full border px-4 py-2">
                Get Started
              </a>
            </div>

            {/* PRO */}
            <div className="rounded-2xl bg-white p-8 border-2 border-green-600 shadow-lg">
              <h4 className="font-semibold">Pro</h4>
              <p className="mt-2 text-3xl font-bold">₹299 / month</p>
              <ul className="mt-6 space-y-2 text-sm text-slate-600">
                <li>Advanced automation</li>
                <li>AI replies</li>
                <li>Analytics dashboard</li>
                <li>Priority support</li>
              </ul>
              <a
                href="/signup"
                className="block mt-6 text-center rounded-full bg-green-600 text-white px-4 py-2 hover:bg-green-700"
              >
                Start Free Trial
              </a>
            </div>

            {/* BUSINESS */}
            <div className="rounded-2xl bg-white p-8 border">
              <h4 className="font-semibold">Business</h4>
              <p className="mt-2 text-3xl font-bold">₹599 / month</p>
              <ul className="mt-6 space-y-2 text-sm text-slate-600">
                <li>Unlimited automation</li>
                <li>Multiple accounts</li>
                <li>Team access</li>
                <li>Premium support</li>
              </ul>
              <a href="#contact" className="block mt-6 text-center rounded-full border px-4 py-2">
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h5 className="text-white font-semibold">ReplyAstra</h5>
            <p className="mt-3 text-sm">
              AI powered DM automation platform.
            </p>
          </div>

          <div>
            <h6 className="text-white font-semibold">Product</h6>
            <ul className="mt-3 space-y-2 text-sm">
              <li>Features</li>
              <li>Pricing</li>
              <li>API</li>
            </ul>
          </div>

          <div>
            <h6 className="text-white font-semibold">Company</h6>
            <ul className="mt-3 space-y-2 text-sm">
              <li>About</li>
              <li>Blog</li>
              <li>Legal</li>
            </ul>
          </div>

          <div>
            <h6 className="text-white font-semibold">Support</h6>
            <ul className="mt-3 space-y-2 text-sm">
              <li>Help Center</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>

        <p className="mt-10 text-center text-xs">
          © 2026 ReplyAstra. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
