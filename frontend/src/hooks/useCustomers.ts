import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerApi } from '../lib/customerApi';
import { CustomerFilters } from '../types/customer.types';

export function useCustomers(filters?: CustomerFilters) {
    return useQuery({
        queryKey: ['customers', filters],
        queryFn: () => customerApi.getCustomers(filters),
    });
}

export function useCustomer(id: string) {
    return useQuery({
        queryKey: ['customer', id],
        queryFn: () => customerApi.getCustomer(id),
        enabled: !!id,
    });
}

export function useCreateCustomer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: customerApi.createCustomer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
        },
    });
}

export function useUpdateCustomer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            customerApi.updateCustomer(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
            queryClient.invalidateQueries({ queryKey: ['customer', variables.id] });
        },
    });
}

export function useDeleteCustomer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: customerApi.deleteCustomer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
        },
    });
}
