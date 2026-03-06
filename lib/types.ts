export enum Role {
    SUPER_ADMIN = 'super_admin',
    ADMIN_CABANG = 'admin_cabang',
    PEMBIMBING = 'pembimbing',
    JAMAAH = 'jamaah',
    KELUARGA = 'keluarga'
}

export interface Tenant {
    id: string;
    name: string;
    slug: string;
    subscription_plan: string;
    max_jamaah: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: string;
    tenant_id: string;
    name: string;
    email: string;
    role: Role;
    branch_id?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Jamaah {
    id: string;
    tenant_id: string;
    branch_id?: string;
    full_name: string;
    passport_number: string;
    phone: string;
    email?: string;
    address?: string;
    ktp_number?: string;
    ktp_image_url?: string;
    passport_image_url?: string;
    vaccine_certificate_url?: string;
    package_type?: string;
    room_type?: string;
    room_upgrade_price?: number;
    additional_tour?: string;
    tour_price?: number;
    base_price?: number;
    total_price?: number;
    verification_status?: string;
    verified_by?: string;
    verified_at?: string;
    rejection_reason?: string;
    birth_date?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface Promo {
    id: string;
    title: string;
    description?: string;
    banner_image?: string;
    discount_percentage?: number;
    start_date?: string;
    end_date?: string;
    tenant_id?: string;
    is_featured: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface TrackingLog {
    id: string;
    tenant_id: string;
    jamaah_id: string;
    latitude: number;
    longitude: number;
    status: string;
    created_at: string;
}
