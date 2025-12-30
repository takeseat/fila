import { Request, Response } from 'express';
import prisma from '../config/database';
import { WhatsAppMessageStatus } from '@prisma/client';

export class ZApiWebhookController {
    /**
     * Handle incoming webhooks from Z-API
     */
    async handleWebhook(req: Request, res: Response): Promise<void> {
        // Z-API sends different event types. We need to distinguish them.
        // Usually checked by URL or body content. For now we assume a unified endpoint or specific handlers below.

        // This method serves as a general entry point if needed, or we implement specific ones.
        res.sendStatus(200);
    }

    async onMessageStatus(req: Request, res: Response): Promise<void> {
        try {
            /*
            Payload Example:
            {
                "id": "ID_DA_MENSAGEM",
                "phone": "5511999999999",
                "status": "SENT" | "RECEIVED" | "READ" | ...
            }
            */
            const { id: messageId, status, phone } = req.body;

            console.log('Z-API Status Update:', { messageId, status, phone });

            if (messageId && status) {
                let dbStatus: WhatsAppMessageStatus | null = null;

                // Map Z-API status to our Enum
                const s = status.toUpperCase();
                if (s === 'SENT') dbStatus = 'SENT';
                if (s === 'RECEIVED' || s === 'DELIVERED') dbStatus = 'DELIVERED';
                if (s === 'READ') dbStatus = 'READ';
                if (s === 'ERROR' || s === 'DAILED') dbStatus = 'FAILED';

                if (dbStatus) {
                    const updateResult = await prisma.whatsAppMessageLog.updateMany({
                        where: { providerMessageId: messageId },
                        data: {
                            status: dbStatus
                        }
                    });

                    if (updateResult.count === 0) {
                        console.warn(`Z-API Webhook: Message ID ${messageId} not found in logs.`);
                    }
                }
            }

            res.sendStatus(200);
        } catch (error) {
            console.error('Error handling Z-API status webhook:', error);
            res.sendStatus(500);
        }
    }

    async onMessageSend(_req: Request, res: Response): Promise<void> {
        // Ack for sending
        res.sendStatus(200);
    }

    async onMessageReceived(_req: Request, res: Response): Promise<void> {
        // Handle incoming messages
        res.sendStatus(200);
    }

    async onDisconnect(_req: Request, res: Response): Promise<void> {
        // Handle disconnection
        res.sendStatus(200);
    }

    async onConnect(_req: Request, res: Response): Promise<void> {
        // Handle connection
        res.sendStatus(200);
    }

    async onPresence(_req: Request, res: Response): Promise<void> {
        // Handle presence
        res.sendStatus(200);
    }
}
