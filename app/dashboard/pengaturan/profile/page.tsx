'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../components/DashboardLayout';
import { motion } from 'framer-motion';
import { userService } from '@/services/user.service';
import { UserCircleIcon, CameraIcon, CheckCircleIcon, XMarkIcon, BuildingOfficeIcon, LockClosedIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function ProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        position: '',
        bio: '',
        avatar_url: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await userService.getProfile();
            setProfile({
                name: data.name || '',
                email: data.email || '',
                phone: data.phone || '',
                position: data.position || '',
                bio: data.bio || '',
                avatar_url: data.avatar_url || '',
            });
        } catch (err) {
            console.error('Failed to load profile:', err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await userService.updateProfile(profile);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Gagal menyimpan profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('File harus berupa gambar');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setError('Ukuran file maksimal 2MB');
            return;
        }

        try {
            setIsLoading(true);
            const result = await userService.uploadAvatar(file);
            setProfile({ ...profile, avatar_url: result.url });
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Gagal upload foto');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto p-6">
                {/* Header dengan gradient */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0F5132] to-[#1B8C5E] bg-clip-text text-transparent">Pengaturan Profile</h1>
                    <p className="text-gray-600 mt-2">Kelola informasi pribadi dan preferensi akun Anda</p>
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-2 mb-8 bg-white rounded-xl shadow-sm p-1 border border-gray-200">
                    <button
                        onClick={() => router.push('/dashboard/pengaturan/profile')}
                        className="flex-1 px-4 py-3 rounded-lg bg-[#0F5132] text-white font-medium flex items-center justify-center gap-2"
                    >
                        <UserCircleIcon className="w-5 h-5" />
                        Profile
                    </button>
                    <button
                        onClick={() => router.push('/dashboard/pengaturan/company')}
                        className="flex-1 px-4 py-3 rounded-lg text-gray-600 hover:text-gray-900 font-medium flex items-center justify-center gap-2 hover:bg-gray-50"
                    >
                        <BuildingOfficeIcon className="w-5 h-5" />
                        Perusahaan
                    </button>
                    <button
                        onClick={() => router.push('/dashboard/pengaturan/security')}
                        className="flex-1 px-4 py-3 rounded-lg text-gray-600 hover:text-gray-900 font-medium flex items-center justify-center gap-2 hover:bg-gray-50"
                    >
                        <LockClosedIcon className="w-5 h-5" />
                        Keamanan
                    </button>
                </div>

                {/* Success Message */}
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3"
                    >
                        <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-green-800 font-medium">Profile berhasil disimpan!</span>
                    </motion.div>
                )}

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
                    >
                        <XMarkIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <span className="text-red-800 font-medium">{error}</span>
                    </motion.div>
                )}

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Avatar Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                            <div className="text-center">
                                <div className="relative inline-block mb-4">
                                    {profile.avatar_url ? (
                                        <img
                                            src={profile.avatar_url}
                                            alt="Avatar"
                                            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                                        />
                                    ) : (
                                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#0F5132] to-[#1B8C5E] flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                                            {profile.name.charAt(0) || 'A'}
                                        </div>
                                    )}
                                    <label className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                                        <CameraIcon className="w-5 h-5 text-gray-700" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleUploadAvatar}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">{profile.name || 'Nama Pengguna'}</h3>
                                <p className="text-sm text-gray-500 mt-1">{profile.position || 'Jabatan'}</p>
                                <p className="text-sm text-gray-500">{profile.email || 'email@example.com'}</p>

                                <div className="mt-6">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Foto Profile</h4>
                                    <p className="text-xs text-gray-500">Format: JPG, PNG, GIF</p>
                                    <p className="text-xs text-gray-500">Ukuran maksimal: 2MB</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Form Card */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                                <div className="p-3 bg-gradient-to-br from-[#0F5132] to-[#1B8C5E] rounded-xl shadow-md">
                                    <UserCircleIcon className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        Informasi Pribadi
                                    </h2>
                                    <p className="text-sm text-gray-500">Perbarui data pribadi Anda</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nama Lengkap
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={profile.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132] focus:border-transparent transition-all"
                                            placeholder="Masukkan nama lengkap"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={profile.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132] focus:border-transparent transition-all"
                                            placeholder="nama@email.com"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nomor Telepon
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={profile.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132] focus:border-transparent transition-all"
                                            placeholder="0812 3456 7890"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Jabatan
                                        </label>
                                        <input
                                            type="text"
                                            name="position"
                                            value={profile.position}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132] focus:border-transparent transition-all"
                                            placeholder="Manager, Admin, dll"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Bio
                                    </label>
                                    <textarea
                                        name="bio"
                                        value={profile.bio}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132] focus:border-transparent transition-all"
                                        placeholder="Ceritakan sedikit tentang diri Anda..."
                                    />
                                    <p className="text-xs text-gray-500 mt-2">Maksimal 500 karakter</p>
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-gray-200">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="px-8 py-3 bg-gradient-to-r from-[#0F5132] to-[#1B8C5E] text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2 transition-all"
                                    >
                                        {isLoading ? (
                                            <>
                                                <ArrowPathIcon className="w-4 h-4 animate-spin" />
                                                Menyimpan...
                                            </>
                                        ) : (
                                            'Simpan Perubahan'
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={loadProfile}
                                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
