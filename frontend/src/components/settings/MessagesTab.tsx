import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePlan } from '../../hooks/usePlan';
import { Card, Button } from '../ui';
// import { WhatsAppTab } from './WhatsAppTab'; // Unused


// Temporary imports until valid refactor
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';

// Reuse types from WhatsAppTab
type WhatsAppSettings = {
    isEnabled: boolean;
    sendWelcome: boolean;
    sendPositionUpdates: boolean;
    sendTurnMessage: boolean;
    welcomeText: string;
    positionUpdateText: string;
    yourTurnText: string;
    minSecondsBetweenUpdates: number;
    minPositionsChangeToNotify: number;
    // Order Messages
    sendOrderCreated: boolean;
    sendOrderReady: boolean;
    sendOrderNotPickedUp: boolean;
    orderCreatedText: string;
    orderReadyText: string;
    orderNotPickedUpText: string;
};

export function MessagesTab() {
    const { t } = useTranslation('settings');
    const { isPro } = usePlan();
    const queryClient = useQueryClient();
    const [successMessage, setSuccessMessage] = useState('');

    // WhatsApp Form
    const { register, handleSubmit, reset } = useForm<WhatsAppSettings>();

    // We fetch settings even if basic, but maybe we shouldn't? 
    // Actually getting them allows us to show what they *would* have 
    // but the save button should be disabled or the form readonly.
    // However, the requirement is to show a locked state.

    const { data: waSettings, isLoading: isWaLoading } = useQuery<WhatsAppSettings>({
        queryKey: ['whatsapp-settings'],
        queryFn: async () => {
            const response = await api.get('/whatsapp-settings');
            return response.data;
        },
        enabled: isPro // Only fetch if pro? Or fetch to show current state?
    });

    // Effect to reset form
    React.useEffect(() => {
        if (waSettings) {
            reset({
                ...waSettings,
                welcomeText: waSettings.welcomeText || '',
                positionUpdateText: waSettings.positionUpdateText || '',
                yourTurnText: waSettings.yourTurnText || '',
                minSecondsBetweenUpdates: waSettings.minSecondsBetweenUpdates || 300,
                minPositionsChangeToNotify: waSettings.minPositionsChangeToNotify || 5,

                // Order Defaults
                sendOrderCreated: waSettings.sendOrderCreated ?? true,
                sendOrderReady: waSettings.sendOrderReady ?? true,
                sendOrderNotPickedUp: waSettings.sendOrderNotPickedUp ?? false,
                orderCreatedText: waSettings.orderCreatedText || '',
                orderReadyText: waSettings.orderReadyText || '',
                orderNotPickedUpText: waSettings.orderNotPickedUpText || '',
            });
        }
    }, [waSettings, reset]);

    const mutation = useMutation({
        mutationFn: async (data: WhatsAppSettings) => {
            // Force isEnabled to true if saving as PRO, or respect the logic. 
            // The requirement: "No need to Activate... plan determines this".
            // So we might set isEnabled = true implicitly or ignoring it backend side.
            // For backward compatibility, we set isEnabled = true.
            const payload = { ...data, isEnabled: true };
            const response = await api.put('/whatsapp-settings', payload);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['whatsapp-settings'] });
            setSuccessMessage('Configurações salvas com sucesso!');
            setTimeout(() => setSuccessMessage(''), 3000);
        }
    });

    const onSubmit = (data: WhatsAppSettings) => {
        mutation.mutate(data);
    };

    if (!isPro) {
        return (
            <div className="space-y-6">
                <Card title="Mensagens" subtitle="Gerencie as notificações automáticas">
                    <div className="p-8 text-center">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Recurso Profissional</h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-6">
                            O envio de mensagens automáticas via WhatsApp e o gerenciamento de Pedidos (Retirada) são exclusivos do plano Profissional.
                        </p>
                        <Button
                            onClick={() => window.dispatchEvent(new CustomEvent('open-upgrade-modal'))}
                            variant="primary"
                            className="bg-gradient-to-r from-primary-600 to-indigo-600 text-white"
                        >
                            Fazer Upgrade Agora
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    if (isWaLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Fila de Espera Section */}
            <Card className="overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-green-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Fila de Espera</h2>
                            <p className="text-sm text-gray-500">Configure as mensagens automáticas da fila.</p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Message Types */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Templates de Mensagem</h3>

                                {/* Welcome Message */}
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="sendWelcome"
                                            {...register('sendWelcome')}
                                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="sendWelcome" className="font-medium text-gray-800">Boas-vindas</label>
                                    </div>
                                    <textarea
                                        {...register('welcomeText')}
                                        rows={3}
                                        placeholder="Olá {{customer_name}}! Você entrou na fila de {{business_name}}..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-500 outline-none text-sm"
                                    />
                                    <p className="text-xs text-gray-400">Enviado quando o cliente entra na fila.</p>
                                </div>

                                {/* Position Message */}
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="sendPositionUpdates"
                                            {...register('sendPositionUpdates')}
                                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="sendPositionUpdates" className="font-medium text-gray-800">Atualização de Posição</label>
                                    </div>
                                    <textarea
                                        {...register('positionUpdateText')}
                                        rows={3}
                                        placeholder="Sua posição atual é: {{position}}..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-500 outline-none text-sm"
                                    />
                                    <p className="text-xs text-gray-400">Enviado quando a fila anda (respeitando limites).</p>
                                </div>

                                {/* Turn Message */}
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="sendTurnMessage"
                                            {...register('sendTurnMessage')}
                                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="sendTurnMessage" className="font-medium text-gray-800">Sua Vez</label>
                                    </div>
                                    <textarea
                                        {...register('yourTurnText')}
                                        rows={3}
                                        placeholder="Olá {{customer_name}}, sua mesa está pronta!..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-500 outline-none text-sm"
                                    />
                                    <p className="text-xs text-gray-400">Enviado quando você chama o cliente.</p>
                                </div>
                            </div>

                            {/* Placeholders Help */}
                            <div className="space-y-6">
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                    <h4 className="font-medium text-blue-900 mb-2">Variáveis Disponíveis</h4>
                                    <ul className="text-sm text-blue-800 space-y-2">
                                        <li><code>{`{{customer_name}}`}</code>: Nome do cliente</li>
                                        <li><code>{`{{party_size}}`}</code>: Tamanho do grupo (número de pessoas)</li>
                                        <li><code>{`{{position}}`}</code>: Posição na fila (Ex: 1)</li>
                                        <li><code>{`{{business_name}}`}</code>: Nome do restaurante</li>
                                        <li><code>{`{{eta_minutes}}`}</code>: Tempo estimado de espera (minutos)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end pt-6 border-t border-gray-100 gap-4">
                            {successMessage && (
                                <span className="text-sm text-green-600 font-medium animate-pulse">
                                    {successMessage}
                                </span>
                            )}
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending ? 'Salvando...' : 'Salvar Configurações WhatsApp'}
                            </Button>
                        </div>
                    </form>
                </div>
            </Card>

            {/* Pickup Orders Section */}
            <Card className="overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-purple-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Pedidos (Retirada)</h2>
                            <p className="text-sm text-gray-500">Gerencie módulo de pedidos e notificações de retirada.</p>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">{t('orderMessages.title')}</h3>

                                {/* Order Created */}
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="sendOrderCreated"
                                            {...register('sendOrderCreated')}
                                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="sendOrderCreated" className="font-medium text-gray-800">{t('orderMessages.created.label')}</label>
                                    </div>
                                    <textarea
                                        {...register('orderCreatedText')}
                                        rows={3}
                                        placeholder="Seu pedido {{order_code}} foi recebido!..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-500 outline-none text-sm"
                                    />
                                    <p className="text-xs text-gray-400">{t('orderMessages.created.help')}</p>
                                </div>

                                {/* Order Ready */}
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="sendOrderReady"
                                            {...register('sendOrderReady')}
                                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="sendOrderReady" className="font-medium text-gray-800">{t('orderMessages.ready.label')}</label>
                                    </div>
                                    <textarea
                                        {...register('orderReadyText')}
                                        rows={3}
                                        placeholder="Seu pedido {{order_code}} está pronto!..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-500 outline-none text-sm"
                                    />
                                    <p className="text-xs text-gray-400">{t('orderMessages.ready.help')}</p>
                                </div>

                                {/* Not Picked Up */}
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="sendOrderNotPickedUp"
                                            {...register('sendOrderNotPickedUp')}
                                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="sendOrderNotPickedUp" className="font-medium text-gray-800">{t('orderMessages.notPickedUp.label')}</label>
                                    </div>
                                    <textarea
                                        {...register('orderNotPickedUpText')}
                                        rows={3}
                                        placeholder="Seu pedido {{order_code}} ainda não foi retirado..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-500 outline-none text-sm"
                                    />
                                    <p className="text-xs text-gray-400">{t('orderMessages.notPickedUp.help')}</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                                    <h4 className="font-medium text-purple-900 mb-2">{t('orderMessages.variables.title')}</h4>
                                    <ul className="text-sm text-purple-800 space-y-2">
                                        <li><code>{`{{customer_name}}`}</code>: {t('orderMessages.variables.customerName')}</li>
                                        <li><code>{`{{order_code}}`}</code>: {t('orderMessages.variables.orderCode')}</li>
                                        <li><code>{`{{business_name}}`}</code>: {t('orderMessages.variables.businessName')}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
