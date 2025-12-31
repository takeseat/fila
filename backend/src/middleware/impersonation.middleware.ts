import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ImpersonationTokenPayload {
    type: 'impersonation';
    sysadminUserId: string;
    targetRestaurantId: string;
    impersonationLogId: string;
    exp: number;
}

/**
 * Middleware to detect and validate impersonation tokens
 * Sets req.impersonation context if valid
 */
export const impersonationMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Check for impersonation token in query param or header
        const impToken =
            req.query.impersonationToken ||
            req.headers['x-impersonation-token'];

        if (!impToken || typeof impToken !== 'string') {
            return next(); // No impersonation, continue normally
        }

        // Verify token
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET not configured');
        }

        const payload = jwt.verify(impToken, secret) as ImpersonationTokenPayload;

        if (payload.type !== 'impersonation') {
            return res.status(400).json({
                error: 'Invalid impersonation token',
            });
        }

        // Verify impersonation log exists and is still active
        const log = await prisma.impersonationLog.findUnique({
            where: { id: payload.impersonationLogId },
            include: {
                sysadmin: true,
                targetRestaurant: true,
            },
        });

        if (!log || log.endedAt) {
            return res.status(401).json({
                error: 'Impersonation session expired or ended',
            });
        }

        // Set impersonation context
        // @ts-ignore
        req.impersonation = {
            sysadminUserId: payload.sysadminUserId,
            targetRestaurantId: payload.targetRestaurantId,
            logId: payload.impersonationLogId,
            isImpersonating: true,
        };

        // Override user context to act as restaurant admin
        // @ts-ignore
        req.user = {
            id: payload.sysadminUserId,
            restaurantId: payload.targetRestaurantId,
            role: 'ADMIN', // Impersonation grants ADMIN privileges
            name: `${log.sysadmin.name} (Support)`,
            email: log.sysadmin.email,
            isImpersonating: true,
        };

        console.log('[Impersonation] Active session:', {
            sysadmin: log.sysadmin.email,
            restaurant: log.targetRestaurant.name,
            logId: log.id,
        });

        next();
    } catch (error) {
        console.error('[Impersonation] Token validation error:', error);
        return res.status(401).json({
            error: 'Invalid or expired impersonation token',
        });
    }
};
