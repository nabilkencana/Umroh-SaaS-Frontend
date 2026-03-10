'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../components/DashboardLayout';
import { motion } from 'framer-motion';
import { userService } from '@/services/user.service';
import { CheckCircleIcon, XMarkIcon, UserCircleIcon, BuildingOfficeIcon, LockClosedIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function CompanyPage() {
    const router = useRouter();
    const [company, setCompany] = useState({
        name: '',
        business_type: '',
        address: '',
        phone: '',
        email: '',
        license_number: '',
        npwp: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadCompany();
    }, []);

    const loadCompany = async () => {
        try {
            const data = await userService.getTenantInfo();
            setCompany({
                name: data.name || '',
                business_type: data.business_type || '',
                address: data.address || '',
                phone: data.phone || '',
                email: data.email || '',
                license_number: data.license_number || '',
                npwp: data.npwp || '',
            });
        } catch (err) {
            console.error('Failed to load company:', err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCompany({ ...company, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await userService.updateTenantInfo(company);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Gagal menyimpan data perusahaan');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto p-6">
                {/* Header dengan gradient */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0F5132] to-[#1B8C5E] bg-clip-text text-transparent">Informasi Perusahaan</h1>
                    <p className="text-gray-600 mt-2">Kelola data perusahaan dan informasi bisnis</p>
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
                        className="flex-1 px-4 py-3 rounded-lg bg-[#0F5132] text-white font-medium flex items-center justify-center gap-2"
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
                        <span className="text-green-800 font-medium">Data perusahaan berhasil disimpan!</span>
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
                            <BuildingOfficeIcon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                Data Perusahaan
                            </h2>
                            <p className="text-sm text-gray-500">Perbarui informasi perusahaan Anda</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nama Perusahaan
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={company.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132] focus:border-transparent transition-all"
                                placeholder="Nama perusahaan Anda"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Jenis Bisnis
                                </label>
                                <input
                                    type="text"
                                    name="business_type"
                                    value={company.business_type}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132] focus:border-transparent transition-all"
                                    placeholder="Travel, Retail, dll"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nomor Izin
                                </label>
                                <input
                                    type="text"
                                    name="license_number"
                                    value={company.license_number}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132] focus:border-transparent transition-all"
                                    placeholder="Nomor izin usaha"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    NPWP
                                </label>
                                <input
                                    type="text"
                                    name="npwp"
                                    value={company.npwp}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132] focus:border-transparent transition-all"
                                    placeholder="XX.XXX.XXX.X-XXX.XXX"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Telepon Kantor
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={company.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132] focus:border-transparent transition-all"
                                    placeholder="(021) 1234 5678"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Kantor
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={company.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132] focus:border-transparent transition-all"
                                    placeholder="info@perusahaan.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Alamat Kantor
                            </label>
                            <textarea
                                name="address"
                                value={company.address}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132] focus:border-transparent transition-all"
                                placeholder="Jl. Contoh No. 123, Kota, Provinsi"
                            />
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
                                onClick={loadCompany}
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
