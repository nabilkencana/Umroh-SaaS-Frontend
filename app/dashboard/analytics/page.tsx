'use client';

import DashboardLayout from '../../components/DashboardLayout';
import { mockJamaah, mockPromos, mockTenants } from '@/lib/mock-data';

const perfRows = mockPromos.map((promo, index) => {
  const baseViews = 650 + (index + 1) * 137;
  const clicks = Math.floor(baseViews * (0.28 + index * 0.03));
  const conversion = ((clicks / baseViews) * 100).toFixed(1);
  return { id: promo.id, title: promo.title, views: baseViews, clicks, conversion };
});

export default function AnalyticsPage() {
  const stats = {
    totalTenants: mockTenants.length,
    totalJamaah: mockJamaah.length,
    activePromos: mockPromos.filter((p) => p.is_active).length,
    trackingToday: 12,
  };

  return (
    <DashboardLayout>
      
      <div>
        <h1 className="mb-2 text-3xl font-bold text-[#0F5132]">Analytics Dashboard</h1>
        <p className="mb-8 text-gray-600">Ringkasan performa tenant, jamaah, dan kampanye promo.</p>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Total Tenant', value: stats.totalTenants, style: 'from-blue-500 to-blue-600' },
            { label: 'Total Jamaah', value: stats.totalJamaah, style: 'from-green-500 to-green-600' },
            { label: 'Promo Aktif', value: stats.activePromos, style: 'from-purple-500 to-purple-600' },
            { label: 'Tracking Hari Ini', value: stats.trackingToday, style: 'from-orange-500 to-orange-600' },
          ].map((item) => (
            <div key={item.label} className={`rounded-2xl bg-gradient-to-br ${item.style} p-6 text-white shadow-lg`}>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-4xl">{item.icon}</span>
                <span className="text-3xl font-bold">{item.value}</span>
              </div>
              <p className="text-sm text-white/90">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="surface-card p-6">
            <h2 className="mb-4 text-xl font-bold text-[#0F5132]">Pertumbuhan Jamaah</h2>
            <div className="flex h-64 items-center justify-center rounded-xl bg-gradient-to-br from-[#0F5132]/10 to-[#1B5E20]/10">
              <div className="text-center">
                <div className="mb-2 text-5xl">📈</div>
                <p className="text-gray-600">Line chart pertumbuhan bulanan</p>
              </div>
            </div>
          </div>

          <div className="surface-card p-6">
            <h2 className="mb-4 text-xl font-bold text-[#0F5132]">Distribusi Tenant</h2>
            <div className="flex h-64 items-center justify-center rounded-xl bg-gradient-to-br from-[#0F5132]/10 to-[#1B5E20]/10">
              <div className="text-center">
                <div className="mb-2 text-5xl">🥧</div>
                <p className="text-gray-600">Pie chart segment tenant</p>
              </div>
            </div>
          </div>
        </div>

        <div className="surface-card overflow-hidden">
          <div className="border-b border-emerald-100 p-6">
            <h2 className="text-xl font-bold text-[#0F5132]">Performa Promo</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Promo</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Views</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Clicks</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Conversion</th>
                </tr>
              </thead>
              <tbody>
                {perfRows.map((promo, index) => (
                  <tr key={promo.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-6 py-4 font-semibold text-[#0F5132]">{promo.title}</td>
                    <td className="px-6 py-4">{promo.views}</td>
                    <td className="px-6 py-4">{promo.clicks}</td>
                    <td className="px-6 py-4 font-semibold text-green-600">{promo.conversion}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
