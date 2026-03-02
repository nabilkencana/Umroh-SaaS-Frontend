"use client";

import Link from 'next/link';
import Image from 'next/image';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const featureHighlights = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    title: 'Live Tracking',
    description: 'Pantau pergerakan jamaah secara real-time dengan akurasi tinggi dan notifikasi instant.',
    color: 'from-blue-600 to-cyan-500',
    gradient: 'bg-gradient-to-br from-blue-500 to-cyan-400',
    lightBg: 'bg-blue-50',
    stats: 'Akurasi 99.9%'
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Multi-Tenant',
    description: 'Kelola multiple travel agencies dengan isolasi data dan kontrol akses terpusat.',
    color: 'from-purple-600 to-pink-500',
    gradient: 'bg-gradient-to-br from-purple-500 to-pink-400',
    lightBg: 'bg-purple-50',
    stats: 'Unlimited tenant'
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Analytics Pro',
    description: 'Dashboard interaktif dengan prediksi AI dan laporan otomatis untuk pengambilan keputusan.',
    color: 'from-amber-600 to-orange-500',
    gradient: 'bg-gradient-to-br from-amber-500 to-orange-400',
    lightBg: 'bg-amber-50',
    stats: 'Real-time insights'
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Smart Notifikasi',
    description: 'Sistem notifikasi pintar untuk jadwal, lokasi, dan kondisi darurat dengan response cepat.',
    color: 'from-emerald-600 to-teal-500',
    gradient: 'bg-gradient-to-br from-emerald-500 to-teal-400',
    lightBg: 'bg-emerald-50',
    stats: '< 5 detik response'
  }
];

const destinations = [
  {
    name: 'Masjid al-Haram',
    location: 'Makkah',
    image: '/images/al-haram.jpeg',
    stats: [
      { label: 'Kapasitas', value: '2.5M' },
      { label: 'Menara', value: '9' },
      { label: 'Luas', value: '356K m²' }
    ],
    color: 'from-emerald-600 to-emerald-800',
    lightColor: 'bg-emerald-500'
  },
  {
    name: 'Masjid an-Nabawi',
    location: 'Madinah',
    image: '/images/madinah.jpeg',
    stats: [
      { label: 'Kapasitas', value: '1.6M' },
      { label: 'Kubah', value: '12' },
      { label: 'Luas', value: '384K m²' }
    ],
    color: 'from-teal-600 to-teal-800',
    lightColor: 'bg-teal-500'
  }
];

const stats = [
  { value: '99.9%', label: 'Uptime', change: '+12%', positive: true },
  { value: '500+', label: 'Travel Mitra', change: '+24%', positive: true },
  { value: '24/7', label: 'Support', change: 'Always', positive: true },
  { value: '1.2M+', label: 'Jamaah', change: '+18%', positive: true },
];

const testimonials = [
  {
    name: 'H. Ahmad Fauzi',
    role: 'CEO PT. Amanah Travel',
    content: 'Platform ini mengubah total cara kami mengelola perjalanan umroh. Efisiensi meningkat 40%!',
    avatar: '/images/avatar1.jpg',
    rating: 5
  },
  {
    name: 'Siti Nurhaliza',
    role: 'Manager Operasional',
    content: 'Tracking real-time sangat membantu. Jamaah merasa aman dan tenang selama perjalanan.',
    avatar: '/images/avatar2.jpg',
    rating: 5
  }
];

// Data untuk avatar lingkaran
const agentAvatars = [
  { id: 1, image: '/images/user.jpeg', name: 'Travel A' },
  { id: 2, image: '/images/user1.jpeg', name: 'Travel B' },
  { id: 3, image: '/images/user2.jpeg', name: 'Travel C' },
  { id: 4, image: '/images/user3.jpeg', name: 'Travel D' },
];

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      <Navbar />

      {/* Hero Section dengan Background Image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image - Mengganti semua background hijau */}
        <div className="absolute inset-0">
          <Image
            src="/images/makkah-hero.webp"
            alt="Makkah Background"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay gelap agar teks terbaca */}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Floating Elements - Tetap ada untuk efek */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              animate={{
                y: [0, -30, 0],
                x: [0, Math.sin(i) * 20, 0],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.2
              }}
              style={{
                left: `${(i * 5) % 100}%`,
                top: `${(i * 7) % 100}%`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Main Headline */}
              <motion.h1 
                className="text-6xl md:text-7xl lg:text-8xl font-black leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="block text-white">Transformasi</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">
                  Manajemen Umroh
                </span>
              </motion.h1>

              <motion.p 
                className="text-xl md:text-2xl text-white/90 max-w-xl leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Kelola perjalanan ibadah dengan platform all-in-one. 
                Real-time tracking, analisis cerdas, dan pengalaman jamaah yang tak terlupakan.
              </motion.p>

              {/* Trust Indicators dengan Avatar Images */}
              <motion.div 
                className="flex items-center space-x-6 pt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex -space-x-3">
                  {agentAvatars.map((agent, index) => (
                    <motion.div
                      key={agent.id}
                      whileHover={{ scale: 1.1, zIndex: 10 }}
                      className="relative w-12 h-12 rounded-full border-2 border-white shadow-lg overflow-hidden"
                    >
                      <Image
                        src={agent.image}
                        alt={agent.name}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  ))}
                  <motion.div
                    whileHover={{ scale: 1.1, zIndex: 10 }}
                    className="w-12 h-12 rounded-full border-2 border-white bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-lg"
                  >
                    +100
                  </motion.div>
                </div>
                <div className="text-white">
                  <p className="font-bold text-2xl">500+</p>
                  <p className="text-sm text-white/80">Travel agents bergabung</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Stats Card - Dengan desain yang lebih bersih */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative"
            >
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        className="bg-white/10 rounded-2xl p-5 backdrop-blur-sm border border-white/20"
                      >
                        <span className="text-3xl mb-2 block">{stat.icon}</span>
                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                        <p className="text-sm text-white/70">{stat.label}</p>
                        <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-emerald-500/30 text-emerald-200">
                          {stat.change}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-6">
                    <div className="flex justify-between text-sm text-white/80 mb-2">
                      <span>Platform Growth</span>
                      <span className="font-semibold">+156% this year</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-emerald-400 to-teal-400"
                        initial={{ width: 0 }}
                        animate={{ width: '80%' }}
                        transition={{ duration: 1.5, delay: 1 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
            <motion.div 
              className="w-1 h-2 bg-white rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-emerald-600 font-semibold tracking-wider uppercase mb-4 block">
              Platform Features
            </span>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              Everything You Need
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                in One Dashboard
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Platform lengkap dengan fitur canggih untuk memaksimalkan operasional travel umroh Anda
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureHighlights.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                <div className="relative h-full bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${feature.gradient}`} />
                  
                  <div className={`relative mb-6 inline-flex p-4 rounded-2xl ${feature.lightBg} group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {feature.description}
                  </p>

                  <div className="flex items-center text-sm font-semibold text-emerald-600">
                    <span className="mr-2">{feature.stats}</span>
                    <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="relative py-24 bg-gradient-to-r from-emerald-600 to-teal-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        
        <div className="relative container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'Travel Agents', icon: '🏢' },
              { value: '1.2M+', label: 'Jamaah', icon: '👥' },
              { value: '50K+', label: 'Keberangkatan', icon: '✈️' },
              { value: '99.9%', label: 'Kepuasan', icon: '⭐' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: 'spring' }}
                className="text-center text-white"
              >
                <span className="text-5xl mb-4 block">{stat.icon}</span>
                <motion.div 
                  className="text-5xl md:text-6xl font-black mb-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  {stat.value}
                </motion.div>
                <p className="text-xl text-white/80">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="relative py-32 bg-gray-900">
        <div className="absolute inset-0">
          <Image
            src="/images/makkah-pattern.jpg"
            alt="Pattern"
            fill
            className="object-cover opacity-10"
          />
        </div>

        <div className="relative container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black text-white mb-4">
              Destinasi
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                Spiritual
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Dua kota suci yang menjadi pusat ibadah umat Islam di seluruh dunia
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {destinations.map((dest, index) => (
              <motion.div
                key={dest.name}
                initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
                className="group relative h-[600px] rounded-3xl overflow-hidden cursor-pointer"
              >
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="transform translate-y-0 group-hover:-translate-y-4 transition-transform duration-500"
                  >
                    <span className="inline-block px-4 py-2 bg-emerald-500 text-white rounded-full text-sm font-semibold mb-4">
                      {dest.location}
                    </span>
                    
                    <h3 className="text-4xl md:text-5xl font-black text-white mb-4">
                      {dest.name}
                    </h3>

                    <div className="grid grid-cols-3 gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {dest.stats.map((stat, idx) => (
                        <div key={idx} className="text-center">
                          <p className="text-2xl font-bold text-white">{stat.value}</p>
                          <p className="text-sm text-white/80">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-32 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-4">
              Apa Kata Mereka?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ribuan travel agent telah merasakan manfaat platform kami
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <div className="bg-gray-50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
                  <div className="absolute top-6 right-8 text-6xl text-emerald-200/50 font-serif">"</div>
                  
                  <div className="flex items-center mb-6">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <p className="font-bold text-lg">{testimonial.name}</p>
                      <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-lg leading-relaxed mb-4">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="flex text-yellow-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-40 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/makkah-night.jpg"
            alt="Makkah Night"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8">
              Siap Transformasi Bisnis Umroh Anda?
            </h2>
            
            <p className="text-2xl text-white/90 mb-12 max-w-2xl mx-auto">
              Bergabung dengan 500+ travel agent dan tingkatkan efisiensi operasional hingga 40%
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <Link
                href="/register"
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-12 py-6 text-xl font-bold text-white transition-all hover:shadow-2xl hover:scale-105"
              >
                <span className="relative z-10">Mulai Gratis 30 Hari</span>
              </Link>

              <Link
                href="/contact"
                className="group rounded-2xl border-2 border-white px-12 py-6 text-xl font-bold text-white transition-all hover:bg-white/10 hover:scale-105"
              >
                Hubungi Sales
              </Link>
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
      `}</style>
    </div>
  );
}