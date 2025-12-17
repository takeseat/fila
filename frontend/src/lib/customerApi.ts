import api from './api';
import { Customer, CustomerFilters, PaginatedCustomers, CustomerDetails } from '../types/customer.types';

export const customerApi = {
    async getCustomers(filters?: CustomerFilters): Promise<PaginatedCustomers> {
        const params = new URLSearchParams();

        if (filters?.name && filters.name.trim()) params.append('name', filters.name);
        if (filters?.phone && filters.phone.trim()) params.append('phone', filters.phone);
        if (filters?.lastVisitAfter && filters.lastVisitAfter.trim()) params.append('lastVisitAfter', filters.lastVisitAfter);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());

        const { data } = await api.get(`/customers?${params.toString()}`);
        return data;
    },

    async getCustomer(id: string): Promise<CustomerDetails> {
        const { data } = await api.get(`/customers/${id}`);
        return data;
    },

    async createCustomer(customerData: {
        name: string;
        countryCode: string;
        ddi: string;
        phone: string;
        fullPhone: string;
        email?: string;
        notes?: string;
    }): Promise<Customer> {
        const { data } = await api.post('/customers', customerData);
        return data;
    },

    async updateCustomer(
        id: string,
        customerData: {
            name?: string;
            countryCode?: string;
            ddi?: string;
            phone?: string;
            fullPhone?: string;
            email?: string;
            notes?: string;
        }
    ): Promise<Customer> {
        const { data } = await api.put(`/customers/${id}`, customerData);
        return data;
    },

    async deleteCustomer(id: string): Promise<void> {
        await api.delete(`/customers/${id}`);
    },
};
