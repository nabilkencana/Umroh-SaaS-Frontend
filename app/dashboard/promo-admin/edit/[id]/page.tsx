'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/app/components/DashboardLayout';
import { motion } from 'framer-motion';
import { promoService } from '@/services/promo.service';
import {
    TagIcon,
    ArrowLeftIcon,
    TrashIcon,
    CalendarIcon,
    PercentBadgeIcon,
    DocumentTextIcon,
    PencilIcon,
    CloudArrowUpIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function EditPromoPage() {
    const router = useRouter();
    const params = useParams();
    const promoId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        discount_percentage: 10,
        start_date: '',
        end_date: '',
        banner_image: '',
        is_active: true,
        is_featured: false,
    });

    useEffect(() => {
        loadPromoData();
    }, [promoId]);

    const loadPromoData = async () => {
        try {
            setLoading(true);
            const promo = await promoService.getById(promoId);

            // Format dates to YYYY-MM-DD
            setFormData({
                title: promo.title || '',
                description: promo.description || '',
                discount_percentage: promo.discount_percentage || 0,
                start_date: promo.start_date ? new Date(promo.start_date).toISOString().split('T')[0] : '',
                end_date: promo.end_date ? new Date(promo.end_date).toISOString().split('T')[0] : '',
                banner_image: promo.banner_image || '',
                is_active: promo.is_active,
                is_featured: promo.is_featured,
            });

            // Set image preview if banner exists
            if (promo.banner_image) {
                setImagePreview(promo.banner_image);
            }

            console.log('✅ Promo data loaded:', promo);
        } catch (error) {
            console.error('Failed to load promo:', error);
            setError('Gagal memuat data promo. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('File harus berupa gambar');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Ukuran file maksimal 5MB');
            return;
        }

        try {
            setUploading(true);
            setError(null);

            // Create preview first
            const reader = new FileReader();
            reader.onloadend = () => {
                const previewUrl = reader.result as string;
                setImagePreview(previewUrl);
            };
            reader.readAsDataURL(file);

            // Upload to backend
            const imageUrl = await promoService.uploadBanner(file);

            setFormData(prev => ({ ...prev, banner_image: imageUrl }));
            console.log('✅ Image uploaded to backend:', imageUrl);
        } catch (error) {
            console.error('Failed to upload image:', error);
            setError('Gagal mengupload gambar. Silakan coba lagi.');
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setFormData(prev => ({ ...prev, banner_image: '' }));
        setImagePreview('');
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);

            // Validation
            if (!formData.title || !formData.start_date || !formData.end_date) {
                setError('Mohon lengkapi semua field yang wajib diisi');
                return;
            }

            // Update via API
            await promoService.update(promoId, formData);
            console.log('✅ Promo updated successfully');

            // Redirect to promo list
            router.push('/dashboard/promo-admin');
        } catch (error: any) {
            console.error('Failed to save promo:', error);
            setError(error.response?.data?.message || 'Gagal menyimpan perubahan. Silakan coba lagi.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            setDeleting(true);

            // Delete via API
            await promoService.delete(promoId);
            console.log('✅ Promo deleted successfully');

            // Redirect to promo list
            router.push('/dashboard/promo-admin');
        } catch (error: any) {
            console.error('Failed to delete promo:', error);

            // Better error message
            if (error.response?.status === 401) {
                alert('Sesi Anda telah berakhir. Silakan login kembali.');
                router.push('/dashboard/login');
            } else if (error.response?.status === 404) {
                alert('Promo tidak ditemukan atau sudah dihapus.');
                router.push('/dashboard/promo-admin');
            } else {
                alert('Gagal menghapus promo. Silakan coba lagi.');
            }
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
                    Hapus Promo
                </h3>

                <p className="text-gray-500 text-center mb-6">
                    Apakah Anda yakin ingin menghapus promo <span className="font-semibold text-gray-900">{formData.title}</span>?
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
                                    <h1 className="text-2xl font-bold text-gray-900">Edit Promo</h1>
                                    <p className="text-gray-500 mt-1">ID: {promoId}</p>
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
                                    Judul Promo <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <TagIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] focus:ring-2 focus:ring-[#0F5132]/20 transition-all"
                                        placeholder="Contoh: Promo Ramadhan Berkah 2026"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Deskripsi
                                </label>
                                <div className="relative">
                                    <DocumentTextIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] focus:ring-2 focus:ring-[#0F5132]/20 transition-all resize-none"
                                        placeholder="Jelaskan detail promo..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Diskon (%) <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <PercentBadgeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="number"
                                            name="discount_percentage"
                                            value={formData.discount_percentage}
                                            onChange={handleNumberChange}
                                            min="0"
                                            max="100"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] focus:ring-2 focus:ring-[#0F5132]/20 transition-all"
                                            placeholder="25"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Banner Image
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            id="banner-upload"
                                            disabled={uploading}
                                        />
                                        <label
                                            htmlFor="banner-upload"
                                            className={`flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#0F5132] transition-colors cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {uploading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#0F5132]"></div>
                                                    <span className="text-sm text-gray-600">Uploading...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <CloudArrowUpIcon className="w-5 h-5 text-gray-400" />
                                                    <span className="text-sm text-gray-600">Upload Gambar</span>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Image Preview */}
                            {(imagePreview || formData.banner_image) && (
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Preview Banner
                                    </label>
                                    <div className="relative w-full h-48 bg-gray-100 rounded-xl overflow-hidden">
                                        <Image
                                            src={imagePreview || formData.banner_image}
                                            alt="Banner preview"
                                            fill
                                            className="object-cover"
                                        />
                                        <button
                                            onClick={handleRemoveImage}
                                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                        >
                                            <XMarkIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Format: JPG, PNG. Maksimal 5MB
                                    </p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tanggal Mulai <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="date"
                                            name="start_date"
                                            value={formData.start_date}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] focus:ring-2 focus:ring-[#0F5132]/20 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tanggal Berakhir <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="date"
                                            name="end_date"
                                            value={formData.end_date}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] focus:ring-2 focus:ring-[#0F5132]/20 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={formData.is_active}
                                        onChange={handleCheckboxChange}
                                        className="w-4 h-4 text-[#0F5132] rounded focus:ring-[#0F5132]"
                                    />
                                    <span className="text-sm text-gray-700 font-medium">Aktifkan Promo</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="is_featured"
                                        checked={formData.is_featured}
                                        onChange={handleCheckboxChange}
                                        className="w-4 h-4 text-[#D4AF37] rounded focus:ring-[#D4AF37]"
                                    />
                                    <span className="text-sm text-gray-700 font-medium">Jadikan Featured</span>
                                </label>
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
                                    disabled={saving || uploading}
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
