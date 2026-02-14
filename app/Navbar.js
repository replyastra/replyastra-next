"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center">R</div>
          <span className="text-xl font-extrabold">
            <span className="text-gray-900">Reply</span>
            <span className="text-emerald-600">Astra</span>
          </span>
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8 font-semibold text-gray-600">
          <a href="/#features">Features</a>
          <a href="/#how-it-works">How it works</a>
          <a href="/#pricing">Pricing</a>
          <a href="/login">Login</a>
          <a href="/signup" className="bg-emerald-600 text-white px-5 py-2 rounded-full">Get Started</a>
        </div>

        {/* MOBILE HAMBURGER */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-gray-800">
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white shadow-lg border-b">
          <div className="flex flex-col px-6 py-4 gap-4 font-semibold text-gray-700">
            <a onClick={() => setOpen(false)} href="/#features">Features</a>
            <a onClick={() => setOpen(false)} href="/#how-it-works">How it works</a>
            <a onClick={() => setOpen(false)} href="/#pricing">Pricing</a>
            <a onClick={() => setOpen(false)} href="/login">Login</a>
            <a onClick={() => setOpen(false)} href="/signup" className="bg-emerald-600 text-white px-4 py-2 rounded-full text-center">Get Started</a>
          </div>
        </div>
      )}
    </nav>
  );
}
