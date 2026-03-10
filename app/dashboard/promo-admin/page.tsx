'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/DashboardLayout';
import { promoService } from '@/services/promo.service';
import { Promo } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  TagIcon,
  CalendarIcon,
  PercentBadgeIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
  ClockIcon,
  EyeIcon,
  ArrowPathIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import HelpTooltip from '@/app/components/ui/HelpTooltip';

export default function PromoAdminPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<Promo | null>(null);
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load promos from backend
  useEffect(() => {
    loadPromos();
  }, []);

  const loadPromos = async () => {
    try {
      const data = await promoService.getAll();
      setPromos(data);
    } catch (error) {
      console.error('Failed to load promos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPromos = promos.filter(promo =>
    promo.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus === 'all' ||
      (filterStatus === 'active' && promo.is_active) ||
      (filterStatus === 'inactive' && !promo.is_active) ||
      (filterStatus === 'featured' && promo.is_featured))
  );

  const handleEdit = (promo: Promo) => {
    router.push(`/dashboard/promo-admin/edit/${promo.id}`);
  };

  const handleDelete = (promo: Promo) => {
    setSelectedPromo(promo);
    setShowDeleteModal(true);
  };

  const handleCreate = () => {
    router.push('/dashboard/promo-admin/create');
  };

  const confirmDelete = async () => {
    if (!selectedPromo) return;
    try {
      await promoService.delete(selectedPromo.id);
      await loadPromos();
      setShowDeleteModal(false);
      setSelectedPromo(null);
    } catch (error: any) {
      console.error('Failed to delete promo:', error);

      // Better error message
      if (error.response?.status === 401) {
        alert('Sesi Anda telah berakhir. Silakan login kembali.');
        // Redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/dashboard/login';
        }
      } else if (error.response?.status === 404) {
        alert('Promo tidak ditemukan atau sudah dihapus.');
        await loadPromos(); // Refresh list
        setShowDeleteModal(false);
      } else {
        alert('Gagal menghapus promo. Silakan coba lagi.');
      }
    }
  };

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Belum ditentukan';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Delete Confirmation Modal
  const DeleteModal = () => (
    <AnimatePresence>
      {showDeleteModal && selectedPromo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setShowDeleteModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrashIcon className="w-8 h-8 text-red-600" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Hapus Promo
            </h3>

            <p className="text-gray-500 text-center mb-6">
              Apakah Anda yakin ingin menghapus promo "{selectedPromo.title}"?
              Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Hapus
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F5132] mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data promo...</p>
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
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0F5132] to-[#1B8C5E] bg-clip-text text-transparent flex items-center gap-2">
                <TagIcon className="w-8 h-8 text-[#0F5132]" />
                Kelola Promo
              </h1>
              <HelpTooltip
                content="Kelola promo dan diskon untuk jamaah. Buat promo baru, edit promo yang ada, atau hapus promo yang sudah tidak berlaku."
                position="right"
              />
            </div>
            <p className="text-gray-600 mt-1">
              Buat, evaluasi, dan update kampanye promo dengan cepat
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreate}
            className="px-6 py-3 bg-gradient-to-r from-[#0F5132] to-[#1B8C5E] text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-[#0F5132]/20"
          >
            <PlusIcon className="w-5 h-5" />
            Tambah Promo
          </motion.button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Total Promo</p>
                <p className="text-2xl font-bold text-gray-900">{promos.length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <TagIcon className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">+2 bulan ini</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Promo Aktif</p>
                <p className="text-2xl font-bold text-gray-900">
                  {promos.filter(p => p.is_active).length}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">{Math.round(promos.filter(p => p.is_active).length / promos.length * 100)}% dari total</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Featured</p>
                <p className="text-2xl font-bold text-gray-900">
                  {promos.filter(p => p.is_featured).length}
                </p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <StarIcon className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <p className="text-xs text-yellow-600 mt-2">Promo unggulan</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Rata-rata Diskon</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(promos.reduce((acc, p) => acc + (p.discount_percentage || 0), 0) / (promos.length || 1))}%
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <PercentBadgeIcon className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-purple-600 mt-2">Dari semua promo</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari promo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] transition-colors"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] bg-white"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
              <option value="featured">Featured</option>
            </select>

            <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <ArrowPathIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Promo Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#0F5132] to-[#1B8C5E]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Promo</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Diskon</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Periode</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <AnimatePresence>
                  {filteredPromos.map((promo, index) => (
                    <motion.tr
                      key={promo.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ backgroundColor: '#f9fafb' }}
                      className="transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#0F5132]/10 rounded-lg">
                            <TagIcon className="w-5 h-5 text-[#0F5132]" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{promo.title}</p>
                            {promo.is_featured && (
                              <span className="inline-flex items-center gap-1 text-xs text-[#D4AF37] mt-1">
                                <StarIconSolid className="w-3 h-3" />
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xl font-bold text-[#D4AF37]">
                          {promo.discount_percentage}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CalendarIcon className="w-4 h-4 text-gray-400" />
                          <div>
                            <p>{formatDate(promo.start_date)}</p>
                            <p className="text-gray-400">s/d {formatDate(promo.end_date)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {promo.is_active ? (
                            <>
                              <CheckCircleIcon className="w-4 h-4 text-green-500" />
                              <span className="text-sm text-green-700 font-medium">Aktif</span>
                            </>
                          ) : (
                            <>
                              <XCircleIcon className="w-4 h-4 text-red-500" />
                              <span className="text-sm text-red-700 font-medium">Nonaktif</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEdit(promo)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <PencilIcon className="w-4 h-4 text-[#0F5132]" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(promo)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <TrashIcon className="w-4 h-4 text-red-500" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Menampilkan {filteredPromos.length} dari {promos.length} promo</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <EyeIcon className="w-4 h-4" />
                  Total Views: 2.5K
                </span>
                <span className="flex items-center gap-1">
                  <ClockIcon className="w-4 h-4" />
                  Update: {new Date().toLocaleTimeString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredPromos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-2xl shadow-xl"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TagIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Tidak Ada Promo</h3>
            <p className="text-gray-500 mb-6">Belum ada promo yang sesuai dengan filter yang dipilih</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
              }}
              className="px-6 py-3 bg-[#0F5132] text-white rounded-xl font-semibold"
            >
              Reset Filter
            </button>
          </motion.div>
        )}

        {/* Modals */}
        <DeleteModal />
      </motion.div>
    </DashboardLayout>
  );
}