import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-32">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">

        <div>
          <h4 className="font-bold mb-4">Product</h4>
          <ul className="space-y-2 text-gray-600">
            <li><Link href="#features">Features</Link></li>
            <li><Link href="#pricing">Pricing</Link></li>
            <li><Link href="/support">Support</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4">Company</h4>
          <ul className="space-y-2 text-gray-600">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/privacy">Privacy</Link></li>
            <li><Link href="/terms">Terms</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4">Resources</h4>
          <ul className="space-y-2 text-gray-600">
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/support">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4">ReplyAstra</h4>
          <p className="text-gray-600">
            Intelligent DM automation for modern creators.
          </p>
        </div>
      </div>

      <div className="border-t py-4 text-center text-xs text-gray-500">
        © 2026 ReplyAstra. All rights reserved.
      </div>
    </footer>
  );
}
