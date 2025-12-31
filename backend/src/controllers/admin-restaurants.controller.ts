import { Request, Response } from 'express';
import { AdminRestaurantsService } from '../services/admin-restaurants.service';

export class AdminRestaurantsController {
    /**
     * GET /admin/restaurants
     */
    static async listRestaurants(req: Request, res: Response) {
        try {
            const { search, isActive, countryCode, page = '1', limit = '20' } = req.query;

            const filters = {
                search: search as string,
                isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
                countryCode: countryCode as string,
            };

            const result = await AdminRestaurantsService.listRestaurants(
                filters,
                parseInt(page as string),
                parseInt(limit as string)
            );

            res.json(result);
        } catch (error: any) {
            console.error('[Admin] List restaurants error:', error);
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * GET /admin/restaurants/:id
     */
    static async getRestaurant(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const restaurant = await AdminRestaurantsService.getRestaurantById(id);
            res.json(restaurant);
        } catch (error: any) {
            console.error('[Admin] Get restaurant error:', error);
            res.status(error.message === 'Restaurant not found' ? 404 : 500).json({
                error: error.message,
            });
        }
    }

    /**
     * POST /admin/restaurants
     */
    static async createRestaurant(req: Request, res: Response) {
        try {
            const restaurant = await AdminRestaurantsService.createRestaurant(req.body);
            res.status(201).json(restaurant);
        } catch (error: any) {
            console.error('[Admin] Create restaurant error:', error);
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * PUT /admin/restaurants/:id
     */
    static async updateRestaurant(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const restaurant = await AdminRestaurantsService.updateRestaurant(id, req.body);
            res.json(restaurant);
        } catch (error: any) {
            console.error('[Admin] Update restaurant error:', error);
            res.status(error.message === 'Restaurant not found' ? 404 : 400).json({
                error: error.message,
            });
        }
    }

    /**
     * PATCH /admin/restaurants/:id/status
     */
    static async toggleStatus(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { isActive } = req.body;

            if (typeof isActive !== 'boolean') {
                res.status(400).json({ error: 'isActive must be a boolean' });
                return;
            }

            const restaurant = await AdminRestaurantsService.toggleRestaurantStatus(id, isActive);
            res.json(restaurant);
        } catch (error: any) {
            console.error('[Admin] Toggle status error:', error);
            res.status(error.message === 'Restaurant not found' ? 404 : 500).json({
                error: error.message,
            });
        }
    }
}
