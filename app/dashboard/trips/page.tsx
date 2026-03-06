'use client';

import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronRightIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

interface Trip {
  id: string;
  name: string;
  departure_date: string;
  return_date: string;
  total_jamaah: number;
  capacity: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  price: number;
  destination: string;
  description?: string;
}

export default function TripsPage() {
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const trips: Trip[] = [
    {
      id: '1',
      name: 'Umroh Ramadhan 2026',
      departure_date: '2026-03-15',
      return_date: '2026-03-25',
      total_jamaah: 45,
      capacity: 50,
      status: 'upcoming',
      price: 25000000,
      destination: 'Makkah - Madinah',
      description: 'Paket umroh spesial bulan Ramadhan dengan bimbingan ustadz berpengalaman'
    },
    {
      id: '2',
      name: 'Umroh Plus Turki',
      departure_date: '2026-04-10',
      return_date: '2026-04-20',
      total_jamaah: 30,
      capacity: 30,
      status: 'upcoming',
      price: 35000000,
      destination: 'Makkah - Madinah - Istanbul',
      description: 'Kombinasi umroh dan wisata Turki dengan fasilitas bintang 5'
    },
    {
      id: '3',
      name: 'Umroh Reguler Januari',
      departure_date: '2026-01-05',
      return_date: '2026-01-15',
      total_jamaah: 48,
      capacity: 48,
      status: 'completed',
      price: 22000000,
      destination: 'Makkah - Madinah',
      description: 'Paket umroh reguler dengan maskapai langsung'
    },
    {
      id: '4',
      name: 'Umroh Plus Aqso',
      departure_date: '2026-05-20',
      return_date: '2026-05-30',
      total_jamaah: 25,
      capacity: 40,
      status: 'upcoming',
      price: 40000000,
      destination: 'Makkah - Madinah - Yerusalem',
      description: 'Umroh plus kunjungan ke Masjid Al Aqsa'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'ongoing':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'completed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <ClockIcon className="w-4 h-4" />;
      case 'ongoing':
        return <PaperAirplaneIcon className="w-4 h-4" />;
      case 'completed':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'cancelled':
        return <ExclamationCircleIcon className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'Akan Datang';
      case 'ongoing':
        return 'Sedang Berlangsung';
      case 'completed':
        return 'Selesai';
      case 'cancelled':
        return 'Dibatalkan';
      default:
        return status;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const filteredTrips = filterStatus === 'all'
    ? trips
    : trips.filter(trip => trip.status === filterStatus);

  // Add Trip Modal
  const AddTripModal = () => (
    <AnimatePresence>
      {showAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setShowAddModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#0F5132]">Tambah Perjalanan Baru</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Paket</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] transition-colors"
                  placeholder="Contoh: Umroh Ramadhan 2026"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Berangkat</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pulang</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kapasitas</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] transition-colors"
                    placeholder="50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] transition-colors"
                    placeholder="Rp 25.000.000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destinasi</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] transition-colors"
                  placeholder="Contoh: Makkah - Madinah"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] transition-colors"
                  placeholder="Deskripsi paket perjalanan..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-[#0F5132] text-white rounded-xl hover:bg-[#1B8C5E] transition-colors"
                >
                  Simpan Perjalanan
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
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setSelectedTrip(null)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#0F5132]">Detail Perjalanan</h2>
                <button
                  onClick={() => setSelectedTrip(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0F5132] to-[#1B8C5E] rounded-2xl flex items-center justify-center text-white text-2xl">
                  ✈️
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{selectedTrip.name}</h3>
                  <p className="text-gray-500 mt-1">{selectedTrip.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span className="text-sm">Keberangkatan</span>
                  </div>
                  <p className="font-semibold">
                    {new Date(selectedTrip.departure_date).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span className="text-sm">Kepulangan</span>
                  </div>
                  <p className="font-semibold">
                    {new Date(selectedTrip.return_date).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <MapPinIcon className="w-4 h-4" />
                    <span className="text-sm">Destinasi</span>
                  </div>
                  <p className="font-semibold">{selectedTrip.destination}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <CurrencyDollarIcon className="w-4 h-4" />
                    <span className="text-sm">Harga</span>
                  </div>
                  <p className="font-semibold text-[#0F5132]">{formatPrice(selectedTrip.price)}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Kapasitas</span>
                  <span className="text-sm font-semibold">
                    {selectedTrip.total_jamaah} / {selectedTrip.capacity} Jamaah
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#0F5132] to-[#1B8C5E]"
                    style={{ width: `${(selectedTrip.total_jamaah / selectedTrip.capacity) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {selectedTrip.capacity - selectedTrip.total_jamaah} slot tersedia
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedTrip(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Tutup
                </button>
                <button
                  className="flex-1 px-4 py-2 bg-[#0F5132] text-white rounded-xl hover:bg-[#1B8C5E] transition-colors"
                >
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0F5132] to-[#1B8C5E] bg-clip-text text-transparent">
              Manajemen Perjalanan
            </h1>
            <p className="text-gray-600 mt-1">
              Atur jadwal keberangkatan dan kapasitas jamaah tiap paket
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-[#0F5132] to-[#1B8C5E] text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-[#0F5132]/20"
          >
            <PlusIcon className="w-5 h-5" />
            Tambah Perjalanan
          </motion.button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['all', 'upcoming', 'ongoing', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${filterStatus === status
                  ? 'bg-[#0F5132] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
            >
              {status === 'all' ? 'Semua' : getStatusText(status)}
            </button>
          ))}
        </div>

        {/* Trip Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTrips.map((trip, index) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              {/* Card Header with Status */}
              <div className="relative h-32 bg-gradient-to-r from-[#0F5132] to-[#1B8C5E] p-6">
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(trip.status)}`}>
                    {getStatusIcon(trip.status)}
                    {getStatusText(trip.status)}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 max-w-[70%]">{trip.name}</h3>
                <div className="flex items-center gap-2 text-white/80">
                  <MapPinIcon className="w-4 h-4" />
                  <span className="text-sm">{trip.destination}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <CalendarIcon className="w-4 h-4" />
                    <div>
                      <p className="text-xs text-gray-400">Keberangkatan</p>
                      <p className="text-sm font-semibold">
                        {new Date(trip.departure_date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CalendarIcon className="w-4 h-4" />
                    <div>
                      <p className="text-xs text-gray-400">Kepulangan</p>
                      <p className="text-sm font-semibold">
                        {new Date(trip.return_date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <UsersIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {trip.total_jamaah} / {trip.capacity} Jamaah
                    </span>
                  </div>
                  <span className="font-semibold text-[#0F5132]">
                    {formatPrice(trip.price)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-gradient-to-r from-[#0F5132] to-[#1B8C5E]"
                    style={{ width: `${(trip.total_jamaah / trip.capacity) * 100}%` }}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedTrip(trip)}
                    className="flex-1 px-4 py-2 bg-[#0F5132] text-white rounded-xl font-semibold hover:bg-[#1B8C5E] transition-colors flex items-center justify-center gap-2"
                  >
                    <EyeIcon className="w-4 h-4" />
                    Detail
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 border border-[#0F5132] text-[#0F5132] rounded-xl font-semibold hover:bg-[#0F5132] hover:text-white transition-colors flex items-center gap-2"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Edit
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTrips.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-2xl shadow-xl"
          >
            <div className="text-6xl mb-4">✈️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Perjalanan</h3>
            <p className="text-gray-500 mb-6">Mulai dengan menambahkan perjalanan baru</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-[#0F5132] text-white rounded-xl font-semibold inline-flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              Tambah Perjalanan
            </button>
          </motion.div>
        )}

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-[#0F5132] to-[#1B8C5E] rounded-2xl p-6 text-white"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-white/80 text-sm">Total Perjalanan</p>
              <p className="text-3xl font-bold">{trips.length}</p>
            </div>
            <div>
              <p className="text-white/80 text-sm">Total Jamaah</p>
              <p className="text-3xl font-bold">
                {trips.reduce((acc, trip) => acc + trip.total_jamaah, 0)}
              </p>
            </div>
            <div>
              <p className="text-white/80 text-sm">Perjalanan Aktif</p>
              <p className="text-3xl font-bold">
                {trips.filter(t => t.status === 'upcoming' || t.status === 'ongoing').length}
              </p>
            </div>
            <div>
              <p className="text-white/80 text-sm">Rata-rata per Perjalanan</p>
              <p className="text-3xl font-bold">
                {Math.round(trips.reduce((acc, trip) => acc + trip.total_jamaah, 0) / trips.length)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Modals */}
        <AddTripModal />
        <DetailTripModal />
      </motion.div>
    </DashboardLayout>
  );
}