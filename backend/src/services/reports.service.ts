import prisma from '../config/database';

export class ReportsService {
    async getWaitlistSummary(restaurantId: string, from?: Date, to?: Date) {
        const where: any = { restaurantId };

        if (from || to) {
            where.createdAt = {};
            if (from) where.createdAt.gte = from;
            if (to) where.createdAt.lte = to;
        }

        const entries = await prisma.waitlistEntry.findMany({
            where,
        });

        const totalEntries = entries.length;
        const seatedCount = entries.filter((e) => e.status === 'SEATED').length;
        const noShowCount = entries.filter((e) => e.status === 'NO_SHOW').length;
        const cancelledCount = entries.filter((e) => e.status === 'CANCELLED').length;

        // Calculate average wait time for seated customers
        const seatedEntries = entries.filter(
            (e) => e.status === 'SEATED' && e.seatedAt && e.createdAt
        );

        const totalWaitMinutes = seatedEntries.reduce((sum, entry) => {
            const waitTime = entry.seatedAt!.getTime() - entry.createdAt.getTime();
            return sum + waitTime / 1000 / 60; // Convert to minutes
        }, 0);

        const avgWaitMinutes = seatedEntries.length > 0
            ? Math.round(totalWaitMinutes / seatedEntries.length)
            : 0;

        const noShowRate = totalEntries > 0
            ? Math.round((noShowCount / totalEntries) * 100)
            : 0;

        return {
            totalEntries,
            seatedCount,
            noShowCount,
            cancelledCount,
            avgWaitMinutes,
            noShowRate,
        };
    }

}
