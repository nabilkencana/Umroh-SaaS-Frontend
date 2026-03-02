import Link from 'next/link';
import Image from 'next/image';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const featureHighlights = [
  {
    icon: '📍',
    title: 'Tracking Realtime',
    description: 'Pantau lokasi jamaah secara realtime dengan teknologi GPS dan notifikasi update otomatis.',
  },
  {
    icon: '👥',
    title: 'Manajemen Multi-Tenant',
    description: 'Kelola banyak travel umroh dengan data terisolasi dan kontrol akses untuk tiap tim.',
  },
  {
    icon: '📊',
    title: 'Analytics & Laporan',
    description: 'Dapatkan insight operasional dan performa bisnis dalam dashboard yang mudah dipahami.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <section className="relative min-h-[700px] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/makkah-hero.jpg"
          alt="Makkah"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F5132]/90 via-[#0F5132]/75 to-[#1B5E20]/80" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 text-white">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="mb-5 inline-flex items-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/15 px-4 py-2 text-sm font-medium text-[#F5E3A3] backdrop-blur-sm">
                Solusi end-to-end untuk travel umroh modern
              </span>
              <h1 className="text-4xl font-bold leading-tight md:text-6xl">
                Platform Manajemen Umroh
                <span className="mt-2 block text-[#D4AF37]">Cepat, Aman, dan Terintegrasi</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-emerald-50/95 md:text-xl">
                Tingkatkan pengalaman jamaah dan efisiensi operasional dengan dashboard terpadu,
                tracking realtime, serta pelaporan yang actionable.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/promo"
                  className="rounded-xl bg-[#D4AF37] px-7 py-3.5 text-base font-bold text-[#0F5132] shadow-lg shadow-[#D4AF37]/30 transition-all hover:-translate-y-0.5 hover:bg-[#C4A037]"
                >
                  Lihat Promo
                </Link>
                <Link
                  href="/dashboard"
                  className="rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 text-base font-bold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/20"
                >
                  Coba Dashboard
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass-panel col-span-2 p-6">
                <p className="text-sm text-emerald-100">Performa Platform</p>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-2xl font-bold text-[#D4AF37]">99.9%</p>
                    <p className="text-xs text-emerald-100">Uptime</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#D4AF37]">500+</p>
                    <p className="text-xs text-emerald-100">Travel Mitra</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#D4AF37]">24/7</p>
                    <p className="text-xs text-emerald-100">Monitoring</p>
                  </div>
                </div>
              </div>
              <div className="glass-panel p-5">
                <p className="text-sm text-emerald-100">Check-in Harian</p>
                <p className="mt-2 text-3xl font-bold">1.240</p>
                <p className="text-xs text-emerald-100">+18% dari minggu lalu</p>
              </div>
              <div className="glass-panel p-5">
                <p className="text-sm text-emerald-100">Status Jamaah</p>
                <p className="mt-2 text-3xl font-bold">Aman</p>
                <p className="text-xs text-emerald-100">Tracking aktif realtime</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="islamic-pattern py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="text-4xl font-bold text-[#0F5132]">Fitur Unggulan untuk Operasional Lebih Rapi</h2>
            <p className="mt-4 text-lg text-gray-600">
              Didesain untuk membantu tim travel bekerja lebih cepat, minim kesalahan, dan tetap fokus
              pada pelayanan jamaah.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {featureHighlights.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-emerald-100 bg-white p-8 shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="mb-4 text-5xl">{feature.icon}</div>
                <h3 className="mb-3 text-2xl font-bold text-[#0F5132]">{feature.title}</h3>
                <p className="leading-relaxed text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#0F5132] to-[#1B5E20] py-20 text-white">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-4xl font-bold">Destinasi Spiritual</h2>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
            <div className="group relative h-80 overflow-hidden rounded-2xl">
              <Image
                src="/images/makkah.jpg"
                alt="Masjid al-Haram"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent">
                <div className="p-6">
                  <h3 className="mb-2 text-3xl font-bold">Masjid al-Haram</h3>
                  <p className="text-gray-200">Makkah al-Mukarramah</p>
                </div>
              </div>
            </div>

            <div className="group relative h-80 overflow-hidden rounded-2xl">
              <Image
                src="/images/madinah.jpg"
                alt="Masjid an-Nabawi"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent">
                <div className="p-6">
                  <h3 className="mb-2 text-3xl font-bold">Masjid an-Nabawi</h3>
                  <p className="text-gray-200">Madinah al-Munawwarah</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="islamic-pattern py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl rounded-3xl border border-emerald-100 bg-white p-10 shadow-xl">
            <h2 className="text-4xl font-bold text-[#0F5132]">Siap Memulai Perjalanan Digital?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Bergabunglah dengan ratusan travel umroh yang telah mempercayai platform kami untuk
              memperkuat layanan dan operasional.
            </p>
            <Link
              href="/dashboard"
              className="mt-8 inline-block rounded-xl bg-[#0F5132] px-10 py-4 text-lg font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#1B5E20]"
            >
              Mulai Sekarang
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
