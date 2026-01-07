import { Request, Response } from 'express';
import { PickupOrdersService } from '../services/pickup-orders.service';
import { PickupOrdersWhatsAppService } from '../services/pickup-orders-whatsapp.service';
import { PickupOrderStatus } from '@prisma/client';

export class PickupOrdersController {
    /**
     * GET /pickup-orders
     */
    static async listOrders(req: Request, res: Response): Promise<void> {
        try {
            const { status, search, from, to, page = '1', limit = '50' } = req.query;
            // @ts-ignore
            const restaurantId = req.user.restaurantId;

            const filters = {
                restaurantId,
                status: status as PickupOrderStatus | undefined,
                search: search as string | undefined,
                from: from ? new Date(from as string) : undefined,
                to: to ? new Date(to as string) : undefined,
            };

            const result = await PickupOrdersService.listPickupOrders(
                filters,
                parseInt(page as string),
                parseInt(limit as string)
            );

            res.json(result);
        } catch (error: any) {
            console.error('[PickupOrders] List error:', error);
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * GET /pickup-orders/:id
     */
    static async getOrder(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            // @ts-ignore
            const restaurantId = req.user.restaurantId;

            const order = await PickupOrdersService.getPickupOrderById(id, restaurantId);
            res.json(order);
        } catch (error: any) {
            console.error('[PickupOrders] Get error:', error);
            const status = error.message === 'Pickup order not found' ? 404 : 500;
            res.status(status).json({ error: error.message });
        }
    }

    /**
     * POST /pickup-orders
     */
    static async createOrder(req: Request, res: Response): Promise<void> {
        try {
            // @ts-ignore
            const restaurantId = req.user.restaurantId;
            // @ts-ignore
            const userId = req.user.id;

            const order = await PickupOrdersService.createPickupOrder({
                ...req.body,
                restaurantId,
                createdByUserId: userId,
            });

            // Send created message if enabled
            if (order.whatsappOptIn) {
                // Send async (don't wait)
                PickupOrdersWhatsAppService.sendOrderCreatedMessage(order.id).catch(
                    (err) => console.error('[PickupOrders] Failed to send created message:', err)
                );
            }

            res.status(201).json(order);
        } catch (error: any) {
            console.error('[PickupOrders] Create error:', error);
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * PUT /pickup-orders/:id
     */
    static async updateOrder(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            // @ts-ignore
            const restaurantId = req.user.restaurantId;

            const order = await PickupOrdersService.updatePickupOrder(
                id,
                restaurantId,
                req.body
            );

            res.json(order);
        } catch (error: any) {
            console.error('[PickupOrders] Update error:', error);
            const status = error.message === 'Pickup order not found' ? 404 : 400;
            res.status(status).json({ error: error.message });
        }
    }

    /**
     * PATCH /pickup-orders/:id/status
     */
    static async changeStatus(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { status } = req.body;
            // @ts-ignore
            const restaurantId = req.user.restaurantId;

            if (!status) {
                res.status(400).json({ error: 'Status is required' });
                return;
            }

            const order = await PickupOrdersService.changeStatus(id, restaurantId, status);

            // Send WhatsApp notification based on new status
            if (order.whatsappOptIn) {
                if (status === 'READY_FOR_PICKUP') {
                    PickupOrdersWhatsAppService.sendOrderReadyMessage(id).catch((err) =>
                        console.error('[PickupOrders] Failed to send ready message:', err)
                    );
                } else if (status === 'NOT_PICKED_UP') {
                    PickupOrdersWhatsAppService.sendOrderNotPickedUpMessage(id).catch((err) =>
                        console.error('[PickupOrders] Failed to send not picked up message:', err)
                    );
                }
            }

            res.json(order);
        } catch (error: any) {
            console.error('[PickupOrders] Change status error:', error);
            const status = error.message === 'Pickup order not found' ? 404 : 400;
            res.status(status).json({ error: error.message });
        }
    }

    /**
     * POST /pickup-orders/:id/resend-whatsapp
     */
    static async resendWhatsApp(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            // @ts-ignore
            const restaurantId = req.user.restaurantId;

            const order = await PickupOrdersService.getPickupOrderById(id, restaurantId);

            // Check if can resend
            const canResend = PickupOrdersService.canResendWhatsApp(order);
            if (!canResend.allowed) {
                res.status(429).json({ error: canResend.reason });
                return;
            }

            // Resend ready message
            const result = await PickupOrdersWhatsAppService.sendOrderReadyMessage(id);

            if (result) {
                res.json({ success: true, message: 'WhatsApp message sent' });
            } else {
                res.status(500).json({ error: 'Failed to send WhatsApp message' });
            }
        } catch (error: any) {
            console.error('[PickupOrders] Resend WhatsApp error:', error);
            res.status(500).json({ error: error.message });
        }
    }
}
