'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/DashboardLayout';
import { jamaahService } from '@/services/jamaah.service';
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
  MapPinIcon,
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  DocumentDuplicateIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import HelpTooltip from '@/app/components/ui/HelpTooltip';

export default function JamaahPage() {
  const router = useRouter();
  const [jamaahList, setJamaahList] = useState<Jamaah[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedJamaah, setSelectedJamaah] = useState<Jamaah | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load jamaah from backend
  useEffect(() => {
    loadJamaah();
  }, []);

  const loadJamaah = async () => {
    try {
      const data = await jamaahService.getAll();
      setJamaahList(data);
    } catch (error) {
      console.error('Failed to load jamaah:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedJamaah) return;
    try {
      await jamaahService.delete(selectedJamaah.id);
      await loadJamaah();
      setShowDeleteModal(false);
      setSelectedJamaah(null);
    } catch (error) {
      console.error('Failed to delete jamaah:', error);
      alert('Gagal menghapus jamaah');
    }
  };

  const handleExportCSV = () => {
    try {
      // Prepare CSV headers
      const headers = [
        'NO',
        'NAMA LENGKAP',
        'NO PASPOR',
        'NO KTP',
        'TELEPON',
        'EMAIL',
        'TANGGAL LAHIR',
        'ALAMAT',
        'STATUS',
        'STATUS VERIFIKASI',
        'TANGGAL DAFTAR'
      ];

      // Prepare CSV rows
      const rows = filteredJamaah.map((jamaah, index) => {
        return [
          index + 1,
          jamaah.full_name || '-',
          jamaah.passport_number || '-',
          jamaah.ktp_number || '-',
          jamaah.phone || '-',
          jamaah.email || '-',
          jamaah.birth_date || '-',
          jamaah.address || '-',
          getStatusText(jamaah.status),
          (jamaah as any).verification_status || 'pending',
          new Date(jamaah.created_at).toLocaleDateString('id-ID')
        ];
      });

      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...rows.map(row =>
          row.map(cell => {
            const cellStr = String(cell);
            if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
              return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
          }).join(',')
        )
      ].join('\n');

      // Create filename
      const timestamp = new Date().toLocaleDateString('id-ID').replace(/\//g, '-');
      const filename = `Data-Jamaah_${timestamp}_${filteredJamaah.length}jamaah.csv`;

      // Create blob and download
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert(`✅ Berhasil mengekspor ${filteredJamaah.length} data jamaah!`);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('❌ Gagal mengekspor data!');
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Popup diblokir! Mohon izinkan popup untuk print.');
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Data Jamaah - ${new Date().toLocaleDateString('id-ID')}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #0F5132; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
          th { background-color: #0F5132; color: white; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .header { text-align: center; margin-bottom: 20px; }
          .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #666; }
          @media print {
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Data Jamaah</h1>
          <p>Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}</p>
          <p>Total: ${filteredJamaah.length} jamaah</p>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Lengkap</th>
              <th>No. Paspor</th>
              <th>Telepon</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${filteredJamaah.map((jamaah, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${jamaah.full_name}</td>
                <td>${jamaah.passport_number}</td>
                <td>${jamaah.phone}</td>
                <td>${jamaah.email || '-'}</td>
                <td>${getStatusText(jamaah.status)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <p>Dokumen ini dicetak secara otomatis dari sistem manajemen jamaah</p>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

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
    },
    {
      label: 'Jamaah Aktif',
      value: jamaahList.filter(j => j.status === 'active').length,
      icon: CheckCircleIcon,
      color: 'from-green-600 to-green-400',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      label: 'Jamaah Inactive',
      value: jamaahList.filter(j => j.status === 'inactive').length,
      icon: ClockIcon,
      color: 'from-yellow-600 to-yellow-400',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
    },
    {
      label: 'Dalam Perjalanan',
      value: jamaahList.filter(j => j.status === 'in_trip').length,
      icon: UserGroupIcon,
      color: 'from-purple-600 to-purple-400',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
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
                    <CheckCircleIcon className="w-4 h-4" />
                    <span className="text-xs">Status Verifikasi</span>
                  </div>
                  <p className={`font-semibold capitalize ${(selectedJamaah as any).verification_status === 'verified' ? 'text-green-600' :
                    (selectedJamaah as any).verification_status === 'rejected' ? 'text-red-600' :
                      'text-yellow-600'
                    }`}>
                    {(selectedJamaah as any).verification_status || 'pending'}
                  </p>
                </div>

                <div className="col-span-2 bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <MapPinIcon className="w-4 h-4" />
                    <span className="text-xs">Alamat</span>
                  </div>
                  <p className="font-semibold">{selectedJamaah.address || '-'}</p>
                </div>
              </div>

              {/* Verification Buttons */}
              {(selectedJamaah as any).verification_status === 'pending' && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <p className="text-sm text-yellow-800 mb-3">Jamaah ini menunggu verifikasi</p>
                  <div className="flex gap-3">
                    <button
                      onClick={async () => {
                        try {
                          const adminName = localStorage.getItem('user_name') || 'Admin';
                          await jamaahService.verify(selectedJamaah.id, 'verified', adminName);
                          alert('Jamaah berhasil diverifikasi!');
                          setShowDetailModal(false);
                          loadJamaah();
                        } catch (error) {
                          alert('Gagal memverifikasi jamaah');
                        }
                      }}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      ✓ Verifikasi
                    </button>
                    <button
                      onClick={async () => {
                        const reason = prompt('Alasan penolakan:');
                        if (reason) {
                          try {
                            const adminName = localStorage.getItem('user_name') || 'Admin';
                            await jamaahService.verify(selectedJamaah.id, 'rejected', adminName, reason);
                            alert('Jamaah ditolak');
                            setShowDetailModal(false);
                            loadJamaah();
                          } catch (error) {
                            alert('Gagal menolak jamaah');
                          }
                        }
                      }}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      ✗ Tolak
                    </button>
                  </div>
                </div>
              )}

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
                    router.push(`/dashboard/jamaah/edit/${selectedJamaah.id}`);
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
                onClick={handleDeleteConfirm}
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
            <p className="text-gray-600">Memuat data jamaah...</p>
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
                <UsersIcon className="w-8 h-8 text-[#0F5132]" />
                Manajemen Jamaah
              </h1>
              <HelpTooltip
                content="Kelola data jamaah, tambah, edit, hapus, dan verifikasi jamaah. Gunakan filter untuk mencari jamaah berdasarkan status."
                position="right"
              />
            </div>
            <p className="text-gray-600 mt-1">
              Kelola data jamaah dengan pencarian cepat dan status terkini
            </p>
          </div>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportCSV}
              className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              title="Export ke CSV"
            >
              <ArrowDownTrayIcon className="w-5 h-5 text-gray-600" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrint}
              className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              title="Print Data"
            >
              <PrinterIcon className="w-5 h-5 text-gray-600" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/dashboard/jamaah/create')}
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
            <div className="flex items-center gap-2">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama, nomor paspor, atau telepon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] transition-colors"
              />
              <HelpTooltip
                content="Cari jamaah berdasarkan nama, nomor paspor, atau nomor telepon. Pencarian bersifat case-insensitive."
                position="top"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="relative">
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
              <HelpTooltip
                content="Filter jamaah berdasarkan status: Aktif, Nonaktif, atau Dalam Perjalanan."
                position="top"
                className="absolute right-2 top-1/2 -translate-y-1/2"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadJamaah}
              className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 relative"
              title="Refresh Data"
            >
              <ArrowPathIcon className="w-5 h-5 text-gray-600" />
              <HelpTooltip
                content="Refresh data jamaah dari server untuk mendapatkan data terbaru."
                position="top"
                className="absolute -top-1 -right-1"
              />
            </motion.button>
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
                            onClick={() => router.push(`/dashboard/jamaah/edit/${jamaah.id}`)}
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
      </motion.div>
    </DashboardLayout>
  );
}