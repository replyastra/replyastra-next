"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl text-emerald-600">
          ReplyAstra
        </Link>

        <div className="hidden md:flex gap-6 text-sm font-semibold text-gray-700">
          <Link href="/pricing">Pricing</Link>
          <Link href="/support">Support</Link>
          <Link href="/login">Login</Link>
          <Link
            href="/signup"
            className="bg-emerald-600 text-white px-4 py-2 rounded-full"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}

