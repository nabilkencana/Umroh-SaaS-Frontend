'use client';

import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { mockPromos } from '@/lib/mock-data';

export default function PromoAdminPage() {
  const [showForm, setShowForm] = useState(false);
  const promos = mockPromos;

  return (
    <DashboardLayout>
      <div>
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-[#0F5132]">Kelola Promo</h1>
            <p className="text-gray-600">Buat, evaluasi, dan update kampanye promo dengan cepat.</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-lg bg-[#0F5132] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#1B5E20]"
          >
            + Tambah Promo
          </button>
        </div>

        {showForm && (
          <div className="surface-card mb-8 p-6">
            <h2 className="mb-4 text-xl font-bold text-[#0F5132]">Form Promo Baru</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input type="text" placeholder="Judul Promo" className="rounded-lg border border-emerald-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0F5132]" />
              <input type="number" placeholder="Diskon (%)" className="rounded-lg border border-emerald-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0F5132]" />
              <input type="date" className="rounded-lg border border-emerald-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0F5132]" />
              <input type="date" className="rounded-lg border border-emerald-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0F5132]" />
            </div>
            <textarea placeholder="Deskripsi Promo" rows={3} className="mt-4 w-full rounded-lg border border-emerald-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0F5132]" />
            <div className="mt-4 flex gap-3">
              <button className="rounded-lg bg-[#0F5132] px-6 py-2 font-semibold text-white hover:bg-[#1B5E20]">Simpan</button>
              <button onClick={() => setShowForm(false)} className="rounded-lg bg-gray-200 px-6 py-2 font-semibold text-gray-700 hover:bg-gray-300">Batal</button>
            </div>
          </div>
        )}

        <div className="surface-card overflow-hidden">
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
                <tr key={promo.id} className={index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-[#0F5132]">{promo.title}</div>
                    {promo.is_featured && <span className="text-xs text-[#D4AF37]">⭐ Featured</span>}
                  </td>
                  <td className="px-6 py-4 font-bold text-[#D4AF37]">{promo.discount_percentage}%</td>
                  <td className="px-6 py-4 text-sm">
                    {promo.start_date && new Date(promo.start_date).toLocaleDateString('id-ID')} - {promo.end_date && new Date(promo.end_date).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${promo.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {promo.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="mr-4 font-semibold text-[#0F5132] hover:text-[#1B5E20]">Edit</button>
                    <button className="font-semibold text-red-600 hover:text-red-700">Hapus</button>
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
