import { SESv2Client, SendEmailCommand, SESv2ServiceException } from "@aws-sdk/client-sesv2";
import crypto from 'crypto';

interface SendVerificationEmailParams {
    to: string;
    verificationLink: string;
    locale?: string;
}

interface SESErrorMetadata {
    correlationId: string;
    region: string;
    from: string;
    errorName: string;
    errorCode?: string | number;
    requestId?: string;
    httpStatusCode?: number;
}

export class EmailService {
    private client: SESv2Client;
    private fromEmail: string;
    private region: string;

    constructor() {
        this.region = process.env.SES_REGION || process.env.AWS_REGION || "us-east-1";
        this.client = new SESv2Client({ region: this.region });
        this.fromEmail = process.env.SES_FROM_EMAIL || "contato@takeseat.me";

        // Validate configuration on startup
        if (!this.fromEmail) {
            throw new Error('[EmailService] SES_FROM_EMAIL is required');
        }

        console.log(`[EmailService] Initialized with region=${this.region}, from=${this.fromEmail}`);
    }

    async sendVerificationEmail({ to, verificationLink, locale = 'en' }: SendVerificationEmailParams): Promise<void> {
        const correlationId = crypto.randomUUID();

        const subject = locale === 'pt-BR'
            ? "Confirme seu e-mail para ativar o TakeSeat"
            : "Verify your email to activate TakeSeat";

        const greeting = locale === 'pt-BR' ? "Olá," : "Hello,";
        const bodyText = locale === 'pt-BR'
            ? `${greeting}\n\nPor favor, confirme seu e-mail clicando no link abaixo:\n${verificationLink}\n\nEste link expira em 60 minutos.\n\nSe você não criou esta conta, ignore este e-mail.`
            : `${greeting}\n\nPlease verify your email by clicking the link below:\n${verificationLink}\n\nThis link expires in 60 minutes.\n\nIf you did not create this account, ignore this email.`;

        const bodyHtml = locale === 'pt-BR'
            ? `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>${greeting}</h2>
                <p>Por favor, confirme seu e-mail clicando no botão abaixo:</p>
                <a href="${verificationLink}" style="display: inline-block; background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">Confirmar E-mail</a>
                <p>Ou copie e cole este link no seu navegador:</p>
                <p><a href="${verificationLink}">${verificationLink}</a></p>
                <p style="color: #666; font-size: 12px;">Este link expira em 60 minutos.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
                <p style="color: #999; font-size: 12px;">Se você não criou esta conta, ignore este e-mail.</p>
            </div>`
            : `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>${greeting}</h2>
                <p>Please verify your email by clicking the button below:</p>
                <a href="${verificationLink}" style="display: inline-block; background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">Verify Email</a>
                <p>Or copy and paste this link into your browser:</p>
                <p><a href="${verificationLink}">${verificationLink}</a></p>
                <p style="color: #666; font-size: 12px;">This link expires in 60 minutes.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
                <p style="color: #999; font-size: 12px;">If you did not create this account, ignore this email.</p>
            </div>`;

        const command = new SendEmailCommand({
            FromEmailAddress: this.fromEmail,
            Destination: {
                ToAddresses: [to],
            },
            Content: {
                Simple: {
                    Subject: {
                        Data: subject,
                        Charset: "UTF-8",
                    },
                    Body: {
                        Text: {
                            Data: bodyText,
                            Charset: "UTF-8",
                        },
                        Html: {
                            Data: bodyHtml,
                            Charset: "UTF-8",
                        },
                    },
                },
            },
        });

        try {
            const response = await this.client.send(command);
            console.log(`[EmailService] ✓ Verification email sent successfully`, {
                correlationId,
                messageId: response.MessageId,
                region: this.region,
                from: this.fromEmail,
            });
        } catch (error) {
            const errorMetadata: SESErrorMetadata = {
                correlationId,
                region: this.region,
                from: this.fromEmail,
                errorName: (error as Error).name || 'UnknownError',
                errorCode: (error as any).Code || (error as any).$metadata?.httpStatusCode,
            };

            if (error instanceof SESv2ServiceException) {
                errorMetadata.requestId = error.$metadata?.requestId;
                errorMetadata.httpStatusCode = error.$metadata?.httpStatusCode;

                console.error(`[EmailService] ✗ SES API Error:`, {
                    ...errorMetadata,
                    message: error.message,
                });

                // Map SES errors to user-friendly messages
                if (error.name === 'MessageRejected') {
                    throw new Error('Email service is currently unavailable. Please try again later or contact support.');
                } else if (error.name === 'MailFromDomainNotVerifiedException') {
                    throw new Error('Email configuration error. Please contact support.');
                } else if (error.name === 'AccountSendingPausedException') {
                    throw new Error('Email service is temporarily unavailable. Please try again later.');
                } else if (error.name === 'ConfigurationSetDoesNotExistException') {
                    throw new Error('Email service configuration error. Please contact support.');
                }
            } else {
                console.error(`[EmailService] ✗ Unexpected error:`, errorMetadata, error);
            }

            // Re-throw to let controller handle
            throw error;
        }
    }
}

export const emailService = new EmailService();
