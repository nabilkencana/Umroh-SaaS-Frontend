'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { mockPromos, mockTenants } from '@/lib/mock-data';

// Fungsi helper untuk format Rupiah dengan aman
const formatRupiah = (value) => {
  if (!value || isNaN(value)) return 'Rp 34.000.000'; // Default value jika input tidak valid
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Komponen PromoCard yang diperbaiki dengan ukuran seragam
const PromoCard = ({ promo }) => {
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    if (!promo.end_date) return;

    const updateTimeRemaining = () => {
      const now = Date.now();
      const end = new Date(promo.end_date).getTime();
      const distance = end - now;

      if (distance <= 0) {
        setTimeRemaining('Berakhir');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeRemaining(`${days} hari ${hours} jam`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours} jam ${minutes} menit`);
      } else {
        setTimeRemaining(`${minutes} menit`);
      }
    };

    updateTimeRemaining();
    const timer = setInterval(updateTimeRemaining, 60000);
    return () => clearInterval(timer);
  }, [promo.end_date]);

  const tenant = mockTenants.find(t => t.id === promo.tenant_id);

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group h-full"
    >
      <div className="relative h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col">
        {/* Image Container */}
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src="/images/makkah-hero.webp"
            alt="Makkah Background"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority
          />
          
          {/* Badge Diskon */}
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-[#D4AF37] text-[#0F5132] text-sm font-bold px-3 py-1 rounded-full">
              {promo.discount || 'Diskon Spesial'}
            </span>
          </div>

          {/* Badge Featured */}
          {promo.is_featured && (
            <div className="absolute top-4 right-4 z-10">
              <span className="bg-[#0F5132] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col">
          {/* Tenant Name */}
          <div className="flex items-center gap-2 mb-2">
            {tenant?.logo ? (
              <div className="relative w-5 h-5 rounded-full overflow-hidden">
                <Image src={tenant.logo} alt={tenant.name} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-xs text-emerald-700">
                {tenant?.name?.charAt(0) || 'T'}
              </div>
            )}
            <span className="text-xs font-medium text-emerald-700">{tenant?.name || 'Travel Partner'}</span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
            {promo.title || 'Promo Spesial Umroh'}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">
            {promo.description || 'Paket umroh dengan fasilitas terbaik'}
          </p>

          {/* Price */}
          <div className="mb-4">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-2xl font-bold text-[#0F5132]">
                {formatRupiah(promo.price)}
              </span>
              {promo.original_price && !isNaN(promo.original_price) && (
                <span className="text-sm text-gray-400 line-through">
                  {formatRupiah(promo.original_price)}
                </span>
              )}
            </div>
          </div>

          {/* Time Remaining */}
          <div className="mb-4 min-h-[2rem]">
            {promo.end_date && (
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-600">
                  {timeRemaining === 'Berakhir' ? (
                    <span className="text-red-500 font-medium">Promo berakhir</span>
                  ) : timeRemaining ? (
                    <span>Berakhir dalam <span className="font-semibold text-emerald-700">{timeRemaining}</span></span>
                  ) : (
                    <span className="text-emerald-600 font-medium">Segera berakhir</span>
                  )}
                </span>
              </div>
            )}
          </div>

          {/* Button */}
          <button className="w-full mt-auto bg-emerald-50 hover:bg-emerald-100 text-[#0F5132] font-semibold py-3 px-4 rounded-xl transition-all hover:shadow-md flex items-center justify-center gap-2 group/btn">
            <span>Lihat Detail</span>
            <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function PromoPage() {
  const [selectedTenant, setSelectedTenant] = useState<string>('all');
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const featuredPromo = useMemo(() => mockPromos.find((p) => p.is_featured), []);
  const filteredPromos = useMemo(
    () => (selectedTenant === 'all' ? mockPromos : mockPromos.filter((p) => p.tenant_id === selectedTenant)),
    [selectedTenant],
  );

  useEffect(() => {
    if (!featuredPromo?.end_date) return;

    const updateCountdown = () => {
      const now = Date.now();
      const end = new Date(featuredPromo.end_date).getTime();
      const distance = Math.max(end - now, 0);

      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [featuredPromo]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      {featuredPromo && (
        <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/images/makkah-hero.webp"
              alt="Makkah Background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Konten */}
          <div className="relative z-10 mx-auto max-w-5xl px-4 py-20 text-center text-white">
            <div className="space-y-6">
              {/* Badge */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block"
              >
                <span className="bg-[#D4AF37] text-[#0F5132] px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
                  Promo Spesial Bulan Ini
                </span>
              </motion.div>

              {/* Main Title */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-6xl lg:text-7xl font-black text-white"
              >
                {featuredPromo.title}
              </motion.h1>

              {/* Description */}
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed"
              >
                {featuredPromo.description}
              </motion.p>

              {/* BERAKHIR DALAM */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="pt-4"
              >
                <p className="text-sm uppercase tracking-[0.2em] text-white/80 font-semibold">
                  BERAKHIR DALAM
                </p>
              </motion.div>

              {/* Countdown Timer - Enhanced Version */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center gap-4 md:gap-6"
              >
                {[
                  { label: 'Hari', value: countdown.days },
                  { label: 'Jam', value: countdown.hours },
                  { label: 'Menit', value: countdown.minutes },
                  { label: 'Detik', value: countdown.seconds },
                ].map((item, index) => (
                  <div key={item.label} className="text-center group">
                    {/* Card dengan background premium */}
                    <div className="relative">
                      {/* Background glow effect */}
                      <div className="absolute inset-0 bg-[#D4AF37]/20 rounded-2xl blur-xl group-hover:bg-[#D4AF37]/30 transition-all duration-300" />

                      {/* Main card dengan multiple layers */}
                      <div className="relative bg-gradient-to-b from-[#2A2A2A] to-[#1A1A1A] rounded-2xl p-4 md:p-6 min-w-[90px] md:min-w-[110px] shadow-2xl border border-[#D4AF37]/30 group-hover:border-[#D4AF37]/60 transition-all duration-300">

                        {/* Inner shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent rounded-2xl" />

                        {/* Angka dengan efek 3D */}
                        <div className="relative">
                          {/* Shadow angka untuk efek depth */}
                          <div className="absolute inset-0 text-4xl md:text-5xl lg:text-6xl font-black text-black/20 blur-sm translate-y-1">
                            {String(item.value).padStart(2, '0')}
                          </div>

                          {/* Angka utama dengan gradient emas */}
                          <div className="relative text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-b from-[#D4AF37] to-[#B49450] bg-clip-text text-transparent drop-shadow-lg">
                            {String(item.value).padStart(2, '0')}
                          </div>
                        </div>

                        {/* Label dengan background transparan */}
                        <div className="relative mt-2 text-sm md:text-base font-medium">
                          <span className="text-white/90 group-hover:text-[#D4AF37] transition-colors duration-300">
                            {item.label}
                          </span>
                        </div>

                        {/* Decorative corner accents */}
                        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37]/40 rounded-tl-lg" />
                        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37]/40 rounded-br-lg" />
                      </div>
                    </div>

                    {/* Connector line untuk efek berantai (kecuali item terakhir) */}
                    {index < 3 && (
                      <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                        <div className="w-2 h-2 bg-[#D4AF37]/40 rounded-full" />
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>

              {/* Additional decorative element - Timer Progress Bar */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="max-w-md mx-auto mt-8 h-1 bg-white/10 rounded-full overflow-hidden"
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F5D742]"
                  initial={{ width: "0%" }}
                  animate={{ width: "75%" }} // Sesuaikan dengan progress timer
                  transition={{ delay: 0.8, duration: 1 }}
                />
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="pt-4"
              >
                <button className="group inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#C4A037] text-[#0F5132] font-bold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 hover:shadow-xl">
                  <span>Ambil Promo Sekarang</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Filter Section */}
      <section className="sticky top-0 z-20 border-b border-emerald-100 bg-white/80 backdrop-blur-md py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline font-semibold text-[#0F5132]">Filter Travel:</span>
              
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="sm:hidden flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-[#0F5132]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter
                <span className="ml-1 rounded-full bg-[#0F5132] px-2 py-0.5 text-xs text-white">
                  {filteredPromos.length}
                </span>
              </button>

              <select
                value={selectedTenant}
                onChange={(e) => setSelectedTenant(e.target.value)}
                className="hidden sm:block rounded-xl border border-emerald-200 bg-white px-4 py-2.5 pr-8 text-gray-700 focus:border-[#0F5132] focus:outline-none focus:ring-2 focus:ring-[#0F5132]/20"
              >
                <option value="all">Semua Travel</option>
                {mockTenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </option>
                ))}
              </select>
            </div>

            <motion.div 
              key={filteredPromos.length}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="rounded-full bg-gradient-to-r from-emerald-50 to-emerald-100 px-4 py-2 text-sm font-medium text-emerald-900 border border-emerald-200"
            >
              <span className="font-bold text-[#0F5132]">{filteredPromos.length}</span> promo tersedia
            </motion.div>
          </div>

          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="sm:hidden mt-4"
              >
                <div className="bg-white rounded-xl border border-emerald-100 p-4 shadow-lg">
                  <p className="text-sm font-medium text-gray-600 mb-2">Pilih Travel:</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setSelectedTenant('all');
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedTenant === 'all' 
                          ? 'bg-[#0F5132] text-white' 
                          : 'bg-gray-50 text-gray-700 hover:bg-emerald-50'
                      }`}
                    >
                      Semua Travel
                    </button>
                    {mockTenants.map((tenant) => (
                      <button
                        key={tenant.id}
                        onClick={() => {
                          setSelectedTenant(tenant.id);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          selectedTenant === tenant.id 
                            ? 'bg-[#0F5132] text-white' 
                            : 'bg-gray-50 text-gray-700 hover:bg-emerald-50'
                        }`}
                      >
                        {tenant.name}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Promo Grid Section */}
      <section className="relative flex-grow py-16 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #0F5132 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          {/* Section Title */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#0F5132] mb-4">
              Promo Spesial
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                untuk Perjalanan Ibadah Anda
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Dapatkan penawaran terbaik dari berbagai travel partner terpercaya
            </p>
          </motion.div>

          {/* Promo Cards Grid */}
          {filteredPromos.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="inline-flex p-6 rounded-full bg-emerald-100 mb-6">
                <span className="text-6xl">🎫</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Tidak Ada Promo Tersedia</h3>
              <p className="text-gray-600">Saat ini belum ada promo untuk filter yang Anda pilih</p>
              <button
                onClick={() => setSelectedTenant('all')}
                className="mt-6 inline-flex items-center gap-2 text-[#0F5132] font-semibold hover:gap-3 transition-all"
              >
                <span>Lihat semua promo</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
              {filteredPromos.map((promo, index) => (
                <motion.div
                  key={promo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="h-full"
                >
                  <PromoCard promo={promo} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="relative py-20 bg-gradient-to-r from-[#0F5132] to-[#1B5E20] overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
        
        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Dapatkan Info Promo Terbaru
            </h3>
            <p className="text-emerald-100 mb-8">
              Berlangganan newsletter kami untuk mendapatkan notifikasi promo spesial langsung di email Anda
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Masukkan email Anda"
                className="flex-1 px-6 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
              <button className="px-8 py-4 rounded-xl bg-[#D4AF37] text-[#0F5132] font-bold hover:bg-[#C4A037] transition-all hover:scale-105">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}