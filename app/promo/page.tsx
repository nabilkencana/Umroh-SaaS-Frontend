'use client';

import { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PromoCard from '../components/PromoCard';
import { mockPromos, mockTenants } from '@/lib/mock-data';

export default function PromoPage() {
  const [selectedTenant, setSelectedTenant] = useState<string>('all');
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      {featuredPromo && (
        <section className="relative flex min-h-[420px] items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${featuredPromo.banner_image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F5132]/95 to-[#1B5E20]/90" />

          <div className="relative z-10 mx-auto max-w-5xl px-4 py-16 text-center text-white">
            <div className="mb-4 inline-block rounded-full bg-[#D4AF37] px-4 py-2 font-bold text-[#0F5132]">
              ⭐ Promo Featured
            </div>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">{featuredPromo.title}</h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-emerald-50">{featuredPromo.description}</p>

            <div className="mb-8 flex flex-wrap justify-center gap-3">
              {[
                { label: 'Hari', value: countdown.days },
                { label: 'Jam', value: countdown.hours },
                { label: 'Menit', value: countdown.minutes },
                { label: 'Detik', value: countdown.seconds },
              ].map((item) => (
                <div key={item.label} className="glass-panel min-w-[90px] p-4">
                  <div className="text-3xl font-bold text-[#D4AF37]">{item.value}</div>
                  <div className="text-sm">{item.label}</div>
                </div>
              ))}
            </div>

            <button className="rounded-xl bg-[#D4AF37] px-8 py-3 font-bold text-[#0F5132] transition-all hover:-translate-y-0.5 hover:bg-[#C4A037]">
              Ambil Promo Sekarang
            </button>
          </div>
        </section>
      )}

      <section className="border-b bg-white py-6">
        <div className="container mx-auto flex flex-wrap items-center gap-4 px-4">
          <label className="font-semibold text-[#0F5132]">Filter Travel:</label>
          <select
            value={selectedTenant}
            onChange={(e) => setSelectedTenant(e.target.value)}
            className="rounded-lg border border-emerald-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
          >
            <option value="all">Semua Travel</option>
            {mockTenants.map((tenant) => (
              <option key={tenant.id} value={tenant.id}>
                {tenant.name}
              </option>
            ))}
          </select>

          <div className="ml-auto rounded-full bg-emerald-50 px-4 py-2 text-sm text-emerald-900">
            Menampilkan {filteredPromos.length} promo
          </div>
        </div>
      </section>

      <section className="islamic-pattern flex-grow py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-3xl font-bold text-[#0F5132]">Promo Tersedia</h2>

          {filteredPromos.length === 0 ? (
            <div className="surface-card py-20 text-center">
              <div className="mb-4 text-6xl">🎫</div>
              <p className="text-xl text-gray-600">Tidak ada promo tersedia saat ini</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredPromos.map((promo) => (
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
