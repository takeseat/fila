export interface PickupOrdersConfig {
    messages: {
        created: {
            enabled: boolean;
            template: string;
        };
        ready: {
            enabled: boolean;
            template: string;
        };
        notPickedUp: {
            enabled: boolean;
            template: string;
        };
    };
    pickupInstructions: string;
    autoNotPickedUpMinutes: number;
    sendCreatedMessage: boolean;
}

export const DEFAULT_PICKUP_CONFIG_PT_BR: PickupOrdersConfig = {
    messages: {
        created: {
            enabled: false,
            template:
                '✅ Pedido {{order_code}} registrado. Avisaremos por WhatsApp quando estiver pronto para retirada.',
        },
        ready: {
            enabled: true,
            template:
                '🍔 Seu pedido {{order_code}} está pronto para retirada no balcão. {{pickup_instructions}}',
        },
        notPickedUp: {
            enabled: false,
            template:
                '⏰ Seu pedido {{order_code}} ainda está disponível para retirada. {{pickup_instructions}}',
        },
    },
    pickupInstructions: 'Dirija-se ao balcão principal.',
    autoNotPickedUpMinutes: 30,
    sendCreatedMessage: false,
};

export const DEFAULT_PICKUP_CONFIG_EN: PickupOrdersConfig = {
    messages: {
        created: {
            enabled: false,
            template:
                "✅ Order {{order_code}} registered. We'll message you when it's ready for pickup.",
        },
        ready: {
            enabled: true,
            template:
                '🍔 Your order {{order_code}} is ready for pickup at the counter. {{pickup_instructions}}',
        },
        notPickedUp: {
            enabled: false,
            template:
                '⏰ Your order {{order_code}} is still available for pickup. {{pickup_instructions}}',
        },
    },
    pickupInstructions: 'Please proceed to the main counter.',
    autoNotPickedUpMinutes: 30,
    sendCreatedMessage: false,
};

export const AVAILABLE_TEMPLATE_VARIABLES = [
    '{{business_name}}',
    '{{order_code}}',
    '{{customer_name}}',
    '{{pickup_instructions}}',
    '{{support_phone}}',
    '{{created_time}}',
    '{{ready_time}}',
];

export function getDefaultPickupConfig(language: string): PickupOrdersConfig {
    if (language.startsWith('pt')) {
        return DEFAULT_PICKUP_CONFIG_PT_BR;
    }
    return DEFAULT_PICKUP_CONFIG_EN;
}
