'use client';

import DashboardLayout from '../../components/DashboardLayout';
import { mockJamaah, mockPromos, mockTenants } from '@/lib/mock-data';

export default function AnalyticsPage() {
    const stats = {
        totalTenants: mockTenants.length,
        totalJamaah: mockJamaah.length,
        activePromos: mockPromos.filter(p => p.is_active).length,
        trackingToday: 12,
    };

    return (
        <DashboardLayout>
            <div>
                <h1 className="text-3xl font-bold text-[#0F5132] mb-8">Analytics Dashboard</h1>

                {/* Super Admin Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-4xl">🏢</div>
                            <div className="text-3xl font-bold">{stats.totalTenants}</div>
                        </div>
                        <p className="text-blue-100">Total Tenants</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-4xl">👥</div>
                            <div className="text-3xl font-bold">{stats.totalJamaah}</div>
                        </div>
                        <p className="text-green-100">Total Jamaah Aktif</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-4xl">🎫</div>
                            <div className="text-3xl font-bold">{stats.activePromos}</div>
                        </div>
                        <p className="text-purple-100">Promo Aktif</p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-4xl">📍</div>
                            <div className="text-3xl font-bold">{stats.trackingToday}</div>
                        </div>
                        <p className="text-orange-100">Tracking Hari Ini</p>
                    </div>
                </div>

                {/* Charts Placeholder */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#D4AF37]">
                        <h2 className="text-xl font-bold text-[#0F5132] mb-4">Pertumbuhan Jamaah</h2>
                        <div className="bg-gradient-to-br from-[#0F5132]/10 to-[#1B5E20]/10 rounded-lg h-64 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-5xl mb-2">📈</div>
                                <p className="text-gray-600">Chart: Line Graph</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#D4AF37]">
                        <h2 className="text-xl font-bold text-[#0F5132] mb-4">Distribusi Tenant</h2>
                        <div className="bg-gradient-to-br from-[#0F5132]/10 to-[#1B5E20]/10 rounded-lg h-64 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-5xl mb-2">🥧</div>
                                <p className="text-gray-600">Chart: Pie Chart</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Promo Performance */}
                <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#D4AF37]">
                    <h2 className="text-xl font-bold text-[#0F5132] mb-4">Performa Promo</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Promo</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Views</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Clicks</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Conversion</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockPromos.map((promo, index) => (
                                    <tr key={promo.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-6 py-4 font-semibold text-[#0F5132]">{promo.title}</td>
                                        <td className="px-6 py-4">{Math.floor(Math.random() * 1000)}</td>
                                        <td className="px-6 py-4">{Math.floor(Math.random() * 500)}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-green-600 font-semibold">
                                                {(Math.random() * 10).toFixed(1)}%
                                            </span>
                                        </td>
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
