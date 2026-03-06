import { apiClient } from '@/lib/api-client';

export interface DashboardStats {
    total_tenants: number;
    total_jamaah: number;
    total_promos: number;
    total_tracking_logs: number;
}

export const analyticsService = {
    async getDashboardStats(params?: { tenant_id?: string }) {
        const response = await apiClient.get<DashboardStats>('/analytics/dashboard', { params });
        return response.data;
    },
};
