import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

const IMPERSONATION_TOKEN_EXPIRY = 15 * 60; // 15 minutes in seconds

export interface ImpersonationTokenPayload {
    type: 'impersonation';
    sysadminUserId: string;
    targetRestaurantId: string;
    impersonationLogId: string;
    exp: number;
}

export class ImpersonationService {
    /**
     * Generate an impersonation token for a SYSADMIN to access a restaurant
     */
    static async generateImpersonationToken(
        sysadminUserId: string,
        targetRestaurantId: string,
        ipAddress?: string,
        userAgent?: string,
        reason?: string
    ) {
        // Verify restaurant exists and is active
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: targetRestaurantId },
        });

        if (!restaurant) {
            throw new Error('Restaurant not found');
        }

        // Create impersonation log
        const correlationId = randomUUID();
        const log = await prisma.impersonationLog.create({
            data: {
                sysadminUserId,
                targetRestaurantId,
                ipAddress,
                userAgent,
                reason,
                correlationId,
            },
        });

        // Generate JWT token
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET not configured');
        }

        const payload: ImpersonationTokenPayload = {
            type: 'impersonation',
            sysadminUserId,
            targetRestaurantId,
            impersonationLogId: log.id,
            exp: Math.floor(Date.now() / 1000) + IMPERSONATION_TOKEN_EXPIRY,
        };

        const token = jwt.sign(payload, secret);

        console.log('[Impersonation] Token generated:', {
            sysadminUserId,
            restaurant: restaurant.name,
            logId: log.id,
            expiresIn: `${IMPERSONATION_TOKEN_EXPIRY / 60} minutes`,
        });

        return {
            token,
            expiresAt: new Date(Date.now() + IMPERSONATION_TOKEN_EXPIRY * 1000),
            logId: log.id,
            restaurant: {
                id: restaurant.id,
                name: restaurant.name,
            },
        };
    }

    /**
     * End an impersonation session
     */
    static async endImpersonation(logId: string) {
        const log = await prisma.impersonationLog.findUnique({
            where: { id: logId },
        });

        if (!log) {
            throw new Error('Impersonation log not found');
        }

        if (log.endedAt) {
            throw new Error('Impersonation session already ended');
        }

        const updated = await prisma.impersonationLog.update({
            where: { id: logId },
            data: { endedAt: new Date() },
        });

        console.log('[Impersonation] Session ended:', {
            logId,
            duration: updated.endedAt
                ? Math.floor(
                    (updated.endedAt.getTime() - updated.startedAt.getTime()) / 1000
                )
                : 0,
        });

        return updated;
    }

    /**
     * Get impersonation logs for audit
     */
    static async getImpersonationLogs(
        filters: {
            sysadminUserId?: string;
            targetRestaurantId?: string;
            isActive?: boolean;
        } = {},
        page: number = 1,
        limit: number = 50
    ) {
        const where: any = {};

        if (filters.sysadminUserId) {
            where.sysadminUserId = filters.sysadminUserId;
        }

        if (filters.targetRestaurantId) {
            where.targetRestaurantId = filters.targetRestaurantId;
        }

        if (filters.isActive !== undefined) {
            where.endedAt = filters.isActive ? null : { not: null };
        }

        const [logs, total] = await Promise.all([
            prisma.impersonationLog.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { startedAt: 'desc' },
                include: {
                    sysadmin: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    targetRestaurant: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            }),
            prisma.impersonationLog.count({ where }),
        ]);

        return {
            data: logs,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}
