'use client';

import Link from 'next/link';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/promo', label: 'Promo' },
  { href: '/dashboard', label: 'Dashboard' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0F5132]/95 text-white shadow-lg backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
            <span className="text-[#D4AF37]">🕌</span>
            <span>Umroh SaaS</span>
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10 hover:text-[#D4AF37]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/dashboard/login"
              className="ml-2 rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-[#0F5132] transition-colors hover:bg-[#C4A037]"
            >
              Login
            </Link>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-lg p-2 transition-colors hover:bg-white/10 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="space-y-2 pb-4 md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block rounded-lg px-3 py-2 transition-colors hover:bg-white/10 hover:text-[#D4AF37]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/dashboard/login"
              onClick={() => setIsMenuOpen(false)}
              className="block rounded-lg bg-[#D4AF37] px-4 py-2 text-center font-semibold text-[#0F5132]"
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
