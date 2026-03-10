'use client';

import Link from 'next/link';
import {
    HomeIcon,
    QuestionMarkCircleIcon,
    DocumentTextIcon,
    PhoneIcon,
    EnvelopeIcon
} from '@heroicons/react/24/outline';

export default function DashboardFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-12 border-t border-gray-200 pt-6 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Umroh SaaS</h3>
                        <p className="text-gray-600 text-sm mb-4">
                            Sistem manajemen umroh terintegrasi untuk pengelolaan jamaah, perjalanan, dan promosi.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <PhoneIcon className="w-4 h-4" />
                            <span>+62 812 3456 7890</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                            <EnvelopeIcon className="w-4 h-4" />
                            <span>support@umrohsaas.com</span>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Tautan Cepat</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/dashboard"
                                    className="text-gray-600 hover:text-[#0F5132] text-sm flex items-center gap-2 hover:underline"
                                >
                                    <HomeIcon className="w-4 h-4" />
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/dashboard/jamaah"
                                    className="text-gray-600 hover:text-[#0F5132] text-sm flex items-center gap-2 hover:underline"
                                >
                                    <QuestionMarkCircleIcon className="w-4 h-4" />
                                    Bantuan
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/docs"
                                    className="text-gray-600 hover:text-[#0F5132] text-sm flex items-center gap-2 hover:underline"
                                >
                                    <DocumentTextIcon className="w-4 h-4" />
                                    Dokumentasi
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Quick Help */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Bantuan Cepat</h4>
                        <div className="space-y-2">
                            <button
                                onClick={() => alert('Fitur chat support akan segera hadir!')}
                                className="text-sm text-gray-600 hover:text-[#0F5132] hover:underline"
                            >
                                Chat dengan Support
                            </button>
                            <div className="text-sm text-gray-500 mt-4">
                                <p className="text-xs">© {currentYear} Umroh SaaS. All rights reserved.</p>
                                <p className="text-xs text-gray-400 mt-1">v1.0.0</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-center text-sm text-gray-500">
                        &copy; {currentYear} Umroh SaaS. Sistem Manajemen Umroh Terintegrasi.
                    </p>
                    <p className="text-center text-xs text-gray-400 mt-2">
                        Dibangun dengan ❤️ untuk memudahkan perjalanan spiritual Anda.
                    </p>
                </div>
            </div>
        </footer>
    );
}