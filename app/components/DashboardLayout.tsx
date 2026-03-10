'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  UsersIcon,
  MapPinIcon,
  GlobeAltIcon,
  ChartBarIcon,
  TagIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ClockIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftIcon,
  ChevronLeftIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import SupportButton from './SupportButton';
import DashboardFooter from './DashboardFooter';
import { userService } from '@/services/user.service';

interface DashboardLayoutProps {
  children: ReactNode;
}

interface UserProfile {
  name: string;
  email: string;
  avatar_url?: string;
  position?: string;
}

const menuItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: HomeIcon,
    description: 'Ringkasan data'
  },
  {
    href: '/dashboard/jamaah',
    label: 'Jamaah',
    icon: UsersIcon,
    description: 'Kelola data jamaah'
  },
  {
    href: '/dashboard/tracking',
    label: 'Tracking',
    icon: MapPinIcon,
    description: 'Lokasi real-time'
  },
  {
    href: '/dashboard/trips',
    label: 'Perjalanan',
    icon: GlobeAltIcon,
    description: 'Jadwal keberangkatan'
  },
  {
    href: '/dashboard/analytics',
    label: 'Analytics',
    icon: ChartBarIcon,
    description: 'Laporan & statistik'
  },
  {
    href: '/dashboard/promo-admin',
    label: 'Kelola Promo',
    icon: TagIcon,
    description: 'Promo & diskon'
  },
];

// Untuk menu tambahan (settings only)
const additionalMenuItems = [
  {
    href: '/dashboard/pengaturan',
    label: 'Pengaturan',
    icon: Cog6ToothIcon,
    description: 'Pengaturan akun'
  }
];

// Notifikasi dummy
const notifications = [
  { id: 1, title: 'Jamaah baru mendaftar', time: '5 menit lalu', read: false },
  { id: 2, title: 'Pembayaran berhasil', time: '1 jam lalu', read: false },
  { id: 3, title: 'Keberangkatan H-7', time: '3 jam lalu', read: true },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Loading...',
    email: 'loading@example.com',
    avatar_url: '',
    position: ''
  });
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Load user profile
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profile = await userService.getProfile();
        setUserProfile({
          name: profile.name || 'Admin',
          email: profile.email || 'admin@umroh.com',
          avatar_url: profile.avatar_url || '',
          position: profile.position || 'Administrator'
        });
      } catch (error) {
        console.error('Failed to load user profile:', error);
        // Fallback to default
        setUserProfile({
          name: 'Admin',
          email: 'admin@umroh.com',
          avatar_url: '',
          position: 'Administrator'
        });
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadUserProfile();
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    // Add logout logic here
    router.push('/dashboard/login');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 md:px-6">
          {/* Left section */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <span className="text-3xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                  🕌
                </span>
                <div className="absolute -inset-1 bg-[#D4AF37]/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-[#0F5132] to-[#1B8C5E] bg-clip-text text-transparent">
                  Umroh SaaS
                </span>
                <span className="text-[10px] text-gray-400 -mt-1">Manajemen Umroh</span>
              </div>
            </Link>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Current time */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
              <ClockIcon className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">{currentTime} WIB</span>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Notifikasi"
              >
                <BellIcon className="w-5 h-5 text-gray-700" />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </button>

              {/* Notifications dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-[#0F5132] to-[#1B8C5E]">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-white">Notifikasi</h3>
                        {unreadCount > 0 && (
                          <span className="px-2 py-1 bg-white/20 text-white text-xs rounded-full font-medium">
                            {unreadCount} baru
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notif) => (
                        <motion.div
                          key={notif.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${!notif.read ? 'bg-blue-50/50' : ''
                            }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${!notif.read ? 'bg-blue-100' : 'bg-gray-100'}`}>
                              <BellIcon className={`w-4 h-4 ${!notif.read ? 'text-blue-600' : 'text-gray-600'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm ${!notif.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                {notif.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                            </div>
                            {!notif.read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="p-3 text-center border-t border-gray-100 bg-gray-50">
                      <button className="text-sm text-[#0F5132] hover:text-[#1B8C5E] font-medium hover:underline">
                        Lihat Semua Notifikasi
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 focus:outline-none"
                aria-label="Menu pengguna"
              >
                <div className="hidden md:block text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {isLoadingProfile ? 'Loading...' : userProfile.name}
                  </p>
                  <p className="text-xs text-green-600 flex items-center gap-1 justify-end">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Online
                  </p>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37] to-[#F5D742] rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity" />
                  {userProfile.avatar_url ? (
                    <img
                      src={userProfile.avatar_url}
                      alt={userProfile.name}
                      className="relative w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
                    />
                  ) : (
                    <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#0F5132] to-[#1B8C5E] flex items-center justify-center text-white font-bold">
                      {userProfile.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </button>

              {/* User dropdown menu */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                      <div className="flex items-center gap-3">
                        {userProfile.avatar_url ? (
                          <img
                            src={userProfile.avatar_url}
                            alt={userProfile.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0F5132] to-[#1B8C5E] flex items-center justify-center text-white font-bold text-lg">
                            {userProfile.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{userProfile.name}</p>
                          <p className="text-xs text-gray-500 truncate">{userProfile.position || 'Administrator'}</p>
                          <p className="text-xs text-gray-400 truncate">{userProfile.email}</p>
                        </div>
                      </div>
                    </div>

                    <Link
                      href="/dashboard/pengaturan/profile"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <UserCircleIcon className="w-5 h-5" />
                      <div>
                        <p className="font-medium">Profile Saya</p>
                        <p className="text-xs text-gray-500">Kelola informasi pribadi</p>
                      </div>
                    </Link>

                    <Link
                      href="/dashboard/pengaturan"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Cog6ToothIcon className="w-5 h-5" />
                      <div>
                        <p className="font-medium">Pengaturan</p>
                        <p className="text-xs text-gray-500">Preferensi akun</p>
                      </div>
                    </Link>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5" />
                      <div className="text-left">
                        <p className="font-medium">Keluar</p>
                        <p className="text-xs text-red-500">Logout dari akun</p>
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto flex w-full max-w-[1440px] relative">
        {/* Sidebar */}
        <AnimatePresence mode="wait">
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed inset-0 z-40 lg:hidden"
            >
              <div className="absolute inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)} />
              <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl p-4 overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-semibold text-gray-400">MENU UTAMA</span>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    aria-label="Tutup menu"
                  >
                    <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <SidebarContent pathname={pathname} />

                {/* Mobile logout button */}
                <button
                  onClick={handleLogout}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span className="font-medium">Keluar</span>
                </button>
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop sidebar */}
        <aside className="sticky top-16 hidden lg:block h-[calc(100vh-4rem)] w-72 bg-white/80 backdrop-blur-sm border-r border-gray-200/50 p-4 overflow-y-auto">
          <div className="mb-6">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#D4AF37] rounded-full"></span>
              Menu Utama
            </p>
          </div>
          <SidebarContent pathname={pathname} />

          {/* Desktop logout button */}
          <button
            onClick={handleLogout}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span className="font-medium">Keluar</span>
          </button>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)] p-4 md:p-6 lg:p-8">
          {/* Mobile back button */}
          <div className="md:hidden flex items-center gap-2 mb-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeftIcon className="w-4 h-4" />
              <span>Kembali</span>
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            {/* Children content */}
            <div className="relative">
              {children}
            </div>

            {/* Dashboard Footer */}
            <DashboardFooter />
          </motion.div>
        </main>
      </div>

      {/* Support Button */}
      <SupportButton />
    </div>
  );
}

// Sidebar content component
function SidebarContent({ pathname }: { pathname: string }) {
  return (
    <nav className="space-y-1">
      {menuItems.map((item, index) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              href={item.href}
              className={`group relative flex items-start gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${isActive
                ? 'bg-gradient-to-r from-[#0F5132] to-[#1B8C5E] text-white shadow-lg'
                : 'text-gray-700 hover:bg-gray-100 hover:text-[#0F5132]'
                }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute left-0 w-1 h-8 bg-[#D4AF37] rounded-r-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}

              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-gray-500'
                    }`} />
                  <span className="font-medium">{item.label}</span>
                </div>
                <span className={`text-xs mt-1 ml-8 ${isActive ? 'text-emerald-100' : 'text-gray-400'
                  }`}>
                  {item.description}
                </span>
              </div>

              {isActive && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2">
                  <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              )}
            </Link>
          </motion.div>
        );
      })}

      {/* Additional section */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-2">
          <span className="w-1 h-4 bg-gray-300 rounded-full"></span>
          Lainnya
        </p>

        {additionalMenuItems.map((item, index) => {
          // Untuk pengaturan, cek apakah pathname dimulai dengan /dashboard/pengaturan
          // Untuk bantuan, cek apakah pathname sama dengan /dashboard/bantuan
          let isActive = false;
          if (item.href === '/dashboard/pengaturan') {
            isActive = pathname.startsWith('/dashboard/pengaturan');
          } else {
            isActive = pathname === item.href;
          }
          const Icon = item.icon;

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (menuItems.length + index) * 0.05 }}
            >
              <Link
                href={item.href}
                className={`group relative flex items-start gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${isActive
                  ? 'bg-gradient-to-r from-[#0F5132] to-[#1B8C5E] text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-[#0F5132]'
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="additional-active-indicator"
                    className="absolute left-0 w-1 h-8 bg-[#D4AF37] rounded-r-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}

                <div className="flex flex-col flex-1">
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-gray-500'
                      }`} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <span className={`text-xs mt-1 ml-8 ${isActive ? 'text-emerald-100' : 'text-gray-400'
                    }`}>
                    {item.description}
                  </span>
                </div>

                {isActive && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2">
                    <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </nav>
  );
}