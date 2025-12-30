export interface SendMessageOptions {
    to: string; // E.164 format expected, provider should normalize
    message: string;
}

export interface SendMessageResult {
    providerMessageId: string;
}

export interface IWhatsAppProvider {
    sendText(options: SendMessageOptions): Promise<SendMessageResult>;
    // Future expansion: sendTemplate, sendImage, etc.
}
