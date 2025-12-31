import { Request, Response } from 'express';
import { ImpersonationService } from '../services/impersonation.service';

export class ImpersonationController {
    /**
     * POST /admin/restaurants/:id/impersonate
     */
    static async generateToken(req: Request, res: Response) {
        try {
            const { id: targetRestaurantId } = req.params;
            const { reason } = req.body;

            // @ts-ignore - user is set by auth middleware
            const sysadminUserId = req.user.id;
            const ipAddress = req.ip || req.socket.remoteAddress;
            const userAgent = req.headers['user-agent'];

            const result = await ImpersonationService.generateImpersonationToken(
                sysadminUserId,
                targetRestaurantId,
                ipAddress,
                userAgent,
                reason
            );

            res.json(result);
        } catch (error: any) {
            console.error('[Impersonation] Generate token error:', error);
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * POST /admin/impersonation/end
     */
    static async endSession(req: Request, res: Response) {
        try {
            const { logId } = req.body;

            if (!logId) {
                return res.status(400).json({ error: 'logId is required' });
            }

            const log = await ImpersonationService.endImpersonation(logId);
            res.json(log);
        } catch (error: any) {
            console.error('[Impersonation] End session error:', error);
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * GET /admin/impersonation/logs
     */
    static async getLogs(req: Request, res: Response) {
        try {
            const { sysadminUserId, targetRestaurantId, isActive, page = '1', limit = '50' } = req.query;

            const filters = {
                sysadminUserId: sysadminUserId as string,
                targetRestaurantId: targetRestaurantId as string,
                isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
            };

            const result = await ImpersonationService.getImpersonationLogs(
                filters,
                parseInt(page as string),
                parseInt(limit as string)
            );

            res.json(result);
        } catch (error: any) {
            console.error('[Impersonation] Get logs error:', error);
            res.status(500).json({ error: error.message });
        }
    }
}
