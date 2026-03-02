'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { mockJamaah } from '@/lib/mock-data';
import { SPIRITUAL_LOCATIONS } from '@/lib/constants';

interface TrackingData {
  jamaah_id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: string;
  last_update: string;
}

const initialTracking: TrackingData[] = mockJamaah.map((j) => ({
  jamaah_id: j.id,
  name: j.full_name,
  latitude: SPIRITUAL_LOCATIONS.MASJID_AL_HARAM.lat + (Math.random() - 0.5) * 0.1,
  longitude: SPIRITUAL_LOCATIONS.MASJID_AL_HARAM.lng + (Math.random() - 0.5) * 0.1,
  status: 'active',
  last_update: new Date().toISOString(),
}));

export default function TrackingPage() {
  const [trackingData, setTrackingData] = useState<TrackingData[]>(initialTracking);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrackingData((prev) =>
        prev.map((t) => ({
          ...t,
          latitude: t.latitude + (Math.random() - 0.5) * 0.001,
          longitude: t.longitude + (Math.random() - 0.5) * 0.001,
          last_update: new Date().toISOString(),
        })),
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardLayout>
      <div>
        <h1 className="mb-2 text-3xl font-bold text-[#0F5132]">Tracking Realtime</h1>
        <p className="mb-8 text-gray-600">Pantau posisi jamaah secara live untuk koordinasi lapangan yang lebih cepat.</p>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="surface-card p-6">
            <p className="mb-1 text-gray-600">Jamaah Aktif</p>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold text-[#0F5132]">{trackingData.length}</p>
              <span className="text-4xl">📍</span>
            </div>
          </div>

          <div className="surface-card p-6">
            <p className="mb-1 text-gray-600">Di Makkah</p>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold text-[#0F5132]">
                {trackingData.filter((t) => Math.abs(t.latitude - SPIRITUAL_LOCATIONS.MASJID_AL_HARAM.lat) < 0.1).length}
              </p>
              <span className="text-4xl">🕋</span>
            </div>
          </div>

          <div className="surface-card p-6">
            <p className="mb-1 text-gray-600">Di Madinah</p>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold text-[#0F5132]">0</p>
              <span className="text-4xl">🕌</span>
            </div>
          </div>
        </div>

        <div className="surface-card mb-8 p-6">
          <h2 className="mb-4 text-xl font-bold text-[#0F5132]">Peta Lokasi</h2>
          <div className="flex h-96 items-center justify-center rounded-xl bg-gradient-to-br from-[#0F5132]/10 to-[#1B5E20]/10">
            <div className="text-center">
              <div className="mb-4 text-6xl">🗺️</div>
              <p className="text-gray-600">Map integration (Google Maps / Leaflet)</p>
              <p className="mt-2 text-sm text-gray-500">Menampilkan {trackingData.length} lokasi jamaah</p>
            </div>
          </div>
        </div>

        <div className="surface-card overflow-hidden">
          <div className="flex items-center justify-between bg-[#0F5132] p-6 text-white">
            <h2 className="text-xl font-bold">Daftar Tracking</h2>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 animate-pulse rounded-full bg-green-400" />
              <span className="text-sm">Live Update</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nama</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Latitude</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Longitude</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Update Terakhir</th>
                </tr>
              </thead>
              <tbody>
                {trackingData.map((track, index) => (
                  <tr key={track.jamaah_id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-6 py-4 font-semibold text-[#0F5132]">{track.name}</td>
                    <td className="px-6 py-4 text-sm">{track.latitude.toFixed(6)}</td>
                    <td className="px-6 py-4 text-sm">{track.longitude.toFixed(6)}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">{track.status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(track.last_update).toLocaleTimeString('id-ID')}</td>
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
