'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/app/components/DashboardLayout';
import { motion } from 'framer-motion';
import { jamaahService } from '@/services/jamaah.service';
import {
    PencilIcon,
    ArrowLeftIcon,
    TrashIcon,
    IdentificationIcon,
    PhoneIcon,
    EnvelopeIcon,
    MapPinIcon,
    CalendarIcon,
    DocumentTextIcon,
} from '@heroicons/react/24/outline';

export default function EditJamaahPage() {
    const router = useRouter();
    const params = useParams();
    const jamaahId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<{
        full_name: string;
        passport_number: string;
        ktp_number: string;
        phone: string;
        email: string;
        birth_date: string;
        address: string;
        status: 'active' | 'inactive' | 'in_trip';
    }>({
        full_name: '',
        passport_number: '',
        ktp_number: '',
        phone: '',
        email: '',
        birth_date: '',
        address: '',
        status: 'active',
    });

    useEffect(() => {
        loadJamaahData();
    }, [jamaahId]);

    const loadJamaahData = async () => {
        try {
            setLoading(true);
            const jamaah = await jamaahService.getById(jamaahId);

            setFormData({
                full_name: jamaah.full_name || '',
                passport_number: jamaah.passport_number || '',
                ktp_number: jamaah.ktp_number || '',
                phone: jamaah.phone || '',
                email: jamaah.email || '',
                birth_date: jamaah.birth_date ? new Date(jamaah.birth_date).toISOString().split('T')[0] : '',
                address: jamaah.address || '',
                status: (jamaah.status as 'active' | 'inactive' | 'in_trip') || 'active',
            });

            console.log('✅ Jamaah data loaded:', jamaah);
        } catch (error) {
            console.error('Failed to load jamaah:', error);
            setError('Gagal memuat data jamaah. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);

            // Validation
            if (!formData.full_name || !formData.passport_number || !formData.phone) {
                setError('Mohon lengkapi semua field yang wajib diisi');
                return;
            }

            // Update via API
            await jamaahService.update(jamaahId, formData);
            console.log('✅ Jamaah updated successfully');

            // Redirect to jamaah list
            router.push('/dashboard/jamaah');
        } catch (error: any) {
            console.error('Failed to save jamaah:', error);
            setError(error.response?.data?.message || 'Gagal menyimpan perubahan. Silakan coba lagi.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            setDeleting(true);

            // Delete via API
            await jamaahService.delete(jamaahId);
            console.log('✅ Jamaah deleted successfully');

            // Redirect to jamaah list
            router.push('/dashboard/jamaah');
        } catch (error: any) {
            console.error('Failed to delete jamaah:', error);
            alert('Gagal menghapus jamaah. Silakan coba lagi.');
        } finally {
            setDeleting(false);
            setShowDeleteModal(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="min-h-screen bg-gray-50 p-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse mb-6"></div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                            <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // Delete Confirmation Modal
    const DeleteModal = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrashIcon className="w-8 h-8 text-red-600" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                    Hapus Jamaah
                </h3>

                <p className="text-gray-500 text-center mb-6">
                    Apakah Anda yakin ingin menghapus jamaah <span className="font-semibold text-gray-900">{formData.full_name}</span>?
                    Tindakan ini tidak dapat dibatalkan.
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={() => setShowDeleteModal(false)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {deleting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Menghapus...
                            </>
                        ) : (
                            'Ya, Hapus'
                        )}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto p-6">
                    {/* Back Button */}
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group"
                    >
                        <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Kembali
                    </motion.button>

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-[#0F5132] to-[#1B8C5E] rounded-2xl flex items-center justify-center text-white">
                                    <PencilIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Edit Jamaah</h1>
                                    <p className="text-gray-500 mt-1">ID: {jamaahId}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            >
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>

                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                        <div className="p-6 space-y-5">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Lengkap <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <IdentificationIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] focus:ring-2 focus:ring-[#0F5132]/20 transition-all"
                                        placeholder="Masukkan nama lengkap"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        No. Paspor <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <DocumentTextIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            name="passport_number"
                                            value={formData.passport_number}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] focus:ring-2 focus:ring-[#0F5132]/20 transition-all"
                                            placeholder="A1234567"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        No. KTP
                                    </label>
                                    <div className="relative">
                                        <DocumentTextIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            name="ktp_number"
                                            value={formData.ktp_number}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] focus:ring-2 focus:ring-[#0F5132]/20 transition-all"
                                            placeholder="3201234567890123"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Telepon <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <PhoneIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] focus:ring-2 focus:ring-[#0F5132]/20 transition-all"
                                            placeholder="08123456789"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] focus:ring-2 focus:ring-[#0F5132]/20 transition-all"
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tanggal Lahir
                                </label>
                                <div className="relative">
                                    <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="date"
                                        name="birth_date"
                                        value={formData.birth_date}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] focus:ring-2 focus:ring-[#0F5132]/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Alamat
                                </label>
                                <div className="relative">
                                    <MapPinIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] focus:ring-2 focus:ring-[#0F5132]/20 transition-all resize-none"
                                        placeholder="Masukkan alamat lengkap"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] focus:ring-2 focus:ring-[#0F5132]/20 transition-all"
                                >
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Nonaktif</option>
                                    <option value="in_trip">Dalam Perjalanan</option>
                                </select>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="border-t border-gray-100 p-6 bg-gray-50">
                            <div className="flex gap-3">
                                <button
                                    onClick={() => router.back()}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-[#0F5132] to-[#1B8C5E] text-white rounded-xl hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {saving ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Menyimpan...
                                        </>
                                    ) : (

                                        'Simpan Perubahan'
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Delete Modal */}
                {showDeleteModal && <DeleteModal />}
            </div>
        </DashboardLayout>
    );
}
