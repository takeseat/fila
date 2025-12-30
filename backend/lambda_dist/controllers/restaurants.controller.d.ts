import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare class RestaurantsController {
    /**
     * Get business data (name, address, contact)
     */
    getBusinessData(req: AuthRequest, res: Response): Promise<void>;
    /**
     * Update business data (editable fields only)
     */
    updateBusinessData(req: AuthRequest, res: Response): Promise<void>;
    /**
     * Get restaurant settings
     */
    getSettings(req: AuthRequest, res: Response): Promise<void>;
    /**
     * Update restaurant settings
     */
    updateSettings(req: AuthRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=restaurants.controller.d.ts.map