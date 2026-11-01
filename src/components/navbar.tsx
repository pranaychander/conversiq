"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-indigo-600">
              ConversiQ
            </Link>
            <div className="hidden sm:flex gap-6">
              <Link href="/" className="text-gray-600 hover:text-indigo-600 transition">
                Home
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-indigo-600 transition">
                About
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-indigo-600 transition">
                Contact
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-indigo-600 transition">
                Dashboard
              </Link>
              <Link href="/ask" className="text-gray-600 hover:text-indigo-600 transition">
                Ask AI
              </Link>
            </div>
          </div>
          <button
            className="sm:hidden p-2"
            onClick={() => {
              const menu = document.getElementById("mobile-menu");
              if (menu) menu.classList.toggle("hidden");
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6L20 6M4 12L20 12M4 18L20 18" />
            </svg>
          </button>
        </div>
        <div id="mobile-menu" className="hidden sm:hidden">
          <div className="flex flex-col gap-2 py-2">
            <Link href="/" className="text-gray-600">Home</Link>
            <Link href="/about" className="text-gray-600">About</Link>
            <Link href="/contact" className="text-gray-600">Contact</Link>
            <Link href="/dashboard" className="text-gray-600">Dashboard</Link>
            <Link href="/ask" className="text-gray-600">Ask AI</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}