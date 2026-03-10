import { apiClient } from '@/lib/api-client';

export interface DashboardStats {
    total_tenants: number;
    total_jamaah: number;
    active_promos: number;
    tracking_today: number;
}

export interface WeeklyActivity {
    day: string;
    registrations: number;
    tracking: number;
    payments: number;
}

export interface RecentActivity {
    id: string;
    user: string;
    action: string;
    time: string;
    type: 'registration' | 'payment' | 'tracking' | 'document';
}

export interface GrowthData {
    month: string;
    jamaah: number;
    tenant: number;
}

export interface TenantDistribution {
    name: string;
    value: number;
    color: string;
}

export interface PromoPerformance {
    id: string;
    title: string;
    views: number;
    clicks: number;
    conversion: string;
    revenue: number;
}

export interface AnalyticsSummary {
    growth_rate: number;
    avg_conversion: number;
    roi: number;
}

export const analyticsService = {
    async getDashboardStats(params?: { tenant_id?: string }) {
        const response = await apiClient.get<DashboardStats>('/analytics/dashboard', { params });
        return response.data;
    },

    async getWeeklyActivity(params?: { tenant_id?: string }) {
        const response = await apiClient.get<WeeklyActivity[]>('/analytics/weekly-activity', { params });
        return response.data;
    },

    async getRecentActivities(params?: { tenant_id?: string; limit?: number }) {
        const response = await apiClient.get<RecentActivity[]>('/analytics/recent-activities', { params });
        return response.data;
    },

    async getGrowthData(params?: { tenant_id?: string; months?: number }) {
        const response = await apiClient.get<GrowthData[]>('/analytics/growth-data', { params });
        return response.data;
    },

    async getTenantDistribution(params?: { tenant_id?: string }) {
        const response = await apiClient.get<TenantDistribution[]>('/analytics/tenant-distribution', { params });
        return response.data;
    },

    async getPromoPerformance(params?: { tenant_id?: string }) {
        const response = await apiClient.get<PromoPerformance[]>('/analytics/promo-performance', { params });
        return response.data;
    },

    async getAnalyticsSummary(params?: { tenant_id?: string }) {
        const response = await apiClient.get<AnalyticsSummary>('/analytics/summary', { params });
        return response.data;
    },
};
