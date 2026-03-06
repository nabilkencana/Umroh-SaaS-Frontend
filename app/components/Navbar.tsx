'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/promo', label: 'Promo' },
  { href: '/dashboard', label: 'Dashboard' },
];

export default function Navbar() {
  const [isMenuOpen, 
    setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const isActiveLink = (href) => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };
  

  return (
    <>
<<<<<<< HEAD
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-3 ' 
          : 'bg-white py-4'
      }`}>
=======
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-2'
          : 'bg-white/80 backdrop-blur-sm py-4'
        }`}>
>>>>>>> 0be8fcb4ed95dd57231a0b69fb97332892d9b791
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="relative group"
              aria-label="Beranda"
            >
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-600 bg-clip-text text-transparent">
                Umroh<span className="text-amber-600">SaaS</span>
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-600 to-amber-500 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = isActiveLink(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative px-4 py-2 group"
                  >
                    <span className={`relative z-10 text-sm font-medium transition-colors duration-300 ${active
                        ? 'text-amber-600'
                        : 'text-gray-700 group-hover:text-emerald-600'
                      }`}>
                      {link.label}
                    </span>

                    {/* Hover Background */}
                    <span className="absolute inset-0 rounded-lg bg-emerald-50 scale-0 group-hover:scale-100 transition-transform duration-300 ease-out origin-left"></span>

                    {/* Active Indicator */}
                    {active && (
                      <motion.span
                        layoutId="activeNav"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-600 to-amber-500 rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}

              {/* Auth Buttons Desktop */}
              <div className="flex items-center gap-3 ml-6">
                {/* Login Button */}
                <Link href="/dashboard/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2 rounded-lg border-2 border-emerald-600 text-emerald-600 font-semibold text-sm hover:bg-emerald-50 transition-all duration-300"
                  >
                    Masuk
                  </motion.button>
                </Link>

                {/* Sign Up Button */}
                <Link href="/dashboard/daftar">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold text-sm hover:from-amber-500 hover:to-amber-600 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Daftar
                  </motion.button>
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative w-10 h-10 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors duration-300 md:hidden focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
              aria-label={isMenuOpen ? 'Tutup menu' : 'Buka menu'}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5">
                <span className={`block h-0.5 bg-emerald-700 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
                <span className={`block h-0.5 bg-emerald-700 transition-all duration-300 my-1 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`block h-0.5 bg-emerald-700 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-72 h-full bg-white shadow-2xl z-50 md:hidden overflow-y-auto"
            >
              <div className="flex flex-col min-h-full">
                {/* Header with close button */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-600 bg-clip-text text-transparent">
                      Umroh<span className="text-amber-600">SaaS</span>
                    </span>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="Tutup menu"
                    >
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 py-6">
                  {navLinks.map((link, index) => {
                    const active = isActiveLink(link.href);
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setIsMenuOpen(false)}
                          className={`block px-6 py-3 transition-all duration-300 ${active
                              ? 'bg-gradient-to-r from-emerald-50 to-amber-50 text-emerald-700 font-semibold border-l-4 border-amber-500'
                              : 'text-gray-600 hover:bg-gray-50 hover:pl-8'
                            }`}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Auth Buttons Mobile */}
                <div className="p-6 border-t border-gray-100 space-y-3">
                  {/* Login Button Mobile */}
                  <Link href="/dashboard/login" onClick={() => setIsMenuOpen(false)}>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="w-full px-4 py-3 rounded-lg border-2 border-emerald-600 text-emerald-600 font-semibold hover:bg-emerald-50 transition-all duration-300"
                    >
                      Masuk
                    </motion.button>
                  </Link>

                  {/* Sign Up Button Mobile */}
                  <Link href="/dashboard/daftar" onClick={() => setIsMenuOpen(false)}>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold hover:from-amber-500 hover:to-amber-600 transition-all duration-300 shadow-md"
                    >
                      Daftar
                    </motion.button>
                  </Link>
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 mt-auto">
                  <p className="text-xs text-gray-500 text-center">
                    © 2024 UmrohSaaS. All rights reserved.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div className={`${isScrolled ? 'h-16' : 'h-20'} transition-all duration-500`} />
    </>
  );
}