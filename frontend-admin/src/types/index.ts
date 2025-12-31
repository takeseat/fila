export interface Restaurant {
    id: string;
    name: string;
    tradeName?: string;
    cnpj?: string;
    email?: string;
    phone?: string;
    countryCode?: string;
    stateCode?: string;
    city: string;
    addressLine?: string;
    addressNumber?: string;
    addressComplement?: string;
    postalCode?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    _count?: {
        users: number;
        customers: number;
    };
}

export interface RestaurantFilters {
    search?: string;
    isActive?: boolean;
    countryCode?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface ImpersonationToken {
    token: string;
    expiresAt: string;
    logId: string;
    restaurant: {
        id: string;
        name: string;
    };
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'SYSADMIN' | 'ADMIN' | 'MANAGER' | 'HOSTESS';
    restaurantId?: string;
}
