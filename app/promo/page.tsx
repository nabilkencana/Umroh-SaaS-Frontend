'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PromoCard from '../components/PromoCard';
import { mockPromos, mockTenants } from '@/lib/mock-data';
import { Promo } from '@/lib/types';

export default function PromoPage() {
    const [promos, setPromos] = useState<Promo[]>([]);
    const [filteredPromos, setFilteredPromos] = useState<Promo[]>([]);
    const [selectedTenant, setSelectedTenant] = useState<string>('all');
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        setPromos(mockPromos);
        setFilteredPromos(mockPromos);
    }, []);

    useEffect(() => {
        if (selectedTenant === 'all') {
            setFilteredPromos(promos);
        } else {
            setFilteredPromos(promos.filter(p => p.tenant_id === selectedTenant));
        }
    }, [selectedTenant, promos]);

    useEffect(() => {
        const featuredPromo = promos.find(p => p.is_featured && p.end_date);
        if (!featuredPromo?.end_date) return;

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const end = new Date(featuredPromo.end_date!).getTime();
            const distance = end - now;

            if (distance < 0) {
                clearInterval(timer);
                return;
            }

            setCountdown({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [promos]);

    const featuredPromo = promos.find(p => p.is_featured);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            {/* Hero Banner with Countdown */}
            {featuredPromo && (
                <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${featuredPromo.banner_image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F5132]/95 to-[#1B5E20]/90" />

                    <div className="relative z-10 text-center text-white px-4 max-w-4xl">
                        <div className="inline-block bg-[#D4AF37] text-[#0F5132] px-4 py-2 rounded-full font-bold mb-4">
                            ⭐ PROMO FEATURED
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            {featuredPromo.title}
                        </h1>
                        <p className="text-xl mb-8">
                            {featuredPromo.description}
                        </p>

                        {/* Countdown Timer */}
                        <div className="flex justify-center gap-4 mb-6">
                            {[
                                { label: 'Hari', value: countdown.days },
                                { label: 'Jam', value: countdown.hours },
                                { label: 'Menit', value: countdown.minutes },
                                { label: 'Detik', value: countdown.seconds },
                            ].map((item) => (
                                <div key={item.label} className="bg-white/20 backdrop-blur-sm rounded-lg p-4 min-w-[80px]">
                                    <div className="text-3xl font-bold text-[#D4AF37]">{item.value}</div>
                                    <div className="text-sm">{item.label}</div>
                                </div>
                            ))}
                        </div>

                        <button className="bg-[#D4AF37] text-[#0F5132] px-8 py-3 rounded-lg font-bold text-lg hover:bg-[#C4A037] transition-all hover:scale-105">
                            Ambil Promo Sekarang
                        </button>
                    </div>
                </section>
            )}

            {/* Filter Section */}
            <section className="py-8 bg-gray-50 border-b">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <label className="font-semibold text-[#0F5132]">Filter Travel:</label>
                        <select
                            value={selectedTenant}
                            onChange={(e) => setSelectedTenant(e.target.value)}
                            className="px-4 py-2 border-2 border-[#D4AF37] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                        >
                            <option value="all">Semua Travel</option>
                            {mockTenants.map(tenant => (
                                <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                            ))}
                        </select>

                        <div className="ml-auto text-sm text-gray-600">
                            Menampilkan {filteredPromos.length} promo
                        </div>
                    </div>
                </div>
            </section>

            {/* Promo Grid */}
            <section className="py-12 islamic-pattern flex-grow">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-[#0F5132] mb-8">
                        Promo Tersedia
                    </h2>

                    {filteredPromos.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">🎫</div>
                            <p className="text-xl text-gray-600">Tidak ada promo tersedia saat ini</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredPromos.map(promo => (
                                <PromoCard key={promo.id} promo={promo} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
