'use client';

import { useState } from 'react';
import {
    QuestionMarkCircleIcon,
    XMarkIcon,
    ChatBubbleLeftRightIcon,
    PhoneIcon,
    EnvelopeIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

export default function SupportButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [showChatModal, setShowChatModal] = useState(false);
    const [chatMessage, setChatMessage] = useState('');
    const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'support', message: string, time: string }>>([
        { sender: 'support', message: 'Halo! Ada yang bisa kami bantu?', time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }
    ]);

    const handleChatSupport = () => {
        setIsOpen(false);
        setShowChatModal(true);
    };

    const handleSendMessage = () => {
        if (!chatMessage.trim()) return;

        const newMessage = {
            sender: 'user' as const,
            message: chatMessage,
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        };

        setChatMessages([...chatMessages, newMessage]);
        setChatMessage('');

        // Auto reply dari support (simulasi)
        setTimeout(() => {
            const autoReply = {
                sender: 'support' as const,
                message: 'Terima kasih atas pesan Anda. Tim support kami akan segera merespons. Untuk bantuan lebih cepat, silakan hubungi kami di 1500-123 atau email support@umrohsaas.com',
                time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
            };
            setChatMessages(prev => [...prev, autoReply]);
        }, 1000);
    };

    const handlePhoneCall = () => {
        const phoneNumber = '1500123';
        // Coba buka aplikasi telepon
        window.location.href = `tel:${phoneNumber}`;
        setIsOpen(false);
    };

    const handleEmail = () => {
        const email = 'support@umrohsaas.com';
        const subject = 'Bantuan - Umroh SaaS';
        const body = 'Halo Tim Support,%0D%0A%0D%0ASaya membutuhkan bantuan terkait:%0D%0A%0D%0A[Jelaskan masalah Anda di sini]%0D%0A%0D%0ATerima kasih.';

        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
        setIsOpen(false);
    };

    const handleDocumentation = () => {
        // Buka dokumentasi di tab baru
        window.open('https://docs.umrohsaas.com', '_blank');
        setIsOpen(false);
    };

    const supportOptions = [
        {
            icon: ChatBubbleLeftRightIcon,
            label: 'Chat Support',
            description: 'Chat langsung dengan tim support',
            action: handleChatSupport
        },
        {
            icon: PhoneIcon,
            label: 'Telepon',
            description: 'Hubungi kami di 1500-123',
            action: handlePhoneCall
        },
        {
            icon: EnvelopeIcon,
            label: 'Email',
            description: 'support@umrohsaas.com',
            action: handleEmail
        },
        {
            icon: DocumentTextIcon,
            label: 'Dokumentasi',
            description: 'Panduan penggunaan sistem',
            action: handleDocumentation
        }
    ];

    return (
        <>
            {/* Floating Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-br from-[#0F5132] to-[#1B8C5E] text-white rounded-full shadow-xl flex items-center justify-center hover:shadow-2xl transition-shadow"
                aria-label="Bantuan"
            >
                <QuestionMarkCircleIcon className="w-6 h-6" />
            </motion.button>

            {/* Support Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-2xl max-w-md w-full p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-[#0F5132]">Bantuan & Dukungan</h2>
                                    <p className="text-gray-600 mt-1">Pilih cara untuk mendapatkan bantuan</p>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <XMarkIcon className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {supportOptions.map((option, index) => {
                                    const Icon = option.icon;
                                    return (
                                        <motion.button
                                            key={option.label}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={option.action}
                                            className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left"
                                        >
                                            <div className="p-3 bg-white rounded-lg shadow-sm">
                                                <Icon className="w-5 h-5 text-[#0F5132]" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-900">{option.label}</p>
                                                <p className="text-sm text-gray-500">{option.description}</p>
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <p className="text-sm text-gray-500 text-center">
                                    Jam operasional: Senin - Jumat, 08:00 - 17:00 WIB
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Modal */}
            <AnimatePresence>
                {showChatModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center p-0 md:p-4"
                        onClick={() => setShowChatModal(false)}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="bg-white rounded-t-2xl md:rounded-2xl max-w-lg w-full h-[80vh] md:h-[600px] flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Chat Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-[#0F5132] to-[#1B8C5E] rounded-t-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                                        <ChatBubbleLeftRightIcon className="w-5 h-5 text-[#0F5132]" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">Chat Support</h3>
                                        <p className="text-xs text-emerald-100">Tim support siap membantu</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowChatModal(false)}
                                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <XMarkIcon className="w-5 h-5 text-white" />
                                </button>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                                {chatMessages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[80%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                                            <div
                                                className={`p-3 rounded-2xl ${msg.sender === 'user'
                                                        ? 'bg-[#0F5132] text-white rounded-br-none'
                                                        : 'bg-white text-gray-900 rounded-bl-none shadow-sm'
                                                    }`}
                                            >
                                                <p className="text-sm">{msg.message}</p>
                                            </div>
                                            <p className={`text-xs text-gray-500 mt-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                                {msg.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Chat Input */}
                            <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={chatMessage}
                                        onChange={(e) => setChatMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Ketik pesan Anda..."
                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132] focus:border-transparent"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        className="px-6 py-3 bg-gradient-to-r from-[#0F5132] to-[#1B8C5E] text-white rounded-xl hover:opacity-90 transition-opacity font-medium"
                                    >
                                        Kirim
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-2 text-center">
                                    Respon biasanya dalam 5-10 menit
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}