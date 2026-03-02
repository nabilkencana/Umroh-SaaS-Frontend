'use client';

import { useState, useEffect } from 'react';
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

export default function TrackingPage() {
    const [trackingData, setTrackingData] = useState<TrackingData[]>([]);
    const [selectedLocation, setSelectedLocation] = useState('all');

    useEffect(() => {
        // Simulate realtime tracking data
        const mockTracking: TrackingData[] = mockJamaah.map(j => ({
            jamaah_id: j.id,
            name: j.full_name,
            latitude: SPIRITUAL_LOCATIONS.MASJID_AL_HARAM.lat + (Math.random() - 0.5) * 0.1,
            longitude: SPIRITUAL_LOCATIONS.MASJID_AL_HARAM.lng + (Math.random() - 0.5) * 0.1,
            status: 'active',
            last_update: new Date().toISOString(),
        }));
        setTrackingData(mockTracking);

        // Simulate realtime updates
        const interval = setInterval(() => {
            setTrackingData(prev => prev.map(t => ({
                ...t,
                latitude: t.latitude + (Math.random() - 0.5) * 0.001,
                longitude: t.longitude + (Math.random() - 0.5) * 0.001,
                last_update: new Date().toISOString(),
            })));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <DashboardLayout>
            <div>
                <h1 className="text-3xl font-bold text-[#0F5132] mb-8">Tracking Realtime</h1>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#D4AF37]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 mb-1">Jamaah Aktif</p>
                                <p className="text-3xl font-bold text-[#0F5132]">{trackingData.length}</p>
                            </div>
                            <div className="text-4xl">📍</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#D4AF37]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 mb-1">Di Makkah</p>
                                <p className="text-3xl font-bold text-[#0F5132]">
                                    {trackingData.filter(t => Math.abs(t.latitude - SPIRITUAL_LOCATIONS.MASJID_AL_HARAM.lat) < 0.1).length}
                                </p>
                            </div>
                            <div className="text-4xl">🕋</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#D4AF37]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 mb-1">Di Madinah</p>
                                <p className="text-3xl font-bold text-[#0F5132]">0</p>
                            </div>
                            <div className="text-4xl">🕌</div>
                        </div>
                    </div>
                </div>

                {/* Map Placeholder */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-[#D4AF37]">
                    <h2 className="text-xl font-bold text-[#0F5132] mb-4">Peta Lokasi</h2>
                    <div className="bg-gradient-to-br from-[#0F5132]/10 to-[#1B5E20]/10 rounded-lg h-96 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-6xl mb-4">🗺️</div>
                            <p className="text-gray-600">Map integration (Google Maps / Leaflet)</p>
                            <p className="text-sm text-gray-500 mt-2">Menampilkan {trackingData.length} lokasi jamaah</p>
                        </div>
                    </div>
                </div>

                {/* Tracking List */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-[#D4AF37]">
                    <div className="p-6 bg-[#0F5132] text-white flex justify-between items-center">
                        <h2 className="text-xl font-bold">Daftar Tracking</h2>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                            <span className="text-sm">Live Update</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
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
                                    <tr key={track.jamaah_id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-6 py-4 font-semibold text-[#0F5132]">{track.name}</td>
                                        <td className="px-6 py-4 text-sm">{track.latitude.toFixed(6)}</td>
                                        <td className="px-6 py-4 text-sm">{track.longitude.toFixed(6)}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                                {track.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(track.last_update).toLocaleTimeString('id-ID')}
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
