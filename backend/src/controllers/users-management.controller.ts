import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { UsersService } from '../services/users.service';
import {
    createUserSchema,
    updateUserSchema,
    updateUserStatusSchema,
    listUsersQuerySchema,
} from '../validators/users.validator';

const usersService = new UsersService();

export class UsersManagementController {
    async listUsers(req: AuthRequest, res: Response) {
        try {
            const restaurantId = req.user!.restaurantId;
            const query = listUsersQuerySchema.parse(req.query);

            const users = await usersService.listUsers(restaurantId, query);

            res.json(users);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getUserById(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const restaurantId = req.user!.restaurantId;

            const user = await usersService.getUserById(id, restaurantId);

            res.json(user);
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    }

    async createUser(req: AuthRequest, res: Response) {
        try {
            const restaurantId = req.user!.restaurantId;
            const creatorLanguage = req.user!.language || 'en';
            const data = createUserSchema.parse(req.body);

            const user = await usersService.createUser(data, restaurantId, creatorLanguage);

            res.status(201).json(user);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateUser(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const restaurantId = req.user!.restaurantId;
            const data = updateUserSchema.parse(req.body);

            const user = await usersService.updateUser(id, data, restaurantId);

            res.json(user);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateUserStatus(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const restaurantId = req.user!.restaurantId;
            const data = updateUserStatusSchema.parse(req.body);

            const user = await usersService.updateUserStatus(id, data, restaurantId);

            res.json(user);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteUser(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const restaurantId = req.user!.restaurantId;

            const result = await usersService.deleteUser(id, restaurantId);

            res.json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
