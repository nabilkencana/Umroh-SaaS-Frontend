'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-[#0F5132] text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="text-2xl font-bold flex items-center gap-2">
                        <span className="text-[#D4AF37]">🕌</span>
                        <span>Umroh SaaS</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/" className="hover:text-[#D4AF37] transition-colors">
                            Beranda
                        </Link>
                        <Link href="/promo" className="hover:text-[#D4AF37] transition-colors">
                            Promo
                        </Link>
                        <Link href="/dashboard" className="hover:text-[#D4AF37] transition-colors">
                            Dashboard
                        </Link>
                        <Link
                            href="/dashboard/login"
                            className="bg-[#D4AF37] text-[#0F5132] px-4 py-2 rounded-lg font-semibold hover:bg-[#C4A037] transition-colors"
                        >
                            Login
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden pb-4 space-y-2">
                        <Link href="/" className="block py-2 hover:text-[#D4AF37] transition-colors">
                            Beranda
                        </Link>
                        <Link href="/promo" className="block py-2 hover:text-[#D4AF37] transition-colors">
                            Promo
                        </Link>
                        <Link href="/dashboard" className="block py-2 hover:text-[#D4AF37] transition-colors">
                            Dashboard
                        </Link>
                        <Link
                            href="/dashboard/login"
                            className="block bg-[#D4AF37] text-[#0F5132] px-4 py-2 rounded-lg font-semibold text-center"
                        >
                            Login
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
