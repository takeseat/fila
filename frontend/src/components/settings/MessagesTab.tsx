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
    // Default Templates
    const DEFAULTS = {
        welcomeText: "Olá {{customer_name}}! Você entrou na fila de {{business_name}}...",
        positionUpdateText: "Sua posição atual é: {{position}}...",
        yourTurnText: "Olá {{customer_name}}, sua mesa está pronta!...",
        orderCreatedText: "Seu pedido {{order_code}} foi recebido!...",
        orderReadyText: "Seu pedido {{order_code}} está pronto!...",
        orderNotPickedUpText: "Seu pedido {{order_code}} ainda não foi retirado..."
    };

    const { t } = useTranslation('settings');
    const { isPro } = usePlan();
    const queryClient = useQueryClient();
    const [successMessage, setSuccessMessage] = useState('');

    // WhatsApp Form
    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<WhatsAppSettings>();

    const sendWelcome = watch('sendWelcome');
    const sendPositionUpdates = watch('sendPositionUpdates');
    const sendTurnMessage = watch('sendTurnMessage');
    const sendOrderCreated = watch('sendOrderCreated');
    const sendOrderReady = watch('sendOrderReady');
    const sendOrderNotPickedUp = watch('sendOrderNotPickedUp');

    const { data: waSettings, isLoading: isWaLoading } = useQuery<WhatsAppSettings>({
        queryKey: ['whatsapp-settings'],
        queryFn: async () => {
            const response = await api.get('/whatsapp-settings');
            return response.data;
        },
        enabled: isPro
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-fade-in">
            {/* Fila de Espera Section */}
            <Card className="overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-green-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            {/* Generic Queue Icon */}
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Fila de Espera</h2>
                            <p className="text-sm text-gray-500">Configure as mensagens automáticas da fila.</p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
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
                                    <label htmlFor="sendWelcome" className="font-medium text-gray-800">
                                        Boas-vindas
                                        {sendWelcome && <span className="text-red-500 ml-1">*</span>}
                                    </label>
                                </div>
                                <textarea
                                    {...register('welcomeText', { required: sendWelcome })}
                                    rows={3}
                                    placeholder={DEFAULTS.welcomeText}
                                    className={`w-full px-3 py-2 border ${errors.welcomeText ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-1 focus:ring-primary-500 outline-none text-sm`}
                                />
                                {errors.welcomeText && <span className="text-xs text-red-500 block mt-1">Este campo é obrigatório.</span>}
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-gray-400">Enviado quando o cliente entra na fila.</p>
                                    <button
                                        type="button"
                                        onClick={() => setValue('welcomeText', DEFAULTS.welcomeText)}
                                        className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                                    >
                                        Restaurar padrão
                                    </button>
                                </div>
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
                                    <label htmlFor="sendPositionUpdates" className="font-medium text-gray-800">
                                        Atualização de Posição
                                        {sendPositionUpdates && <span className="text-red-500 ml-1">*</span>}
                                    </label>
                                </div>
                                <textarea
                                    {...register('positionUpdateText', { required: sendPositionUpdates })}
                                    rows={3}
                                    placeholder={DEFAULTS.positionUpdateText}
                                    className={`w-full px-3 py-2 border ${errors.positionUpdateText ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-1 focus:ring-primary-500 outline-none text-sm`}
                                />
                                {errors.positionUpdateText && <span className="text-xs text-red-500 block mt-1">Este campo é obrigatório.</span>}
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-gray-400">Enviado quando a fila anda.</p>
                                    <button
                                        type="button"
                                        onClick={() => setValue('positionUpdateText', DEFAULTS.positionUpdateText)}
                                        className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                                    >
                                        Restaurar padrão
                                    </button>
                                </div>
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
                                    <label htmlFor="sendTurnMessage" className="font-medium text-gray-800">
                                        Sua Vez
                                        {sendTurnMessage && <span className="text-red-500 ml-1">*</span>}
                                    </label>
                                </div>
                                <textarea
                                    {...register('yourTurnText', { required: sendTurnMessage })}
                                    rows={3}
                                    placeholder={DEFAULTS.yourTurnText}
                                    className={`w-full px-3 py-2 border ${errors.yourTurnText ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-1 focus:ring-primary-500 outline-none text-sm`}
                                />
                                {errors.yourTurnText && <span className="text-xs text-red-500 block mt-1">Este campo é obrigatório.</span>}
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-gray-400">Enviado quando você chama o cliente.</p>
                                    <button
                                        type="button"
                                        onClick={() => setValue('yourTurnText', DEFAULTS.yourTurnText)}
                                        className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                                    >
                                        Restaurar padrão
                                    </button>
                                </div>
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
                                        <label htmlFor="sendOrderCreated" className="font-medium text-gray-800">
                                            {t('orderMessages.created.label')}
                                            {sendOrderCreated && <span className="text-red-500 ml-1">*</span>}
                                        </label>
                                    </div>
                                    <textarea
                                        {...register('orderCreatedText', { required: sendOrderCreated })}
                                        rows={3}
                                        placeholder={DEFAULTS.orderCreatedText}
                                        className={`w-full px-3 py-2 border ${errors.orderCreatedText ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-1 focus:ring-primary-500 outline-none text-sm`}
                                    />
                                    {errors.orderCreatedText && <span className="text-xs text-red-500 block mt-1">Este campo é obrigatório.</span>}
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs text-gray-400">{t('orderMessages.created.help')}</p>
                                        <button
                                            type="button"
                                            onClick={() => setValue('orderCreatedText', DEFAULTS.orderCreatedText)}
                                            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                                        >
                                            Restaurar padrão
                                        </button>
                                    </div>
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
                                        <label htmlFor="sendOrderReady" className="font-medium text-gray-800">
                                            {t('orderMessages.ready.label')}
                                            {sendOrderReady && <span className="text-red-500 ml-1">*</span>}
                                        </label>
                                    </div>
                                    <textarea
                                        {...register('orderReadyText', { required: sendOrderReady })}
                                        rows={3}
                                        placeholder={DEFAULTS.orderReadyText}
                                        className={`w-full px-3 py-2 border ${errors.orderReadyText ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-1 focus:ring-primary-500 outline-none text-sm`}
                                    />
                                    {errors.orderReadyText && <span className="text-xs text-red-500 block mt-1">Este campo é obrigatório.</span>}
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs text-gray-400">{t('orderMessages.ready.help')}</p>
                                        <button
                                            type="button"
                                            onClick={() => setValue('orderReadyText', DEFAULTS.orderReadyText)}
                                            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                                        >
                                            Restaurar padrão
                                        </button>
                                    </div>
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
                                        <label htmlFor="sendOrderNotPickedUp" className="font-medium text-gray-800">
                                            {t('orderMessages.notPickedUp.label')}
                                            {sendOrderNotPickedUp && <span className="text-red-500 ml-1">*</span>}
                                        </label>
                                    </div>
                                    <textarea
                                        {...register('orderNotPickedUpText', { required: sendOrderNotPickedUp })}
                                        rows={3}
                                        placeholder={DEFAULTS.orderNotPickedUpText}
                                        className={`w-full px-3 py-2 border ${errors.orderNotPickedUpText ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-1 focus:ring-primary-500 outline-none text-sm`}
                                    />
                                    {errors.orderNotPickedUpText && <span className="text-xs text-red-500 block mt-1">Este campo é obrigatório.</span>}
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs text-gray-400">{t('orderMessages.notPickedUp.help')}</p>
                                        <button
                                            type="button"
                                            onClick={() => setValue('orderNotPickedUpText', DEFAULTS.orderNotPickedUpText)}
                                            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                                        >
                                            Restaurar padrão
                                        </button>
                                    </div>
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

            <div className="flex items-center justify-end gap-4 sticky bottom-6 bg-bg-surface p-4 rounded-xl border border-gray-100 shadow-lg z-10">
                {successMessage && (
                    <span className="text-sm text-green-600 font-medium animate-pulse">
                        {successMessage}
                    </span>
                )}
                <Button
                    type="submit"
                    variant="primary"
                    disabled={mutation.isPending}
                    className="w-full md:w-auto"
                >
                    {mutation.isPending ? 'Salvando...' : 'Salvar'}
                </Button>
            </div>
        </form>
    );
}
