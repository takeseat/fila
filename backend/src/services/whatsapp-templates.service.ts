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
            return "Tudo certo, {{customer_name}}! 🎉 Você já está na fila do {{business_name}}.\nSua posição atual é: *{{position}}*.\nRelaxe que a gente te avisa por aqui assim que sua mesa estiver pronta! 🍽️";
        }
        // Default English
        return "You're all set, {{customer_name}}! 🎉 You've joined the waitlist at {{business_name}}.\nYour current position is: *{{position}}*.\nSit back and relax, we'll notify you here as soon as your table is ready! 🍽️";
    }

    static getDefaultPositionUpdateTemplate(language: string): string {
        if (language === 'pt-BR' || language === 'pt') {
            return "Atualização fila {{business_name}}: Você agora é o número {{position}} da fila.";
        }
        return "Update from {{business_name}}: You are now number {{position}} in line.";
    }

    static getDefaultYourTurnTemplate(language: string): string {
        if (language === 'pt-BR' || language === 'pt') {
            return "Chegou a sua vez, {{customer_name}}! 🥳\nSua mesa no {{business_name}} já está te esperando.\nPor favor, dirija-se à entrada. Bom apetite! 😋";
        }
        return "It's your turn, {{customer_name}}! 🥳\nYour table at {{business_name}} is ready.\nPlease head to the entrance. Enjoy your meal! 😋";
    }
}
