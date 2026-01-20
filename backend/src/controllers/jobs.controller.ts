import { Request, Response } from 'express';
import { TrialExpirationJob } from '../jobs/trial-expiration.job';

export class JobsController {
    /**
     * Trigger trial expiration check
     */
    async checkTrialExpiration(_req: Request, res: Response) {
        try {
            const result = await TrialExpirationJob.processExpiredTrials();
            res.json(result);
        } catch (error: any) {
            console.error('Error in manual trial expiration check:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
