import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare class WaitlistController {
    getWaitlist(req: AuthRequest, res: Response): Promise<void>;
    getMetrics(req: AuthRequest, res: Response): Promise<void>;
    createEntry(req: AuthRequest, res: Response): Promise<void>;
    callEntry(req: AuthRequest, res: Response): Promise<void>;
    seatEntry(req: AuthRequest, res: Response): Promise<void>;
    cancelEntry(req: AuthRequest, res: Response): Promise<void>;
    markNoShow(req: AuthRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=waitlist.controller.d.ts.map