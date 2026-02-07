export default function Home() {
  return (
    <main className="bg-[#f6fbf9] text-gray-900">
      
      {/* NAVBAR */}
      <header className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-emerald-600">ReplyAstra</h1>
        <nav className="hidden md:flex gap-8 text-sm font-medium">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="/login">Login</a>
        </nav>
        <a
          href="/signup"
          className="bg-emerald-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-emerald-700"
        >
          Get Started
        </a>
      </header>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <span className="inline-block bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-xs font-semibold mb-6">
          Intelligent Instagram Growth
        </span>

        <h2 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
          Fresh approach to <br />
          <span className="text-emerald-600">DM Automation.</span>
        </h2>

        <p className="max-w-2xl mx-auto text-gray-600 text-lg mb-10">
          Automate replies, capture leads, and manage conversations with a fast,
          reliable and scalable system.
        </p>

        <div className="flex justify-center gap-4">
          <a
            href="/signup"
            className="bg-black text-white px-6 py-3 rounded-full font-semibold"
          >
            Start Free Now
          </a>
          <a
            href="#features"
            className="bg-white border px-6 py-3 rounded-full font-semibold"
          >
            Explore Features
          </a>
        </div>
      </section>

      {/* FEATURE ICON ROW */}
      <section className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 pb-24">
        {[
          ["Natural Flow", "Smooth automated conversations"],
          ["Smart Logic", "Rule based intelligent replies"],
          ["Privacy First", "Secure and compliant system"],
          ["Deep Insights", "Track performance in real time"],
        ].map(([title, desc]) => (
          <div
            key={title}
            className="bg-white rounded-2xl p-6 shadow-sm text-center"
          >
            <h4 className="font-bold mb-2">{title}</h4>
            <p className="text-sm text-gray-600">{desc}</p>
          </div>
        ))}
      </section>

      {/* FEATURES GRID */}
      <section id="features" className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-12">
            Everything you need to scale
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              ["AI DM Responses", "Automatic replies based on intent"],
              ["Lead Generation", "Capture and export leads instantly"],
              ["Comment to DM", "Auto DM users from comments"],
              ["Safe & Approved", "Uses official Instagram APIs"],
              ["Analytics Dashboard", "Monitor conversations & growth"],
              ["Multi Account Support", "Manage multiple brands easily"],
            ].map(([title, desc]) => (
              <div key={title} className="border rounded-2xl p-6">
                <h4 className="font-semibold mb-2">{title}</h4>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 bg-[#f6fbf9]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-12">Simple Pricing</h3>

          <div className="grid md:grid-cols-3 gap-8">
            {/* FREE */}
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <h4 className="font-bold mb-2">Free</h4>
              <p className="text-3xl font-extrabold mb-6">₹0</p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>Limited automation</li>
                <li>Basic features</li>
                <li>1 Instagram account</li>
              </ul>
              <a href="/signup" className="font-semibold underline">
                Get Started
              </a>
            </div>

            {/* PRO */}
            <div className="bg-black text-white p-8 rounded-2xl shadow-lg scale-105">
              <h4 className="font-bold mb-2">Pro</h4>
              <p className="text-3xl font-extrabold mb-6">₹299 / month</p>
              <ul className="text-sm space-y-2 mb-6">
                <li>Advanced automation</li>
                <li>AI replies</li>
                <li>Analytics dashboard</li>
                <li>Priority support</li>
              </ul>
              <a
                href="/signup"
                className="inline-block bg-white text-black px-6 py-3 rounded-full font-semibold"
              >
                Start Free Trial
              </a>
            </div>

            {/* BUSINESS */}
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <h4 className="font-bold mb-2">Business</h4>
              <p className="text-3xl font-extrabold mb-6">₹599 / month</p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>Unlimited automation</li>
                <li>Multiple accounts</li>
                <li>Team access</li>
                <li>Premium support</li>
              </ul>
              <a href="/contact" className="font-semibold underline">
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-sm">
          <div>
            <h4 className="text-white font-bold mb-3">ReplyAstra</h4>
            <p>AI powered DM automation platform.</p>
          </div>
          <div>
            <h5 className="text-white font-semibold mb-3">Product</h5>
            <p>Features</p>
            <p>Pricing</p>
            <p>API</p>
          </div>
          <div>
            <h5 className="text-white font-semibold mb-3">Company</h5>
            <p>About</p>
            <p>Blog</p>
            <p>Legal</p>
          </div>
          <div>
            <h5 className="text-white font-semibold mb-3">Support</h5>
            <p>Help Center</p>
            <p>Contact</p>
          </div>
        </div>
        <p className="text-center text-xs mt-10">
          © 2026 ReplyAstra. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
