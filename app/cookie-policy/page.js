export default function CookiePolicy() {
  return (
    <main className="bg-[#f0fdfa] min-h-screen px-6 py-32">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block mb-4 bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-xs font-bold">
            LEGAL
          </span>
          <h1 className="text-5xl font-black text-gray-900">Cookie Policy</h1>
          <p className="mt-4 text-gray-500 text-sm">Last updated: February 15, 2026</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-10 md:p-16 space-y-10 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files stored on your device when you visit a website. They help
              us keep you logged in, remember your preferences, and understand how you use ReplyAstra
              so we can improve your experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">2. Cookies We Use</h2>
            <p className="mb-5">We use a small number of cookies to operate our platform:</p>

            <div className="space-y-4">
              {[
                {
                  name: "Necessary",
                  badge: "Always Active",
                  badgeColor: "bg-emerald-100 text-emerald-700",
                  desc: "Essential for the platform to work — keeps you logged in and protects your account.",
                },
                {
                  name: "Analytics",
                  badge: "Optional",
                  badgeColor: "bg-gray-100 text-gray-600",
                  desc: "Helps us understand which features are used most, so we can improve the product. We use Google Analytics for this.",
                },
                {
                  name: "Functional",
                  badge: "Optional",
                  badgeColor: "bg-gray-100 text-gray-600",
                  desc: "Remembers your preferences like language or UI settings so you don't have to set them every time.",
                },
              ].map((c) => (
                <div key={c.name} className="border border-gray-100 rounded-2xl p-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-gray-900 mb-1">{c.name} Cookies</p>
                    <p className="text-sm text-gray-500">{c.desc}</p>
                  </div>
                  <span className={`shrink-0 text-xs font-bold px-3 py-1 rounded-full ${c.badgeColor}`}>
                    {c.badge}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">3. Third-Party Cookies</h2>
            <p>
              Some cookies are set by services we use — like Google Analytics for usage stats and
              Razorpay for payment processing. These are governed by their own privacy policies.
              We do not control these cookies directly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">4. How to Control Cookies</h2>
            <p>
              You can disable or delete cookies at any time through your browser settings. Note that
              turning off necessary cookies may prevent you from logging in or using core features
              of ReplyAstra.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">5. Updates to This Policy</h2>
            <p>
              We may update this policy as we add new features. We will update the date at the top
              when changes are made.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">6. Contact Us</h2>
            <p>
              Questions about cookies? Email us at{" "}
              <a href="mailto:support@replyastra.online" className="text-emerald-600 underline">
                support@replyastra.online
              </a>.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
