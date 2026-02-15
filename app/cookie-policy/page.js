"use client";

import { useState } from "react";

export default function CookiePolicy() {
  const [preferences, setPreferences] = useState({
    necessary: true,      // always on
    analytics: true,
    functional: true,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem("cookiePreferences", JSON.stringify(preferences));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

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
              websites remember your preferences, keep you logged in, and understand how you use the
              site. ReplyAstra uses cookies to provide a better, faster, and more secure experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">2. Cookies We Use</h2>

            {/* Necessary */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden mb-4">
              <div className="flex items-center justify-between p-5 bg-gray-50">
                <div>
                  <p className="font-bold text-gray-900">Necessary Cookies</p>
                  <p className="text-sm text-gray-500">Required for the platform to function</p>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-bold">
                  Always Active
                </span>
              </div>
              <div className="p-5">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="pb-2 font-semibold">Cookie</th>
                      <th className="pb-2 font-semibold">Purpose</th>
                      <th className="pb-2 font-semibold">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2 text-gray-700">
                    <tr>
                      <td className="py-1.5 font-mono text-xs">sb-auth-token</td>
                      <td className="py-1.5">Keeps you logged in to ReplyAstra</td>
                      <td className="py-1.5">Session</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-mono text-xs">csrf-token</td>
                      <td className="py-1.5">Protects against cross-site request forgery</td>
                      <td className="py-1.5">Session</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-mono text-xs">cookie-consent</td>
                      <td className="py-1.5">Stores your cookie preferences</td>
                      <td className="py-1.5">1 year</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Analytics */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden mb-4">
              <div className="flex items-center justify-between p-5 bg-gray-50">
                <div>
                  <p className="font-bold text-gray-900">Analytics Cookies</p>
                  <p className="text-sm text-gray-500">Help us understand how visitors use our site</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
              <div className="p-5">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="pb-2 font-semibold">Cookie</th>
                      <th className="pb-2 font-semibold">Purpose</th>
                      <th className="pb-2 font-semibold">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr>
                      <td className="py-1.5 font-mono text-xs">_ga</td>
                      <td className="py-1.5">Google Analytics — tracks page visits</td>
                      <td className="py-1.5">2 years</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-mono text-xs">_ga_*</td>
                      <td className="py-1.5">Google Analytics — session tracking</td>
                      <td className="py-1.5">2 years</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-mono text-xs">ra_session</td>
                      <td className="py-1.5">ReplyAstra internal — tracks feature usage</td>
                      <td className="py-1.5">30 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Functional */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between p-5 bg-gray-50">
                <div>
                  <p className="font-bold text-gray-900">Functional Cookies</p>
                  <p className="text-sm text-gray-500">Remember your preferences and settings</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={preferences.functional}
                    onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
              <div className="p-5">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="pb-2 font-semibold">Cookie</th>
                      <th className="pb-2 font-semibold">Purpose</th>
                      <th className="pb-2 font-semibold">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr>
                      <td className="py-1.5 font-mono text-xs">ra_theme</td>
                      <td className="py-1.5">Stores your UI theme preference</td>
                      <td className="py-1.5">1 year</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-mono text-xs">ra_lang</td>
                      <td className="py-1.5">Stores your language preference</td>
                      <td className="py-1.5">1 year</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Save preferences */}
          <div className="bg-emerald-50 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-emerald-900">Save Your Preferences</p>
              <p className="text-emerald-700 text-sm">Your choices will be saved for 1 year.</p>
            </div>
            <button
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-bold text-sm transition-all shrink-0"
            >
              {saved ? "✅ Saved!" : "Save Preferences"}
            </button>
          </div>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">3. How to Control Cookies</h2>
            <p>
              In addition to the controls above, you can manage cookies through your browser settings:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
              <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
              <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
              <li><strong>Edge:</strong> Settings → Cookies and site permissions</li>
            </ul>
            <p className="mt-3 text-sm text-gray-500">
              Note: Blocking necessary cookies may prevent you from logging in or using core features.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">4. Third-Party Cookies</h2>
            <p>
              Some cookies are set by third-party services we use. These are governed by their own
              privacy policies:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>
                <strong>Google Analytics</strong> —{" "}
                <a href="https://policies.google.com/privacy" className="text-emerald-600 underline" target="_blank" rel="noopener noreferrer">
                  Google Privacy Policy
                </a>
              </li>
              <li>
                <strong>Meta (Facebook)</strong> — Used during Instagram OAuth authentication —{" "}
                <a href="https://www.facebook.com/policy.php" className="text-emerald-600 underline" target="_blank" rel="noopener noreferrer">
                  Meta Privacy Policy
                </a>
              </li>
              <li>
                <strong>Razorpay</strong> — Used during payment processing —{" "}
                <a href="https://razorpay.com/privacy/" className="text-emerald-600 underline" target="_blank" rel="noopener noreferrer">
                  Razorpay Privacy Policy
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">5. Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy as we add new features or services. We will notify you
              by updating the date at the top of this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-3">6. Contact Us</h2>
            <div className="bg-emerald-50 rounded-2xl p-6 space-y-2">
              <p><strong>ReplyAstra</strong></p>
              <p>Email: <a href="mailto:privacy@replyastra.online" className="text-emerald-600 underline">privacy@replyastra.online</a></p>
              <p>Website: <a href="https://replyastra.online" className="text-emerald-600 underline">replyastra.online</a></p>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
