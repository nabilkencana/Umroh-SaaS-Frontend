export const COLORS = {
    primary: '#0F5132',
    secondary: '#1B5E20',
    accent: '#D4AF37',
    background: '#FFFFFF',
    foreground: '#171717',
} as const;

export const SPIRITUAL_LOCATIONS = {
    MASJID_AL_HARAM: {
        name: 'Masjid al-Haram',
        city: 'Makkah',
        lat: 21.4225,
        lng: 39.8262,
    },
    MASJID_AN_NABAWI: {
        name: 'Masjid an-Nabawi',
        city: 'Madinah',
        lat: 24.4672,
        lng: 39.6111,
    },
} as const;

export const SUBSCRIPTION_PLANS = {
    BASIC: { name: 'Basic', max_jamaah: 200, price: 500000 },
    PROFESSIONAL: { name: 'Professional', max_jamaah: 500, price: 1000000 },
    ENTERPRISE: { name: 'Enterprise', max_jamaah: 2000, price: 2500000 },
} as const;
