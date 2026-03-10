import { apiClient } from '@/lib/api-client';

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: string;
    tenant_id: string;
    branch_id?: string;
    phone?: string;
    position?: string;
    bio?: string;
    avatar_url?: string;
    created_at: string;
    updated_at: string;
}

export interface TenantInfo {
    id: string;
    name: string;
    slug: string;
    business_type?: string;
    subscription_plan: string;
    max_jamaah: number;
    is_active: boolean;
    address?: string;
    phone?: string;
    email?: string;
    license_number?: string;
    npwp?: string;
}

export interface NotificationSettings {
    email_notifications: boolean;
    push_notifications: boolean;
    whatsapp_notifications: boolean;
}

export interface AppearanceSettings {
    theme: 'light' | 'dark' | 'system';
    font_size: number;
    animations_enabled: boolean;
}

export interface LanguageSettings {
    language: 'id' | 'en' | 'ar';
    timezone: 'wib' | 'wita' | 'wit';
    date_format: 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'yyyy-mm-dd';
}

export interface ChangePasswordData {
    current_password: string;
    new_password: string;
    confirm_password: string;
}

export const userService = {
    // Get current user profile
    async getProfile() {
        const response = await apiClient.get<UserProfile>('/auth/profile');
        return response.data;
    },

    // Update user profile
    async updateProfile(data: Partial<UserProfile>) {
        const response = await apiClient.patch<UserProfile>('/auth/profile', data);
        return response.data;
    },

    // Upload profile picture
    async uploadAvatar(file: File) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiClient.post<{ success: boolean; url: string; public_id: string }>('/auth/upload-avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Get tenant information
    async getTenantInfo() {
        const response = await apiClient.get<TenantInfo>('/tenant/info');
        return response.data;
    },

    // Update tenant information
    async updateTenantInfo(data: Partial<TenantInfo>) {
        const response = await apiClient.patch<TenantInfo>('/tenant/info', data);
        return response.data;
    },

    // Get notification settings
    async getNotificationSettings() {
        const response = await apiClient.get<NotificationSettings>('/auth/settings');
        return {
            email_notifications: response.data.email_notifications,
            push_notifications: response.data.push_notifications,
            whatsapp_notifications: response.data.whatsapp_notifications,
        };
    },

    // Update notification settings
    async updateNotificationSettings(settings: NotificationSettings) {
        const response = await apiClient.patch('/auth/settings', {
            email_notifications: settings.email_notifications,
            push_notifications: settings.push_notifications,
            whatsapp_notifications: settings.whatsapp_notifications,
        });
        return response.data;
    },

    // Get appearance settings
    async getAppearanceSettings() {
        const response = await apiClient.get<AppearanceSettings>('/auth/settings');
        return {
            theme: response.data.theme,
            font_size: response.data.font_size,
            animations_enabled: response.data.animations_enabled,
        };
    },

    // Update appearance settings
    async updateAppearanceSettings(settings: AppearanceSettings) {
        const response = await apiClient.patch('/auth/settings', {
            theme: settings.theme,
            font_size: settings.font_size,
            animations_enabled: settings.animations_enabled,
        });
        // Apply theme
        if (settings.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        // Apply font size
        document.documentElement.style.fontSize = `${settings.font_size}px`;
        return response.data;
    },

    // Get language settings
    async getLanguageSettings() {
        const response = await apiClient.get<LanguageSettings>('/auth/settings');
        return {
            language: response.data.language,
            timezone: response.data.timezone,
            date_format: response.data.date_format,
        };
    },

    // Update language settings
    async updateLanguageSettings(settings: LanguageSettings) {
        const response = await apiClient.patch('/auth/settings', {
            language: settings.language,
            timezone: settings.timezone,
            date_format: settings.date_format,
        });
        return response.data;
    },

    // Change password
    async changePassword(data: ChangePasswordData) {
        const response = await apiClient.post('/auth/change-password', data);
        return response.data;
    },

    // Logout from all devices
    async logoutAllDevices() {
        const response = await apiClient.post('/auth/logout-all');
        return response.data;
    },

    // Enable 2FA
    async enable2FA() {
        const response = await apiClient.post('/auth/enable-2fa');
        return response.data;
    },
};
