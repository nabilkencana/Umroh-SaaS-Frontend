import { Promo, Jamaah, Tenant } from './types';

export const mockPromos: Promo[] = [
    {
        id: '1',
        title: 'Promo Ramadhan 2026 - Diskon 25%',
        description: 'Dapatkan diskon spesial untuk paket umroh Ramadhan. Fasilitas lengkap dengan hotel bintang 5 dekat Masjid al-Haram.',
        banner_image: '/images/makkah-hero.jpg',
        discount_percentage: 25,
        start_date: '2026-02-01',
        end_date: '2026-03-31',
        is_featured: true,
        is_active: true,
        created_at: '2026-01-15T00:00:00Z',
        updated_at: '2026-01-15T00:00:00Z',
    },
    {
        id: '2',
        title: 'Paket Umroh Plus Madinah',
        description: 'Nikmati perjalanan spiritual ke Makkah dan Madinah dengan bimbingan ustadz berpengalaman.',
        banner_image: '/images/madinah.jpg',
        discount_percentage: 15,
        start_date: '2026-03-01',
        end_date: '2026-06-30',
        is_featured: true,
        is_active: true,
        created_at: '2026-01-20T00:00:00Z',
        updated_at: '2026-01-20T00:00:00Z',
    },
    {
        id: '3',
        title: 'Early Bird Umroh 2027',
        description: 'Booking sekarang untuk umroh tahun depan dengan harga spesial.',
        banner_image: '/images/makkah.jpg',
        discount_percentage: 20,
        start_date: '2026-03-01',
        end_date: '2026-12-31',
        is_featured: false,
        is_active: true,
        created_at: '2026-02-01T00:00:00Z',
        updated_at: '2026-02-01T00:00:00Z',
    },
];

export const mockTenants: Tenant[] = [
    {
        id: '1',
        name: 'Al-Hijrah Travel',
        slug: 'al-hijrah',
        subscription_plan: 'PROFESSIONAL',
        max_jamaah: 500,
        is_active: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
    },
    {
        id: '2',
        name: 'Barokah Umroh',
        slug: 'barokah',
        subscription_plan: 'BASIC',
        max_jamaah: 200,
        is_active: true,
        created_at: '2025-02-01T00:00:00Z',
        updated_at: '2025-02-01T00:00:00Z',
    },
];

export const mockJamaah: Jamaah[] = [
    {
        id: '1',
        tenant_id: '1',
        full_name: 'Ahmad Fauzi',
        passport_number: 'A1234567',
        phone: '+62812345678',
        status: 'active',
        created_at: '2026-01-10T00:00:00Z',
        updated_at: '2026-01-10T00:00:00Z',
    },
    {
        id: '2',
        tenant_id: '1',
        full_name: 'Siti Aminah',
        passport_number: 'B7654321',
        phone: '+62823456789',
        status: 'active',
        created_at: '2026-01-12T00:00:00Z',
        updated_at: '2026-01-12T00:00:00Z',
    },
];
