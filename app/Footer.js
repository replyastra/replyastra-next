import { Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-12">

          {/* LEFT — BRAND */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                R
              </div>
              <span className="text-xl font-extrabold">
                <span className="text-gray-900">Reply</span>
                <span className="text-emerald-600">Astra</span>
              </span>
            </div>

            <p className="text-gray-600 leading-relaxed max-w-sm">
              ReplyAstra brings intelligent automation to Instagram DMs —
              helping creators reply faster and grow smarter.
            </p>
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-4 tracking-wide">
              COMPANY
            </h4>
            <ul className="space-y-3 text-gray-600 font-semibold">
              <li><a href="#pricing" className="hover:text-emerald-600">Pricing</a></li>
              <li><a href="/terms" className="hover:text-emerald-600">Terms & Conditions</a></li>
              <li><a href="/privacy" className="hover:text-emerald-600">Privacy Policy</a></li>
              <li><a href="/refund" className="hover:text-emerald-600">Refund Policy</a></li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-4 tracking-wide">
              SUPPORT
            </h4>
            <ul className="space-y-3 font-semibold">
              <li>
                <a href="/contact" className="text-emerald-600 hover:underline">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-gray-600 hover:text-emerald-600">
                  How it Works
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="mt-16 pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-xs text-gray-400 font-semibold text-center md:text-left">
            © 2026 ReplyAstra Platform · All Rights Reserved
          </p>

          <a
            href="https://instagram.com"
            target="_blank"
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:text-emerald-600 hover:border-emerald-300 transition"
          >
            <Instagram size={18} />
          </a>

        </div>

      </div>
    </footer>
  );
            }
