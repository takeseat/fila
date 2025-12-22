import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { WaitlistService } from '../services/waitlist.service';
import { CreateWaitlistEntryInputSchema } from '../validators/waitlist.validator';

const waitlistService = new WaitlistService();

export class WaitlistController {
    async getWaitlist(req: AuthRequest, res: Response): Promise<void> {
        try {
            const restaurantId = req.user!.restaurantId;
            const entries = await waitlistService.getWaitlist(restaurantId);
            res.json(entries);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getMetrics(req: AuthRequest, res: Response): Promise<void> {
        try {
            const restaurantId = req.user!.restaurantId;
            const metrics = await waitlistService.getQueueMetrics(restaurantId);
            res.json(metrics);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async createEntry(req: AuthRequest, res: Response): Promise<void> {
        try {
            const restaurantId = req.user!.restaurantId;
            const data = CreateWaitlistEntryInputSchema.parse(req.body);
            const entry = await waitlistService.createEntry(restaurantId, data);

            res.status(201).json(entry);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async callEntry(req: AuthRequest, res: Response): Promise<void> {
        try {
            const restaurantId = req.user!.restaurantId;
            const { id } = req.params;
            const entry = await waitlistService.callEntry(restaurantId, id);

            res.json(entry);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async seatEntry(req: AuthRequest, res: Response): Promise<void> {
        try {
            const restaurantId = req.user!.restaurantId;
            const { id } = req.params;
            const entry = await waitlistService.seatEntry(restaurantId, id);

            res.json(entry);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async cancelEntry(req: AuthRequest, res: Response): Promise<void> {
        try {
            const restaurantId = req.user!.restaurantId;
            const { id } = req.params;
            const entry = await waitlistService.cancelEntry(restaurantId, id);

            res.json(entry);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async markNoShow(req: AuthRequest, res: Response): Promise<void> {
        try {
            const restaurantId = req.user!.restaurantId;
            const { id } = req.params;
            const entry = await waitlistService.markNoShow(restaurantId, id);

            res.json(entry);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
