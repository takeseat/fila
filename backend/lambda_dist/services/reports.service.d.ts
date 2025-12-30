export declare class ReportsService {
    getWaitlistSummary(restaurantId: string, from?: Date, to?: Date): Promise<{
        totalEntries: number;
        seatedCount: number;
        noShowCount: number;
        cancelledCount: number;
        avgWaitMinutes: number;
        noShowRate: number;
    }>;
}
//# sourceMappingURL=reports.service.d.ts.map