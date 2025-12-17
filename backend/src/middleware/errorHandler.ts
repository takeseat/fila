import { Request, Response, NextFunction } from 'express';

export function errorHandler(
    error: any,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    console.error('Error:', error);

    if (error.name === 'ZodError') {
        res.status(400).json({
            error: 'Validation error',
            details: error.errors,
        });
        return;
    }

    if (error.name === 'JsonWebTokenError') {
        res.status(401).json({ error: 'Invalid token' });
        return;
    }

    if (error.name === 'TokenExpiredError') {
        res.status(401).json({ error: 'Token expired' });
        return;
    }

    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal server error';

    res.status(statusCode).json({ error: message });
}
