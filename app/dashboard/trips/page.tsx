'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { tripsService, Trip, TripStats } from '@/services/trips.service';
import {
  CalendarIcon,
  UsersIcon,
  PlusIcon,
  PencilIcon,
  EyeIcon,
  PaperAirplaneIcon,
  ClockIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  TagIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentTextIcon,
  UserGroupIcon,
  RocketLaunchIcon,
  SparklesIcon,
  ShieldCheckIcon,
  WalletIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

export default function TripsPage() {
  const router = useRouter();
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [stats, setStats] = useState<TripStats>({
    total_trips: 0,
    total_jamaah: 0,
    active_trips: 0,
    average_per_trip: 0
  });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Load trips data from backend
  useEffect(() => {
    loadTripsData();
  }, []);

  const loadTripsData = async () => {
    try {
      setLoading(true);
      const [tripsData, statsData] = await Promise.all([
        tripsService.getAll(),
        tripsService.getStats()
      ]);
      setTrips(tripsData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load trips data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadTripsData();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleCreateTrip = () => {
    router.push('/dashboard/trips/create');
  };

  const handleEditTrip = (tripId: string) => {
    router.push(`/dashboard/trips/edit/${tripId}`);
  };

  const handleViewDetail = (trip: Trip) => {
    setSelectedTrip(trip);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200',
          icon: ClockIcon,
          label: 'Akan Datang'
        };
      case 'ongoing':
        return {
          bg: 'bg-green-50',
          text: 'text-green-700',
          border: 'border-green-200',
          icon: PaperAirplaneIcon,
          label: 'Sedang Berlangsung'
        };
      case 'completed':
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          border: 'border-gray-200',
          icon: CheckCircleIcon,
          label: 'Selesai'
        };
      case 'cancelled':
        return {
          bg: 'bg-red-50',
          text: 'text-red-700',
          border: 'border-red-200',
          icon: ExclamationCircleIcon,
          label: 'Dibatalkan'
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          border: 'border-gray-200',
          icon: ClockIcon,
          label: status
        };
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price).replace('Rp', 'Rp ');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDuration = (departure: string, returns: string) => {
    const start = new Date(departure);
    const end = new Date(returns);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return `${days} Hari`;
  };

  const filteredTrips = trips
    .filter(trip => filterStatus === 'all' || trip.status === filterStatus)
    .filter(trip =>
      searchQuery === '' ||
      trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Statistik tambahan
  const totalRevenue = trips.reduce((sum, trip) => sum + (trip.price * (trip.total_jamaah || 0)), 0);
  const totalCapacity = trips.reduce((sum, trip) => sum + trip.capacity, 0);
  const occupancyRate = totalCapacity > 0 ? Math.round(((stats.total_jamaah || 0) / totalCapacity) * 100) : 0;

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Skeleton */}
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-96"></div>
            </div>

            {/* Stats Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>

            {/* Cards Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
                  <div className="h-32 bg-gray-200"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Add Trip Modal
  const AddTripModal = () => (
    <AnimatePresence>
      {showAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setShowAddModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0F5132]/10 rounded-xl flex items-center justify-center">
                    <PlusIcon className="w-5 h-5 text-[#0F5132]" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Tambah Perjalanan Baru</h2>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Nama Paket */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Paket <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] focus:ring-2 focus:ring-[#0F5132]/20 transition-all"
                  placeholder="Contoh: Umroh Ramadhan 2026"
                />
              </div>

              {/* Tanggal */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Berangkat
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] focus:ring-2 focus:ring-[#0F5132]/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Pulang
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] focus:ring-2 focus:ring-[#0F5132]/20 transition-all"
                  />
                </div>
              </div>

              {/* Kapasitas dan Harga */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kapasitas
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] focus:ring-2 focus:ring-[#0F5132]/20 transition-all"
                    placeholder="50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Harga
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                    <input
                      type="text"
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] focus:ring-2 focus:ring-[#0F5132]/20 transition-all"
                      placeholder="25.000.000"
                    />
                  </div>
                </div>
              </div>

              {/* Destinasi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destinasi
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] focus:ring-2 focus:ring-[#0F5132]/20 transition-all"
                  placeholder="Contoh: Makkah - Madinah"
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] focus:ring-2 focus:ring-[#0F5132]/20 transition-all resize-none"
                  placeholder="Jelaskan detail paket perjalanan, fasilitas, dan informasi penting lainnya..."
                />
              </div>

              {/* Fasilitas (Checkbox) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Fasilitas
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Hotel Bintang 5', 'Transport AC', 'Makan 3x Sehari', 'Tour Guide', 'Visa', 'Asuransi'].map((item) => (
                    <label key={item} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded border-gray-300 text-[#0F5132] focus:ring-[#0F5132]" />
                      <span className="text-sm text-gray-600">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    handleCreateTrip();
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#0F5132] to-[#1B8C5E] text-white rounded-xl hover:shadow-lg transition-all font-medium"
                >
                  Buat Perjalanan Baru
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Detail Trip Modal
  const DetailTripModal = () => (
    <AnimatePresence>
      {selectedTrip && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedTrip(null)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Status */}
            <div className="relative h-40 bg-gradient-to-r from-[#0F5132] to-[#1B8C5E] p-6">
              <button
                onClick={() => setSelectedTrip(null)}
                className="absolute top-4 right-4 p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors backdrop-blur-sm"
              >
                <XMarkIcon className="w-5 h-5 text-white" />
              </button>

              <div className="absolute bottom-6 left-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 bg-white/20 text-white border-white/30`}>
                    {(() => {
                      const status = getStatusColor(selectedTrip.status);
                      const StatusIcon = status.icon;
                      return (
                        <>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </>
                      );
                    })()}
                  </span>
                  <span className="text-white/80 text-sm flex items-center gap-1">
                    <TagIcon className="w-3 h-3" />
                    {selectedTrip.package_type || 'Reguler'}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white">{selectedTrip.name}</h2>
                <p className="text-white/80 text-sm mt-1 flex items-center gap-1">
                  <BuildingOfficeIcon className="w-4 h-4" />
                  {selectedTrip.organizer || 'PT. Amanah Travel'}
                </p>
              </div>
            </div>

            <div className="p-6">
              {/* Quick Info Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <CalendarIcon className="w-5 h-5 text-[#0F5132] mx-auto mb-2" />
                  <p className="text-xs text-gray-500">Durasi</p>
                  <p className="font-semibold text-gray-900">{getDuration(selectedTrip.departure_date, selectedTrip.return_date)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <UserGroupIcon className="w-5 h-5 text-[#0F5132] mx-auto mb-2" />
                  <p className="text-xs text-gray-500">Jamaah</p>
                  <p className="font-semibold text-gray-900">{selectedTrip.total_jamaah}/{selectedTrip.capacity}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <WalletIcon className="w-5 h-5 text-[#0F5132] mx-auto mb-2" />
                  <p className="text-xs text-gray-500">Harga</p>
                  <p className="font-semibold text-[#0F5132]">{formatPrice(selectedTrip.price)}</p>
                </div>
              </div>

              {/* Main Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Keberangkatan</span>
                  </div>
                  <p className="font-semibold">{formatDate(selectedTrip.departure_date)}</p>
                  <p className="text-xs text-gray-400 mt-1">Berangkat pukul 08:00 WIB</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Kepulangan</span>
                  </div>
                  <p className="font-semibold">{formatDate(selectedTrip.return_date)}</p>
                  <p className="text-xs text-gray-400 mt-1">Tiba pukul 14:00 WIB</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <MapPinIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Destinasi</span>
                  </div>
                  <p className="font-semibold">{selectedTrip.destination}</p>
                  <p className="text-xs text-gray-400 mt-1">Termasuk ziarah</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <RocketLaunchIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Maskapai</span>
                  </div>
                  <p className="font-semibold">{selectedTrip.airline || 'Garuda Indonesia'}</p>
                  <p className="text-xs text-gray-400 mt-1">Direct flight</p>
                </div>
              </div>

              {/* Progress Section */}
              <div className="bg-gray-50 p-5 rounded-xl mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ChartBarIcon className="w-5 h-5 text-[#0F5132]" />
                    <span className="font-semibold text-gray-900">Progress Keberangkatan</span>
                  </div>
                  <span className="text-sm font-medium text-[#0F5132]">
                    {Math.round(((selectedTrip.total_jamaah || 0) / selectedTrip.capacity) * 100)}%
                  </span>
                </div>

                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#0F5132] to-[#1B8C5E] rounded-full"
                    style={{ width: `${((selectedTrip.total_jamaah || 0) / selectedTrip.capacity) * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between mt-3 text-sm">
                  <span className="text-gray-600">{selectedTrip.total_jamaah || 0} Jamaah terdaftar</span>
                  <span className="text-gray-400">{selectedTrip.capacity - (selectedTrip.total_jamaah || 0)} slot tersisa</span>
                </div>
              </div>

              {/* Fasilitas */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-[#0F5132]" />
                  Fasilitas
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {['Hotel Bintang 5', 'Transport AC', 'Makan 3x Sehari', 'Tour Guide', 'Visa', 'Asuransi'].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircleIcon className="w-4 h-4 text-[#0F5132]" />
                      <span className="text-sm text-gray-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deskripsi */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <DocumentTextIcon className="w-5 h-5 text-[#0F5132]" />
                  Deskripsi
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {selectedTrip.description || 'Paket umroh dengan fasilitas terbaik, akomodasi hotel bintang 5, dan bimbingan dari tour guide berpengalaman. Seluruh perjalanan didampingi oleh pembimbing yang profesional.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedTrip(null)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    setSelectedTrip(null);
                    handleEditTrip(selectedTrip.id);
                  }}
                  className="flex-1 px-4 py-3 bg-[#0F5132] text-white rounded-xl hover:bg-[#1B8C5E] transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <PencilIcon className="w-4 h-4" />
                  Edit Perjalanan
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0F5132]/10 rounded-xl flex items-center justify-center">
                    <PaperAirplaneIcon className="w-5 h-5 text-[#0F5132]" />
                  </div>
                  Manajemen Perjalanan
                </h1>
                <p className="text-gray-500 mt-1 flex items-center gap-2">
                  <BuildingOfficeIcon className="w-4 h-4" />
                  Atur jadwal keberangkatan dan kapasitas jamaah tiap paket
                </p>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRefresh}
                  className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <ArrowPathIcon className={`w-5 h-5 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateTrip}
                  className="px-6 py-3 bg-gradient-to-r from-[#0F5132] to-[#1B8C5E] text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-[#0F5132]/20 hover:shadow-xl transition-all"
                >
                  <PlusIcon className="w-5 h-5" />
                  Tambah Perjalanan
                </motion.button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-500">Total Perjalanan</p>
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <PaperAirplaneIcon className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.total_trips}</p>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <ArrowTrendingUpIcon className="w-3 h-3 text-green-500" />
                  +12% dari bulan lalu
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-500">Total Jamaah</p>
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                    <UsersIcon className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.total_jamaah}</p>
                <p className="text-xs text-gray-400 mt-1">Terdaftar di semua paket</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-500">Perjalanan Aktif</p>
                  <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                    <RocketLaunchIcon className="w-4 h-4 text-orange-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.active_trips}</p>
                <p className="text-xs text-gray-400 mt-1">Sedang berlangsung</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                    <CurrencyDollarIcon className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(totalRevenue)}</p>
                <p className="text-xs text-gray-400 mt-1">Estimasi pendapatan</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-500">Okupansi</p>
                  <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                    <ChartBarIcon className="w-4 h-4 text-indigo-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{occupancyRate}%</p>
                <p className="text-xs text-gray-400 mt-1">Dari total kapasitas</p>
              </motion.div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari perjalanan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0F5132] transition-colors"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <FunnelIcon className="w-4 h-4 text-gray-600" />
                  Filter
                  {showFilters ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
                </button>
              </div>

              {/* Filter Options */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 border-t border-gray-100 mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Status</p>
                      <div className="flex gap-2 flex-wrap">
                        {['all', 'upcoming', 'ongoing', 'completed', 'cancelled'].map((status) => (
                          <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors text-sm ${filterStatus === status
                              ? 'bg-[#0F5132] text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                          >
                            {status === 'all' ? 'Semua' : getStatusColor(status).label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Trip Grid */}
            {filteredTrips.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {filteredTrips.map((trip, index) => {
                  const status = getStatusColor(trip.status);
                  const StatusIcon = status.icon;
                  const occupancy = ((trip.total_jamaah || 0) / trip.capacity) * 100;

                  return (
                    <motion.div
                      key={trip.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -4 }}
                      className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all"
                    >
                      {/* Card Header */}
                      <div className="p-5 border-b border-gray-100">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">{trip.name}</h3>
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 ${status.bg} ${status.text}`}>
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPinIcon className="w-4 h-4" />
                          {trip.destination}
                        </p>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 space-y-4">
                        {/* Dates */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm">
                            <CalendarIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{formatShortDate(trip.departure_date)}</span>
                          </div>
                          <div className="text-gray-400">→</div>
                          <div className="flex items-center gap-2 text-sm">
                            <CalendarIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{formatShortDate(trip.return_date)}</span>
                          </div>
                        </div>

                        {/* Capacity and Price */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <UsersIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              <span className="font-semibold text-gray-900">{trip.total_jamaah}</span> / {trip.capacity}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-400">Harga</span>
                            <span className="font-semibold text-[#0F5132]">{formatPrice(trip.price)}</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Kapasitas terisi</span>
                            <span className="font-medium text-gray-700">{Math.round(occupancy)}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#0F5132] to-[#1B8C5E] rounded-full"
                              style={{ width: `${occupancy}%` }}
                            />
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => handleViewDetail(trip)}
                            className="flex-1 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                          >
                            <EyeIcon className="w-4 h-4" />
                            Detail
                          </button>
                          <button
                            onClick={() => handleEditTrip(trip.id)}
                            className="px-3 py-2 border border-[#0F5132] text-[#0F5132] rounded-lg hover:bg-[#0F5132] hover:text-white transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                          >
                            <PencilIcon className="w-4 h-4" />
                            Edit
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              // Empty State
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PaperAirplaneIcon className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Perjalanan</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  {searchQuery
                    ? 'Tidak ada perjalanan yang sesuai dengan pencarian Anda'
                    : 'Mulai dengan menambahkan perjalanan baru untuk mengelola jadwal keberangkatan'}
                </p>
                <button
                  onClick={handleCreateTrip}
                  className="px-6 py-3 bg-gradient-to-r from-[#0F5132] to-[#1B8C5E] text-white rounded-xl font-semibold inline-flex items-center gap-2 shadow-lg shadow-[#0F5132]/20 hover:shadow-xl transition-all"
                >
                  <PlusIcon className="w-5 h-5" />
                  Tambah Perjalanan
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Modals */}
        <AddTripModal />
        <DetailTripModal />
      </div>
    </DashboardLayout>
  );
}