'use client';

import DashboardLayout from '../components/DashboardLayout';
import { mockJamaah, mockPromos } from '@/lib/mock-data';

export default function DashboardPage() {
  const stats = [
    { label: 'Total Jamaah', value: mockJamaah.length, icon: '👥', color: 'bg-blue-500' },
    { label: 'Jamaah Aktif', value: mockJamaah.filter((j) => j.status === 'active').length, icon: '✓', color: 'bg-green-500' },
    { label: 'Promo Aktif', value: mockPromos.filter((p) => p.is_active).length, icon: '🎫', color: 'bg-purple-500' },
    { label: 'Tracking Hari Ini', value: 12, icon: '📍', color: 'bg-orange-500' },
  ];

  return (
    <DashboardLayout>
      
      <div>
        
        <h1 className="mb-2 text-3xl font-bold text-[#0F5132]">Dashboard</h1>
        <p className="mb-8 text-gray-600">Ringkasan operasional harian travel umroh Anda.</p>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="surface-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className={`${stat.color} flex h-12 w-12 items-center justify-center rounded-xl text-2xl text-white`}>{stat.icon}</div>
                <span className="text-3xl font-bold text-[#0F5132]">{stat.value}</span>
              </div>
              <p className="font-medium text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="surface-card p-6">
            <h2 className="mb-4 text-xl font-bold text-[#0F5132]">Jamaah Terbaru</h2>
            <div className="space-y-3">
              {mockJamaah.slice(0, 5).map((jamaah) => (
                <div key={jamaah.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                  <div>
                    <p className="font-semibold text-[#0F5132]">{jamaah.full_name}</p>
                    <p className="text-sm text-gray-600">{jamaah.passport_number}</p>
                  </div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">{jamaah.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card p-6">
            <h2 className="mb-4 text-xl font-bold text-[#0F5132]">Promo Aktif</h2>
            <div className="space-y-3">
              {mockPromos
                .filter((p) => p.is_active)
                .slice(0, 5)
                .map((promo) => (
                  <div key={promo.id} className="rounded-xl bg-slate-50 p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-[#0F5132]">{promo.title}</p>
                        <p className="mt-1 text-sm text-gray-600">Diskon {promo.discount_percentage}%</p>
                      </div>
                      {promo.is_featured && <span className="text-[#D4AF37]">⭐</span>}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
