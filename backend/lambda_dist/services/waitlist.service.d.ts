import { CreateWaitlistEntryInput } from '../validators/waitlist.validator';
export declare class WaitlistService {
    getWaitlist(restaurantId: string): Promise<({
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
        } | null;
    } & {
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
    })[]>;
    createEntry(restaurantId: string, data: CreateWaitlistEntryInput): Promise<{
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
        } | null;
    } & {
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
    }>;
    callEntry(restaurantId: string, entryId: string): Promise<{
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
        } | null;
    } & {
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
    }>;
    seatEntry(restaurantId: string, entryId: string): Promise<{
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
        } | null;
    } & {
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
    }>;
    cancelEntry(restaurantId: string, entryId: string): Promise<{
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
        } | null;
    } & {
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
    }>;
    markNoShow(restaurantId: string, entryId: string): Promise<{
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
        } | null;
    } & {
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
    }>;
    getQueueMetrics(restaurantId: string): Promise<{
        averageWaitSeconds: number;
        sampleSize: number;
        windowMinutes: number;
        isFallbackUsed: boolean;
        activeCount: number;
        servedToday: number;
    }>;
}
//# sourceMappingURL=waitlist.service.d.ts.map