'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix untuk icon marker di Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapComponentProps {
    trackingData: Array<{
        jamaah_id: string;
        name: string;
        latitude: number;
        longitude: number;
        status: string;
        battery?: number;
    }>;
    center: { lat: number; lng: number };
    zoom: number;
}

export default function MapComponent({ trackingData, center, zoom }: MapComponentProps) {
    const mapRef = useRef<L.Map | null>(null);
    const markersRef = useRef<{ [key: string]: L.Marker }>({});

    useEffect(() => {
        if (!mapRef.current) {
            // Inisialisasi map
            mapRef.current = L.map('map').setView([center.lat, center.lng], zoom);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(mapRef.current);
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [center, zoom]);

    useEffect(() => {
        if (!mapRef.current) return;

        // Update markers
        trackingData.forEach((data) => {
            const { jamaah_id, name, latitude, longitude, battery } = data;

            // Buat custom icon berdasarkan status baterai
            const markerColor = battery && battery > 60 ? '#10b981' :
                battery && battery > 20 ? '#f59e0b' : '#ef4444';

            const customIcon = L.divIcon({
                className: 'custom-marker',
                html: `
          <div class="relative">
            <div class="w-4 h-4 bg-white rounded-full shadow-lg flex items-center justify-center" style="border: 2px solid ${markerColor}">
              <div class="w-2 h-2 bg-${markerColor} rounded-full"></div>
            </div>
            <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-white rounded-full shadow-sm flex items-center justify-center text-[8px] font-bold" style="color: ${markerColor}">
              ${battery}%
            </div>
          </div>
        `,
                iconSize: [24, 24],
                iconAnchor: [12, 12],
                popupAnchor: [0, -12]
            });

            if (markersRef.current[jamaah_id]) {
                // Update marker yang sudah ada
                markersRef.current[jamaah_id].setLatLng([latitude, longitude]);
            } else {
                // Buat marker baru
                const marker = L.marker([latitude, longitude], { icon: customIcon })
                    .bindPopup(`
            <div class="p-2">
              <p class="font-semibold text-sm">${name}</p>
              <p class="text-xs text-gray-600">Baterai: ${battery}%</p>
              <p class="text-xs text-gray-600">Koordinat: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}</p>
            </div>
          `)
                    .addTo(mapRef.current!);

                markersRef.current[jamaah_id] = marker;
            }
        });

        // Hapus marker yang tidak ada di data
        Object.keys(markersRef.current).forEach((id) => {
            if (!trackingData.find(d => d.jamaah_id === id)) {
                markersRef.current[id].remove();
                delete markersRef.current[id];
            }
        });

    }, [trackingData]);

    return <div id="map" className="h-full w-full" />;
}