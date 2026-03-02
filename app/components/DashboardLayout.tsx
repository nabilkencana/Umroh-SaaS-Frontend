'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const pathname = usePathname();

    const menuItems = [
        { href: '/dashboard', label: 'Dashboard', icon: '📊' },
        { href: '/dashboard/jamaah', label: 'Jamaah', icon: '👥' },
        { href: '/dashboard/tracking', label: 'Tracking', icon: '📍' },
        { href: '/dashboard/trips', label: 'Perjalanan', icon: '✈️' },
        { href: '/dashboard/analytics', label: 'Analytics', icon: '📈' },
        { href: '/dashboard/promo-admin', label: 'Kelola Promo', icon: '🎫' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navbar */}
            <nav className="bg-[#0F5132] text-white shadow-lg">
                <div className="px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold flex items-center gap-2">
                        <span className="text-[#D4AF37]">🕌</span>
                        <span>Umroh SaaS</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <span className="text-sm">Admin Cabang</span>
                        <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center font-bold text-[#0F5132]">
                            AC
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-white shadow-lg min-h-[calc(100vh-4rem)]">
                    <nav className="p-4 space-y-2">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                            ? 'bg-[#0F5132] text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
