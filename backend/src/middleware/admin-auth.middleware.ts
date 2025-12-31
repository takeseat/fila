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
): void => {
    // @ts-ignore - user is added by auth middleware
    const user = req.user;

    if (!user) {
        res.status(401).json({
            error: 'Unauthorized',
            message: 'Authentication required',
        });
        return;
    }

    if (user.role !== UserRole.SYSADMIN) {
        res.status(403).json({
            error: 'Forbidden',
            message: 'SYSADMIN access required',
        });
        return;
    }

    next();
};
