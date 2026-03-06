'use client';

import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { mockJamaah } from '@/lib/mock-data';
import { Jamaah } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UsersIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PhoneIcon,
  IdentificationIcon,
  EnvelopeIcon,
  CalendarIcon,
  MapPinIcon,
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  FunnelIcon,
  ArrowPathIcon,
  DocumentDuplicateIcon,
  PrinterIcon,
  ArrowDownTrayIcon, // Ganti DownloadIcon dengan ArrowDownTrayIcon
  UserGroupIcon
} from '@heroicons/react/24/outline';

export default function JamaahPage() {
  const [jamaahList] = useState<Jamaah[]>(mockJamaah);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedJamaah, setSelectedJamaah] = useState<Jamaah | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const filteredJamaah = jamaahList.filter(
    (j) =>
      (j.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.passport_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.phone.includes(searchTerm)) &&
      (filterStatus === 'all' || j.status === filterStatus)
  );

  const stats = [
    {
      label: 'Total Jamaah',
      value: jamaahList.length,
      icon: UsersIcon,
      color: 'from-blue-600 to-blue-400',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      change: '+12'
    },
    {
      label: 'Jamaah Aktif',
      value: jamaahList.filter(j => j.status === 'active').length,
      icon: CheckCircleIcon,
      color: 'from-green-600 to-green-400',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      change: '+8'
    },
    {
      label: 'Jamaah Inactive',
      value: jamaahList.filter(j => j.status === 'inactive').length,
      icon: ClockIcon,
      color: 'from-yellow-600 to-yellow-400',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      change: '-3'
    },
    {
      label: 'Dalam Perjalanan',
      value: jamaahList.filter(j => j.status === 'in_trip').length,
      icon: UserGroupIcon,
      color: 'from-purple-600 to-purple-400',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      change: '+5'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'in_trip':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'inactive':
        return <XCircleIcon className="w-4 h-4" />;
      case 'in_trip':
        return <ClockIcon className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'inactive':
        return 'Nonaktif';
      case 'in_trip':
        return 'Dalam Perjalanan';
      default:
        return status;
    }
  };

  // Detail Modal
  const DetailModal = () => (
    <AnimatePresence>
      {showDetailModal && selectedJamaah && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setShowDetailModal(false)}
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
                <h2 className="text-2xl font-bold text-[#0F5132]">Detail Jamaah</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#0F5132] to-[#1B8C5E] rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
                  {selectedJamaah.full_name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedJamaah.full_name}</h3>
                  <p className="text-sm text-gray-500">ID: {selectedJamaah.id}</p>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold mt-2 ${getStatusColor(selectedJamaah.status)}`}>
                    {getStatusIcon(selectedJamaah.status)}
                    {getStatusText(selectedJamaah.status)}
                  </span>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <IdentificationIcon className="w-4 h-4" />
                    <span className="text-xs">No. Paspor</span>
                  </div>
                  <p className="font-semibold">{selectedJamaah.passport_number}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <PhoneIcon className="w-4 h-4" />
                    <span className="text-xs">Telepon</span>
                  </div>
                  <p className="font-semibold">{selectedJamaah.phone}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <EnvelopeIcon className="w-4 h-4" />
                    <span className="text-xs">Email</span>
                  </div>
                  <p className="font-semibold">{selectedJamaah.email || '-'}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span className="text-xs">Tanggal Lahir</span>
                  </div>
                  <p className="font-semibold">{selectedJamaah.birth_date || '-'}</p>
                </div>

                <div className="col-span-2 bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <MapPinIcon className="w-4 h-4" />
                    <span className="text-xs">Alamat</span>
                  </div>
                  <p className="font-semibold">{selectedJamaah.address || '-'}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setShowEditModal(true);
                  }}
                  className="flex-1 px-4 py-2 bg-[#0F5132] text-white rounded-xl hover:bg-[#1B8C5E] transition-colors"
                >
                  Edit Data
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Delete Modal
  const DeleteModal = () => (
    <AnimatePresence>
      {showDeleteModal && selectedJamaah && (
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
              Hapus Jamaah
            </h3>

            <p className="text-gray-500 text-center mb-6">
              Apakah Anda yakin ingin menghapus jamaah "{selectedJamaah.full_name}"?
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
                onClick={() => {
                  // Handle delete logic here
                  setShowDeleteModal(false);
                  setSelectedJamaah(null);
                }}
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

  // Add/Edit Modal
  const JamaahFormModal = ({ isEdit = false }) => (
    <AnimatePresence>
      {(showAddModal || showEditModal) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => {
            setShowAddModal(false);
            setShowEditModal(false);
          }}
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
                <h2 className="text-2xl font-bold text-[#0F5132]">
                  {isEdit ? 'Edit Jamaah' : 'Tambah Jamaah Baru'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    defaultValue={isEdit ? selectedJamaah?.full_name : ''}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    No. Paspor
                  </label>
                  <input
                    type="text"
                    placeholder="A1234567"
                    defaultValue={isEdit ? selectedJamaah?.passport_number : ''}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telepon
                  </label>
                  <input
                    type="text"
                    placeholder="08123456789"
                    defaultValue={isEdit ? selectedJamaah?.phone : ''}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    defaultValue={isEdit ? selectedJamaah?.email : ''}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    defaultValue={isEdit ? selectedJamaah?.birth_date : ''}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] transition-colors"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Masukkan alamat lengkap"
                    defaultValue={isEdit ? selectedJamaah?.address : ''}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    defaultValue={isEdit ? selectedJamaah?.status : 'active'}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] transition-colors"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                    <option value="in_trip">Dalam Perjalanan</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-[#0F5132] text-white rounded-xl hover:bg-[#1B8C5E] transition-colors"
                >
                  {isEdit ? 'Update Data' : 'Simpan Data'}
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0F5132] to-[#1B8C5E] bg-clip-text text-transparent flex items-center gap-2">
              <UsersIcon className="w-8 h-8 text-[#0F5132]" />
              Manajemen Jamaah
            </h1>
            <p className="text-gray-600 mt-1">
              Kelola data jamaah dengan pencarian cepat dan status terkini
            </p>
          </div>

          <div className="flex gap-2">
            <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <ArrowDownTrayIcon className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <PrinterIcon className="w-5 h-5 text-gray-600" />
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-[#0F5132] to-[#1B8C5E] text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-[#0F5132]/20"
            >
              <PlusIcon className="w-5 h-5" />
              Tambah Jamaah
            </motion.button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-green-600 mt-2">{stat.change} bulan ini</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`w-5 h-5 ${stat.textColor}`} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama, nomor paspor, atau telepon..."
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
              <option value="in_trip">Dalam Perjalanan</option>
            </select>

            <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <ArrowPathIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#0F5132] to-[#1B8C5E]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Nama Lengkap</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">No. Paspor</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Telepon</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <AnimatePresence>
                  {filteredJamaah.map((jamaah, index) => (
                    <motion.tr
                      key={jamaah.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ backgroundColor: '#f9fafb' }}
                      className="transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-[#0F5132] to-[#1B8C5E] rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {jamaah.full_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{jamaah.full_name}</p>
                            <p className="text-xs text-gray-400">ID: {jamaah.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <IdentificationIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{jamaah.passport_number}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <PhoneIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{jamaah.phone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{jamaah.email || '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(jamaah.status)}`}>
                          {getStatusIcon(jamaah.status)}
                          {getStatusText(jamaah.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setSelectedJamaah(jamaah);
                              setShowDetailModal(true);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Detail"
                          >
                            <EyeIcon className="w-4 h-4 text-blue-500" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setSelectedJamaah(jamaah);
                              setShowEditModal(true);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <PencilIcon className="w-4 h-4 text-[#0F5132]" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setSelectedJamaah(jamaah);
                              setShowDeleteModal(true);
                            }}
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-sm text-gray-600">
              <span>Menampilkan {filteredJamaah.length} dari {jamaahList.length} jamaah</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <DocumentDuplicateIcon className="w-4 h-4" />
                  Total Data: {jamaahList.length} record
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredJamaah.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-2xl shadow-xl"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UsersIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Tidak Ada Data</h3>
            <p className="text-gray-500 mb-6">Tidak ada jamaah yang sesuai dengan pencarian</p>
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
        <DetailModal />
        <DeleteModal />
        <JamaahFormModal isEdit={false} />
        <JamaahFormModal isEdit={true} />
      </motion.div>
    </DashboardLayout>
  );
}