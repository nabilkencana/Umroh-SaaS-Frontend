export const COLORS = {
    primary: '#0F5132',
    secondary: '#1B5E20',
    accent: '#D4AF37',
    background: '#FFFFFF',
    foreground: '#171717',
} as const;

export const SPIRITUAL_LOCATIONS = {
    MASJID_AL_HARAM: {
        name: 'Masjid Al-Haram',
        lat: 21.4225,
        lng: 39.8262,
        city: 'Makkah'
    },
    MASJID_AL_NABAWI: {
        name: 'Masjid Nabawi',
        lat: 24.4672,
        lng: 39.6111,
        city: 'Madinah'
    },
    // Tambahan lokasi lain jika diperlukan
    JABAL_NUR: {
        name: 'Jabal Nur',
        lat: 21.4575,
        lng: 39.8575,
        city: 'Makkah'
    },
    JABAL_RAHMAH: {
        name: 'Jabal Rahmah',
        lat: 21.2144,
        lng: 39.9681,
        city: 'Arafah'
    }
} as const;

export const SUBSCRIPTION_PLANS = {
    BASIC: { name: 'Basic', max_jamaah: 200, price: 500000 },
    PROFESSIONAL: { name: 'Professional', max_jamaah: 500, price: 1000000 },
    ENTERPRISE: { name: 'Enterprise', max_jamaah: 2000, price: 2500000 },
} as const;
