import { PrismaClient } from '@prisma/client';
import {
    PickupOrdersConfig,
    getDefaultPickupConfig,
} from '../config/pickup-orders-defaults';

const prisma = new PrismaClient();

export class PickupOrdersConfigService {
    /**
     * Get pickup orders configuration for a restaurant
     */
    static async getConfig(restaurantId: string): Promise<{
        enabled: boolean;
        whatsappEnabled: boolean;
        config: PickupOrdersConfig;
    }> {
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: restaurantId },
            select: {
                pickupOrdersEnabled: true,
                pickupOrdersWhatsappEnabled: true,
                pickupOrdersConfig: true,
            },
        });

        if (!restaurant) {
            throw new Error('Restaurant not found');
        }

        // Get default config if not set
        let config: PickupOrdersConfig;
        if (restaurant.pickupOrdersConfig) {
            config = restaurant.pickupOrdersConfig as unknown as PickupOrdersConfig;
        } else {
            config = getDefaultPickupConfig('pt-BR'); // TODO: Get from restaurant language
        }

        return {
            enabled: restaurant.pickupOrdersEnabled,
            whatsappEnabled: restaurant.pickupOrdersWhatsappEnabled,
            config,
        };
    }

    /**
     * Update pickup orders configuration
     */
    static async updateConfig(
        restaurantId: string,
        updates: {
            enabled?: boolean;
            whatsappEnabled?: boolean;
            config?: Partial<PickupOrdersConfig>;
        }
    ) {
        const current = await this.getConfig(restaurantId);

        const data: any = {};

        if (updates.enabled !== undefined) {
            data.pickupOrdersEnabled = updates.enabled;
        }

        if (updates.whatsappEnabled !== undefined) {
            data.pickupOrdersWhatsappEnabled = updates.whatsappEnabled;
        }

        if (updates.config) {
            // Merge with current config
            const mergedConfig = {
                ...current.config,
                ...updates.config,
                messages: {
                    ...current.config.messages,
                    ...updates.config.messages,
                },
            };
            data.pickupOrdersConfig = mergedConfig;
        }

        const updated = await prisma.restaurant.update({
            where: { id: restaurantId },
            data,
            select: {
                pickupOrdersEnabled: true,
                pickupOrdersWhatsappEnabled: true,
                pickupOrdersConfig: true,
            },
        });

        return {
            enabled: updated.pickupOrdersEnabled,
            whatsappEnabled: updated.pickupOrdersWhatsappEnabled,
            config: updated.pickupOrdersConfig as unknown as PickupOrdersConfig,
        };
    }

    /**
     * Get default messages by language
     */
    static getDefaultMessages(language: string): PickupOrdersConfig {
        return getDefaultPickupConfig(language);
    }
}
