'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../components/DashboardLayout';
import { motion } from 'framer-motion';
import { userService } from '@/services/user.service';
import { CheckCircleIcon, XMarkIcon, LockClosedIcon, UserCircleIcon, BuildingOfficeIcon, ShieldCheckIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function SecurityPage() {
    const router = useRouter();
    const [password, setPassword] = useState({
        current_password: '',
        new_password: '',
        confirm_password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword({ ...password, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Validasi
        if (!password.current_password || !password.new_password || !password.confirm_password) {
            setError('Mohon lengkapi semua field');
            setIsLoading(false);
            return;
        }

        if (password.new_password !== password.confirm_password) {
            setError('Password baru dan konfirmasi tidak cocok');
            setIsLoading(false);
            return;
        }

        if (password.new_password.length < 8) {
            setError('Password baru minimal 8 karakter');
            setIsLoading(false);
            return;
        }

        try {
            await userService.changePassword({
                current_password: password.current_password,
                new_password: password.new_password,
                confirm_password: password.confirm_password,
            });

            setShowSuccess(true);
            setPassword({ current_password: '', new_password: '', confirm_password: '' });
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Gagal mengubah password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto p-6">
                {/* Header dengan gradient */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0F5132] to-[#1B8C5E] bg-clip-text text-transparent">Keamanan Akun</h1>
                    <p className="text-gray-600 mt-2">Kelola password dan keamanan akun Anda</p>
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-2 mb-8 bg-white rounded-xl shadow-sm p-1 border border-gray-200">
                    <button
                        onClick={() => router.push('/dashboard/pengaturan/profile')}
                        className="flex-1 px-4 py-3 rounded-lg text-gray-600 hover:text-gray-900 font-medium flex items-center justify-center gap-2 hover:bg-gray-50"
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
                        className="flex-1 px-4 py-3 rounded-lg bg-[#0F5132] text-white font-medium flex items-center justify-center gap-2"
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
                        <span className="text-green-800 font-medium">Password berhasil diubah!</span>
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
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                        <div className="p-3 bg-gradient-to-br from-[#0F5132] to-[#1B8C5E] rounded-xl shadow-md">
                            <LockClosedIcon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                Ganti Password
                            </h2>
                            <p className="text-sm text-gray-500">Pastikan password minimal 8 karakter dan sulit ditebak</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password Saat Ini
                            </label>
                            <input
                                type="password"
                                name="current_password"
                                value={password.current_password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132] focus:border-transparent transition-all"
                                placeholder="Masukkan password saat ini"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password Baru
                            </label>
                            <input
                                type="password"
                                name="new_password"
                                value={password.new_password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132] focus:border-transparent transition-all"
                                placeholder="Minimal 8 karakter"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-2">Gunakan kombinasi huruf, angka, dan simbol</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Konfirmasi Password Baru
                            </label>
                            <input
                                type="password"
                                name="confirm_password"
                                value={password.confirm_password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132] focus:border-transparent transition-all"
                                placeholder="Ketik ulang password baru"
                                required
                            />
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <div className="p-1.5 bg-yellow-100 rounded-lg">
                                    <ShieldCheckIcon className="w-5 h-5 text-yellow-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-yellow-800">Tips Keamanan</h3>
                                    <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                                        <li>• Gunakan password minimal 8 karakter</li>
                                        <li>• Kombinasikan huruf besar, kecil, angka, dan simbol</li>
                                        <li>• Hindari menggunakan informasi pribadi</li>
                                        <li>• Jangan gunakan password yang sama untuk akun lain</li>
                                    </ul>
                                </div>
                            </div>
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
                                        Mengubah...
                                    </>
                                ) : (
                                    'Update Password'
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => setPassword({ current_password: '', new_password: '', confirm_password: '' })}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                            >
                                Batal
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
