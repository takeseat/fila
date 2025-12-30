import { WaitlistEntry, Restaurant, Customer } from '@prisma/client';

export class WhatsAppTemplatesService {
    /**
     * Replaces placeholders in the template text with actual values from the entry and restaurant.
     */
    static replacePlaceholders(
        text: string,
        entry: WaitlistEntry & { customer?: Customer | null },
        restaurant: Restaurant,
        position: number | null
    ): string {
        let result = text;

        const variables: Record<string, string> = {
            '{{business_name}}': restaurant.tradeName || restaurant.name,
            '{{customer_name}}': entry.customerName,
            '{{queue_name}}': 'Fila Principal', // We can enhance this if we have multiple queues later
            '{{party_size}}': entry.partySize.toString(),
            '{{position}}': position ? position.toString() : '?',
            '{{eta_minutes}}': entry.estimatedWaitMinutes ? entry.estimatedWaitMinutes.toString() : '?',
            '{{avg_wait_minutes}}': restaurant.avgWaitFallbackMinutes ? restaurant.avgWaitFallbackMinutes.toString() : '?', // Simplified
        };

        for (const [key, value] of Object.entries(variables)) {
            // Replace all occurrences
            result = result.split(key).join(value);
        }

        return result;
    }

    static getDefaultWelcomeTemplate(language: string): string {
        if (language === 'pt-BR' || language === 'pt') {
            return "Olá {{customer_name}}! Você entrou na fila de {{business_name}}.\nSua posição atual é: {{position}}.\nTe avisaremos quando sua vez chegar!";
        }
        // Default English
        return "Hello {{customer_name}}! You have joined the waitlist at {{business_name}}.\nYour current position is: {{position}}.\nWe will notify you when it's your turn!";
    }

    static getDefaultPositionUpdateTemplate(language: string): string {
        if (language === 'pt-BR' || language === 'pt') {
            return "Atualização fila {{business_name}}: Você agora é o número {{position}} da fila.";
        }
        return "Update from {{business_name}}: You are now number {{position}} in line.";
    }

    static getDefaultYourTurnTemplate(language: string): string {
        if (language === 'pt-BR' || language === 'pt') {
            return "Olá {{customer_name}}, sua mesa no {{business_name}} está pronta!\nPor favor, dirija-se à entrada.";
        }
        return "Hello {{customer_name}}, your table at {{business_name}} is ready!\nPlease head to the entrance.";
    }
}
