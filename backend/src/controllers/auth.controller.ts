import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { signupEmailSchema, completeSignupSchema, loginSchema, refreshTokenSchema } from '../validators/auth.validator';

const authService = new AuthService();

export class AuthController {
    async register(req: Request, res: Response): Promise<void> {
        // Alias for signupEmail for backward compatibility (or if frontend calls register)
        return this.signupEmail(req, res);
    }

    async signupEmail(req: Request, res: Response): Promise<void> {
        try {
            const data = signupEmailSchema.parse(req.body);
            // Extract locale from headers or body
            const locale = (req.headers['accept-language'] || 'en').split(',')[0];
            const result = await authService.signupEmail(data.userEmail, locale);
            res.status(200).json(result);
        } catch (error: any) {
            if (error.constructor.name === 'ZodError') {
                const issues = error.issues.map((issue: any) => issue.message).join(', ');
                res.status(400).json({ error: issues });
            } else {
                res.status(400).json({ error: error.message });
            }
        }
    }

    async verifyEmail(req: Request, res: Response): Promise<void> {
        try {
            const { token } = req.query;
            if (!token || typeof token !== 'string') {
                res.status(400).json({ error: 'Token is required' });
                return;
            }
            // Check if token is valid (exists and not expired)
            // We use verifyTokenValues from service
            const result = await authService.verifyTokenValues(token);
            res.json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async completeSignup(req: Request, res: Response): Promise<void> {
        try {
            const data = completeSignupSchema.parse(req.body);
            const result = await authService.completeSignup(data);
            res.status(201).json(result);
        } catch (error: any) {
            if (error.constructor.name === 'ZodError') {
                const issues = error.issues.map((issue: any) => issue.message).join(', ');
                res.status(400).json({ error: issues });
            } else {
                res.status(400).json({ error: error.message });
            }
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const data = loginSchema.parse(req.body);
            const result = await authService.login(data);
            res.json(result);
        } catch (error: any) {
            if (error.constructor.name === 'ZodError') {
                res.status(400).json({ error: error.issues.map((i: any) => i.message).join(', ') });
            } else {
                res.status(401).json({ error: error.message });
            }
        }
    }

    async refresh(req: Request, res: Response): Promise<void> {
        try {
            const { refreshToken } = refreshTokenSchema.parse(req.body);
            const result = await authService.refreshToken(refreshToken);
            res.json(result);
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    }
}
