import axios from 'axios';
import { IWhatsAppProvider, SendMessageOptions, SendMessageResult } from './whatsapp.provider.interface';

export class ZApiWhatsAppProvider implements IWhatsAppProvider {
    private readonly baseUrl: string;
    private readonly instanceId: string;
    private readonly instanceToken: string;
    private readonly clientToken: string;

    constructor() {
        this.baseUrl = process.env.ZAPI_BASE_URL || 'https://api.z-api.io';
        this.instanceId = process.env.ZAPI_INSTANCE_ID || '';
        this.instanceToken = process.env.ZAPI_INSTANCE_TOKEN || '';
        this.clientToken = process.env.ZAPI_CLIENT_TOKEN || '';

        if (!this.instanceId || !this.instanceToken || !this.clientToken) {
            console.warn('Z-API credentials not fully configured (ZAPI_INSTANCE_ID, ZAPI_INSTANCE_TOKEN, ZAPI_CLIENT_TOKEN)');
        }
    }

    async sendText(options: SendMessageOptions): Promise<SendMessageResult> {
        if (!this.instanceId || !this.instanceToken) {
            throw new Error('Z-API credentials missing');
        }

        const phone = this.normalizePhone(options.to);
        const url = `${this.baseUrl}/instances/${this.instanceId}/token/${this.instanceToken}/send-text`;

        try {
            const response = await axios.post(
                url,
                {
                    phone: phone,
                    message: options.message,
                },
                {
                    headers: {
                        'Client-Token': this.clientToken,
                        'Content-Type': 'application/json',
                    },
                }
            );

            // Z-API success response usually contains messageId or id
            // Adjust based on exact Z-API response structure.
            // Assuming: { messageId: "..." } or { id: "..." }
            const providerMessageId = response.data.messageId || response.data.id || 'unknown-id';

            return { providerMessageId };
        } catch (error: any) {
            const msg = error.response?.data?.message || error.message;
            console.error('Z-API Send Error:', msg);
            throw new Error(`Z-API Failed: ${msg}`);
        }
    }

    /**
     * Z-API expects phone numbers as digits only (DDI + DDD + Number).
     * e.g., +5511999999999 -> 5511999999999
     */
    private normalizePhone(phone: string): string {
        return phone.replace(/\D/g, '');
    }
}
