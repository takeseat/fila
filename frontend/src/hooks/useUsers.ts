import { useState, useEffect } from 'react';
import api from '../lib/api';

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'MANAGER' | 'HOSTESS';
    isActive: boolean;
    language: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserData {
    name: string;
    email: string;
    password: string;
    role: 'ADMIN' | 'MANAGER' | 'HOSTESS';
    language?: string;
    isActive?: boolean;
}

export interface UpdateUserData {
    name?: string;
    email?: string;
    role?: 'ADMIN' | 'MANAGER' | 'HOSTESS';
    language?: string;
    isActive?: boolean;
}

export interface UsersFilters {
    search?: string;
    role?: 'ADMIN' | 'MANAGER' | 'HOSTESS';
    isActive?: boolean;
}

export function useUsers(filters?: UsersFilters) {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams();
            if (filters?.search) params.append('search', filters.search);
            if (filters?.role) params.append('role', filters.role);
            if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));

            const response = await api.get(`/users-management?${params.toString()}`);
            setUsers(response.data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const createUser = async (data: CreateUserData): Promise<User> => {
        const response = await api.post('/users-management', data);
        await fetchUsers(); // Refresh list
        return response.data;
    };

    const updateUser = async (id: string, data: UpdateUserData): Promise<User> => {
        const response = await api.put(`/users-management/${id}`, data);
        await fetchUsers(); // Refresh list
        return response.data;
    };

    const updateUserStatus = async (id: string, isActive: boolean): Promise<User> => {
        const response = await api.patch(`/users-management/${id}/status`, { isActive });
        await fetchUsers(); // Refresh list
        return response.data;
    };

    const deleteUser = async (id: string): Promise<void> => {
        await api.delete(`/users-management/${id}`);
        await fetchUsers(); // Refresh list
    };

    useEffect(() => {
        fetchUsers();
    }, [filters?.search, filters?.role, filters?.isActive]);

    return {
        users,
        loading,
        error,
        fetchUsers,
        createUser,
        updateUser,
        updateUserStatus,
        deleteUser,
    };
}
