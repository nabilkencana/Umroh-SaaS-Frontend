import { apiClient } from '@/lib/api-client';
import { Promo } from '@/lib/types';

export const promoService = {
    async getAll(params?: { tenant_id?: string; is_active?: boolean; is_featured?: boolean }) {
        try {
            const response = await apiClient.get<Promo[]>('/promo', { params });
            console.log('✅ Promo data loaded:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('❌ Failed to load promos:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            throw error;
        }
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

    async uploadBanner(file: File): Promise<string> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiClient.post<{
            success: boolean;
            url: string;
            public_id: string;
            width: number;
            height: number;
            format: string;
            bytes: number;
        }>('/promo/upload/banner', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        // Return Cloudinary URL directly
        return response.data.url;
    },
};
