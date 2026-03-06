import { apiClient } from '@/lib/api-client';

export interface TrackingLog {
    id: string;
    tenant_id: string;
    jamaah_id: string;
    latitude: number;
    longitude: number;
    status: string;
    created_at: string;
    jamaah?: {
        id: string;
        full_name: string;
        passport_number: string;
        phone: string;
    };
}

export const trackingService = {
    async getAll(params?: { tenant_id?: string; jamaah_id?: string }) {
        const response = await apiClient.get<TrackingLog[]>('/tracking', { params });
        return response.data;
    },
};
