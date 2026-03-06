import { apiClient } from '@/lib/api-client';
import { Jamaah } from '@/lib/types';

export const jamaahService = {
    async getAll(params?: { tenant_id?: string; branch_id?: string; status?: string }) {
        const response = await apiClient.get<Jamaah[]>('/jamaah', { params });
        return response.data;
    },

    async getById(id: string) {
        const response = await apiClient.get<Jamaah>(`/jamaah/${id}`);
        return response.data;
    },

    async create(data: any) {
        const response = await apiClient.post<Jamaah>('/jamaah', data);
        return response.data;
    },

    async update(id: string, data: Partial<Jamaah>) {
        const response = await apiClient.patch<Jamaah>(`/jamaah/${id}`, data);
        return response.data;
    },

    async delete(id: string) {
        await apiClient.delete(`/jamaah/${id}`);
    },

    async verify(id: string, status: 'verified' | 'rejected', verified_by: string, rejection_reason?: string) {
        const response = await apiClient.patch(`/jamaah/${id}/verify`, {
            status,
            verified_by,
            rejection_reason,
        });
        return response.data;
    },
};
