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
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-[#0F5132]">Manajemen Perjalanan</h1>
            <p className="text-gray-600">Atur jadwal keberangkatan dan kapasitas jamaah tiap paket.</p>
          </div>
          <button className="rounded-lg bg-[#0F5132] px-6 py-3 font-semibold text-white hover:bg-[#1B5E20]">+ Tambah Perjalanan</button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {trips.map((trip) => (
            <div key={trip.id} className="surface-card p-6 transition-all hover:-translate-y-0.5 hover:shadow-xl">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="mb-2 text-xl font-bold text-[#0F5132]">{trip.name}</h3>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">{trip.status}</span>
                </div>
                <div className="text-3xl">✈️</div>
              </div>

              <div className="mb-4 space-y-2">
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
                <button className="flex-1 rounded-lg bg-[#0F5132] px-4 py-2 font-semibold text-white hover:bg-[#1B5E20]">Detail</button>
                <button className="rounded-lg border border-[#0F5132] px-4 py-2 font-semibold text-[#0F5132] hover:bg-[#0F5132] hover:text-white">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
