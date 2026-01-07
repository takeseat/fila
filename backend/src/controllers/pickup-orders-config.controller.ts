import { Request, Response } from 'express';
import { PickupOrdersConfigService } from '../services/pickup-orders-config.service';

export class PickupOrdersConfigController {
    /**
     * GET /pickup-orders/config
     */
    static async getConfig(req: Request, res: Response): Promise<void> {
        try {
            // @ts-ignore
            const restaurantId = req.user.restaurantId;

            const config = await PickupOrdersConfigService.getConfig(restaurantId);
            res.json(config);
        } catch (error: any) {
            console.error('[PickupOrdersConfig] Get error:', error);
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * PUT /pickup-orders/config
     */
    static async updateConfig(req: Request, res: Response): Promise<void> {
        try {
            // @ts-ignore
            const restaurantId = req.user.restaurantId;

            const updated = await PickupOrdersConfigService.updateConfig(
                restaurantId,
                req.body
            );

            res.json(updated);
        } catch (error: any) {
            console.error('[PickupOrdersConfig] Update error:', error);
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * GET /pickup-orders/config/defaults
     */
    static async getDefaults(req: Request, res: Response): Promise<void> {
        try {
            const { language = 'pt-BR' } = req.query;

            const defaults = PickupOrdersConfigService.getDefaultMessages(
                language as string
            );

            res.json(defaults);
        } catch (error: any) {
            console.error('[PickupOrdersConfig] Get defaults error:', error);
            res.status(500).json({ error: error.message });
        }
    }
}
