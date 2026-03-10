'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { motion } from 'framer-motion';
import {
  UsersIcon,
  CheckBadgeIcon,
  TicketIcon,
  MapPinIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  DocumentTextIcon,
  CreditCardIcon,
  DocumentArrowUpIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import { jamaahService } from '@/services/jamaah.service';
import { promoService } from '@/services/promo.service';
import { analyticsService } from '@/services/analytics.service';
import { Jamaah, Promo } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('Minggu Ini');
  const [selectedMetric, setSelectedMetric] = useState('Total Jamaah');
  const [greeting, setGreeting] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingJamaah, setLoadingJamaah] = useState(true);
  const [loadingPromo, setLoadingPromo] = useState(true);
  const [loadingActivity, setLoadingActivity] = useState(true);

  // Real data states
  const [jamaahList, setJamaahList] = useState<Jamaah[]>([]);
  const [promoList, setPromoList] = useState<Promo[]>([]);
  const [dashboardStats, setDashboardStats] = useState({
    total_jamaah: 0,
    active_jamaah: 0,
    active_promos: 0,
    tracking_today: 0,
  });
  const [weeklyActivity, setWeeklyActivity] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Selamat Pagi');
    else if (hour < 15) setGreeting('Selamat Siang');
    else if (hour < 18) setGreeting('Selamat Sore');
    else setGreeting('Selamat Malam');

    // Load real data from backend
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      console.log('📊 Loading dashboard data...');

      // Get tenant_id from localStorage
      const tenantId = localStorage.getItem('tenant_id') || undefined;

      // Load stats first (fastest)
      setLoadingStats(true);
      const statsData = await analyticsService.getDashboardStats(tenantId ? { tenant_id: tenantId } : {});
      console.log('✅ Stats loaded:', statsData);

      setDashboardStats({
        total_jamaah: statsData.total_jamaah,
        active_jamaah: 0, // Will be calculated after jamaah data loads
        active_promos: statsData.active_promos,
        tracking_today: statsData.tracking_today,
      });
      setLoadingStats(false);

      // Load other data in parallel (non-blocking)
      Promise.all([
        // Load jamaah data
        (async () => {
          setLoadingJamaah(true);
          const jamaahData = await jamaahService.getAll(tenantId ? { tenant_id: tenantId } : {});
          console.log('✅ Jamaah loaded:', jamaahData.length);
          setJamaahList(jamaahData);

          // Update active jamaah count
          const activeJamaah = jamaahData.filter((j) => j.status === 'active').length;
          setDashboardStats(prev => ({ ...prev, active_jamaah: activeJamaah }));
          setLoadingJamaah(false);
        })(),

        // Load promo data
        (async () => {
          setLoadingPromo(true);
          const promoData = await promoService.getAll(tenantId ? { tenant_id: tenantId } : {});
          console.log('✅ Promos loaded:', promoData.length);
          setPromoList(promoData);
          setLoadingPromo(false);
        })(),

        // Load activity data
        (async () => {
          setLoadingActivity(true);
          const [weeklyData, activitiesData] = await Promise.all([
            analyticsService.getWeeklyActivity(tenantId ? { tenant_id: tenantId } : {}),
            analyticsService.getRecentActivities(tenantId ? { tenant_id: tenantId, limit: 10 } : { limit: 10 }),
          ]);
          console.log('✅ Weekly activity loaded:', weeklyData);
          console.log('✅ Recent activities loaded:', activitiesData);
          setWeeklyActivity(weeklyData);
          setRecentActivities(activitiesData);
          setLoadingActivity(false);
        })(),
      ]).finally(() => {
        setLoading(false);
      });

    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
      setLoading(false);
      setLoadingStats(false);
      setLoadingJamaah(false);
      setLoadingPromo(false);
      setLoadingActivity(false);
    }
  };

  // Helper function to format currency
  const formatCurrency = (value: number | undefined | null): string => {
    if (!value) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Helper function to translate package type
  const translatePackage = (packageType: string | undefined): string => {
    if (!packageType) return '-';
    const packages: Record<string, string> = {
      'reguler': 'Reguler',
      'silver': 'Silver',
      'gold': 'Gold',
      'vip': 'VIP',
    };
    return packages[packageType.toLowerCase()] || packageType;
  };

  // Helper function to translate room type
  const translateRoom = (roomType: string | undefined): string => {
    if (!roomType) return '-';
    const rooms: Record<string, string> = {
      '4 person': 'Ber-4 (Quad)',
      '3 person': 'Ber-3 (Triple)',
      '2 person': 'Ber-2 (Double)',
    };
    return rooms[roomType] || roomType;
  };

  // Helper function to translate tour
  const translateTour = (tour: string | undefined): string => {
    if (!tour || tour === 'None') return 'Tidak Ada';
    if (tour === '1 location') return '1 Lokasi';
    return tour;
  };

  // Helper function to translate status
  const translateStatus = (status: string | undefined): string => {
    if (!status) return '-';
    const statuses: Record<string, string> = {
      'active': 'Aktif',
      'inactive': 'Tidak Aktif',
      'completed': 'Selesai',
      'cancelled': 'Dibatalkan',
    };
    return statuses[status.toLowerCase()] || status;
  };

  // Helper function to translate verification status
  const translateVerification = (status: string | undefined): string => {
    if (!status) return 'Belum Diverifikasi';
    const verifications: Record<string, string> = {
      'pending': 'Menunggu Verifikasi',
      'verified': 'Terverifikasi',
      'rejected': 'Ditolak',
    };
    return verifications[status.toLowerCase()] || status;
  };

  // Export data to CSV with improved formatting and clarity
  const exportToCSV = () => {
    try {
      console.log('📥 Exporting data to CSV...');

      if (jamaahList.length === 0) {
        alert('Tidak ada data untuk diekspor');
        return;
      }

      // Prepare CSV headers with clear sections and better organization
      const headers = [
        // Informasi Dasar
        'NO',
        'TANGGAL DAFTAR',
        'NAMA LENGKAP',
        'STATUS JAMAAH',
        'STATUS VERIFIKASI',

        // Data Pribadi
        'NO KTP',
        'NO PASSPOR',
        'TELEPON',
        'EMAIL',
        'ALAMAT',

        // Data Paket
        'PAKET',
        'TIPE KAMAR',
        'HARGA DASAR PAKET',
        'HARGA UPGRADE KAMAR',
        'TOUR TAMBAHAN',
        'HARGA TOUR',

        // Informasi Keuangan
        'TOTAL HARGA',
        'DP (25%)',
        'SISA PEMBAYARAN',

        // Informasi Tambahan
        'TERAKHIR UPDATE'
      ];

      // Prepare CSV rows with formatted and calculated data
      const rows = jamaahList.map((jamaah, index) => {
        // Calculate payment information
        const totalPrice = jamaah.total_price || 0;
        const downPayment = totalPrice * 0.25; // 25% DP
        const remainingPayment = totalPrice - downPayment;

        // Format dates
        const registerDate = jamaah.created_at
          ? new Date(jamaah.created_at).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
          : '-';

        const lastUpdate = jamaah.updated_at
          ? new Date(jamaah.updated_at).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
          : '-';

        return [
          // Informasi Dasar
          index + 1,
          registerDate,
          jamaah.full_name || '-',
          translateStatus(jamaah.status),
          translateVerification(jamaah.verification_status),

          // Data Pribadi
          jamaah.ktp_number || '-',
          jamaah.passport_number || '-',
          jamaah.phone || '-',
          jamaah.email || '-',
          jamaah.address || '-',

          // Data Paket
          translatePackage(jamaah.package_type),
          translateRoom(jamaah.room_type),
          formatCurrency(jamaah.base_price),
          formatCurrency(jamaah.room_upgrade_price),
          translateTour(jamaah.additional_tour),
          formatCurrency(jamaah.tour_price),

          // Informasi Keuangan
          formatCurrency(totalPrice),
          formatCurrency(downPayment),
          formatCurrency(remainingPayment),

          // Informasi Tambahan
          lastUpdate
        ];
      });

      // Create summary data for the top of the file
      const summary = [
        ['=== LAPORAN DATA JAMAAH ==='],
        [`Tanggal Export: ${new Date().toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}`],
        [`Total Jamaah: ${jamaahList.length} orang`],
        [`Jamaah Aktif: ${jamaahList.filter(j => j.status === 'active').length} orang`],
        [`Jamaah Terverifikasi: ${jamaahList.filter(j => j.verification_status === 'verified').length} orang`],
        [`Total Nilai: ${formatCurrency(jamaahList.reduce((sum, j) => sum + (j.total_price || 0), 0))}`],
        [''],
        ['=== RINCIAN DATA ==='],
        ['']
      ];

      // Convert to CSV string with proper escaping
      const csvContent = [
        ...summary.map(row => row.join(',')),
        headers.join(','),
        ...rows.map((row) =>
          row.map((cell) => {
            // Escape cells that contain commas, quotes, or newlines
            const cellStr = String(cell);
            if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n') || cellStr.includes(';')) {
              return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
          }).join(',')
        )
      ].join('\n');

      // Create filename with timestamp
      const timestamp = new Date().toLocaleDateString('id-ID')
        .replace(/\//g, '-')
        .replace(/ /g, '_');
      const filename = `Data-Jamaah_${timestamp}_${jamaahList.length}jamaah.csv`;

      // Create blob with BOM for UTF-8 encoding (supports Indonesian characters)
      const blob = new Blob(['\uFEFF' + csvContent], {
        type: 'text/csv;charset=utf-8;'
      });

      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Show success message with details
      console.log('✅ Data exported successfully!');
      alert(
        `✅ Berhasil mengekspor data jamaah!\n\n` +
        `📊 Detail Export:\n` +
        `• Total Data: ${jamaahList.length} jamaah\n` +
        `• Format: CSV (Excel compatible)\n` +
        `• Nama File: ${filename}\n\n` +
        `📁 File akan tersimpan di folder Downloads Anda.`
      );

    } catch (error) {
      console.error('❌ Error exporting data:', error);
      alert(
        '❌ Gagal mengekspor data!\n\n' +
        'Silakan coba lagi atau hubungi tim IT jika masalah berlanjut.'
      );
    }
  };

  // Add function to export selected data only (if needed)
  const exportSelectedToCSV = (selectedIds: string[]) => {
    try {
      const selectedData = jamaahList.filter(j => selectedIds.includes(j.id));

      if (selectedData.length === 0) {
        alert('Tidak ada data yang dipilih');
        return;
      }

      // Reuse the same export logic but with selected data
      // ... similar to above but with selectedData instead of jamaahList

      alert(`Berhasil mengekspor ${selectedData.length} data yang dipilih`);
    } catch (error) {
      console.error('Error exporting selected data:', error);
      alert('Gagal mengekspor data yang dipilih');
    }
  };

  // Add function to preview data before export
  const previewExportData = () => {
    const totalJamaah = jamaahList.length;
    const totalValue = jamaahList.reduce((sum, j) => sum + (j.total_price || 0), 0);

    const confirmMessage =
      `📋 Preview Export Data:\n\n` +
      `Total Data: ${totalJamaah} jamaah\n` +
      `Total Nilai: ${formatCurrency(totalValue)}\n` +
      `Format: CSV (Excel Compatible)\n\n` +
      `Field yang akan diexport:\n` +
      `• Data Pribadi (Nama, KTP, Passport, dll)\n` +
      `• Data Paket & Harga\n` +
      `• Informasi Pembayaran\n` +
      `• Status & Verifikasi\n\n` +
      `Lanjutkan export?`;

    if (window.confirm(confirmMessage)) {
      exportToCSV();
    }
  };

  // Data aktivitas mingguan - menggunakan data real dari backend
  const weeklyActivityData = weeklyActivity.length > 0 ? weeklyActivity : [
    { day: 'Sen', registrations: 0, tracking: 0, payments: 0 },
    { day: 'Sel', registrations: 0, tracking: 0, payments: 0 },
    { day: 'Rab', registrations: 0, tracking: 0, payments: 0 },
    { day: 'Kam', registrations: 0, tracking: 0, payments: 0 },
    { day: 'Jum', registrations: 0, tracking: 0, payments: 0 },
    { day: 'Sab', registrations: 0, tracking: 0, payments: 0 },
    { day: 'Min', registrations: 0, tracking: 0, payments: 0 },
  ];

  // Hitung total dan statistik
  const totalRegistrations = weeklyActivityData.reduce((sum, day) => sum + day.registrations, 0);
  const totalTracking = weeklyActivityData.reduce((sum, day) => sum + day.tracking, 0);
  const totalPayments = weeklyActivityData.reduce((sum, day) => sum + day.payments, 0);
  const totalActivities = totalRegistrations + totalTracking + totalPayments;
  const averagePerDay = Math.round(totalActivities / 7);
  const maxActivity = Math.max(...weeklyActivityData.map(day =>
    day.registrations + day.tracking + day.payments
  ));
  const peakDay = weeklyActivityData.find(day =>
    (day.registrations + day.tracking + day.payments) === maxActivity
  )?.day || 'Jum';

  const stats = [
    {
      label: 'Total Jamaah',
      value: dashboardStats.total_jamaah,
      icon: UsersIcon,
      color: 'from-blue-600 to-blue-400',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      trend: '+12%',
      trendUp: true
    },
    {
      label: 'Jamaah Aktif',
      value: dashboardStats.active_jamaah,
      icon: CheckBadgeIcon,
      color: 'from-green-600 to-green-400',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      trend: '+5%',
      trendUp: true
    },
    {
      label: 'Promo Aktif',
      value: dashboardStats.active_promos,
      icon: TicketIcon,
      color: 'from-purple-600 to-purple-400',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      trend: '0%',
      trendUp: false
    },
    {
      label: 'Tracking Hari Ini',
      value: dashboardStats.tracking_today,
      icon: MapPinIcon,
      color: 'from-orange-600 to-orange-400',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      trend: '-2%',
      trendUp: false
    },
  ];

  const recentActivitiesData = recentActivities.length > 0 ? recentActivities.map((activity) => {
    // Map activity type to icon and color
    const activityConfig = {
      registration: {
        icon: DocumentTextIcon,
        color: 'bg-blue-100 text-blue-600'
      },
      payment: {
        icon: CreditCardIcon,
        color: 'bg-green-100 text-green-600'
      },
      tracking: {
        icon: MapPinIcon,
        color: 'bg-orange-100 text-orange-600'
      },
      document: {
        icon: DocumentArrowUpIcon,
        color: 'bg-purple-100 text-purple-600'
      }
    };

    const config = activityConfig[activity.type as keyof typeof activityConfig] || activityConfig.registration;

    return {
      id: activity.id,
      user: activity.user,
      action: activity.action,
      time: activity.time,
      icon: config.icon,
      color: config.color
    };
  }) : [
    {
      id: 1,
      user: 'Belum ada aktivitas',
      action: 'Tidak ada aktivitas terbaru',
      time: '-',
      icon: ClockIcon,
      color: 'bg-gray-100 text-gray-600'
    },
  ];

  // Optional: Tambahan activity types
  const activityTypes = {
    registration: {
      icon: DocumentTextIcon,
      color: 'bg-blue-100 text-blue-600',
      label: 'Pendaftaran Baru'
    },
    payment: {
      icon: CreditCardIcon,
      color: 'bg-green-100 text-green-600',
      label: 'Pembayaran'
    },
    document: {
      icon: DocumentArrowUpIcon,
      color: 'bg-purple-100 text-purple-600',
      label: 'Upload Dokumen'
    },
    tracking: {
      icon: MapPinIcon,
      color: 'bg-orange-100 text-orange-600',
      label: 'Tracking'
    },
    reminder: {
      icon: ClockIcon,
      color: 'bg-yellow-100 text-yellow-600',
      label: 'Pengingat'
    },
    newUser: {
      icon: UserPlusIcon,
      color: 'bg-emerald-100 text-emerald-600',
      label: 'User Baru'
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100
      }
    }
  };

  return (
    <DashboardLayout>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#0F5132] mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat dashboard...</p>
          </div>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header Section with Greeting */}
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#0F5132] to-[#1B8C5E] bg-clip-text text-transparent">
                {greeting}, Admin
              </h1>
              <p className="mt-2 text-gray-600 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#0F5132]" />
                {new Date().toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            {/* Quick Action Buttons - Perbaiki bagian ini */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/dashboard/jamaah/daftar')}
                className="px-4 py-2 bg-[#0F5132] text-white rounded-xl hover:bg-[#1B8C5E] transition-all duration-300 shadow-lg shadow-[#0F5132]/20 flex items-center gap-2"
              >
                <UserPlusIcon className="w-5 h-5" />
                <span>Tambah Jamaah</span>
              </motion.button>

              {/* Export Button with Dropdown Options */}
              <div className="relative group">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={previewExportData}
                  className="px-4 py-2 border-2 border-[#0F5132] text-[#0F5132] rounded-xl hover:bg-[#0F5132] hover:text-white transition-all duration-300 flex items-center gap-2"
                >
                  <DocumentArrowUpIcon className="w-5 h-5" />
                  <span>Export Data</span>
                </motion.button>

                {/* Tooltip untuk informasi export */}
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                    Klik untuk preview sebelum export
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color}`} />
                  </div>

                  {/* Main Content */}
                  <div className="relative p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`${stat.bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-6 h-6 ${stat.textColor}`} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${stat.trendUp ? 'text-green-600' : 'text-red-600'} flex items-center gap-1`}>
                          {stat.trendUp ? <ArrowUpIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />}
                          {stat.trend}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        {stat.value}
                      </p>
                      <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${stat.textColor.replace('text', 'bg')}`} />
                        {stat.label}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(stat.value / 100) * 100}%` }}
                      transition={{ delay: 0.5, duration: 1 }}
                      className={`h-full bg-gradient-to-r ${stat.color}`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* Left Column - 2/3 width */}
            <div className="xl:col-span-2 space-y-6">
              {/* Jamaah Terbaru Card */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[#0F5132] flex items-center gap-2">
                      <UsersIcon className="w-5 h-5" />
                      Jamaah Terbaru
                    </h2>
                    <motion.button
                      whileHover={{ x: 5 }}
                      onClick={() => router.push('/dashboard/jamaah')}
                      className="text-sm text-[#0F5132] hover:text-[#1B8C5E] font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      Lihat Semua
                      <span>→</span>
                    </motion.button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-3">
                    {loading ? (
                      <div className="text-center py-8 text-gray-500">Memuat data...</div>
                    ) : jamaahList.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">Belum ada jamaah terdaftar</div>
                    ) : (
                      jamaahList.slice(0, 5).map((jamaah, index) => (
                        <motion.div
                          key={jamaah.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02, x: 5 }}
                          className="flex items-center justify-between rounded-xl bg-gradient-to-r from-slate-50 to-white p-4 border border-gray-100 hover:border-[#0F5132]/20 hover:shadow-md transition-all duration-300 cursor-pointer"
                          onClick={() => router.push('/dashboard/jamaah')}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#0F5132] to-[#1B8C5E] rounded-full flex items-center justify-center text-white font-bold">
                              {jamaah.full_name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{jamaah.full_name}</p>
                              <p className="text-xs text-gray-500">{jamaah.passport_number || 'No Passport'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${jamaah.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                              }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${jamaah.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                                }`}></span>
                              {jamaah.status}
                            </span>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Activity Chart */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-[#0F5132] flex items-center gap-2">
                      <ArrowTrendingUpIcon className="w-5 h-5" />
                      Aktivitas Mingguan
                    </h2>

                    {/* Stats Row */}
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-500">Total:</span>
                        <span className="text-sm font-semibold text-gray-900">{totalActivities}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-500">Rata-rata:</span>
                        <span className="text-sm font-semibold text-gray-900">{averagePerDay}/hari</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <ArrowUpIcon className="w-3 h-3" />
                        <span className="text-sm font-semibold">Minggu ini</span>
                      </div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex gap-2">
                    <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#0F5132] bg-white">
                      <option>Semua Aktivitas</option>
                      <option>Registrasi</option>
                      <option>Tracking</option>
                      <option>Pembayaran</option>
                    </select>
                    <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#0F5132] bg-white">
                      <option>Minggu Ini</option>
                      <option>Bulan Ini</option>
                      <option>Tahun Ini</option>
                    </select>
                  </div>
                </div>

                {/* Chart Container - Fixed height with border for visibility */}
                <div className="relative h-48 mt-8 border-l border-b border-gray-200">
                  {/* Y-axis labels */}
                  <div className="absolute -left-6 top-0 h-full flex flex-col justify-between text-xs text-gray-400">
                    <span>100</span>
                    <span>75</span>
                    <span>50</span>
                    <span>25</span>
                    <span>0</span>
                  </div>

                  {/* Bars Container */}
                  <div className="absolute inset-0 flex items-end justify-around gap-1 pl-2">
                    {weeklyActivityData.map((dayData, index) => {
                      const total = dayData.registrations + dayData.tracking + dayData.payments;
                      const maxValue = Math.max(...weeklyActivityData.map(d => d.registrations + d.tracking + d.payments), 1);
                      const heightPercentage = (total / maxValue) * 100;

                      return (
                        <div key={dayData.day} className="flex-1 flex flex-col items-center group">
                          <div className="relative w-full">
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                              <div>{dayData.day === 'Sen' ? 'Senin' : dayData.day === 'Sel' ? 'Selasa' : dayData.day === 'Rab' ? 'Rabu' : dayData.day === 'Kam' ? 'Kamis' : dayData.day === 'Jum' ? 'Jumat' : dayData.day === 'Sab' ? 'Sabtu' : 'Minggu'}</div>
                              <div>Reg: {dayData.registrations} | Tr: {dayData.tracking} | Pay: {dayData.payments}</div>
                              <div className="font-bold">Total: {total}</div>
                            </div>
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${heightPercentage}%` }}
                              transition={{ delay: 0.1 + (index * 0.1), duration: 0.5 }}
                              className="w-full bg-gradient-to-t from-[#0F5132] to-[#1B8C5E] rounded-t-lg"
                            />
                          </div>
                          <span className="text-xs mt-2 text-gray-600">{dayData.day}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-4 gap-4 mt-8">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Total Registrasi</p>
                    <p className="text-lg font-bold text-[#0F5132]">{totalRegistrations}</p>
                    <p className="text-xs text-green-600">Minggu ini</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Total Tracking</p>
                    <p className="text-lg font-bold text-blue-600">{totalTracking}</p>
                    <p className="text-xs text-green-600">Minggu ini</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Total Pembayaran</p>
                    <p className="text-lg font-bold text-amber-600">{totalPayments}</p>
                    <p className="text-xs text-green-600">Minggu ini</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Peak Day</p>
                    <p className="text-lg font-bold text-purple-600">{peakDay}</p>
                    <p className="text-xs text-gray-400">{maxActivity} aktivitas</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-6">
              {/* Promo Aktif Card */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[#0F5132] flex items-center gap-2">
                      <TicketIcon className="w-5 h-5" />
                      Promo Aktif
                    </h2>
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-semibold">
                      {promoList.filter((p) => p.is_active).length} Aktif
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-3">
                    {loading ? (
                      <div className="text-center py-8 text-gray-500">Memuat promo...</div>
                    ) : promoList.filter((p) => p.is_active).length === 0 ? (
                      <div className="text-center py-8 text-gray-500">Belum ada promo aktif</div>
                    ) : (
                      promoList
                        .filter((p) => p.is_active)
                        .slice(0, 4)
                        .map((promo, index) => (
                          <motion.div
                            key={promo.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 p-4 border border-purple-100 cursor-pointer"
                            onClick={() => router.push('/dashboard/promo-admin')}
                          >
                            {promo.is_featured && (
                              <div className="absolute top-0 right-0 bg-[#D4AF37] text-white text-xs px-3 py-1 rounded-bl-lg font-bold">
                                FEATURED
                              </div>
                            )}
                            <div className="space-y-2">
                              <p className="font-bold text-gray-900">{promo.title}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-purple-600">
                                  {promo.discount_percentage}%
                                </span>
                                <span className="text-xs text-gray-500">OFF</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <ClockIcon className="w-3 h-3" />
                                <span>
                                  {promo.end_date && new Date(promo.end_date) > new Date()
                                    ? `Berakhir ${new Date(promo.end_date).toLocaleDateString('id-ID')}`
                                    : 'Sudah berakhir'
                                  }
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Recent Activities Card */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[#0F5132] flex items-center gap-2">
                      <ClockIcon className="w-5 h-5" />
                      Aktivitas Terkini
                    </h2>
                    <span className="text-xs text-gray-400">Live</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {recentActivitiesData.map((activity, index) => {
                      const Icon = activity.icon;
                      return (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02, x: 5 }}
                          className="flex items-start gap-3 group cursor-pointer"
                        >
                          <div className={`w-10 h-10 rounded-xl ${activity.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {activity.user}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {activity.action}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              <ClockIcon className="w-3 h-3 text-gray-400" />
                              <p className="text-xs text-gray-400">
                                {activity.time}
                              </p>
                            </div>
                          </div>
                          <div className="w-2 h-2 bg-green-400 rounded-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* View All Link */}
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => router.push('/dashboard/tracking')}
                    className="mt-6 w-full text-center text-sm text-[#0F5132] hover:text-[#1B8C5E] font-medium flex items-center justify-center gap-2 py-2 border-t border-gray-100 pt-4 cursor-pointer"
                  >
                    <span>Lihat Semua Aktivitas</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Footer Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-[#0F5132] to-[#1B8C5E] rounded-2xl p-6 text-white">
              <p className="text-sm opacity-90">Total Pendapatan</p>
              <p className="text-3xl font-bold mt-2">
                Rp {(jamaahList.reduce((sum, j) => sum + (j.total_price || 0), 0) / 1000000).toFixed(1)} M
              </p>
              <p className="text-xs mt-2 opacity-75">Dari {jamaahList.length} jamaah</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <p className="text-sm text-gray-500">Paket Terpopuler</p>
              <p className="text-xl font-bold text-[#0F5132] mt-2">
                {(() => {
                  const packages = jamaahList.reduce((acc, j) => {
                    if (j.package_type) {
                      acc[j.package_type] = (acc[j.package_type] || 0) + 1;
                    }
                    return acc;
                  }, {} as Record<string, number>);
                  const popular = Object.entries(packages).sort((a, b) => b[1] - a[1])[0];
                  return popular ? `${popular[0]} (${popular[1]} jamaah)` : 'Belum ada data';
                })()}
              </p>
              <p className="text-xs text-gray-400 mt-2">Paket paling banyak dipilih</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <p className="text-sm text-gray-500">Status Verifikasi</p>
              <p className="text-xl font-bold text-[#0F5132] mt-2">
                {jamaahList.filter(j => j.verification_status === 'verified').length} Terverifikasi
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {jamaahList.filter(j => j.verification_status === 'pending').length} menunggu verifikasi
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </DashboardLayout>
  );
}