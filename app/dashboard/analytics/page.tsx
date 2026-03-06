'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { analyticsService } from '@/services/analytics.service';
import { promoService } from '@/services/promo.service';
import { jamaahService } from '@/services/jamaah.service';
import { motion } from 'framer-motion';
import {
  BuildingOfficeIcon,
  UsersIcon,
  TicketIcon,
  MapPinIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  CircleStackIcon,
  EyeIcon,
  CursorArrowRaysIcon,
  PercentBadgeIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Data untuk pertumbuhan jamaah (6 bulan terakhir)
const growthData = [
  { month: 'Sep', jamaah: 45, tenant: 12 },
  { month: 'Okt', jamaah: 52, tenant: 15 },
  { month: 'Nov', jamaah: 61, tenant: 18 },
  { month: 'Des', jamaah: 78, tenant: 22 },
  { month: 'Jan', jamaah: 85, tenant: 25 },
  { month: 'Feb', jamaah: 97, tenant: 28 },
];

// Data untuk distribusi tenant
const tenantDistribution = [
  { name: 'Travel Umroh', value: 45, color: '#0F5132' },
  { name: 'Hotel', value: 25, color: '#1B8C5E' },
  { name: 'Transportasi', value: 15, color: '#2BAF72' },
  { name: 'Katering', value: 10, color: '#4ECB8D' },
  { name: 'Lainnya', value: 5, color: '#7FE0A8' },
];

// Data untuk daily activity
const dailyActivity = [
  { day: 'Sen', visits: 65, registrations: 12 },
  { day: 'Sel', visits: 72, registrations: 15 },
  { day: 'Rab', visits: 58, registrations: 10 },
  { day: 'Kam', visits: 84, registrations: 18 },
  { day: 'Jum', visits: 91, registrations: 22 },
  { day: 'Sab', visits: 77, registrations: 16 },
  { day: 'Min', visits: 63, registrations: 13 },
];

// Helper function untuk format currency yang konsisten
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('Rp', 'Rp ').trim();
};

// Helper function untuk format number yang konsisten
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('id-ID').format(num);
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedChart, setSelectedChart] = useState('line');
  const [isClient, setIsClient] = useState(false);
  const [stats, setStats] = useState({
    total_tenants: 0,
    total_jamaah: 0,
    total_promos: 0,
    total_tracking_logs: 0,
  });
  const [loading, setLoading] = useState(true);

  // Load analytics data
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await analyticsService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  // Data untuk performa promo (dibuat di dalam komponen)
  const [perfRows, setPerfRows] = useState<any[]>([]);

  useEffect(() => {
    const loadPromos = async () => {
      try {
        const promos = await promoService.getAll();
        const rows = promos.map((promo, index) => {
          const baseViews = 650 + (index + 1) * 137;
          const clicks = Math.floor(baseViews * (0.28 + index * 0.03));
          const conversion = ((clicks / baseViews) * 100).toFixed(1);
          return {
            id: promo.id,
            title: promo.title,
            views: baseViews,
            clicks,
            conversion,
            revenue: baseViews * 15000
          };
        });
        setPerfRows(rows);
      } catch (error) {
        console.error('Failed to load promos:', error);
      }
    };
    loadPromos();
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const statsCards = [
    {
      label: 'Total Tenant',
      value: stats.total_tenants,
      icon: BuildingOfficeIcon,
      color: 'from-blue-600 to-blue-400',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      change: '+12%',
      trend: 'up'
    },
    {
      label: 'Total Jamaah',
      value: stats.total_jamaah,
      icon: UsersIcon,
      color: 'from-green-600 to-green-400',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      change: '+23%',
      trend: 'up'
    },
    {
      label: 'Promo Aktif',
      value: stats.total_promos,
      icon: TicketIcon,
      color: 'from-purple-600 to-purple-400',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      change: '+5%',
      trend: 'up'
    },
    {
      label: 'Tracking Hari Ini',
      value: stats.total_tracking_logs,
      icon: MapPinIcon,
      color: 'from-orange-600 to-orange-400',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      change: '-2%',
      trend: 'down'
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Render versi statis untuk server
  if (!isClient || loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0F5132] to-[#1B8C5E] bg-clip-text text-transparent flex items-center gap-2">
                <ChartBarIcon className="w-8 h-8 text-[#0F5132]" />
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Ringkasan performa tenant, jamaah, dan kampanye promo
              </p>
            </div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-xl p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0F5132] to-[#1B8C5E] bg-clip-text text-transparent flex items-center gap-2">
              <ChartBarIcon className="w-8 h-8 text-[#0F5132]" />
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Ringkasan performa tenant, jamaah, dan kampanye promo
            </p>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-gray-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] bg-white"
            >
              <option value="7days">7 Hari Terakhir</option>
              <option value="30days">30 Hari Terakhir</option>
              <option value="6months">6 Bulan Terakhir</option>
              <option value="1year">1 Tahun Terakhir</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="relative bg-white rounded-2xl shadow-xl p-6 overflow-hidden group"
              >
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br ${stat.color}`} />

                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-xs mt-2 flex items-center gap-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {stat.trend === 'up' ? '↑' : '↓'} {stat.change}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.random() * 100}%` }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className={`h-full bg-gradient-to-r ${stat.color}`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Growth Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#0F5132] flex items-center gap-2">
                <ArrowTrendingUpIcon className="w-5 h-5" />
                Pertumbuhan Jamaah
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedChart('line')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${selectedChart === 'line'
                    ? 'bg-[#0F5132] text-white shadow-md shadow-[#0F5132]/30'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  Line Chart
                </button>
                <button
                  onClick={() => setSelectedChart('area')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${selectedChart === 'area'
                    ? 'bg-[#0F5132] text-white shadow-md shadow-[#0F5132]/30'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  Area Chart
                </button>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              {selectedChart === 'line' ? (
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="jamaah"
                    stroke="#0F5132"
                    strokeWidth={3}
                    dot={{ fill: '#0F5132', r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="tenant"
                    stroke="#1B8C5E"
                    strokeWidth={3}
                    dot={{ fill: '#1B8C5E', r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              ) : (
                <AreaChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="jamaah"
                    stroke="#0F5132"
                    fill="#0F5132"
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    dataKey="tenant"
                    stroke="#1B8C5E"
                    fill="#1B8C5E"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </motion.div>

          {/* Distribution Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <h2 className="text-xl font-bold text-[#0F5132] flex items-center gap-2 mb-6">
              <CircleStackIcon className="w-5 h-5" />
              Distribusi Tenant
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tenantDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {tenantDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Daily Activity Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-6 lg:col-span-2"
          >
            <h2 className="text-xl font-bold text-[#0F5132] flex items-center gap-2 mb-6">
              <ChartBarIcon className="w-5 h-5" />
              Aktivitas Harian
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="visits" fill="#0F5132" radius={[4, 4, 0, 0]} />
                <Bar dataKey="registrations" fill="#1B8C5E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Promo Performance Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#0F5132] flex items-center gap-2">
                <TicketIcon className="w-5 h-5" />
                Performa Promo
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                    Views
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    Clicks
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Promo</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <EyeIcon className="w-4 h-4" />
                      Views
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <CursorArrowRaysIcon className="w-4 h-4" />
                      Clicks
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">CTR</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <PercentBadgeIcon className="w-4 h-4" />
                      Conversion
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {perfRows.map((promo, index) => {
                  const ctr = ((promo.clicks / promo.views) * 100).toFixed(1);
                  return (
                    <motion.tr
                      key={promo.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ backgroundColor: '#f9fafb' }}
                      className="transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-[#0F5132]">{promo.title}</p>
                          <p className="text-xs text-gray-400">ID: {promo.id}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500"
                              style={{ width: `${(promo.views / 1500) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{formatNumber(promo.views)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500"
                              style={{ width: `${(promo.clicks / 500) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{formatNumber(promo.clicks)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-blue-600">{ctr}%</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                          {promo.conversion}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-[#0F5132]">
                          {formatCurrency(promo.revenue)}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Total {perfRows.length} promo aktif</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <EyeIcon className="w-4 h-4" />
                  Total Views: {formatNumber(perfRows.reduce((acc, p) => acc + p.views, 0))}
                </span>
                <span className="flex items-center gap-1">
                  <CursorArrowRaysIcon className="w-4 h-4" />
                  Total Clicks: {formatNumber(perfRows.reduce((acc, p) => acc + p.clicks, 0))}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-gradient-to-br from-[#0F5132] to-[#1B8C5E] rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-xl">
                <ArrowTrendingUpIcon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold">Growth Rate</h3>
            </div>
            <p className="text-3xl font-bold">+23.5%</p>
            <p className="text-sm text-white/80 mt-2">Dibanding bulan lalu</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-xl">
                <UsersIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Konversi</h3>
            </div>
            <p className="text-3xl font-bold text-[#0F5132]">15.8%</p>
            <p className="text-sm text-gray-400 mt-2">Rata-rata konversi promo</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-xl">
                <TicketIcon className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">ROI</h3>
            </div>
            <p className="text-3xl font-bold text-[#0F5132]">285%</p>
            <p className="text-sm text-gray-400 mt-2">Return on investment</p>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}