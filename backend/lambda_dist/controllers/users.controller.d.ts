import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare class UsersController {
    updateLanguage(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    getProfile(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    updateProfile(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    updatePassword(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=users.controller.d.ts.map