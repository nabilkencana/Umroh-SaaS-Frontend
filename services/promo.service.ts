import { apiClient } from '@/lib/api-client';
import { Promo } from '@/lib/types';

export const promoService = {
    async getAll(params?: { tenant_id?: string; is_active?: boolean; is_featured?: boolean }) {
        const response = await apiClient.get<Promo[]>('/promo', { params });
        return response.data;
    },

    async getById(id: string) {
        const response = await apiClient.get<Promo>(`/promo/${id}`);
        return response.data;
    },

    async create(data: Partial<Promo>) {
        const response = await apiClient.post<Promo>('/promo', data);
        return response.data;
    },

    async update(id: string, data: Partial<Promo>) {
        const response = await apiClient.patch<Promo>(`/promo/${id}`, data);
        return response.data;
    },

    async delete(id: string) {
        await apiClient.delete(`/promo/${id}`);
    },
};
