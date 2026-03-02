'use client';

import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { mockPromos } from '@/lib/mock-data';
import { Promo } from '@/lib/types';

export default function PromoAdminPage() {
    const [promos, setPromos] = useState<Promo[]>(mockPromos);
    const [showForm, setShowForm] = useState(false);

    return (
        <DashboardLayout>
            <div>
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-[#0F5132]">Kelola Promo</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-[#0F5132] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1B5E20] transition-colors"
                    >
                        + Tambah Promo
                    </button>
                </div>

                {/* Add Promo Form */}
                {showForm && (
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-[#D4AF37]">
                        <h2 className="text-xl font-bold text-[#0F5132] mb-4">Form Promo Baru</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Judul Promo"
                                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#0F5132]"
                            />
                            <input
                                type="number"
                                placeholder="Diskon (%)"
                                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#0F5132]"
                            />
                            <input
                                type="date"
                                placeholder="Tanggal Mulai"
                                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#0F5132]"
                            />
                            <input
                                type="date"
                                placeholder="Tanggal Berakhir"
                                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#0F5132]"
                            />
                        </div>
                        <textarea
                            placeholder="Deskripsi Promo"
                            rows={3}
                            className="w-full mt-4 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#0F5132]"
                        />
                        <div className="flex gap-4 mt-4">
                            <button className="bg-[#0F5132] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#1B5E20]">
                                Simpan
                            </button>
                            <button
                                onClick={() => setShowForm(false)}
                                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                )}

                {/* Promo List */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-[#D4AF37]">
                    <table className="w-full">
                        <thead className="bg-[#0F5132] text-white">
                            <tr>
                                <th className="px-6 py-4 text-left">Judul</th>
                                <th className="px-6 py-4 text-left">Diskon</th>
                                <th className="px-6 py-4 text-left">Periode</th>
                                <th className="px-6 py-4 text-left">Status</th>
                                <th className="px-6 py-4 text-left">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {promos.map((promo, index) => (
                                <tr key={promo.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-[#0F5132]">{promo.title}</div>
                                        {promo.is_featured && (
                                            <span className="text-xs text-[#D4AF37]">⭐ Featured</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-[#D4AF37]">
                                        {promo.discount_percentage}%
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {promo.start_date && new Date(promo.start_date).toLocaleDateString('id-ID')}
                                        {' - '}
                                        {promo.end_date && new Date(promo.end_date).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${promo.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {promo.is_active ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-[#0F5132] hover:text-[#1B5E20] font-semibold mr-4">
                                            Edit
                                        </button>
                                        <button className="text-red-600 hover:text-red-700 font-semibold">
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
