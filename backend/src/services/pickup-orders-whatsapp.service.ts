import { PrismaClient } from '@prisma/client';
import { format } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import { PickupOrdersConfig } from '../config/pickup-orders-defaults';
import { WhatsAppProvider } from '../providers/whatsapp/whatsapp.provider';

const prisma = new PrismaClient();
const whatsappProvider = new WhatsAppProvider();

interface TemplateVariables {
    business_name: string;
    order_code: string;
    customer_name?: string;
    pickup_instructions: string;
    support_phone?: string;
    created_time?: string;
    ready_time?: string;
}

export class PickupOrdersWhatsAppService {
    /**
     * Render template with variables
     */
    private static renderTemplate(template: string, variables: TemplateVariables): string {
        let rendered = template;

        Object.entries(variables).forEach(([key, value]) => {
            const placeholder = `{{${key}}}`;
            rendered = rendered.replace(new RegExp(placeholder, 'g'), value || '');
        });

        return rendered;
    }

    /**
     * Get template variables for an order
     */
    private static async getTemplateVariables(
        order: any,
        restaurant: any,
        config: PickupOrdersConfig,
        language: string
    ): Promise<TemplateVariables> {
        const locale = language.startsWith('pt') ? ptBR : enUS;

        return {
            business_name: restaurant.name,
            order_code: order.orderCode,
            customer_name: order.customerName || '',
            pickup_instructions: config.pickupInstructions,
            support_phone: restaurant.phone || '',
            created_time: order.createdAt
                ? format(order.createdAt, 'HH:mm', { locale })
                : '',
            ready_time: order.readyAt ? format(order.readyAt, 'HH:mm', { locale }) : '',
        };
    }

    /**
     * Send order created message
     */
    static async sendOrderCreatedMessage(orderId: string) {
        const order = await prisma.pickupOrder.findUnique({
            where: { id: orderId },
            include: { restaurant: true },
        });

        if (!order || !order.whatsappOptIn) {
            return null;
        }

        const restaurant = order.restaurant;
        if (!restaurant.pickupOrdersWhatsappEnabled) {
            return null;
        }

        const config = restaurant.pickupOrdersConfig as unknown as PickupOrdersConfig;
        if (!config?.messages?.created?.enabled) {
            return null;
        }

        const variables = await this.getTemplateVariables(
            order,
            restaurant,
            config,
            'pt-BR' // TODO: Get from restaurant or customer
        );

        const message = this.renderTemplate(config.messages.created.template, variables);

        try {
            const result = await whatsappProvider.sendText({
                to: order.customerPhoneE164,
                message,
            });

            // Log message
            await prisma.whatsAppMessageLog.create({
                data: {
                    restaurantId: restaurant.id,
                    pickupOrderId: order.id,
                    customerPhone: order.customerPhoneE164,
                    messageType: 'ORDER_CREATED',
                    payload: variables as any,
                    providerMessageId: result.providerMessageId,
                    status: 'SENT',
                },
            });

            // Update last notified time
            await prisma.pickupOrder.update({
                where: { id: orderId },
                data: { lastWhatsAppNotifiedAt: new Date() },
            });

            console.log('[PickupOrdersWhatsApp] Order created message sent:', {
                orderId,
                orderCode: order.orderCode,
                phone: order.customerPhoneE164,
            });

            return result;
        } catch (error: any) {
            console.error('[PickupOrdersWhatsApp] Failed to send created message:', error);

            // Log failed message
            await prisma.whatsAppMessageLog.create({
                data: {
                    restaurantId: restaurant.id,
                    pickupOrderId: order.id,
                    customerPhone: order.customerPhoneE164,
                    messageType: 'ORDER_CREATED',
                    payload: variables as any,
                    status: 'FAILED',
                    errorMessage: error.message,
                },
            });

            throw error;
        }
    }

    /**
     * Send order ready message
     */
    static async sendOrderReadyMessage(orderId: string) {
        const order = await prisma.pickupOrder.findUnique({
            where: { id: orderId },
            include: { restaurant: true },
        });

        if (!order || !order.whatsappOptIn) {
            return null;
        }

        const restaurant = order.restaurant;
        if (!restaurant.pickupOrdersWhatsappEnabled) {
            return null;
        }

        const config = restaurant.pickupOrdersConfig as unknown as PickupOrdersConfig;
        if (!config?.messages?.ready?.enabled) {
            return null;
        }

        const variables = await this.getTemplateVariables(
            order,
            restaurant,
            config,
            'pt-BR'
        );

        const message = this.renderTemplate(config.messages.ready.template, variables);

        try {
            const result = await whatsappProvider.sendText({
                to: order.customerPhoneE164,
                message,
            });

            await prisma.whatsAppMessageLog.create({
                data: {
                    restaurantId: restaurant.id,
                    pickupOrderId: order.id,
                    customerPhone: order.customerPhoneE164,
                    messageType: 'ORDER_READY',
                    payload: variables as any,
                    providerMessageId: result.providerMessageId,
                    status: 'SENT',
                },
            });

            await prisma.pickupOrder.update({
                where: { id: orderId },
                data: { lastWhatsAppNotifiedAt: new Date() },
            });

            console.log('[PickupOrdersWhatsApp] Order ready message sent:', {
                orderId,
                orderCode: order.orderCode,
                phone: order.customerPhoneE164,
            });

            return result;
        } catch (error: any) {
            console.error('[PickupOrdersWhatsApp] Failed to send ready message:', error);

            await prisma.whatsAppMessageLog.create({
                data: {
                    restaurantId: restaurant.id,
                    pickupOrderId: order.id,
                    customerPhone: order.customerPhoneE164,
                    messageType: 'ORDER_READY',
                    payload: variables as any,
                    status: 'FAILED',
                    errorMessage: error.message,
                },
            });

            throw error;
        }
    }

    /**
     * Send order not picked up message
     */
    static async sendOrderNotPickedUpMessage(orderId: string) {
        const order = await prisma.pickupOrder.findUnique({
            where: { id: orderId },
            include: { restaurant: true },
        });

        if (!order || !order.whatsappOptIn) {
            return null;
        }

        const restaurant = order.restaurant;
        if (!restaurant.pickupOrdersWhatsappEnabled) {
            return null;
        }

        const config = restaurant.pickupOrdersConfig as unknown as PickupOrdersConfig;
        if (!config?.messages?.notPickedUp?.enabled) {
            return null;
        }

        const variables = await this.getTemplateVariables(
            order,
            restaurant,
            config,
            'pt-BR'
        );

        const message = this.renderTemplate(
            config.messages.notPickedUp.template,
            variables
        );

        try {
            const result = await whatsappProvider.sendText({
                to: order.customerPhoneE164,
                message,
            });

            await prisma.whatsAppMessageLog.create({
                data: {
                    restaurantId: restaurant.id,
                    pickupOrderId: order.id,
                    customerPhone: order.customerPhoneE164,
                    messageType: 'ORDER_NOT_PICKED_UP',
                    payload: variables as any,
                    providerMessageId: result.providerMessageId,
                    status: 'SENT',
                },
            });

            await prisma.pickupOrder.update({
                where: { id: orderId },
                data: { lastWhatsAppNotifiedAt: new Date() },
            });

            console.log('[PickupOrdersWhatsApp] Not picked up message sent:', {
                orderId,
                orderCode: order.orderCode,
                phone: order.customerPhoneE164,
            });

            return result;
        } catch (error: any) {
            console.error('[PickupOrdersWhatsApp] Failed to send not picked up message:', error);

            await prisma.whatsAppMessageLog.create({
                data: {
                    restaurantId: restaurant.id,
                    pickupOrderId: order.id,
                    customerPhone: order.customerPhoneE164,
                    messageType: 'ORDER_NOT_PICKED_UP',
                    payload: variables as any,
                    status: 'FAILED',
                    errorMessage: error.message,
                },
            });

            throw error;
        }
    }
}
