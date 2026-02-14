import { Instagram } from "lucide-react";
export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-12">
          {/* LEFT — BRAND */}
          <div>
            <div className="flex items-center gap-0 mb-4">
              <span className="text-xl font-black text-emerald-600 tracking-tight">REPLY</span>
              <span className="text-xl font-light text-emerald-700 tracking-widest">ASTRA</span>
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
                <a href="/contact" className="text-gray-600 hover:text-emerald-600 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-gray-600 hover:text-emerald-600 transition-colors">
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
            href="https://www.instagram.com/replyastra?igsh=N2t5OGszZXp4aWUw"
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
