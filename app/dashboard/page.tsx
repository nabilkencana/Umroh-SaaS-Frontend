'use client';

import DashboardLayout from '../components/DashboardLayout';
import { mockJamaah, mockPromos } from '@/lib/mock-data';

export default function DashboardPage() {
    const stats = [
        { label: 'Total Jamaah', value: mockJamaah.length, icon: '👥', color: 'bg-blue-500' },
        { label: 'Jamaah Aktif', value: mockJamaah.filter(j => j.status === 'active').length, icon: '✓', color: 'bg-green-500' },
        { label: 'Promo Aktif', value: mockPromos.filter(p => p.is_active).length, icon: '🎫', color: 'bg-purple-500' },
        { label: 'Tracking Hari Ini', value: 12, icon: '📍', color: 'bg-orange-500' },
    ];

    return (
        <DashboardLayout>
            <div>
                <h1 className="text-3xl font-bold text-[#0F5132] mb-8">Dashboard</h1>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#D4AF37]">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                                    {stat.icon}
                                </div>
                                <span className="text-3xl font-bold text-[#0F5132]">{stat.value}</span>
                            </div>
                            <p className="text-gray-600 font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#D4AF37]">
                        <h2 className="text-xl font-bold text-[#0F5132] mb-4">Jamaah Terbaru</h2>
                        <div className="space-y-3">
                            {mockJamaah.slice(0, 5).map((jamaah) => (
                                <div key={jamaah.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-semibold text-[#0F5132]">{jamaah.full_name}</p>
                                        <p className="text-sm text-gray-600">{jamaah.passport_number}</p>
                                    </div>
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                        {jamaah.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#D4AF37]">
                        <h2 className="text-xl font-bold text-[#0F5132] mb-4">Promo Aktif</h2>
                        <div className="space-y-3">
                            {mockPromos.filter(p => p.is_active).slice(0, 5).map((promo) => (
                                <div key={promo.id} className="p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="font-semibold text-[#0F5132]">{promo.title}</p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Diskon {promo.discount_percentage}%
                                            </p>
                                        </div>
                                        {promo.is_featured && (
                                            <span className="text-[#D4AF37]">⭐</span>
                                        )}
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
