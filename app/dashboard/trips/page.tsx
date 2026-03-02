'use client';

import DashboardLayout from '../../components/DashboardLayout';

interface Trip {
    id: string;
    name: string;
    departure_date: string;
    return_date: string;
    total_jamaah: number;
    status: string;
}

export default function TripsPage() {
    const trips: Trip[] = [
        {
            id: '1',
            name: 'Umroh Ramadhan 2026',
            departure_date: '2026-03-15',
            return_date: '2026-03-25',
            total_jamaah: 45,
            status: 'upcoming',
        },
        {
            id: '2',
            name: 'Umroh Plus Turki',
            departure_date: '2026-04-10',
            return_date: '2026-04-20',
            total_jamaah: 30,
            status: 'upcoming',
        },
    ];

    return (
        <DashboardLayout>
            <div>
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-[#0F5132]">Manajemen Perjalanan</h1>
                    <button className="bg-[#0F5132] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1B5E20] transition-colors">
                        + Tambah Perjalanan
                    </button>
                </div>

                {/* Trips Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {trips.map(trip => (
                        <div key={trip.id} className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#D4AF37] hover:shadow-2xl transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-[#0F5132] mb-2">{trip.name}</h3>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                        {trip.status}
                                    </span>
                                </div>
                                <div className="text-3xl">✈️</div>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <span>📅</span>
                                    <span className="text-sm">
                                        {new Date(trip.departure_date).toLocaleDateString('id-ID')} - {new Date(trip.return_date).toLocaleDateString('id-ID')}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <span>👥</span>
                                    <span className="text-sm">{trip.total_jamaah} Jamaah</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button className="flex-1 bg-[#0F5132] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#1B5E20] transition-colors">
                                    Detail
                                </button>
                                <button className="px-4 py-2 border-2 border-[#0F5132] text-[#0F5132] rounded-lg font-semibold hover:bg-[#0F5132] hover:text-white transition-colors">
                                    Edit
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
