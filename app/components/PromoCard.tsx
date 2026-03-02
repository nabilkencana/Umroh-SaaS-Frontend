'use client';

import Image from 'next/image';
import { Promo } from '@/lib/types';

interface PromoCardProps {
    promo: Promo;
}

export default function PromoCard({ promo }: PromoCardProps) {
    const isActive = promo.end_date ? new Date(promo.end_date) > new Date() : true;

    return (
        <div className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-[#D4AF37] hover:scale-105">
            {/* Banner Image */}
            <div className="relative h-48 overflow-hidden">
                {promo.banner_image ? (
                    <Image
                        src={promo.banner_image}
                        alt={promo.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#0F5132] to-[#1B5E20]" />
                )}

                {/* Discount Badge */}
                {promo.discount_percentage && (
                    <div className="absolute top-4 right-4 bg-[#D4AF37] text-[#0F5132] px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                        -{promo.discount_percentage}%
                    </div>
                )}

                {/* Featured Badge */}
                {promo.is_featured && (
                    <div className="absolute top-4 left-4 bg-[#0F5132] text-white px-3 py-1 rounded-full text-sm font-semibold">
                        ⭐ Featured
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-xl font-bold text-[#0F5132] mb-2 line-clamp-2">
                    {promo.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {promo.description || 'Promo spesial untuk perjalanan umroh Anda.'}
                </p>

                {/* Date Range */}
                {promo.start_date && promo.end_date && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <span>📅</span>
                        <span>
                            {new Date(promo.start_date).toLocaleDateString('id-ID')} - {new Date(promo.end_date).toLocaleDateString('id-ID')}
                        </span>
                    </div>
                )}

                {/* Status */}
                <div className="flex items-center justify-between">
                    <span className={`text-sm font-semibold ${isActive ? 'text-green-600' : 'text-red-600'}`}>
                        {isActive ? '✓ Aktif' : '✗ Berakhir'}
                    </span>

                    <button className="bg-[#0F5132] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#1B5E20] transition-colors">
                        Lihat Detail
                    </button>
                </div>
            </div>

            {/* Gold Border Animation */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 gold-border-shimmer" />
            </div>
        </div>
    );
}
