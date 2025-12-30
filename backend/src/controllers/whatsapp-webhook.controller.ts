import { Request, Response } from 'express';
import prisma from '../config/database';
import { WhatsAppMessageStatus } from '@prisma/client';

export class WhatsAppWebhookController {
    /**
     * Webhook verification (GET)
     * Used by Meta to verify the callback URL
     */
    verify(req: Request, res: Response): void {
        const mode = req.query['hub.mode'];
        const token = req.query['hub.verify_token'];
        const challenge = req.query['hub.challenge'];

        const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'fila_verify_token';

        if (mode && token) {
            if (mode === 'subscribe' && token === VERIFY_TOKEN) {
                console.log('WEBHOOK_VERIFIED');
                res.status(200).send(challenge);
            } else {
                res.sendStatus(403);
            }
        }
    }

    /**
     * Webhook event handler (POST)
     */
    async handleWebhook(req: Request, res: Response): Promise<void> {
        try {
            const body = req.body;

            if (body.object === 'whatsapp_business_account') {
                for (const entry of body.entry || []) {
                    for (const change of entry.changes || []) {
                        const value = change.value;

                        // Handle Status Updates
                        if (value.statuses) {
                            for (const status of value.statuses) {
                                await this.handleStatusUpdate(status);
                            }
                        }

                        // Handle Incoming Messages (Optional - not in reqs yet)
                    }
                }
                res.sendStatus(200);
            } else {
                res.sendStatus(404);
            }
        } catch (error) {
            console.error('Error handling webhook:', error);
            res.sendStatus(500);
        }
    }

    private async handleStatusUpdate(statusObj: any) {
        const messageId = statusObj.id;
        const statusStr = statusObj.status; // sent, delivered, read, failed

        let dbStatus: WhatsAppMessageStatus | null = null;
        switch (statusStr) {
            case 'sent': dbStatus = 'SENT'; break;
            case 'delivered': dbStatus = 'DELIVERED'; break;
            case 'read': dbStatus = 'READ'; break;
            case 'failed': dbStatus = 'FAILED'; break;
        }

        if (dbStatus && messageId) {
            // Find log by provider message ID
            const log = await prisma.whatsAppMessageLog.findFirst({
                where: { providerMessageId: messageId }
            });

            if (log) {
                await prisma.whatsAppMessageLog.update({
                    where: { id: log.id },
                    data: {
                        status: dbStatus,
                        errorCode: statusObj.errors?.[0]?.code?.toString(),
                        errorMessage: statusObj.errors?.[0]?.message
                    }
                });
            }
        }
    }
}
