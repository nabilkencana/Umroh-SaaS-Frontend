'use client';

import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { mockJamaah } from '@/lib/mock-data';
import { Jamaah } from '@/lib/types';

export default function JamaahPage() {
    const [jamaahList] = useState<Jamaah[]>(mockJamaah);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredJamaah = jamaahList.filter(j =>
        j.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.passport_number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div>
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-[#0F5132]">Manajemen Jamaah</h1>
                    <button className="bg-[#0F5132] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1B5E20] transition-colors">
                        + Tambah Jamaah
                    </button>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-[#D4AF37]">
                    <input
                        type="text"
                        placeholder="Cari nama atau nomor paspor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#0F5132]"
                    />
                </div>

                {/* Jamaah Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-[#D4AF37]">
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
                                <tr key={jamaah.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                    <td className="px-6 py-4 font-semibold text-[#0F5132]">{jamaah.full_name}</td>
                                    <td className="px-6 py-4">{jamaah.passport_number}</td>
                                    <td className="px-6 py-4">{jamaah.phone}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                            {jamaah.status}
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
