import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare class UsersManagementController {
    listUsers(req: AuthRequest, res: Response): Promise<void>;
    getUserById(req: AuthRequest, res: Response): Promise<void>;
    createUser(req: AuthRequest, res: Response): Promise<void>;
    updateUser(req: AuthRequest, res: Response): Promise<void>;
    updateUserStatus(req: AuthRequest, res: Response): Promise<void>;
    deleteUser(req: AuthRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=users-management.controller.d.ts.map