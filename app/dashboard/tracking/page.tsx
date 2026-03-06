'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { jamaahService } from '@/services/jamaah.service';
import { trackingService } from '@/services/tracking.service';
import { SPIRITUAL_LOCATIONS } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { io, Socket } from 'socket.io-client';
import {
  MapPinIcon,
  UserGroupIcon,
  BuildingLibraryIcon,
  ClockIcon,
  ArrowPathIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  SignalIcon,
  GlobeAltIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  Battery100Icon,
  WifiIcon
} from '@heroicons/react/24/outline';

// Dynamic import untuk Leaflet (karena perlu window object)
const MapWithNoSSR = dynamic(
  () => import('../../components/MapComponent'),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#0F5132]/5 to-[#1B5E20]/5">
        <div className="text-center px-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F5132] mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat peta...</p>
        </div>
      </div>
    )
  }
);

interface TrackingData {
  jamaah_id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: string;
  last_update: string;
  location_name?: string;
  accuracy?: number;
  battery?: number;
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';

// Data statis untuk server render
const staticInitialTracking: TrackingData[] = [];

export default function TrackingPage() {
  const [trackingData, setTrackingData] = useState<TrackingData[]>(staticInitialTracking);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('all');
  const [selectedJamaah, setSelectedJamaah] = useState<TrackingData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClient, setIsClient] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(true);

  // Load jamaah and tracking data from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        const [jamaahData, trackingLogs] = await Promise.all([
          jamaahService.getAll(),
          trackingService.getAll()
        ]);

        // Create tracking data from jamaah and latest tracking logs
        const tracking = jamaahData.map((j) => {
          const latestLog = trackingLogs.find(log => log.jamaah_id === j.id);
          return {
            jamaah_id: j.id,
            name: j.full_name,
            latitude: latestLog?.latitude || SPIRITUAL_LOCATIONS.MASJID_AL_HARAM.lat + (Math.random() - 0.5) * 0.1,
            longitude: latestLog?.longitude || SPIRITUAL_LOCATIONS.MASJID_AL_HARAM.lng + (Math.random() - 0.5) * 0.1,
            status: latestLog?.status || 'active',
            last_update: latestLog?.created_at || new Date().toISOString(),
            accuracy: Math.floor(Math.random() * 20) + 5,
            battery: Math.floor(Math.random() * 100),
          };
        });

        setTrackingData(tracking);
      } catch (error) {
        console.error('Failed to load tracking data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Setup WebSocket connection
  useEffect(() => {
    setIsClient(true);

    const newSocket = io(WS_URL);

    newSocket.on('connect', () => {
      console.log('WebSocket connected');
      // Join tenant room (use tenant_id from localStorage or default)
      const tenantId = localStorage.getItem('tenant_id') || 'tenant-1';
      newSocket.emit('join', { tenant_id: tenantId });
    });

    newSocket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    newSocket.on('tracking_update', (data) => {
      console.log('Tracking update received:', data);
      setTrackingData((prev) => {
        const index = prev.findIndex(t => t.jamaah_id === data.jamaah_id);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            latitude: data.latitude,
            longitude: data.longitude,
            status: data.status,
            last_update: new Date().toISOString(),
          };
          return updated;
        }
        return prev;
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Simulate location updates (for demo purposes)
  useEffect(() => {
    if (!isClient) return;

    const interval = setInterval(() => {
      setTrackingData((prev) =>
        prev.map((t) => ({
          ...t,
          latitude: t.latitude + (Math.random() - 0.5) * 0.001,
          longitude: t.longitude + (Math.random() - 0.5) * 0.001,
          last_update: new Date().toISOString(),
          accuracy: Math.floor(Math.random() * 20) + 5,
          battery: Math.max(0, Math.min(100, (t.battery || 100) - Math.random() * 2)),
        })),
      );
      setCurrentTime(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, [isClient]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const jamaahDiMakkah = trackingData.filter(
    (t) => Math.abs(t.latitude - SPIRITUAL_LOCATIONS.MASJID_AL_HARAM.lat) < 0.1
  ).length;

  const jamaahDiMadinah = trackingData.filter(
    (t) => Math.abs(t.latitude - SPIRITUAL_LOCATIONS.MASJID_AL_NABAWI.lat) < 0.1
  ).length;

  const filteredData = trackingData.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterLocation === 'all' ||
      (filterLocation === 'makkah' && Math.abs(t.latitude - SPIRITUAL_LOCATIONS.MASJID_AL_HARAM.lat) < 0.1) ||
      (filterLocation === 'madinah' && Math.abs(t.latitude - SPIRITUAL_LOCATIONS.MASJID_AL_NABAWI.lat) < 0.1))
  );

  const stats = [
    {
      label: 'Jamaah Aktif',
      value: trackingData.length,
      icon: UserGroupIcon,
      color: 'from-blue-600 to-blue-400',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      change: '+5 hari ini'
    },
    {
      label: 'Di Makkah',
      value: jamaahDiMakkah,
      icon: BuildingLibraryIcon,
      color: 'from-emerald-600 to-emerald-400',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      change: `${Math.round((jamaahDiMakkah / trackingData.length) * 100)}% dari total`
    },
    {
      label: 'Di Madinah',
      value: jamaahDiMadinah,
      icon: GlobeAltIcon,
      color: 'from-purple-600 to-purple-400',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      change: `${Math.round((jamaahDiMadinah / trackingData.length) * 100)}% dari total`
    },
  ];

  // Mobile Stats Summary
  const MobileStatsSummary = () => (
    <div className="grid grid-cols-3 gap-2 md:hidden mb-4">
      <div className="bg-white rounded-xl p-3 text-center shadow-sm">
        <p className="text-xs text-gray-500">Total</p>
        <p className="text-lg font-bold text-[#0F5132]">{trackingData.length}</p>
      </div>
      <div className="bg-white rounded-xl p-3 text-center shadow-sm">
        <p className="text-xs text-gray-500">Makkah</p>
        <p className="text-lg font-bold text-emerald-600">{jamaahDiMakkah}</p>
      </div>
      <div className="bg-white rounded-xl p-3 text-center shadow-sm">
        <p className="text-xs text-gray-500">Madinah</p>
        <p className="text-lg font-bold text-purple-600">{jamaahDiMadinah}</p>
      </div>
    </div>
  );

  // Mobile Filter Modal
  const MobileFilterModal = () => (
    <AnimatePresence>
      {showMobileFilters && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 md:hidden"
          onClick={() => setShowMobileFilters(false)}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Filter & Search</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Cari Jamaah</label>
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Nama jamaah..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132]"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Lokasi</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'all', label: 'Semua', color: 'gray' },
                  { value: 'makkah', label: 'Makkah', color: 'emerald' },
                  { value: 'madinah', label: 'Madinah', color: 'purple' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFilterLocation(option.value)}
                    className={`py-2 px-3 rounded-xl text-sm font-medium transition-colors ${filterLocation === option.value
                      ? `bg-${option.color}-100 text-${option.color}-700 border-2 border-${option.color}-200`
                      : 'bg-gray-50 text-gray-700 border border-gray-200'
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-full py-3 bg-[#0F5132] text-white rounded-xl font-semibold"
            >
              Terapkan Filter
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Mobile Detail Modal
  const MobileDetailModal = () => (
    <AnimatePresence>
      {selectedJamaah && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-end md:hidden"
          onClick={() => setSelectedJamaah(null)}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="w-full bg-white rounded-t-3xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Detail Jamaah</h3>
              <button
                onClick={() => setSelectedJamaah(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0F5132] to-[#1B8C5E] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {selectedJamaah.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-lg text-gray-900">{selectedJamaah.name}</p>
                  <p className="text-sm text-gray-500">ID: {selectedJamaah.jamaah_id}</p>
                </div>
              </div>

              <div className="flex justify-center">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${Math.abs(selectedJamaah.latitude - SPIRITUAL_LOCATIONS.MASJID_AL_HARAM.lat) < 0.1
                  ? 'bg-emerald-100 text-emerald-700'
                  : Math.abs(selectedJamaah.latitude - SPIRITUAL_LOCATIONS.MASJID_AL_NABAWI.lat) < 0.1
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-700'
                  }`}>
                  {Math.abs(selectedJamaah.latitude - SPIRITUAL_LOCATIONS.MASJID_AL_HARAM.lat) < 0.1
                    ? '📍 Di Makkah'
                    : Math.abs(selectedJamaah.latitude - SPIRITUAL_LOCATIONS.MASJID_AL_NABAWI.lat) < 0.1
                      ? '📍 Di Madinah'
                      : '📍 Dalam Perjalanan'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-500">Latitude</p>
                  <p className="font-mono text-sm">{selectedJamaah.latitude.toFixed(6)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-500">Longitude</p>
                  <p className="font-mono text-sm">{selectedJamaah.longitude.toFixed(6)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-500">Akurasi</p>
                  <div className="flex items-center gap-1">
                    <WifiIcon className={`w-4 h-4 ${(selectedJamaah.accuracy || 0) < 10 ? 'text-green-500' :
                      (selectedJamaah.accuracy || 0) < 20 ? 'text-yellow-500' : 'text-red-500'
                      }`} />
                    <span className="font-medium">{selectedJamaah.accuracy}m</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-500">Baterai</p>
                  <div className="flex items-center gap-1">
                    <Battery100Icon className={`w-4 h-4 ${(selectedJamaah.battery || 0) > 60 ? 'text-green-500' :
                      (selectedJamaah.battery || 0) > 20 ? 'text-yellow-500' : 'text-red-500'
                      }`} />
                    <span className="font-medium">{selectedJamaah.battery}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl">
                <p className="text-xs text-gray-500">Update Terakhir</p>
                <p className="font-medium">
                  {new Date(selectedJamaah.last_update).toLocaleString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })} WIB
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedJamaah(null)}
              className="w-full mt-6 py-3 bg-[#0F5132] text-white rounded-xl font-semibold"
            >
              Tutup
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Jika belum di client, render versi statis
  if (!isClient || loading) {
    return (
      <DashboardLayout>
        <div className="space-y-4 md:space-y-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#0F5132] to-[#1B8C5E] bg-clip-text text-transparent flex items-center gap-2">
                  <MapPinIcon className="w-6 h-6 md:w-8 md:h-8 text-[#0F5132]" />
                  <span className="text-xl md:text-3xl">Tracking</span>
                </h1>
              </div>
            </div>
            <div className="h-[400px] bg-gray-100 rounded-xl animate-pulse flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F5132] mx-auto mb-4"></div>
                <p className="text-gray-600">Memuat data tracking...</p>
              </div>
            </div>
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
        className="space-y-4 md:space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#0F5132] to-[#1B8C5E] bg-clip-text text-transparent flex items-center gap-2">
                <MapPinIcon className="w-6 h-6 md:w-8 md:h-8 text-[#0F5132]" />
                <span className="text-xl md:text-3xl">Tracking</span>
              </h1>
              <p className="text-xs md:text-sm text-gray-600 mt-1 flex items-center gap-1 md:gap-2">
                <SignalIcon className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
                <span className="hidden md:inline">Pantau posisi jamaah secara live</span>
                <span className="md:hidden">Live tracking jamaah</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-2 md:px-4 py-1.5 md:py-2 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center gap-1 md:gap-2">
                <ClockIcon className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                <span className="text-xs md:text-sm text-gray-600">
                  {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                className="p-1.5 md:p-2 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <ArrowPathIcon className={`w-4 h-4 md:w-5 md:h-5 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              </motion.button>
            </div>
          </div>
        </div>

        <MobileStatsSummary />

        <div className="hidden md:grid grid-cols-1 gap-6 md:grid-cols-3">
          {stats.map((stat, index) => {
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
                    <p className="text-xs text-gray-400 mt-2">{stat.change}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(stat.value / trackingData.length) * 100}%` }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className={`h-full bg-gradient-to-r ${stat.color}`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl md:rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-3 md:p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-base md:text-xl font-bold text-[#0F5132] flex items-center gap-1 md:gap-2">
                <MapPinIcon className="w-4 h-4 md:w-5 md:h-5" />
                <span>Peta Lokasi</span>
              </h2>
              <div className="flex items-center gap-1 md:gap-2">
                <span className="flex items-center gap-1 text-[10px] md:text-xs text-gray-500">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full"></span>
                  <span className="hidden md:inline">Online</span>
                </span>
                <span className="flex items-center gap-1 text-[10px] md:text-xs text-gray-500">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-300 rounded-full"></span>
                  <span className="hidden md:inline">Offline</span>
                </span>
              </div>
            </div>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              {trackingData.length} lokasi jamaah
            </p>
          </div>

          <div className="h-[250px] md:h-[400px] w-full relative">
            <MapWithNoSSR
              trackingData={trackingData}
              center={SPIRITUAL_LOCATIONS.MASJID_AL_HARAM}
              zoom={12}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl md:rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-3 md:p-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base md:text-xl font-bold text-[#0F5132] flex items-center gap-1 md:gap-2">
                  <UserGroupIcon className="w-4 h-4 md:w-5 md:h-5" />
                  <span>Daftar Tracking</span>
                </h2>

                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="md:hidden p-2 bg-gray-100 rounded-lg"
                >
                  <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="hidden md:flex flex-col md:flex-row gap-3">
                <div className="relative">
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari jamaah..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] transition-colors w-full md:w-64"
                  />
                </div>

                <div className="relative">
                  <select
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="pl-4 pr-10 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] transition-colors appearance-none bg-white w-full md:w-40"
                  >
                    <option value="all">Semua Lokasi</option>
                    <option value="makkah">Makkah</option>
                    <option value="madinah">Madinah</option>
                  </select>
                  <ChevronDownIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="md:hidden divide-y divide-gray-100">
            <AnimatePresence>
              {filteredData.map((track, index) => {
                const isNearMakkah = Math.abs(track.latitude - SPIRITUAL_LOCATIONS.MASJID_AL_HARAM.lat) < 0.1;
                const isNearMadinah = Math.abs(track.latitude - SPIRITUAL_LOCATIONS.MASJID_AL_NABAWI.lat) < 0.1;

                return (
                  <motion.div
                    key={track.jamaah_id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedJamaah(track)}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#0F5132] to-[#1B8C5E] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        {track.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-gray-900 truncate">{track.name}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${isNearMakkah ? 'bg-emerald-100 text-emerald-700' :
                            isNearMadinah ? 'bg-purple-100 text-purple-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                            {isNearMakkah ? 'Makkah' : isNearMadinah ? 'Madinah' : 'Perjalanan'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <span className="truncate font-mono">
                            {track.latitude.toFixed(4)}, {track.longitude.toFixed(4)}
                          </span>
                          <span>•</span>
                          <span>{track.accuracy}m</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${(track.battery || 0) > 60 ? 'bg-green-500' :
                                (track.battery || 0) > 20 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                              style={{ width: `${track.battery}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600">{track.battery}%</span>
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Lokasi</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Koordinat</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Akurasi</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Baterai</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <AnimatePresence>
                  {filteredData.map((track, index) => {
                    const isNearMakkah = Math.abs(track.latitude - SPIRITUAL_LOCATIONS.MASJID_AL_HARAM.lat) < 0.1;
                    const isNearMadinah = Math.abs(track.latitude - SPIRITUAL_LOCATIONS.MASJID_AL_NABAWI.lat) < 0.1;

                    return (
                      <motion.tr
                        key={track.jamaah_id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ backgroundColor: '#f9fafb' }}
                        onClick={() => setSelectedJamaah(track)}
                        className="cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-[#0F5132] to-[#1B8C5E] rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {track.name.charAt(0)}
                            </div>
                            <span className="font-semibold text-gray-900">{track.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isNearMakkah ? 'bg-emerald-100 text-emerald-700' :
                            isNearMadinah ? 'bg-purple-100 text-purple-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                            {isNearMakkah ? 'Makkah' : isNearMadinah ? 'Madinah' : 'Dalam Perjalanan'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600 font-mono">
                            {track.latitude.toFixed(4)}, {track.longitude.toFixed(4)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm ${(track.accuracy || 0) < 10 ? 'text-green-600' :
                              (track.accuracy || 0) < 20 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                              {track.accuracy}m
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${(track.battery || 0) > 60 ? 'bg-green-500' :
                                  (track.battery || 0) > 20 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                style={{ width: `${track.battery}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-600">{track.battery}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-sm text-gray-600">Active</span>
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-500">
                            {new Date(track.last_update).toLocaleTimeString('id-ID')}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          <div className="p-3 md:p-4 border-t border-gray-100 bg-gray-50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs md:text-sm text-gray-600">
              <span>Menampilkan {filteredData.length} dari {trackingData.length} jamaah</span>
              <div className="flex items-center gap-2 md:gap-4">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full"></span>
                  <span className="hidden md:inline">Live Update setiap 5 detik</span>
                  <span className="md:hidden">Live</span>
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <MobileFilterModal />
        <MobileDetailModal />
      </motion.div>
    </DashboardLayout>
  );
}