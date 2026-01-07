import api from './api';

export interface PickupOrder {
    id: string;
    restaurantId: string;
    orderCode: string;
    customerId?: string;
    customerName?: string;
    customerPhoneE164: string;
    customerCountryCode: string;
    partySize?: number;
    notes?: string;
    status: 'CREATED' | 'READY_FOR_PICKUP' | 'PICKED_UP' | 'NOT_PICKED_UP';
    createdAt: string;
    readyAt?: string;
    pickedUpAt?: string;
    notPickedUpAt?: string;
    whatsappOptIn: boolean;
    lastWhatsAppNotifiedAt?: string;
    source: 'MANUAL' | 'API' | 'POS';
    createdByUserId?: string;
}

export interface PickupOrdersConfig {
    enabled: boolean;
    whatsappEnabled: boolean;
    config: {
        messages: {
            created: {
                enabled: boolean;
                template: string;
            };
            ready: {
                enabled: boolean;
                template: string;
            };
            notPickedUp: {
                enabled: boolean;
                template: string;
            };
        };
        pickupInstructions: string;
        autoNotPickedUpMinutes: number;
        sendCreatedMessage: boolean;
    };
}

export interface CreatePickupOrderInput {
    orderCode: string;
    customerPhoneE164: string;
    customerCountryCode: string;
    customerName?: string;
    partySize?: number;
    notes?: string;
    whatsappOptIn?: boolean;
}

export interface UpdatePickupOrderInput {
    orderCode?: string;
    customerName?: string;
    partySize?: number;
    notes?: string;
}

export interface ListPickupOrdersParams {
    status?: string;
    search?: string;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
}

export interface PickupOrdersListResponse {
    data: PickupOrder[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

const pickupOrdersApi = {
    // List orders
    list: async (params?: ListPickupOrdersParams): Promise<PickupOrdersListResponse> => {
        const response = await api.get('/pickup-orders', { params });
        return response.data;
    },

    // Get order by ID
    getById: async (id: string): Promise<PickupOrder> => {
        const response = await api.get(`/pickup-orders/${id}`);
        return response.data;
    },

    // Create order
    create: async (data: CreatePickupOrderInput): Promise<PickupOrder> => {
        const response = await api.post('/pickup-orders', data);
        return response.data;
    },

    // Update order
    update: async (id: string, data: UpdatePickupOrderInput): Promise<PickupOrder> => {
        const response = await api.put(`/pickup-orders/${id}`, data);
        return response.data;
    },

    // Change status
    changeStatus: async (id: string, status: string): Promise<PickupOrder> => {
        const response = await api.patch(`/pickup-orders/${id}/status`, { status });
        return response.data;
    },

    // Resend WhatsApp
    resendWhatsApp: async (id: string): Promise<{ success: boolean; message: string }> => {
        const response = await api.post(`/pickup-orders/${id}/resend-whatsapp`);
        return response.data;
    },

    // Get config
    getConfig: async (): Promise<PickupOrdersConfig> => {
        const response = await api.get('/pickup-orders/config');
        return response.data;
    },

    // Update config
    updateConfig: async (data: Partial<PickupOrdersConfig>): Promise<PickupOrdersConfig> => {
        const response = await api.put('/pickup-orders/config', data);
        return response.data;
    },

    // Get default templates
    getDefaults: async (language: string = 'pt-BR') => {
        const response = await api.get('/pickup-orders/config/defaults', {
            params: { language },
        });
        return response.data;
    },
};

export default pickupOrdersApi;
