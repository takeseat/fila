import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import pickupOrdersApi, {
    CreatePickupOrderInput,
    UpdatePickupOrderInput,
    ListPickupOrdersParams,
} from '../services/pickupOrdersApi';
import { toast } from 'react-hot-toast';

// Query keys
export const pickupOrdersKeys = {
    all: ['pickup-orders'] as const,
    lists: () => [...pickupOrdersKeys.all, 'list'] as const,
    list: (params?: ListPickupOrdersParams) => [...pickupOrdersKeys.lists(), params] as const,
    details: () => [...pickupOrdersKeys.all, 'detail'] as const,
    detail: (id: string) => [...pickupOrdersKeys.details(), id] as const,
    config: () => [...pickupOrdersKeys.all, 'config'] as const,
};

// List pickup orders
export function usePickupOrders(params?: ListPickupOrdersParams) {
    return useQuery({
        queryKey: pickupOrdersKeys.list(params),
        queryFn: () => pickupOrdersApi.list(params),
        staleTime: 30000, // 30 seconds
    });
}

// Get pickup order by ID
export function usePickupOrder(id: string) {
    return useQuery({
        queryKey: pickupOrdersKeys.detail(id),
        queryFn: () => pickupOrdersApi.getById(id),
        enabled: !!id,
    });
}

// Get config
export function usePickupOrdersConfig() {
    return useQuery({
        queryKey: pickupOrdersKeys.config(),
        queryFn: () => pickupOrdersApi.getConfig(),
    });
}

// Create pickup order
export function useCreatePickupOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePickupOrderInput) => pickupOrdersApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: pickupOrdersKeys.lists() });
            toast.success('Pedido criado com sucesso!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Erro ao criar pedido');
        },
    });
}

// Update pickup order
export function useUpdatePickupOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdatePickupOrderInput }) =>
            pickupOrdersApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: pickupOrdersKeys.lists() });
            queryClient.invalidateQueries({ queryKey: pickupOrdersKeys.detail(variables.id) });
            toast.success('Pedido atualizado!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Erro ao atualizar pedido');
        },
    });
}

// Change status
export function useChangePickupOrderStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            pickupOrdersApi.changeStatus(id, status),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: pickupOrdersKeys.lists() });
            queryClient.invalidateQueries({ queryKey: pickupOrdersKeys.detail(variables.id) });
            toast.success('Status atualizado!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Erro ao atualizar status');
        },
    });
}

// Resend WhatsApp
export function useResendWhatsApp() {
    return useMutation({
        mutationFn: (id: string) => pickupOrdersApi.resendWhatsApp(id),
        onSuccess: () => {
            toast.success('Mensagem reenviada!');
        },
        onError: (error: any) => {
            const message = error.response?.data?.error || 'Erro ao reenviar mensagem';
            toast.error(message);
        },
    });
}

// Update config
export function useUpdatePickupOrdersConfig() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: any) => pickupOrdersApi.updateConfig(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: pickupOrdersKeys.config() });
            toast.success('Configurações salvas!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Erro ao salvar configurações');
        },
    });
}
