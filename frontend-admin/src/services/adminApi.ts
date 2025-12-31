import { api } from './api';
import type { Restaurant, RestaurantFilters, PaginatedResponse, ImpersonationToken } from '../types';

export const adminApi = {
    // Restaurants
    async listRestaurants(filters: RestaurantFilters = {}, page = 1, limit = 20) {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.isActive !== undefined) params.append('isActive', String(filters.isActive));
        if (filters.countryCode) params.append('countryCode', filters.countryCode);
        params.append('page', String(page));
        params.append('limit', String(limit));

        const { data } = await api.get<PaginatedResponse<Restaurant>>(
            `/admin/restaurants?${params}`
        );
        return data;
    },

    async getRestaurant(id: string) {
        const { data } = await api.get<Restaurant>(`/admin/restaurants/${id}`);
        return data;
    },

    async createRestaurant(restaurant: Partial<Restaurant>) {
        const { data } = await api.post<Restaurant>('/admin/restaurants', restaurant);
        return data;
    },

    async updateRestaurant(id: string, restaurant: Partial<Restaurant>) {
        const { data } = await api.put<Restaurant>(`/admin/restaurants/${id}`, restaurant);
        return data;
    },

    async toggleRestaurantStatus(id: string, isActive: boolean) {
        const { data } = await api.patch<Restaurant>(
            `/admin/restaurants/${id}/status`,
            { isActive }
        );
        return data;
    },

    // Impersonation
    async generateImpersonationToken(restaurantId: string, reason?: string) {
        const { data } = await api.post<ImpersonationToken>(
            `/admin/restaurants/${restaurantId}/impersonate`,
            { reason }
        );
        return data;
    },

    async endImpersonation(logId: string) {
        const { data } = await api.post('/admin/impersonation/end', { logId });
        return data;
    },

    // Auth
    async login(email: string, password: string) {
        const { data } = await api.post('/auth/login', { email, password });
        return data;
    },
};
