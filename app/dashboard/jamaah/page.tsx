'use client';

import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { mockJamaah } from '@/lib/mock-data';
import { Jamaah } from '@/lib/types';

export default function JamaahPage() {
  const [jamaahList] = useState<Jamaah[]>(mockJamaah);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJamaah = jamaahList.filter(
    (j) => j.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || j.passport_number.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <DashboardLayout>
      <div>
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-[#0F5132]">Manajemen Jamaah</h1>
            <p className="text-gray-600">Kelola data jamaah dengan pencarian cepat dan status terkini.</p>
          </div>
          <button className="rounded-lg bg-[#0F5132] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#1B5E20]">+ Tambah Jamaah</button>
        </div>

        <div className="surface-card mb-6 p-5">
          <input
            type="text"
            placeholder="Cari nama atau nomor paspor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-emerald-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
          />
        </div>

        <div className="surface-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#0F5132] text-white">
              <tr>
                <th className="px-6 py-4 text-left">Nama Lengkap</th>
                <th className="px-6 py-4 text-left">No. Paspor</th>
                <th className="px-6 py-4 text-left">Telepon</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredJamaah.map((jamaah, index) => (
                <tr key={jamaah.id} className={index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                  <td className="px-6 py-4 font-semibold text-[#0F5132]">{jamaah.full_name}</td>
                  <td className="px-6 py-4">{jamaah.passport_number}</td>
                  <td className="px-6 py-4">{jamaah.phone}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">{jamaah.status}</span>
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
