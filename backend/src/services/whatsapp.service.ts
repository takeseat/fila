import prisma from '../config/database';
import { WaitlistEntry, Customer, RestaurantWhatsAppSettings, WhatsAppMessageType, WhatsAppMessageStatus } from '@prisma/client';
import { WhatsAppTemplatesService } from './whatsapp-templates.service';
import { IWhatsAppProvider } from '../providers/whatsapp/whatsapp.provider.interface';
import { ZApiWhatsAppProvider } from '../providers/whatsapp/z-api.provider';

export class WhatsAppService {
    private static provider: IWhatsAppProvider = WhatsAppService.getProvider();

    private static getProvider(): IWhatsAppProvider {
        const providerType = process.env.WHATSAPP_PROVIDER || 'zapi';

        if (providerType === 'meta') {
            // Placeholder for Meta Provider if we were to implementing it fully now.
            // For now, we fallback or throw, but strictly per instruction we implement Z-API.
            // To keep it simple and working for POC:
            console.warn('Meta provider requested but not fully refactored. Using Z-API as fallback per POC instructions.');
            return new ZApiWhatsAppProvider();
        }

        return new ZApiWhatsAppProvider();
    }

    /**
     * Sends the Welcome message if enabled.
     */
    static async sendWelcome(
        restaurantId: string,
        entry: WaitlistEntry & { customer?: Customer | null },
        position: number
    ) {
        console.log('[WhatsApp] sendWelcome called for entry:', entry.id, 'phone:', entry.customerPhone);

        if (!WaitlistEntryCheck(entry)) {
            console.log('[WhatsApp] Entry check failed - whatsappOptIn:', entry.whatsappOptIn);
            return;
        }
        console.log('[WhatsApp] Entry check passed');

        const settings = await this.getSettings(restaurantId);
        console.log('[WhatsApp] Settings:', settings ? {
            isEnabled: settings.isEnabled,
            sendWelcome: settings.sendWelcome,
            welcomeText: settings.welcomeText?.substring(0, 50)
        } : 'null');

        if (!settings || !settings.isEnabled || !settings.sendWelcome) {
            console.log('[WhatsApp] Settings check failed - returning early');
            return;
        }
        console.log('[WhatsApp] Settings check passed');

        const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
        if (!restaurant) {
            console.log('[WhatsApp] Restaurant not found');
            return;
        }
        console.log('[WhatsApp] Restaurant found:', restaurant.name);

        const text = settings.welcomeText || WhatsAppTemplatesService.getDefaultWelcomeTemplate('pt-BR'); // TODO: Use restaurant lang
        const messageBody = WhatsAppTemplatesService.replacePlaceholders(text, entry, restaurant, position);
        console.log('[WhatsApp] Message body prepared, calling sendMessage...');

        await this.sendMessage(restaurantId, entry, WhatsAppMessageType.WELCOME, messageBody);
        console.log('[WhatsApp] sendMessage completed');
    }

    /**
     * Sends the Position Update message if enabled and rate limits pass.
     */
    static async sendPositionUpdate(
        restaurantId: string,
        entry: WaitlistEntry & { customer?: Customer | null },
        newPosition: number
    ) {
        if (!WaitlistEntryCheck(entry)) return;

        const settings = await this.getSettings(restaurantId);
        if (!settings || !settings.isEnabled || !settings.sendPositionUpdates) return;

        // Rate Limit Check
        if (entry.lastNotifiedAt && entry.lastNotifiedPosition) {
            const secondsSinceLast = (new Date().getTime() - entry.lastNotifiedAt.getTime()) / 1000;
            const positionDiff = Math.abs(entry.lastNotifiedPosition - newPosition);

            if (secondsSinceLast < settings.minSecondsBetweenUpdates) return;
            if (positionDiff < settings.minPositionsChangeToNotify) return;
        }

        const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
        if (!restaurant) return;

        const text = settings.positionUpdateText || WhatsAppTemplatesService.getDefaultPositionUpdateTemplate('pt-BR');
        const messageBody = WhatsAppTemplatesService.replacePlaceholders(text, entry, restaurant, newPosition);

        await this.sendMessage(restaurantId, entry, WhatsAppMessageType.POSITION_UPDATE, messageBody, newPosition);
    }

    /**
     * Sends the Your Turn message if enabled.
     */
    static async sendYourTurn(
        restaurantId: string,
        entry: WaitlistEntry & { customer?: Customer | null }
    ) {
        if (!WaitlistEntryCheck(entry)) return;

        const settings = await this.getSettings(restaurantId);
        if (!settings || !settings.isEnabled || !settings.sendTurnMessage) return;

        const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
        if (!restaurant) return;

        const text = settings.yourTurnText || WhatsAppTemplatesService.getDefaultYourTurnTemplate('pt-BR');
        const messageBody = WhatsAppTemplatesService.replacePlaceholders(text, entry, restaurant, 0);

        await this.sendMessage(restaurantId, entry, WhatsAppMessageType.YOUR_TURN, messageBody);
    }

    // --- Private Helpers ---

    private static async getSettings(restaurantId: string): Promise<RestaurantWhatsAppSettings | null> {
        return prisma.restaurantWhatsAppSettings.findUnique({
            where: { restaurantId }
        });
    }

    private static async sendMessage(
        restaurantId: string,
        entry: WaitlistEntry,
        type: WhatsAppMessageType,
        body: string,
        notifyPosition?: number
    ) {
        const phone = entry.customerPhone || (entry as any).customer?.fullPhone;
        console.log('[WhatsApp] sendMessage - phone:', phone, 'type:', type);

        if (!phone) {
            console.error('No phone number for entry:', entry.id);
            return;
        }

        try {
            console.log('[WhatsApp] Calling provider.sendText...');
            // Use Provider
            const result = await this.provider.sendText({
                to: phone,
                message: body
            });
            console.log('[WhatsApp] Provider response:', result);

            await this.logMessage(restaurantId, entry, type, body, 'SENT', result.providerMessageId);
            console.log('[WhatsApp] Message logged as SENT');

            // Update entry tracking for rate limits
            if (notifyPosition !== undefined) {
                await prisma.waitlistEntry.update({
                    where: { id: entry.id },
                    data: {
                        lastNotifiedAt: new Date(),
                        lastNotifiedPosition: notifyPosition
                    }
                });
            }

        } catch (error: any) {
            const errorMsg = error.message || 'Unknown error';
            console.error('[WhatsApp] Provider Error:', errorMsg, error);
            await this.logMessage(restaurantId, entry, type, body, 'FAILED', undefined, errorMsg);
        }
    }

    private static async logMessage(
        restaurantId: string,
        entry: WaitlistEntry,
        type: WhatsAppMessageType,
        payload: any,
        status: string,
        providerId?: string,
        errorMsg?: string
    ) {
        await prisma.whatsAppMessageLog.create({
            data: {
                restaurantId,
                queueEntryId: entry.id,
                customerPhone: entry.customerPhone,
                messageType: type,
                payload: { body: payload },
                status: status === 'SENT' ? WhatsAppMessageStatus.SENT : WhatsAppMessageStatus.FAILED,
                providerMessageId: providerId,
                errorMessage: errorMsg
            }
        });
    }
}

function WaitlistEntryCheck(entry: WaitlistEntry): boolean {
    return !!entry.whatsappOptIn;
}
