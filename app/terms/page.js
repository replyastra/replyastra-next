export default function TermsOfService() {
  const sections = [
    {
      title: "Who This Is For",
      content: (
        <>
          <p>
            ReplyAstra is built for Instagram creators, businesses, and brands who want to
            grow smarter — not harder. By using our platform, you agree to these Terms. If
            something here doesn't work for you, please don't use ReplyAstra.
          </p>
          <p className="mt-3">
            You must be <strong>18 or older</strong> to use our platform. If you are signing
            up on behalf of a business, you confirm you have the authority to do so.
          </p>
        </>
      ),
    },
    {
      title: "What ReplyAstra Does",
      content: (
        <>
          <p>
            ReplyAstra automates your Instagram DMs using <strong>Meta's official API</strong> —
            the same infrastructure Instagram provides for approved business tools. We are not
            a bot. We don't scrape. We don't use workarounds.
          </p>
          <p className="mt-3">Our platform enables:</p>
          <ul className="mt-3 space-y-2">
            {[
              "Keyword-triggered DM replies",
              "Comment-to-DM automation",
              "Ask to Follow flows",
              "Multi-account management",
              "Real-time analytics",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-600">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-5 bg-gray-50 border-l-4 border-emerald-500 rounded-r-xl p-4">
            <p className="text-sm text-gray-600">
              ReplyAstra is an independent platform. We are not affiliated with, endorsed by,
              or sponsored by Meta Platforms, Inc. or Instagram.
            </p>
          </div>
        </>
      ),
    },
    {
      title: "Your Account",
      content: (
        <>
          <p>
            We will <strong>never</strong> ask for your Instagram password. You connect your
            Instagram through Meta's own secure login window. Your credentials stay between
            you and Meta.
          </p>
          <p className="mt-3">
            Your ReplyAstra account is your responsibility. Keep your credentials safe. If
            you suspect unauthorized access, contact us immediately at{" "}
            <a href="mailto:support@replyastra.online" className="text-emerald-600 underline font-semibold">
              support@replyastra.online
            </a>.
          </p>
        </>
      ),
    },
    {
      title: "A Straight Talk on Automation Risk",
      content: (
        <>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-4">
            <p className="font-bold text-amber-900 text-sm">Important</p>
            <p className="text-amber-800 text-sm mt-1">
              Even with Meta's official API, high-volume messaging can attract attention
              from Instagram's internal systems. ReplyAstra paces messages intelligently,
              but we cannot guarantee your account will never be affected.
            </p>
          </div>
          <p>
            You are responsible for how you use automation and for staying within Instagram's
            Community Guidelines. ReplyAstra is not liable for account restrictions, bans,
            or suspensions that result from your use of our service.
          </p>
        </>
      ),
    },
    {
      title: "Things You Cannot Do",
      content: (
        <>
          <p className="mb-4">ReplyAstra exists to help creators grow genuinely. Do not use it to:</p>
          <ul className="space-y-3">
            {[
              "Send spam or bulk unsolicited messages",
              "Harass, bully, or target individuals",
              "Spread misleading, harmful, or hateful content",
              "Impersonate another person or brand",
              "Intentionally exceed Instagram's messaging rate limits",
              "Reverse-engineer, exploit, or interfere with our platform",
              "Resell or sublicense access to ReplyAstra without permission",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-600">
                <span className="w-4 h-4 rounded-full border-2 border-red-300 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-gray-500">
            Violations may result in immediate account suspension without refund.
          </p>
        </>
      ),
    },
    {
      title: "Plans, Payments & Refunds",
      content: (
        <>
          <p className="mb-5">ReplyAstra runs on a subscription model. Here is how it works:</p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { plan: "Free", price: "₹0 / mo", accounts: "1 account" },
              { plan: "Starter", price: "₹199 / mo", accounts: "3 accounts" },
              { plan: "Pro", price: "₹399 / mo", accounts: "10 accounts" },
            ].map((p, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
                <p className="font-black text-gray-900 text-sm">{p.plan}</p>
                <p className="text-emerald-600 font-bold text-sm mt-1">{p.price}</p>
                <p className="text-gray-400 text-xs mt-1">{p.accounts}</p>
              </div>
            ))}
          </div>

          <ul className="space-y-3 text-sm text-gray-600">
            {[
              "Subscriptions renew automatically — cancel anytime from your dashboard before renewal",
              "Yearly plans save 15% and are billed as a single annual payment",
              "Payments processed securely via Razorpay. We never store your card details",
              "Unused quota does not carry over to the next billing cycle",
              "Pricing may change with 30 days' email notice",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-emerald-500 shrink-0 font-bold">—</span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-5 bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
            <p className="font-black text-emerald-900 text-sm">Refund Policy</p>
            <p className="text-emerald-800 text-sm mt-2">
              If ReplyAstra does not work as described, first-time subscribers receive a full
              refund within <strong>7 days</strong> — no questions asked. Refunds are not
              available after 7 days or on renewal charges.
            </p>
          </div>
        </>
      ),
    },
    {
      title: "Ownership",
      content: (
        <>
          <p>
            The ReplyAstra brand, design, code, and product belong to us. You get a license
            to use the platform while you are an active subscriber — you do not own any part
            of it.
          </p>
          <p className="mt-3">
            Your automation rules, message templates, and business content are entirely yours.
            We process them only to run your automations — nothing else.
          </p>
        </>
      ),
    },
    {
      title: "Third-Party Services",
      content: (
        <p>
          ReplyAstra works alongside Meta's API, Supabase, Razorpay, and Vercel. These
          services operate independently and have their own terms. We are not responsible
          for disruptions or policy changes made by any third-party provider.
        </p>
      ),
    },
    {
      title: "Termination",
      content: (
        <>
          <p>
            You can close your account at any time from your dashboard. We will handle your
            data as described in our{" "}
            <a href="/privacy-policy" className="text-emerald-600 underline font-semibold">
              Privacy Policy
            </a>.
          </p>
          <p className="mt-3">
            We may suspend or terminate accounts that violate these Terms, engage in
            fraudulent activity, or are flagged under Meta's API policies — in serious
            cases, without prior notice.
          </p>
        </>
      ),
    },
    {
      title: "Liability & Warranties",
      content: (
        <>
          <p>
            ReplyAstra is provided <strong>"as is"</strong> and <strong>"as available"</strong>.
            We work hard to keep things running but cannot promise zero downtime or that every
            automation will perform exactly as expected.
          </p>
          <p className="mt-3">
            To the fullest extent permitted by law, ReplyAstra is not liable for any indirect,
            incidental, or consequential damages — including loss of profits, data, followers,
            or Instagram account standing — arising from your use of our platform.
          </p>
        </>
      ),
    },
    {
      title: "Changes to These Terms",
      content: (
        <p>
          We will update these Terms as ReplyAstra evolves. For significant changes, we will
          notify you by email at least <strong>7 days in advance</strong>. The date at the
          top of this page always reflects the latest version. Continuing to use ReplyAstra
          after an update means you accept the revised Terms.
        </p>
      ),
    },
    {
      title: "Governing Law",
      content: (
        <p>
          These Terms are governed by the laws of <strong>India</strong>. Any disputes
          arising from your use of ReplyAstra shall be subject to the exclusive jurisdiction
          of the courts of India.
        </p>
      ),
    },
  ];

  return (
    <main className="bg-[#f0fdfa] min-h-screen px-6 py-32">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block mb-4 bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-xs font-bold tracking-widest">
            LEGAL
          </span>
          <h1 className="text-5xl font-black text-gray-900">Terms of Service</h1>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">
            Written to be actually readable. If you have any questions, we are always reachable.
          </p>
          <p className="mt-3 text-gray-400 text-sm">
            Effective: February 15, 2026 &nbsp;·&nbsp; Last updated: February 15, 2026
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-5">
          {sections.map((section, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100"
            >
              <h2 className="text-lg font-black text-gray-900 mb-4 pb-4 border-b border-gray-100">
                {String(i + 1).padStart(2, "0")}. {section.title}
              </h2>
              <div className="text-gray-600 leading-relaxed text-sm md:text-base">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Footer */}
        <div className="mt-10 bg-white rounded-3xl p-10 shadow-sm border border-gray-100 text-center">
          <h3 className="text-2xl font-black text-gray-900 mb-2">Questions about these Terms?</h3>
          <p className="text-gray-500 mb-7">
            Reach out and we will explain anything clearly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:legal@replyastra.online"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-full transition-all"
            >
              legal@replyastra.online
            </a>
            <a
              href="/contact"
              className="border border-gray-200 text-gray-700 font-bold px-6 py-3 rounded-full hover:border-emerald-400 hover:text-emerald-600 transition-all"
            >
              Open a Support Ticket
            </a>
          </div>
        </div>

      </div>
    </main>
  );
}
