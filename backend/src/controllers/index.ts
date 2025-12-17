import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ReportsService } from '../services/reports.service';

// Reports Controller
const reportsService = new ReportsService();

export class ReportsController {
    async getWaitlistSummary(req: AuthRequest, res: Response): Promise<void> {
        try {
            const restaurantId = req.user!.restaurantId;
            const { from, to } = req.query;
            const summary = await reportsService.getWaitlistSummary(
                restaurantId,
                from ? new Date(from as string) : undefined,
                to ? new Date(to as string) : undefined
            );
            res.json(summary);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
