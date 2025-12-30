import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare class CustomersController {
    getCustomers(req: AuthRequest, res: Response): Promise<void>;
    getCustomer(req: AuthRequest, res: Response): Promise<void>;
    createCustomer(req: AuthRequest, res: Response): Promise<void>;
    updateCustomer(req: AuthRequest, res: Response): Promise<void>;
    deleteCustomer(req: AuthRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=customers.controller.d.ts.map