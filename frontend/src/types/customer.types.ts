export interface Customer {
    id: string;
    restaurantId: string;
    name: string;
    countryCode: string;
    ddi: string;
    phone: string;
    fullPhone: string;
    email?: string | null;
    notes?: string | null;
    lastVisitAt?: string | null;
    totalVisits: number;
    createdAt: string;
    updatedAt: string;
}

export interface CustomerFilters {
    name?: string;
    phone?: string;
    lastVisitAfter?: string;
    page?: number;
    pageSize?: number;
}

export interface PaginatedCustomers {
    data: Customer[];
    meta: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
}

export interface CustomerFormData {
    country: {
        code: string;
        name: string;
        ddi: string;
        flag: string;
    };
    phone: string;
    name: string;
    email: string;
    notes: string;
}

export interface CustomerDetails {
    customer: Customer;
    waitlistHistory: any[];
    reservationHistory: any[];
    npsResponses: any[];
}
