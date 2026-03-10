'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix untuk icon marker di Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Spiritual locations for reference
const SPIRITUAL_LOCATIONS = {
  MASJID_AL_HARAM: { lat: 21.4225, lng: 39.8262, name: 'Masjid al-Haram', color: '#10b981' },
  MASJID_AL_NABAWI: { lat: 24.4672, lng: 39.6111, name: 'Masjid an-Nabawi', color: '#8b5cf6' },
  JABAL_NUR: { lat: 21.4575, lng: 39.8544, name: 'Jabal Nur', color: '#f59e0b' },
  JABAL_RAHMAH: { lat: 21.3547, lng: 39.9837, name: 'Jabal Rahmah', color: '#ef4444' },
  MINA: { lat: 21.4133, lng: 39.8933, name: 'Mina', color: '#3b82f6' },
  MUZDALIFAH: { lat: 21.3878, lng: 39.9378, name: 'Muzdalifah', color: '#ec4899' },
};

// Data dummy jamaah dengan rute yang berbeda-beda
const DUMMY_JAMAAH = [
  {
    id: 'j1',
    name: 'Ahmad Fauzi',
    package: 'Gold',
    route: 'makkah-madinah',
    color: '#10b981',
    battery: 95,
    accuracy: 5,
  },
  {
    id: 'j2',
    name: 'Siti Aminah',
    package: 'VIP',
    route: 'makkah',
    color: '#8b5cf6',
    battery: 82,
    accuracy: 8,
  },
  {
    id: 'j3',
    name: 'Budi Santoso',
    package: 'Reguler',
    route: 'madinah',
    color: '#3b82f6',
    battery: 67,
    accuracy: 12,
  },
  {
    id: 'j4',
    name: 'Fatimah Az-Zahra',
    package: 'Silver',
    route: 'makkah-mina',
    color: '#f59e0b',
    battery: 43,
    accuracy: 15,
  },
  {
    id: 'j5',
    name: 'Umar bin Khattab',
    package: 'Gold',
    route: 'makkah-arafah',
    color: '#ef4444',
    battery: 100,
    accuracy: 3,
  },
];

// Rute perjalanan yang sudah didefinisikan dengan jarak yang lebih realistis
const ROUTES = {
  'makkah-madinah': {
    name: 'Makkah → Madinah',
    points: [
      { lat: 21.4225, lng: 39.8262, name: 'Masjid al-Haram', waitTime: 30 }, // Makkah
      { lat: 21.5, lng: 39.8, name: 'Keluar Makkah', waitTime: 5 },
      { lat: 22.0, lng: 39.9, name: 'Rest Area 1', waitTime: 15 },
      { lat: 22.5, lng: 40.0, name: 'Rest Area 2', waitTime: 15 },
      { lat: 23.0, lng: 39.8, name: 'Rest Area 3', waitTime: 15 },
      { lat: 23.5, lng: 39.7, name: 'Rest Area 4', waitTime: 15 },
      { lat: 24.0, lng: 39.6, name: 'Rest Area 5', waitTime: 15 },
      { lat: 24.4672, lng: 39.6111, name: 'Masjid an-Nabawi', waitTime: 30 }, // Madinah
    ],
    speed: 0.0002, // Kecepatan lambat untuk perjalanan jauh
  },
  'makkah': {
    name: 'Area Makkah',
    points: [
      { lat: 21.4225, lng: 39.8262, name: 'Masjid al-Haram', waitTime: 45 },
      { lat: 21.43, lng: 39.83, name: 'Hotel Area', waitTime: 20 },
      { lat: 21.44, lng: 39.84, name: 'Shopping District', waitTime: 25 },
      { lat: 21.4575, lng: 39.8544, name: 'Jabal Nur', waitTime: 40 },
      { lat: 21.45, lng: 39.86, name: 'Restaurant Area', waitTime: 20 },
      { lat: 21.42, lng: 39.82, name: 'Clock Tower', waitTime: 30 },
    ],
    speed: 0.0001, // Kecepatan sangat lambat untuk area padat
  },
  'madinah': {
    name: 'Area Madinah',
    points: [
      { lat: 24.4672, lng: 39.6111, name: 'Masjid an-Nabawi', waitTime: 45 },
      { lat: 24.46, lng: 39.60, name: 'Hotel Area', waitTime: 20 },
      { lat: 24.47, lng: 39.61, name: 'Dates Market', waitTime: 25 },
      { lat: 24.46, lng: 39.62, name: 'Restaurant Area', waitTime: 20 },
      { lat: 24.48, lng: 39.60, name: 'Masjid Quba', waitTime: 40 },
    ],
    speed: 0.0001,
  },
  'makkah-mina': {
    name: 'Makkah → Mina',
    points: [
      { lat: 21.4225, lng: 39.8262, name: 'Masjid al-Haram', waitTime: 30 },
      { lat: 21.41, lng: 39.85, name: 'Jalan Raya', waitTime: 10 },
      { lat: 21.40, lng: 39.87, name: 'Terowongan', waitTime: 15 },
      { lat: 21.4133, lng: 39.8933, name: 'Mina', waitTime: 40 },
      { lat: 21.41, lng: 39.89, name: 'Tenda Area', waitTime: 30 },
    ],
    speed: 0.00015,
  },
  'makkah-arafah': {
    name: 'Makkah → Arafah',
    points: [
      { lat: 21.4225, lng: 39.8262, name: 'Masjid al-Haram', waitTime: 30 },
      { lat: 21.40, lng: 39.90, name: 'Jalan Raya', waitTime: 15 },
      { lat: 21.38, lng: 39.95, name: 'Padang Arafah', waitTime: 20 },
      { lat: 21.3547, lng: 39.9837, name: 'Jabal Rahmah', waitTime: 45 },
    ],
    speed: 0.00015,
  },
};

// Fungsi untuk interpolasi linear antara dua titik
function interpolatePoint(point1: any, point2: any, progress: number) {
  return {
    lat: point1.lat + (point2.lat - point1.lat) * progress,
    lng: point1.lng + (point2.lng - point1.lng) * progress,
    name: progress < 0.5 ? point1.name : point2.name,
  };
}

// Fungsi untuk menghitung jarak antara dua titik (dalam km)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius bumi dalam km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

interface MapComponentProps {
  trackingData?: Array<{
    jamaah_id: string;
    name: string;
    latitude: number;
    longitude: number;
    status: string;
    battery?: number;
    accuracy?: number;
  }>;
  center?: { lat: number; lng: number };
  zoom?: number;
  useDummyData?: boolean;
}

export default function MapComponent({
  trackingData = [],
  center = { lat: 22.0, lng: 39.8 },
  zoom = 7,
  useDummyData = true
}: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const spiritualMarkersRef = useRef<L.Marker[]>([]);
  const hasInitialFit = useRef(false);
  const animationRef = useRef<number | undefined>(undefined);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);
  const lastUpdateRef = useRef<number>(Date.now());

  // State untuk dummy data yang bergerak
  const [dummyTrackingData, setDummyTrackingData] = useState<any[]>([]);
  const [isMapReady, setIsMapReady] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);

  // Inisialisasi posisi awal untuk dummy data
  useEffect(() => {
    if (!useDummyData) return;

    const initialPositions = DUMMY_JAMAAH.map(jamaah => {
      const route = ROUTES[jamaah.route as keyof typeof ROUTES];
      const startPoint = route.points[0];

      return {
        jamaah_id: jamaah.id,
        name: jamaah.name,
        latitude: startPoint.lat,
        longitude: startPoint.lng,
        status: 'active',
        battery: jamaah.battery,
        accuracy: jamaah.accuracy,
        currentRoute: jamaah.route,
        currentPointIndex: 0,
        progress: 0,
        waiting: false,
        waitTimeRemaining: 0,
        speed: route.speed * (0.8 + Math.random() * 0.4), // Variasi kecepatan
      };
    });

    setDummyTrackingData(initialPositions);
  }, [useDummyData]);

  // Animasi pergerakan dummy data dengan logika yang lebih realistis
  useEffect(() => {
    if (!useDummyData || dummyTrackingData.length === 0 || !isMountedRef.current) return;

    const animate = () => {
      if (!isMountedRef.current) return;

      const now = Date.now();
      const deltaTime = Math.min(100, now - lastUpdateRef.current) / 1000; // Konversi ke detik, max 100ms
      lastUpdateRef.current = now;

      setDummyTrackingData(prevData => {
        return prevData.map(jamaah => {
          const route = ROUTES[jamaah.currentRoute as keyof typeof ROUTES];
          const totalPoints = route.points.length;

          // Handle waiting state
          if (jamaah.waiting) {
            const newWaitTime = jamaah.waitTimeRemaining - deltaTime;
            if (newWaitTime <= 0) {
              // Selesai menunggu, lanjut ke titik berikutnya
              const nextPointIndex = (jamaah.currentPointIndex + 1) % totalPoints;
              return {
                ...jamaah,
                waiting: false,
                waitTimeRemaining: 0,
                currentPointIndex: nextPointIndex,
                progress: 0,
              };
            } else {
              // Masih menunggu
              return {
                ...jamaah,
                waitTimeRemaining: newWaitTime,
              };
            }
          }

          // Update progress berdasarkan kecepatan dan delta time
          let newProgress = jamaah.progress + jamaah.speed * deltaTime;
          let newPointIndex = jamaah.currentPointIndex;
          const nextPointIndex = (jamaah.currentPointIndex + 1) % totalPoints;

          const currentPoint = route.points[jamaah.currentPointIndex];
          const nextPoint = route.points[nextPointIndex];

          // Hitung jarak ke titik berikutnya
          const distanceToNext = calculateDistance(
            currentPoint.lat, currentPoint.lng,
            nextPoint.lat, nextPoint.lng
          );

          // Jika sudah mencapai titik berikutnya
          if (newProgress >= 1) {
            // Cek apakah ada waktu tunggu di titik ini
            if (nextPoint.waitTime && nextPoint.waitTime > 0) {
              return {
                ...jamaah,
                waiting: true,
                waitTimeRemaining: nextPoint.waitTime,
                progress: 0,
                // Posisi tepat di titik
                latitude: nextPoint.lat,
                longitude: nextPoint.lng,
              };
            } else {
              // Langsung lanjut ke titik berikutnya
              return {
                ...jamaah,
                currentPointIndex: nextPointIndex,
                progress: 0,
                latitude: nextPoint.lat,
                longitude: nextPoint.lng,
              };
            }
          }

          // Interpolasi posisi untuk pergerakan smooth
          const interpolated = interpolatePoint(currentPoint, nextPoint, newProgress);

          // Update battery secara realistis (turun 1% per 5 menit perjalanan)
          const batteryDrain = deltaTime * 0.003; // 0.3% per detik ≈ 1% per 3.3 detik
          const newBattery = Math.max(20, Math.min(100, jamaah.battery - batteryDrain));

          // Update akurasi (fluktuasi kecil)
          const newAccuracy = Math.max(3, Math.min(20,
            jamaah.accuracy + (Math.random() - 0.5) * 0.2
          ));

          return {
            ...jamaah,
            latitude: interpolated.lat,
            longitude: interpolated.lng,
            progress: newProgress,
            battery: newBattery,
            accuracy: newAccuracy,
          };
        });
      });

      if (isMountedRef.current) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    lastUpdateRef.current = Date.now();
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [useDummyData, dummyTrackingData.length]);

  // Inisialisasi map (sama seperti sebelumnya)
  useEffect(() => {
    isMountedRef.current = true;

    const initializeMap = () => {
      if (!mapContainerRef.current) {
        console.log('⏳ Map container not ready, retrying...');
        setTimeout(initializeMap, 100);
        return;
      }

      if (mapInitialized) {
        return;
      }

      try {
        const map = L.map(mapContainerRef.current, {
          zoomControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          touchZoom: true,
          fadeAnimation: true,
          zoomAnimation: true,
          markerZoomAnimation: true,
        }).setView([center.lat, center.lng], zoom);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map);

        L.control.zoom({
          position: 'topright'
        }).addTo(map);

        L.control.scale({
          imperial: false,
          metric: true,
          position: 'bottomleft'
        }).addTo(map);

        mapRef.current = map;
        setMapInitialized(true);

        setTimeout(() => {
          if (mapRef.current && isMountedRef.current) {
            mapRef.current.invalidateSize();
            setIsMapReady(true);
          }
        }, 200);

      } catch (err) {
        console.error('Error initializing map:', err);
        setTimeout(initializeMap, 1000);
      }
    };

    initializeMap();

    return () => {
      isMountedRef.current = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setMapInitialized(false);
      setIsMapReady(false);
      hasInitialFit.current = false;
    };
  }, [center, zoom]);

  // Handle window resize
  useEffect(() => {
    if (!isMapReady) return;

    const handleResize = () => {
      if (mapRef.current && isMountedRef.current) {
        mapRef.current.invalidateSize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMapReady]);

  // Data final yang akan ditampilkan di map
  const displayData = useDummyData ? dummyTrackingData : trackingData;

  // Update markers
  useEffect(() => {
    if (!mapRef.current || !isMapReady || displayData.length === 0 || !isMountedRef.current) return;

    const updateMarkers = () => {
      displayData.forEach((data) => {
        const { jamaah_id, name, latitude, longitude, battery = 100, accuracy, waiting } = data;

        if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
          return;
        }

        const jamaahInfo = DUMMY_JAMAAH.find(j => j.id === jamaah_id);

        // Determine location
        let locationColor = jamaahInfo?.color || '#3b82f6';
        let locationName = 'Dalam Perjalanan';

        for (const [key, loc] of Object.entries(SPIRITUAL_LOCATIONS)) {
          const distance = Math.sqrt(
            Math.pow(latitude - loc.lat, 2) +
            Math.pow(longitude - loc.lng, 2)
          );
          if (distance < 0.05) { // Radius deteksi lebih kecil untuk akurasi
            locationName = loc.name;
            locationColor = loc.color;
            break;
          }
        }

        const batteryLevel = Math.min(100, Math.max(0, battery));
        const batteryColor = batteryLevel > 60 ? '#10b981' :
          batteryLevel > 20 ? '#f59e0b' : '#ef4444';

        // Tambah efek pulsing jika sedang menunggu
        const pulsingEffect = waiting ? 'animation: gentle-pulse 2s infinite;' : '';

        // Custom icon
        const customIcon = L.divIcon({
          className: 'jamaah-marker',
          html: `
            <div style="
              position: relative;
              width: 60px;
              height: 70px;
              cursor: pointer;
            ">
              <!-- Main Circle -->
              <div style="
                position: absolute;
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
                width: 45px;
                height: 45px;
                background: white;
                border: 3px solid ${locationColor};
                border-radius: 50%;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2;
                ${pulsingEffect}
              ">
                <div style="
                  width: 30px;
                  height: 30px;
                  background: ${locationColor};
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-weight: bold;
                  font-size: 14px;
                ">
                  ${name?.charAt(0) || 'J'}
                </div>
              </div>
              
              <!-- Battery Badge -->
              <div style="
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                background: white;
                border: 2px solid ${batteryColor};
                border-radius: 10px;
                padding: 2px 8px;
                font-size: 10px;
                font-weight: bold;
                color: ${batteryColor};
                box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                min-width: 40px;
                text-align: center;
                z-index: 3;
              ">
                ${Math.round(batteryLevel)}%
              </div>
              
              <!-- Status Indicator (sedang bergerak/menunggu) -->
              <div style="
                position: absolute;
                top: -5px;
                right: 5px;
                width: 12px;
                height: 12px;
                background: ${waiting ? '#f59e0b' : '#10b981'};
                border: 2px solid white;
                border-radius: 50%;
                z-index: 4;
                ${waiting ? 'animation: pulse-wait 1.5s infinite;' : ''}
              "></div>
              
              <!-- Name Tooltip -->
              <div style="
                position: absolute;
                top: -25px;
                left: 50%;
                transform: translateX(-50%);
                background: ${locationColor};
                padding: 3px 8px;
                border-radius: 12px;
                font-size: 10px;
                font-weight: bold;
                color: white;
                white-space: nowrap;
                box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                z-index: 4;
                opacity: 0;
                transition: opacity 0.2s ease;
                pointer-events: none;
                border: 1px solid white;
              " class="marker-name">
                ${name} ${waiting ? '⏸️' : '🚶'}
              </div>
            </div>
            <style>
              .jamaah-marker:hover .marker-name {
                opacity: 1 !important;
              }
              @keyframes gentle-pulse {
                0%, 100% { transform: translateX(-50%) scale(1); }
                50% { transform: translateX(-50%) scale(1.05); }
              }
              @keyframes pulse-wait {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
              }
            </style>
          `,
          iconSize: [60, 70],
          iconAnchor: [30, 35],
          popupAnchor: [0, -35],
        });

        // Popup content
        const popupContent = `
          <div style="padding: 12px; min-width: 240px;">
            <div style="
              display: flex;
              align-items: center;
              gap: 10px;
              margin-bottom: 12px;
              padding-bottom: 8px;
              border-bottom: 1px solid #e5e7eb;
            ">
              <div style="
                width: 40px;
                height: 40px;
                background: ${locationColor}20;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: ${locationColor};
                font-weight: bold;
                font-size: 16px;
              ">
                ${name?.charAt(0) || 'J'}
              </div>
              <div>
                <div style="font-weight: bold; font-size: 16px; color: #0F5132;">
                  ${name}
                </div>
                <div style="font-size: 11px; color: ${locationColor};">
                  📍 ${locationName}
                </div>
              </div>
            </div>
            
            <div style="font-size: 11px; color: #666; margin-bottom: 8px;">
              ${jamaahInfo ? `Paket: ${jamaahInfo.package}<br/>` : ''}
              Status: ${waiting ? '⏸️ Berhenti' : '🚶 Bergerak'}<br/>
              Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <div style="background: ${batteryColor}15; padding: 6px; border-radius: 6px; text-align: center;">
                <div style="font-size: 9px; color: #666;">Baterai</div>
                <div style="font-size: 13px; font-weight: bold; color: ${batteryColor};">${Math.round(batteryLevel)}%</div>
              </div>
              
              ${accuracy ? `
                <div style="background: #3b82f615; padding: 6px; border-radius: 6px; text-align: center;">
                  <div style="font-size: 9px; color: #666;">Akurasi</div>
                  <div style="font-size: 13px; font-weight: bold; color: #3b82f6;">${Math.round(accuracy)}m</div>
                </div>
              ` : ''}
            </div>
          </div>
        `;

        if (markersRef.current[jamaah_id]) {
          // Update existing marker
          const marker = markersRef.current[jamaah_id];
          const currentPos = marker.getLatLng();

          // Smooth movement dengan kecepatan yang wajar
          const moveSpeed = 0.3; // Faktor smoothing
          const newLat = currentPos.lat + (latitude - currentPos.lat) * moveSpeed;
          const newLng = currentPos.lng + (longitude - currentPos.lng) * moveSpeed;

          marker.setLatLng([newLat, newLng]);
          marker.setIcon(customIcon);
          marker.getPopup()?.setContent(popupContent);
        } else {
          // Create new marker
          const marker = L.marker([latitude, longitude], {
            icon: customIcon,
            zIndexOffset: 1000
          })
            .bindPopup(popupContent)
            .addTo(mapRef.current!);

          markersRef.current[jamaah_id] = marker;
        }
      });

      // Remove old markers
      const currentIds = new Set(displayData.map(d => d.jamaah_id));
      Object.keys(markersRef.current).forEach((id) => {
        if (!currentIds.has(id) && markersRef.current[id]) {
          markersRef.current[id].remove();
          delete markersRef.current[id];
        }
      });
    };

    updateMarkers();

    // Auto-fit bounds only once
    if (displayData.length > 0 && mapRef.current && !hasInitialFit.current) {
      setTimeout(() => {
        if (mapRef.current && displayData.length > 0 && isMountedRef.current) {
          const bounds = L.latLngBounds(
            displayData.map(d => [d.latitude, d.longitude] as [number, number])
          );
          mapRef.current.fitBounds(bounds, {
            padding: [50, 50],
            maxZoom: 10,
            animate: true,
            duration: 1
          });
          hasInitialFit.current = true;
        }
      }, 1000);
    }
  }, [displayData, isMapReady]);

  return (
    <div className="relative h-full w-full">
      <div
        ref={mapContainerRef}
        className="h-full w-full rounded-lg"
        style={{ minHeight: '500px' }}
      />
    </div>
  );
}