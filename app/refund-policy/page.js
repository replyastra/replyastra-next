export default function RefundPolicy() {
  return (
    <main className="bg-[#f0fdfa] min-h-screen px-6 py-32">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block mb-4 bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-xs font-bold">
            LEGAL
          </span>
          <h1 className="text-5xl font-black text-gray-900">Refund Policy</h1>
          <p className="mt-4 text-gray-500 text-sm">Last updated: February 15, 2026</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-10 md:p-16 space-y-10 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">1. Overview</h2>
            <p>
              At ReplyAstra, we want you to be completely satisfied with our service. This Refund
              Policy explains when you are eligible for a refund and how to request one. Please read
              this carefully before making a purchase.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">2. Subscription Plans</h2>
            <p>
              ReplyAstra offers monthly and annual subscription plans. All subscriptions are billed
              in advance. You can cancel your subscription at any time — cancellation takes effect
              at the end of your current billing period, and you will not be charged again.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">3. Refund Eligibility</h2>
            <p className="mb-4">We offer refunds under the following conditions:</p>

            <div className="space-y-4">
              {[
                {
                  icon: "✅",
                  title: "7-Day Money-Back Guarantee",
                  desc: "If you are not satisfied with ReplyAstra within the first 7 days of your first paid subscription, contact us and we will issue a full refund — no questions asked.",
                },
                {
                  icon: "✅",
                  title: "Technical Issues",
                  desc: "If a verified technical error on our end prevents you from using the platform for an extended period, you may be eligible for a prorated refund for the affected time.",
                },
                {
                  icon: "✅",
                  title: "Duplicate Charge",
                  desc: "If you were charged more than once for the same billing period due to a payment error, we will refund the duplicate charge immediately.",
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 border border-gray-100 rounded-2xl p-5">
                  <span className="text-2xl shrink-0">{item.icon}</span>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">4. Non-Refundable Cases</h2>
            <p className="mb-4">Refunds will <strong>not</strong> be issued in the following cases:</p>
            <ul className="space-y-2">
              {[
                "Refund requests made after the 7-day money-back window has expired",
                "Cancellation of a subscription after the billing date for the current period",
                "Partial month or unused days remaining after cancellation",
                "Annual plan renewals where no cancellation was submitted before the renewal date",
                "Accounts suspended or terminated due to violation of our Terms of Service",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-600">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full shrink-0 mt-2" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">5. How to Request a Refund</h2>
            <p>
              To request a refund, email us at{" "}
              <a href="mailto:support@replyastra.online" className="text-emerald-600 underline font-semibold">
                support@replyastra.online
              </a>{" "}
              with the subject line <strong>&quot;Refund Request&quot;</strong> and include:
            </p>
            <ul className="mt-4 space-y-2">
              {[
                "Your registered email address",
                "The reason for your refund request",
                "Your payment receipt or transaction ID (if available)",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-600">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4">
              We will respond within <strong>2 business days</strong>. Approved refunds are processed
              within <strong>5–7 business days</strong> and returned to your original payment method.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">6. Payment Processing</h2>
            <p>
              All payments are processed securely through <strong>Razorpay</strong>. ReplyAstra does
              not store your card details. Refunds are credited back to the original payment method
              and may take additional time to appear depending on your bank or card issuer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">7. Changes to This Policy</h2>
            <p>
              We reserve the right to modify this Refund Policy at any time. Changes will be posted
              on this page with an updated date. Continued use of ReplyAstra after changes constitutes
              your acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">8. Contact Us</h2>
            <div className="bg-emerald-50 rounded-2xl p-6 space-y-2">
              <p className="font-bold text-gray-900">ReplyAstra Support</p>
              <p className="text-gray-600">
                Email:{" "}
                <a href="mailto:support@replyastra.online" className="text-emerald-600 underline">
                  support@replyastra.online
                </a>
              </p>
              <p className="text-gray-600">
                Website:{" "}
                <a href="https://replyastra.online" className="text-emerald-600 underline">
                  replyastra.online
                </a>
              </p>
              <p className="text-sm text-gray-400 mt-2">
                We aim to respond to all refund requests within 2 business days.
              </p>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
