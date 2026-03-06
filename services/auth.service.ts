import { apiClient } from '@/lib/api-client';

export const authService = {
    async login(email: string, password: string) {
        const response = await apiClient.post('/auth/login', { email, password });
        if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', response.data.access_token);
        }
        return response.data;
    },

    async register(data: {
        email: string;
        password: string;
        name: string;
        tenant_name: string;
        phone?: string;
        role?: string;
    }) {
        const response = await apiClient.post('/auth/register', data);
        return response.data;
    },

    logout() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            window.location.href = '/dashboard/login';
        }
    },

    getToken() {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('access_token');
        }
        return null;
    },
};
