'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/dashboard/jamaah', label: 'Jamaah', icon: '👥' },
  { href: '/dashboard/tracking', label: 'Tracking', icon: '📍' },
  { href: '/dashboard/trips', label: 'Perjalanan', icon: '✈️' },
  { href: '/dashboard/analytics', label: 'Analytics', icon: '📈' },
  { href: '/dashboard/promo-admin', label: 'Kelola Promo', icon: '🎫' },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="sticky top-0 z-40 border-b border-white/10 bg-[#0F5132] text-white shadow-lg">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
            <span className="text-[#D4AF37]">🕌</span>
            <span>Umroh SaaS</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">Admin Cabang</p>
              <p className="text-xs text-emerald-100">Online</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D4AF37] font-bold text-[#0F5132]">
              AC
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto flex w-full max-w-[1440px]">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-72 border-r border-emerald-100 bg-white p-4 lg:block">
          <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Menu Utama</p>
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#0F5132] text-white shadow-md'
                      : 'text-gray-700 hover:bg-emerald-50 hover:text-[#0F5132]'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
