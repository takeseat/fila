import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        restaurantId: string;
        role: string;
        language?: string;
    };
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'No token provided' });
            return;
        }

        const token = authHeader.substring(7);
        const payload = verifyAccessToken(token);

        req.user = payload;
        next();
    } catch (error: any) {
        console.error('Auth middleware error:', error.message);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
}

export function authorize(...roles: string[]) {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        if (roles.length > 0 && !roles.includes(req.user.role)) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }

        next();
    };
}
