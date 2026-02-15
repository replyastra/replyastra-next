export default function TermsOfService() {
  return (
    <main className="bg-[#f0fdfa] min-h-screen px-6 py-32">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block mb-4 bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-xs font-bold">
            LEGAL
          </span>
          <h1 className="text-5xl font-black text-gray-900">Terms of Service</h1>
          <p className="mt-4 text-gray-500 text-sm">Last updated: February 15, 2026</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-10 md:p-16 space-y-10 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">1. Agreement to Terms</h2>
            <p>
              By accessing or using ReplyAstra at{" "}
              <a href="https://replyastra.online" className="text-emerald-600 underline">replyastra.online</a>,
              you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree,
              do not use our platform.
            </p>
            <p className="mt-3">
              These Terms apply to all users, including visitors, registered users, and paying subscribers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">2. Description of Service</h2>
            <p>
              ReplyAstra is a SaaS platform that enables Instagram Business and Creator account holders
              to automate Direct Message (DM) responses using Meta's official Messaging API. Features include:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Keyword-based DM automation</li>
              <li>Ask to Follow automation</li>
              <li>Multi-account management</li>
              <li>Analytics and reporting</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">3. Eligibility</h2>
            <p>To use ReplyAstra, you must:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Be at least 18 years of age</li>
              <li>Have a valid Instagram Business or Creator account</li>
              <li>Comply with Meta's Terms of Service and Community Standards</li>
              <li>Provide accurate and complete registration information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">4. Account Registration</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials.
              You agree to immediately notify us of any unauthorized use of your account at{" "}
              <a href="mailto:support@replyastra.online" className="text-emerald-600 underline">
                support@replyastra.online
              </a>.
            </p>
            <p className="mt-3">
              ReplyAstra is not liable for any loss or damage arising from your failure to protect
              your account credentials.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">5. Subscription & Billing</h2>
            <p>ReplyAstra offers the following plans:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Free Plan:</strong> Limited automation with 1 Instagram account</li>
              <li><strong>Starter Plan:</strong> ₹199/month or ₹169/month (yearly) — up to 3 accounts</li>
              <li><strong>Pro Plan:</strong> ₹399/month or ₹339/month (yearly) — up to 10 accounts</li>
            </ul>
            <p className="mt-3">
              Subscriptions auto-renew unless cancelled before the renewal date. All payments are
              processed securely via Razorpay. Prices are in Indian Rupees (INR) and inclusive of
              applicable taxes.
            </p>
            <p className="mt-3">
              <strong>Refund Policy:</strong> We offer a 7-day refund for first-time subscribers if
              the service does not work as described. No refunds will be issued after 7 days or for
              subsequent billing cycles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">6. Acceptable Use</h2>
            <p>You agree <strong>NOT</strong> to use ReplyAstra to:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Send spam, unsolicited messages, or harassing content</li>
              <li>Violate Meta's Terms of Service, Platform Policies, or Community Standards</li>
              <li>Impersonate any person or entity</li>
              <li>Conduct any fraudulent or illegal activity</li>
              <li>Attempt to reverse engineer or exploit our platform</li>
              <li>Automate messages in a way that exceeds Instagram's official rate limits</li>
            </ul>
            <p className="mt-3">
              Violation of these rules may result in immediate account suspension without refund.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">7. Meta Platform Compliance</h2>
            <p>
              ReplyAstra operates using Meta's official APIs. You acknowledge that:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Your use of our service is subject to Meta's platform policies</li>
              <li>Meta may change API access rules at any time, which may affect our service</li>
              <li>ReplyAstra is not affiliated with or endorsed by Meta Platforms, Inc.</li>
              <li>You are solely responsible for the content of your automated messages</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">8. Intellectual Property</h2>
            <p>
              All content, features, and functionality of ReplyAstra — including but not limited to
              the logo, design, code, and text — are owned by ReplyAstra and protected by applicable
              intellectual property laws.
            </p>
            <p className="mt-3">
              You retain ownership of your automation rules and message content. By using our platform,
              you grant us a limited license to process this content solely to provide our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">9. Disclaimer of Warranties</h2>
            <p>
              ReplyAstra is provided "as is" and "as available" without warranties of any kind. We do
              not guarantee that the service will be uninterrupted, error-free, or that results from
              automation will meet your specific expectations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">10. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, ReplyAstra shall not be liable for any indirect,
              incidental, special, or consequential damages, including loss of profits, data, or
              Instagram account standing, resulting from your use of our platform.
            </p>
            <p className="mt-3">
              Our total liability to you shall not exceed the amount you paid us in the 3 months
              preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">11. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account at any time for violations of
              these Terms. You may cancel your account at any time from your dashboard settings.
            </p>
            <p className="mt-3">
              Upon termination, your right to use the platform immediately ceases. We will delete
              your data per our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India.
              Any disputes shall be subject to the exclusive jurisdiction of the courts in India.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">13. Changes to Terms</h2>
            <p>
              We may update these Terms at any time. We will notify you via email or a notice on our
              platform at least 7 days before major changes take effect. Continued use of ReplyAstra
              after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">14. Contact Us</h2>
            <p>For questions about these Terms, contact us:</p>
            <div className="mt-3 bg-emerald-50 rounded-2xl p-6 space-y-2">
              <p><strong>ReplyAstra</strong></p>
              <p>Email: <a href="mailto:legal@replyastra.online" className="text-emerald-600 underline">legal@replyastra.online</a></p>
              <p>Website: <a href="https://replyastra.online" className="text-emerald-600 underline">replyastra.online</a></p>
              <p>Support: <a href="/contact" className="text-emerald-600 underline">replyastra.online/contact</a></p>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
