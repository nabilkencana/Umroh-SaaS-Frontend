import Link from 'next/link';
import Image from 'next/image';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/makkah-hero.jpg"
          alt="Makkah"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F5132]/90 to-[#1B5E20]/80" />

        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Platform Manajemen Umroh
            <span className="block text-[#D4AF37] mt-2">Multi-Tenant Terpercaya</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100">
            Kelola jamaah, tracking realtime, dan laporan lengkap dalam satu sistem
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/promo"
              className="bg-[#D4AF37] text-[#0F5132] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#C4A037] transition-all hover:scale-105"
            >
              Lihat Promo
            </Link>
            <Link
              href="/dashboard"
              className="bg-white text-[#0F5132] px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 islamic-pattern">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-[#0F5132] mb-12">
            Fitur Unggulan
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-[#D4AF37] hover:shadow-2xl transition-all">
              <div className="text-5xl mb-4">📍</div>
              <h3 className="text-2xl font-bold text-[#0F5132] mb-3">Tracking Realtime</h3>
              <p className="text-gray-600">
                Pantau lokasi jamaah secara realtime dengan teknologi GPS dan WebSocket
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-[#D4AF37] hover:shadow-2xl transition-all">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-2xl font-bold text-[#0F5132] mb-3">Multi-Tenant</h3>
              <p className="text-gray-600">
                Kelola multiple travel umroh dengan isolasi data yang aman
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-[#D4AF37] hover:shadow-2xl transition-all">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-[#0F5132] mb-3">Analytics</h3>
              <p className="text-gray-600">
                Laporan lengkap dan dashboard analytics untuk pengambilan keputusan
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Spiritual Locations */}
      <section className="py-20 bg-gradient-to-br from-[#0F5132] to-[#1B5E20] text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Destinasi Spiritual
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="relative h-80 rounded-xl overflow-hidden group">
              <Image
                src="/images/makkah.jpg"
                alt="Masjid al-Haram"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6">
                  <h3 className="text-3xl font-bold mb-2">Masjid al-Haram</h3>
                  <p className="text-gray-200">Makkah al-Mukarramah</p>
                </div>
              </div>
            </div>

            <div className="relative h-80 rounded-xl overflow-hidden group">
              <Image
                src="/images/madinah.jpg"
                alt="Masjid an-Nabawi"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6">
                  <h3 className="text-3xl font-bold mb-2">Masjid an-Nabawi</h3>
                  <p className="text-gray-200">Madinah al-Munawwarah</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 islamic-pattern">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-[#0F5132] mb-6">
            Siap Memulai Perjalanan Digital?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan ratusan travel umroh yang telah mempercayai platform kami
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-[#0F5132] text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-[#1B5E20] transition-all hover:scale-105"
          >
            Mulai Sekarang
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
