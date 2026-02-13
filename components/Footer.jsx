import Link from "next/link";

export default function Footer() {
  return ( ... );
}

    <footer className="bg-white border-t mt-32">
      <div className="max-w-7xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-3">
        
        {/* BRAND */}
        <div>
          <h3 className="text-xl font-bold text-emerald-600 mb-4">
            ReplyAstra
          </h3>
          <p className="text-gray-600 text-sm max-w-xs">
            ReplyAstra brings intelligent automation to Instagram DMs —
            helping creators reply faster and grow smarter.
          </p>
        </div>

        {/* COMPANY */}
        <div>
          <p className="font-bold text-sm mb-4">COMPANY</p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link href="/pricing">Pricing</Link></li>
            <li><Link href="/terms">Terms & Conditions</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/refund">Refund Policy</Link></li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <p className="font-bold text-sm mb-4">SUPPORT</p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <Link href="/support" className="text-emerald-600 font-semibold">
                Contact Us
              </Link>
            </li>
            <li><Link href="/#how-it-works">How it works</Link></li>
          </ul>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 py-6">
        © 2026 ReplyAstra Platform. All rights reserved.
      </div>
    </footer>
  );
}
