'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    UserCircleIcon,
    MapPinIcon,
    CalendarIcon,
    PhoneIcon,
    EnvelopeIcon,
    IdentificationIcon,
    BuildingOfficeIcon,
    UserGroupIcon,
    ArrowRightEndOnRectangleIcon,
    ClockIcon,
    CheckCircleIcon,
    PencilSquareIcon
} from '@heroicons/react/24/outline';
import { authService } from '@/services/auth.service';
import { jamaahService } from '@/services/jamaah.service';
import { Jamaah } from '@/lib/types';

export default function JamaahProfilePage() {
    const router = useRouter();
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userRole, setUserRole] = useState('');
    const [loading, setLoading] = useState(true);
    const [jamaahData, setJamaahData] = useState<Jamaah | null>(null);

    useEffect(() => {
        loadJamaahData();

        // Check if we need to refresh (after completing data)
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('refresh') === 'true') {
            // Force reload after a short delay to ensure data is saved
            setTimeout(() => {
                loadJamaahData();
            }, 1000);
            // Remove the query param
            window.history.replaceState({}, '', '/dashboard/jamaah-profile');
        }
    }, [router]);

    const loadJamaahData = async () => {
        if (typeof window !== 'undefined') {
            const role = localStorage.getItem('user_role');
            const name = localStorage.getItem('user_name');
            const email = localStorage.getItem('user_email');

            if (!role || (role !== 'JAMAAH' && role !== 'KELUARGA')) {
                router.push('/dashboard');
                return;
            }

            setUserRole(role);
            setUserName(name || 'Jamaah');
            setUserEmail(email || '');

            // Load jamaah data from backend
            try {
                console.log('🔄 Loading jamaah data...');
                const jamaahList = await jamaahService.getAll();
                console.log('📊 Total jamaah:', jamaahList.length);
                console.log('📧 My email:', email);

                const myData = jamaahList.find((j: Jamaah) => j.email === email);
                console.log('🔍 My data found:', myData ? 'YES' : 'NO');

                if (myData) {
                    console.log('✅ My jamaah data:', {
                        id: myData.id,
                        email: myData.email,
                        phone: myData.phone,
                        package_type: myData.package_type,
                        room_type: myData.room_type,
                        total_price: myData.total_price,
                    });
                    setJamaahData(myData);
                } else {
                    console.warn('⚠️ Jamaah data not found for email:', email);
                    console.log('📋 Available emails:', jamaahList.map(j => j.email));
                }
            } catch (error) {
                console.error('❌ Failed to load jamaah data:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleLogout = () => {
        authService.logout();
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getPackageName = (type?: string) => {
        const packages: Record<string, string> = {
            reguler: 'Paket Reguler',
            silver: 'Paket Silver',
            gold: 'Paket Gold',
            vip: 'Paket VIP',
        };
        return type ? packages[type] || type : 'Belum Dipilih';
    };

    const getRoomName = (type?: string) => {
        const rooms: Record<string, string> = {
            '4_person': '4 Orang per Kamar',
            '3_person': '3 Orang per Kamar',
            '2_person': '2 Orang per Kamar',
        };
        return type ? rooms[type] || type : 'Belum Dipilih';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F5132] to-[#1B5E20]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-white">Memuat...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0F5132] to-[#1B5E20]">
            {/* Header */}
            <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center">
                                <span className="text-[#0F5132] font-bold text-lg">
                                    {userName.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <h1 className="text-white font-bold text-lg">{userName}</h1>
                                <p className="text-emerald-200 text-xs">{userRole}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    setLoading(true);
                                    loadJamaahData();
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
                                title="Refresh data"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span className="hidden sm:inline">Refresh</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
                            >
                                <ArrowRightEndOnRectangleIcon className="w-5 h-5" />
                                <span className="hidden sm:inline">Keluar</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Welcome Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                        <div className="text-center mb-8">
                            <div className="w-24 h-24 bg-gradient-to-br from-[#0F5132] to-[#1B8C5E] rounded-full flex items-center justify-center mx-auto mb-4">
                                <UserCircleIcon className="w-16 h-16 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-[#0F5132] mb-2">
                                Selamat Datang, {userName}!
                            </h2>
                            <p className="text-gray-600">Dashboard Jamaah - Informasi Perjalanan Umroh Anda</p>
                        </div>

                        {/* Status Card */}
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
                                    <h3 className="text-lg font-bold text-emerald-900">Status Pendaftaran</h3>
                                </div>
                                <button
                                    onClick={() => router.push('/dashboard/lengkapi-data')}
                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                                >
                                    <PencilSquareIcon className="w-5 h-5" />
                                    <span>Lengkapi Data</span>
                                </button>
                            </div>
                            <p className="text-emerald-700">
                                Akun Anda telah terdaftar. Silakan lengkapi data perjalanan umroh Anda dengan mengklik tombol "Lengkapi Data" di atas.
                            </p>
                        </div>

                        {/* Info Sections */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personal Info */}
                            <div className="bg-gray-50 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-[#0F5132] mb-4 flex items-center gap-2">
                                    <UserCircleIcon className="w-5 h-5" />
                                    Informasi Pribadi
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <IdentificationIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500">Nama Lengkap</p>
                                            <p className="font-semibold text-gray-900">{jamaahData?.full_name || userName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <EnvelopeIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500">Email</p>
                                            <p className="font-semibold text-gray-900">{jamaahData?.email || userEmail || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <PhoneIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500">No. Telepon</p>
                                            <p className="font-semibold text-gray-900">{jamaahData?.phone || '-'}</p>
                                        </div>
                                    </div>
                                    {jamaahData?.ktp_number && (
                                        <div className="flex items-start gap-3">
                                            <IdentificationIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500">Nomor KTP</p>
                                                <p className="font-semibold text-gray-900">{jamaahData.ktp_number}</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-start gap-3">
                                        <IdentificationIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500">Nomor Paspor</p>
                                            <p className="font-semibold text-gray-900">{jamaahData?.passport_number || '-'}</p>
                                        </div>
                                    </div>
                                    {jamaahData?.address && (
                                        <div className="flex items-start gap-3">
                                            <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500">Alamat</p>
                                                <p className="font-semibold text-gray-900">{jamaahData.address}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Travel Info */}
                            <div className="bg-gray-50 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-[#0F5132] mb-4 flex items-center gap-2">
                                    <BuildingOfficeIcon className="w-5 h-5" />
                                    Informasi Paket
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <CheckCircleIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500">Paket Umroh</p>
                                            <p className="font-semibold text-gray-900">{getPackageName(jamaahData?.package_type)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <BuildingOfficeIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500">Tipe Kamar</p>
                                            <p className="font-semibold text-gray-900">{getRoomName(jamaahData?.room_type)}</p>
                                        </div>
                                    </div>
                                    {jamaahData?.total_price && (
                                        <div className="flex items-start gap-3">
                                            <CalendarIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500">Total Biaya</p>
                                                <p className="font-semibold text-emerald-600 text-lg">
                                                    {formatCurrency(Number(jamaahData.total_price))}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-start gap-3">
                                        <ClockIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-gray-500">Status Verifikasi</p>
                                            <p className={`font-semibold capitalize ${jamaahData?.verification_status === 'verified' ? 'text-green-600' :
                                                jamaahData?.verification_status === 'rejected' ? 'text-red-600' :
                                                    'text-yellow-600'
                                                }`}>
                                                {jamaahData?.verification_status === 'verified' ? 'Terverifikasi' :
                                                    jamaahData?.verification_status === 'rejected' ? 'Ditolak' :
                                                        'Menunggu Verifikasi'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#0F5132] to-[#1B8C5E] text-white rounded-xl hover:shadow-lg transition-all">
                                <MapPinIcon className="w-5 h-5" />
                                <span>Tracking Lokasi</span>
                            </button>
                            <button className="flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-[#0F5132] text-[#0F5132] rounded-xl hover:bg-emerald-50 transition-all">
                                <CalendarIcon className="w-5 h-5" />
                                <span>Jadwal Kegiatan</span>
                            </button>
                            <button className="flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-[#0F5132] text-[#0F5132] rounded-xl hover:bg-emerald-50 transition-all">
                                <PhoneIcon className="w-5 h-5" />
                                <span>Hubungi Admin</span>
                            </button>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <div className="flex items-start gap-3">
                            <ClockIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-blue-900 mb-2">Informasi Penting</h4>
                                <p className="text-sm text-blue-700">
                                    Untuk melengkapi data perjalanan umroh Anda, silakan hubungi admin travel atau kunjungi kantor cabang terdekat.
                                    Admin akan membantu Anda melengkapi dokumen dan informasi yang diperlukan.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
