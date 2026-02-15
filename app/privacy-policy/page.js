export default function PrivacyPolicy() {
  return (
    <main className="bg-[#f0fdfa] min-h-screen px-6 py-32">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block mb-4 bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-xs font-bold">
            LEGAL
          </span>
          <h1 className="text-5xl font-black text-gray-900">Privacy Policy</h1>
          <p className="mt-4 text-gray-500 text-sm">Last updated: February 15, 2026</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-10 md:p-16 space-y-10 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">1. Introduction</h2>
            <p>
              Welcome to ReplyAstra ("we", "our", or "us"). We are committed to protecting your personal
              information and your right to privacy. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use our platform at{" "}
              <a href="https://replyastra.online" className="text-emerald-600 underline">replyastra.online</a>.
            </p>
            <p className="mt-3">
              Please read this policy carefully. If you disagree with its terms, please discontinue use
              of our platform immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">2. Information We Collect</h2>
            <p>We collect information that you provide directly to us, including:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, and password when you register.</li>
              <li><strong>Instagram Account Data:</strong> We access your Instagram Business or Creator account via Meta's official API. This includes your Instagram user ID, username, and messaging permissions.</li>
              <li><strong>Message Metadata:</strong> We process incoming DM content solely to trigger automated responses. We do not store the content of your followers' messages beyond what is necessary for automation.</li>
              <li><strong>Billing Information:</strong> Payment details processed securely through our payment provider (Razorpay). We do not store your card details.</li>
              <li><strong>Usage Data:</strong> Information about how you use our platform, including features accessed and automation rules configured.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Provide, operate, and maintain the ReplyAstra platform</li>
              <li>Process and deliver automated DM replies on your behalf via Meta's API</li>
              <li>Manage your account and subscription</li>
              <li>Send transactional emails (account confirmation, billing receipts, support responses)</li>
              <li>Monitor and analyze usage patterns to improve our service</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p className="mt-3">
              We do <strong>not</strong> sell your personal data to third parties. We do <strong>not</strong> use
              your Instagram data for advertising purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">4. Meta / Instagram Data</h2>
            <p>
              ReplyAstra integrates with Meta's Messaging API. By connecting your Instagram account, you
              authorize us to:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Read incoming Direct Messages to detect keyword triggers</li>
              <li>Send automated replies on your behalf</li>
              <li>Access your follower list to support "Ask to Follow" features</li>
            </ul>
            <p className="mt-3">
              We access only the permissions you explicitly grant through Meta's OAuth flow. You can
              revoke access at any time from your{" "}
              <a
                href="https://www.facebook.com/settings?tab=business_tools"
                className="text-emerald-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Meta Business Settings
              </a>{" "}
              or from your ReplyAstra dashboard.
            </p>
            <p className="mt-3">
              Our use of Meta data complies with{" "}
              <a
                href="https://developers.facebook.com/policy/"
                className="text-emerald-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Meta's Platform Policy
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">5. Data Retention</h2>
            <p>
              We retain your account data for as long as your account is active or as needed to provide
              you services. If you delete your account, we will delete or anonymize your personal data
              within <strong>30 days</strong>, except where we are required by law to retain it.
            </p>
            <p className="mt-3">
              Instagram message metadata used for automation is retained for a maximum of <strong>90 days</strong> for
              analytics purposes, after which it is permanently deleted.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">6. Data Security</h2>
            <p>
              We implement industry-standard security measures including:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>TLS/SSL encryption for all data in transit</li>
              <li>AES-256 encryption for sensitive data at rest</li>
              <li>Secure OAuth 2.0 token storage — we never store your Instagram password</li>
              <li>Regular security audits and vulnerability assessments</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">7. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Supabase</strong> — Database and authentication</li>
              <li><strong>Meta (Facebook) API</strong> — Instagram messaging integration</li>
              <li><strong>Razorpay</strong> — Payment processing</li>
              <li><strong>Vercel</strong> — Website hosting</li>
            </ul>
            <p className="mt-3">
              Each third-party service has its own privacy policy governing their use of data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">8. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Access</strong> — Request a copy of the data we hold about you</li>
              <li><strong>Correct</strong> — Update inaccurate personal information</li>
              <li><strong>Delete</strong> — Request deletion of your personal data</li>
              <li><strong>Withdraw consent</strong> — Disconnect your Instagram account at any time</li>
              <li><strong>Data portability</strong> — Request your data in a machine-readable format</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, visit our{" "}
              <a href="/data-deletion" className="text-emerald-600 underline">
                Data Deletion page
              </a>{" "}
              or email us at{" "}
              <a href="mailto:privacy@replyastra.online" className="text-emerald-600 underline">
                privacy@replyastra.online
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">9. Children's Privacy</h2>
            <p>
              ReplyAstra is not directed to children under the age of 13. We do not knowingly collect
              personal information from children. If you believe a child has provided us with personal
              information, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by
              updating the "Last updated" date at the top of this page and, for significant changes,
              sending an email notification to your registered address.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">11. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us:</p>
            <div className="mt-3 bg-emerald-50 rounded-2xl p-6 space-y-2">
              <p><strong>ReplyAstra</strong></p>
              <p>Email: <a href="mailto:privacy@replyastra.online" className="text-emerald-600 underline">privacy@replyastra.online</a></p>
              <p>Website: <a href="https://replyastra.online" className="text-emerald-600 underline">replyastra.online</a></p>
              <p>Support: <a href="/contact" className="text-emerald-600 underline">replyastra.online/contact</a></p>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
