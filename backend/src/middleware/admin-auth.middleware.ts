import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';

/**
 * Middleware to verify that the authenticated user has SYSADMIN role
 * Must be used after the standard auth middleware
 */
export const adminAuthMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // @ts-ignore - user is added by auth middleware
    const user = req.user;

    if (!user) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Authentication required',
        });
    }

    if (user.role !== UserRole.SYSADMIN) {
        return res.status(403).json({
            error: 'Forbidden',
            message: 'SYSADMIN access required',
        });
    }

    next();
};
