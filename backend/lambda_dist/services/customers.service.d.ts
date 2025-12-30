import { CreateCustomerInput } from '../validators/index';
export declare class CustomersService {
    getCustomers(restaurantId: string, filters?: {
        name?: string;
        phone?: string;
        lastVisitAfter?: string;
        page?: number;
        pageSize?: number;
    }): Promise<{
        data: {
            id: string;
            restaurantId: string;
            name: string;
            countryCode: string;
            ddi: string;
            phone: string;
            fullPhone: string;
            email: string | null;
            notes: string | null;
            lastVisitAt: Date | null;
            totalVisits: number;
            createdAt: Date;
            updatedAt: Date;
        }[];
        meta: {
            page: number;
            pageSize: number;
            total: number;
            totalPages: number;
        };
    }>;
    getCustomerDetails(restaurantId: string, customerId: string): Promise<{
        customer: {
            id: string;
            restaurantId: string;
            name: string;
            countryCode: string;
            ddi: string;
            phone: string;
            fullPhone: string;
            email: string | null;
            notes: string | null;
            lastVisitAt: Date | null;
            totalVisits: number;
            createdAt: Date;
            updatedAt: Date;
        };
        waitlistHistory: {
            id: string;
            restaurantId: string;
            customerId: string | null;
            customerName: string;
            customerPhone: string;
            customerCountryCode: string | null;
            partySize: number;
            status: import(".prisma/client").$Enums.WaitlistEntryStatus;
            estimatedWaitMinutes: number | null;
            createdAt: Date;
            calledAt: Date | null;
            seatedAt: Date | null;
            cancelledAt: Date | null;
            noShowAt: Date | null;
        }[];
    }>;
    getCustomerByFullPhone(restaurantId: string, fullPhone: string): Promise<{
        id: string;
        restaurantId: string;
        name: string;
        countryCode: string;
        ddi: string;
        phone: string;
        fullPhone: string;
        email: string | null;
        notes: string | null;
        lastVisitAt: Date | null;
        totalVisits: number;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    createCustomer(restaurantId: string, data: CreateCustomerInput): Promise<{
        id: string;
        restaurantId: string;
        name: string;
        countryCode: string;
        ddi: string;
        phone: string;
        fullPhone: string;
        email: string | null;
        notes: string | null;
        lastVisitAt: Date | null;
        totalVisits: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    upsertCustomer(restaurantId: string, fullPhone: string, data: CreateCustomerInput): Promise<{
        id: string;
        restaurantId: string;
        name: string;
        countryCode: string;
        ddi: string;
        phone: string;
        fullPhone: string;
        email: string | null;
        notes: string | null;
        lastVisitAt: Date | null;
        totalVisits: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    importCustomers(restaurantId: string, customers: CreateCustomerInput[]): Promise<{
        count: number;
    }>;
    updateCustomer(restaurantId: string, customerId: string, data: Partial<CreateCustomerInput>): Promise<{
        id: string;
        restaurantId: string;
        name: string;
        countryCode: string;
        ddi: string;
        phone: string;
        fullPhone: string;
        email: string | null;
        notes: string | null;
        lastVisitAt: Date | null;
        totalVisits: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteCustomer(restaurantId: string, customerId: string): Promise<{
        id: string;
        restaurantId: string;
        name: string;
        countryCode: string;
        ddi: string;
        phone: string;
        fullPhone: string;
        email: string | null;
        notes: string | null;
        lastVisitAt: Date | null;
        totalVisits: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
//# sourceMappingURL=customers.service.d.ts.map