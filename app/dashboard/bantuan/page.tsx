'use client';

import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    QuestionMarkCircleIcon,
    BookOpenIcon,
    ChatBubbleLeftRightIcon,
    PhoneIcon,
    EnvelopeIcon,
    DocumentTextIcon,
    VideoCameraIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    MagnifyingGlassIcon,
    RocketLaunchIcon,
    UserGroupIcon,
    CreditCardIcon,
    ShieldCheckIcon,
    ArrowTopRightOnSquareIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

interface FaqItem {
    id: string;
    question: string;
    answer: string;
    category: string;
}

interface GuideItem {
    id: string;
    title: string;
    description: string;
    icon: any;
    duration: string;
    level: 'Pemula' | 'Menengah' | 'Lanjutan';
}

export default function HelpPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState('all');

    const faqData: FaqItem[] = [
        {
            id: '1',
            question: 'Bagaimana cara menambahkan jamaah baru?',
            answer: 'Anda dapat menambahkan jamaah baru melalui menu "Jamaah" kemudian klik tombol "Tambah Jamaah". Isi formulir dengan lengkap dan klik "Simpan". Jamaah baru akan otomatis terdaftar dalam sistem.',
            category: 'jamaah'
        },
        {
            id: '2',
            question: 'Bagaimana cara membuat promo?',
            answer: 'Untuk membuat promo baru, buka menu "Kelola Promo" dan klik "Tambah Promo". Tentukan judul, diskon, periode berlaku, dan deskripsi promo. Pastikan promo aktif untuk mulai digunakan.',
            category: 'promo'
        },
        {
            id: '3',
            question: 'Apa itu fitur tracking real-time?',
            answer: 'Fitur tracking memungkinkan Anda memantau posisi jamaah secara real-time selama perjalanan. Setiap jamaah akan terlihat di peta dengan informasi lokasi, akurasi GPS, dan status baterai perangkat.',
            category: 'tracking'
        },
        {
            id: '4',
            question: 'Bagaimana cara melihat laporan analytics?',
            answer: 'Laporan analytics dapat diakses melalui menu "Analytics". Di sini Anda dapat melihat pertumbuhan jamaah, performa promo, dan statistik penting lainnya dalam bentuk grafik interaktif.',
            category: 'analytics'
        },
        {
            id: '5',
            question: 'Apakah data aman di sistem ini?',
            answer: 'Ya, semua data dienkripsi dan disimpan dengan aman. Kami menggunakan protokol keamanan terkini dan melakukan backup data secara rutin. Akses data juga dilindungi dengan verifikasi dua langkah.',
            category: 'keamanan'
        },
        {
            id: '6',
            question: 'Bagaimana cara mengatur jadwal perjalanan?',
            answer: 'Buka menu "Perjalanan" untuk melihat dan mengelola jadwal. Anda dapat menambahkan perjalanan baru, mengatur kapasitas, dan melihat daftar jamaah yang terdaftar di setiap perjalanan.',
            category: 'perjalanan'
        },
    ];

    const guides: GuideItem[] = [
        {
            id: '1',
            title: 'Panduan Memulai',
            description: 'Pelajari dasar-dasar penggunaan sistem untuk pemula',
            icon: RocketLaunchIcon,
            duration: '10 menit',
            level: 'Pemula'
        },
        {
            id: '2',
            title: 'Manajemen Jamaah',
            description: 'Cara efektif mengelola data dan status jamaah',
            icon: UserGroupIcon,
            duration: '15 menit',
            level: 'Pemula'
        },
        {
            id: '3',
            title: 'Kampanye Promo',
            description: 'Strategi membuat dan mengelola promo yang menarik',
            icon: CreditCardIcon,
            duration: '20 menit',
            level: 'Menengah'
        },
        {
            id: '4',
            title: 'Keamanan & Backup',
            description: 'Tips menjaga keamanan data dan backup rutin',
            icon: ShieldCheckIcon,
            duration: '15 menit',
            level: 'Menengah'
        },
    ];

    const categories = [
        { id: 'all', label: 'Semua', count: faqData.length },
        { id: 'jamaah', label: 'Jamaah', count: faqData.filter(f => f.category === 'jamaah').length },
        { id: 'promo', label: 'Promo', count: faqData.filter(f => f.category === 'promo').length },
        { id: 'tracking', label: 'Tracking', count: faqData.filter(f => f.category === 'tracking').length },
        { id: 'analytics', label: 'Analytics', count: faqData.filter(f => f.category === 'analytics').length },
        { id: 'perjalanan', label: 'Perjalanan', count: faqData.filter(f => f.category === 'perjalanan').length },
        { id: 'keamanan', label: 'Keamanan', count: faqData.filter(f => f.category === 'keamanan').length },
    ];

    const filteredFaqs = faqData.filter(faq =>
        (selectedCategory === 'all' || faq.category === selectedCategory) &&
        (faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'Pemula':
                return 'bg-green-100 text-green-700';
            case 'Menengah':
                return 'bg-yellow-100 text-yellow-700';
            case 'Lanjutan':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
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
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0F5132] to-[#1B8C5E] bg-clip-text text-transparent flex items-center gap-2">
                        <QuestionMarkCircleIcon className="w-8 h-8 text-[#0F5132]" />
                        Pusat Bantuan
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Temukan jawaban dan panduan untuk membantu Anda menggunakan sistem
                    </p>
                </div>

                {/* Search */}
                <div className="relative">
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Cari pertanyaan atau topik..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] transition-colors"
                    />
                </div>

                {/* Quick Help Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                    >
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                            <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
                        <p className="text-sm text-gray-500 mb-4">Chat dengan tim support kami secara langsung</p>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                            Mulai Chat
                            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                        </button>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                    >
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                            <PhoneIcon className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Call Center</h3>
                        <p className="text-sm text-gray-500 mb-4">Hubungi kami di nomor telepon berikut</p>
                        <p className="text-sm font-semibold text-gray-900">+62 21 1234 5678</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                    >
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                            <EnvelopeIcon className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
                        <p className="text-sm text-gray-500 mb-4">Kirim pertanyaan via email</p>
                        <p className="text-sm font-semibold text-gray-900">support@umrohsaas.com</p>
                    </motion.div>
                </div>

                {/* Panduan Section */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-[#0F5132] flex items-center gap-2">
                            <BookOpenIcon className="w-5 h-5" />
                            Panduan & Tutorial
                        </h2>
                        <button className="text-sm text-[#0F5132] hover:text-[#1B8C5E] font-medium">
                            Lihat Semua
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {guides.map((guide) => {
                            const Icon = guide.icon;
                            return (
                                <motion.div
                                    key={guide.id}
                                    whileHover={{ scale: 1.02 }}
                                    className="p-4 border border-gray-200 rounded-xl hover:border-[#0F5132] transition-colors cursor-pointer group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-[#0F5132] transition-colors">
                                            <Icon className="w-5 h-5 text-gray-600 group-hover:text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 group-hover:text-[#0F5132]">
                                                {guide.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">{guide.description}</p>
                                            <div className="flex items-center gap-3 mt-3">
                                                <span className={`text-xs px-2 py-1 rounded-full ${getLevelColor(guide.level)}`}>
                                                    {guide.level}
                                                </span>
                                                <span className="text-xs text-gray-400">{guide.duration}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-[#0F5132] flex items-center gap-2 mb-4">
                            <DocumentTextIcon className="w-5 h-5" />
                            Pertanyaan Umum (FAQ)
                        </h2>

                        {/* Category Filters */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${selectedCategory === category.id
                                            ? 'bg-[#0F5132] text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {category.label} ({category.count})
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {filteredFaqs.map((faq) => (
                            <div key={faq.id} className="p-6">
                                <button
                                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                                    className="w-full flex items-start justify-between text-left"
                                >
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                                        <AnimatePresence>
                                            {expandedFaq === faq.id && (
                                                <motion.p
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="text-gray-600 mt-3 text-sm"
                                                >
                                                    {faq.answer}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <div className="ml-4">
                                        {expandedFaq === faq.id ? (
                                            <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                                        ) : (
                                            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                                        )}
                                    </div>
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredFaqs.length === 0 && (
                        <div className="text-center py-12">
                            <QuestionMarkCircleIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak Ditemukan</h3>
                            <p className="text-gray-500 mb-4">Tidak ada pertanyaan yang sesuai dengan pencarian Anda</p>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('all');
                                }}
                                className="px-6 py-2 bg-[#0F5132] text-white rounded-xl font-medium"
                            >
                                Reset Filter
                            </button>
                        </div>
                    )}
                </div>

                {/* Contact Form */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <h2 className="text-xl font-bold text-[#0F5132] mb-6">Kirim Pertanyaan</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nama Lengkap
                            </label>
                            <input
                                type="text"
                                placeholder="Masukkan nama Anda"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="email@example.com"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] transition-colors"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Subjek
                            </label>
                            <input
                                type="text"
                                placeholder="Ringkasan pertanyaan Anda"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] transition-colors"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Pesan
                            </label>
                            <textarea
                                rows={4}
                                placeholder="Tulis pertanyaan Anda secara detail..."
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F5132] transition-colors"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-4">
                        <button className="px-6 py-3 bg-[#0F5132] text-white rounded-xl hover:bg-[#1B8C5E] transition-colors font-medium">
                            Kirim Pesan
                        </button>
                    </div>
                </div>
            </motion.div>
        </DashboardLayout>
    );
}