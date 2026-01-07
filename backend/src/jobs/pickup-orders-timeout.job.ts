import { PrismaClient } from '@prisma/client';
import { PickupOrdersService } from '../services/pickup-orders.service';
import { PickupOrdersWhatsAppService } from '../services/pickup-orders-whatsapp.service';
import { PickupOrdersConfig } from '../config/pickup-orders-defaults';

const prisma = new PrismaClient();

export class PickupOrdersJobService {
    /**
     * Process auto-timeout for orders not picked up
     * Run this every 5 minutes via cron
     */
    static async processAutoTimeout() {
        console.log('[PickupOrdersJob] Starting auto-timeout check...');

        try {
            // Get all restaurants with pickup orders enabled
            const restaurants = await prisma.restaurant.findMany({
                where: {
                    pickupOrdersEnabled: true,
                },
                select: {
                    id: true,
                    name: true,
                    pickupOrdersConfig: true,
                },
            });

            console.log(
                `[PickupOrdersJob] Found ${restaurants.length} restaurants with pickup orders enabled`
            );

            let totalProcessed = 0;

            for (const restaurant of restaurants) {
                const config = restaurant.pickupOrdersConfig as unknown as PickupOrdersConfig;
                const timeoutMinutes = config?.autoNotPickedUpMinutes || 30;

                // Get orders ready for timeout
                const orders = await PickupOrdersService.getOrdersForAutoTimeout(
                    restaurant.id,
                    timeoutMinutes
                );

                if (orders.length === 0) {
                    continue;
                }

                console.log(
                    `[PickupOrdersJob] Restaurant ${restaurant.name}: ${orders.length} orders to timeout`
                );

                for (const order of orders) {
                    try {
                        // Change status to NOT_PICKED_UP
                        await PickupOrdersService.changeStatus(
                            order.id,
                            restaurant.id,
                            'NOT_PICKED_UP',
                            { automated: true }
                        );

                        // Send notification if enabled
                        if (order.whatsappOptIn && config?.messages?.notPickedUp?.enabled) {
                            await PickupOrdersWhatsAppService.sendOrderNotPickedUpMessage(
                                order.id
                            );
                        }

                        totalProcessed++;
                    } catch (error) {
                        console.error(
                            `[PickupOrdersJob] Failed to timeout order ${order.orderCode}:`,
                            error
                        );
                    }
                }
            }

            console.log(
                `[PickupOrdersJob] Auto-timeout completed. Processed ${totalProcessed} orders.`
            );

            return { success: true, processed: totalProcessed };
        } catch (error) {
            console.error('[PickupOrdersJob] Auto-timeout job failed:', error);
            throw error;
        }
    }
}
