'use client';

import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion'; // Tambahkan AnimatePresence di sini
import {
    UserCircleIcon,
    BuildingOfficeIcon,
    BellIcon,
    LockClosedIcon,
    PaintBrushIcon,
    GlobeAltIcon,
    DocumentTextIcon,
    DevicePhoneMobileIcon,
    EnvelopeIcon,
    KeyIcon,
    ShieldCheckIcon,
    ArrowPathIcon,
    CheckCircleIcon,
    XMarkIcon,
    PencilIcon,
    CameraIcon
} from '@heroicons/react/24/outline';
import { ShieldCheckIcon as ShieldCheckIconSolid } from '@heroicons/react/24/solid';

interface SettingSection {
    id: string;
    title: string;
    icon: any;
    description: string;
}

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');
    const [showSuccess, setShowSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const sections: SettingSection[] = [
        { id: 'profile', title: 'Profil', icon: UserCircleIcon, description: 'Kelola informasi pribadi Anda' },
        { id: 'company', title: 'Perusahaan', icon: BuildingOfficeIcon, description: 'Informasi perusahaan dan cabang' },
        { id: 'notifications', title: 'Notifikasi', icon: BellIcon, description: 'Atur preferensi notifikasi' },
        { id: 'security', title: 'Keamanan', icon: LockClosedIcon, description: 'Pengaturan keamanan akun' },
        { id: 'appearance', title: 'Tampilan', icon: PaintBrushIcon, description: 'Sesuaikan tema dan tampilan' },
        { id: 'language', title: 'Bahasa', icon: GlobeAltIcon, description: 'Pengaturan bahasa dan regional' },
    ];

    const handleSave = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 1500);
    };

    // Success Notification
    const SuccessNotification = () => (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 right-4 z-50 bg-green-100 border border-green-200 text-green-700 px-6 py-4 rounded-xl shadow-lg flex items-center gap-3"
        >
            <CheckCircleIcon className="w-5 h-5 text-green-500" />
            <span>Pengaturan berhasil disimpan!</span>
            <button onClick={() => setShowSuccess(false)} className="ml-4">
                <XMarkIcon className="w-4 h-4 text-green-500" />
            </button>
        </motion.div>
    );

    // Profile Section
    const ProfileSection = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Profile Picture */}
            <div className="flex items-center gap-6">
                <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0F5132] to-[#1B8C5E] flex items-center justify-center text-white text-3xl font-bold">
                        AC
                    </div>
                    <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-lg border border-gray-200 group-hover:bg-gray-50 transition-colors">
                        <CameraIcon className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">Foto Profil</h3>
                    <p className="text-sm text-gray-500 mt-1">JPG, GIF atau PNG. Maksimal 2MB</p>
                    <button className="mt-2 text-sm text-[#0F5132] hover:text-[#1B8C5E] font-medium">
                        Upload foto baru
                    </button>
                </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Lengkap
                    </label>
                    <input
                        type="text"
                        defaultValue="Admin Cabang"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        defaultValue="admin@umroh.com"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nomor Telepon
                    </label>
                    <input
                        type="tel"
                        defaultValue="+62 812 3456 7890"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jabatan
                    </label>
                    <input
                        type="text"
                        defaultValue="Admin Cabang"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] transition-colors"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                    </label>
                    <textarea
                        rows={3}
                        defaultValue="Admin dengan pengalaman 5 tahun di bidang travel umroh."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] transition-colors"
                    />
                </div>
            </div>
        </motion.div>
    );

    // Company Section
    const CompanySection = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Perusahaan
                    </label>
                    <input
                        type="text"
                        defaultValue="Umroh SaaS Indonesia"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nomor Izin
                    </label>
                    <input
                        type="text"
                        defaultValue="PPIU 123456"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        NPWP
                    </label>
                    <input
                        type="text"
                        defaultValue="01.234.567.8-901.234"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] transition-colors"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alamat Kantor
                    </label>
                    <textarea
                        rows={3}
                        defaultValue="Jl. Contoh No. 123, Jakarta Selatan"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telepon Kantor
                    </label>
                    <input
                        type="text"
                        defaultValue="+62 21 1234 5678"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Kantor
                    </label>
                    <input
                        type="email"
                        defaultValue="info@umrohsaas.com"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] transition-colors"
                    />
                </div>
            </div>
        </motion.div>
    );

    // Notifications Section
    const NotificationsSection = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
        >
            <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <EnvelopeIcon className="w-5 h-5 text-gray-600" />
                        <div>
                            <p className="font-medium text-gray-900">Email Notifikasi</p>
                            <p className="text-sm text-gray-500">Terima notifikasi via email</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F5132]"></div>
                    </label>
                </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <DevicePhoneMobileIcon className="w-5 h-5 text-gray-600" />
                        <div>
                            <p className="font-medium text-gray-900">Push Notifikasi</p>
                            <p className="text-sm text-gray-500">Terima notifikasi di browser</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F5132]"></div>
                    </label>
                </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <BellIcon className="w-5 h-5 text-gray-600" />
                        <div>
                            <p className="font-medium text-gray-900">Notifikasi WhatsApp</p>
                            <p className="text-sm text-gray-500">Terima notifikasi via WhatsApp</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F5132]"></div>
                    </label>
                </div>
            </div>
        </motion.div>
    );

    // Security Section
    const SecuritySection = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <ShieldCheckIconSolid className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                        <p className="font-medium text-yellow-800">Verifikasi Dua Langkah</p>
                        <p className="text-sm text-yellow-700 mt-1">
                            Aktifkan verifikasi dua langkah untuk keamanan akun yang lebih baik
                        </p>
                        <button className="mt-2 text-sm text-yellow-700 hover:text-yellow-800 font-medium underline">
                            Aktifkan sekarang
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kata Sandi Saat Ini
                    </label>
                    <input
                        type="password"
                        placeholder="********"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kata Sandi Baru
                    </label>
                    <input
                        type="password"
                        placeholder="Minimal 8 karakter"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Konfirmasi Kata Sandi Baru
                    </label>
                    <input
                        type="password"
                        placeholder="********"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] transition-colors"
                    />
                </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <KeyIcon className="w-5 h-5 text-gray-600" />
                        <div>
                            <p className="font-medium text-gray-900">Sesi Aktif</p>
                            <p className="text-sm text-gray-500">Anda login dari 2 perangkat</p>
                        </div>
                    </div>
                    <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                        Keluar dari semua perangkat
                    </button>
                </div>
            </div>
        </motion.div>
    );

    // Appearance Section
    const AppearanceSection = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
        >
            <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-medium text-gray-900 mb-3">Tema</p>
                <div className="grid grid-cols-3 gap-3">
                    <button className="p-3 border-2 border-[#0F5132] bg-white rounded-xl text-center">
                        <div className="w-full h-8 bg-gray-100 rounded-lg mb-2"></div>
                        <span className="text-sm font-medium">Terang</span>
                    </button>
                    <button className="p-3 border border-gray-200 bg-white rounded-xl text-center hover:border-gray-300 transition-colors">
                        <div className="w-full h-8 bg-gray-800 rounded-lg mb-2"></div>
                        <span className="text-sm font-medium">Gelap</span>
                    </button>
                    <button className="p-3 border border-gray-200 bg-white rounded-xl text-center hover:border-gray-300 transition-colors">
                        <div className="w-full h-8 bg-gradient-to-r from-gray-100 to-gray-800 rounded-lg mb-2"></div>
                        <span className="text-sm font-medium">Sistem</span>
                    </button>
                </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-medium text-gray-900 mb-3">Ukuran Font</p>
                <div className="flex items-center gap-3">
                    <input
                        type="range"
                        min="12"
                        max="24"
                        defaultValue="16"
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0F5132]"
                    />
                    <span className="text-sm text-gray-600">16px</span>
                </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-gray-900">Animasi</p>
                        <p className="text-sm text-gray-500">Aktifkan animasi antarmuka</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F5132]"></div>
                    </label>
                </div>
            </div>
        </motion.div>
    );

    // Language Section
    const LanguageSection = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
        >
            <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bahasa
                </label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] bg-white">
                    <option value="id">Indonesia</option>
                    <option value="en">English</option>
                    <option value="ar">العربية</option>
                </select>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zona Waktu
                </label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] bg-white">
                    <option value="wib">WIB (UTC+7)</option>
                    <option value="wita">WITA (UTC+8)</option>
                    <option value="wit">WIT (UTC+9)</option>
                </select>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Format Tanggal
                </label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] bg-white">
                    <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                    <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                    <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                </select>
            </div>
        </motion.div>
    );

    const renderSection = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileSection />;
            case 'company':
                return <CompanySection />;
            case 'notifications':
                return <NotificationsSection />;
            case 'security':
                return <SecuritySection />;
            case 'appearance':
                return <AppearanceSection />;
            case 'language':
                return <LanguageSection />;
            default:
                return <ProfileSection />;
        }
    };

    return (
        <DashboardLayout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0F5132] to-[#1B8C5E] bg-clip-text text-transparent">
                        Pengaturan
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Kelola preferensi dan pengaturan akun Anda
                    </p>
                </div>

                {/* Settings Layout */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar */}
                    <div className="lg:w-72 space-y-2">
                        {sections.map((section) => {
                            const Icon = section.icon;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveTab(section.id)}
                                    className={`w-full flex items-start gap-3 p-4 rounded-xl transition-all ${activeTab === section.id
                                            ? 'bg-[#0F5132] text-white shadow-lg'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 ${activeTab === section.id ? 'text-white' : 'text-gray-500'}`} />
                                    <div className="text-left">
                                        <p className="font-medium">{section.title}</p>
                                        <p className={`text-xs mt-0.5 ${activeTab === section.id ? 'text-emerald-100' : 'text-gray-400'}`}>
                                            {section.description}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">
                                {sections.find(s => s.id === activeTab)?.title}
                            </h2>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className="px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isLoading}
                                    className="px-6 py-2 bg-[#0F5132] text-white rounded-xl hover:bg-[#1B8C5E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                            </div>
                        </div>

                        {renderSection()}
                    </div>
                </div>

                {/* Success Notification */}
                <AnimatePresence>
                    {showSuccess && <SuccessNotification />}
                </AnimatePresence>
            </motion.div>
        </DashboardLayout>
    );
}