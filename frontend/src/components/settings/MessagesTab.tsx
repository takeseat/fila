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
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-7xl mx-auto px-4 sm:px-8 py-8 animate-fade-in text-left">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Main Content: Templates */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Fila de Espera Section */}
                    <Card className="flex flex-col shadow-md border-default radius-lg overflow-hidden">
                        <div className="p-6 border-b border-default bg-elevated">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-brand-subtle rounded-lg">
                                    <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-medium text-text-primary">Fila de Espera</h2>
                                    <p className="text-sm text-text-secondary">Configure as mensagens automáticas da fila.</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-8">
                            <h3 className="text-lg font-medium text-text-primary border-b border-default pb-4">Templates de Mensagem</h3>

                            {/* Welcome Message */}
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        id="sendWelcome"
                                        {...register('sendWelcome')}
                                        className="h-4 w-4 bg-primary border-default rounded text-brand focus:ring-brand focus:ring-offset-0 transition-colors"
                                    />
                                    <label htmlFor="sendWelcome" className="text-base font-medium text-text-primary flex items-center">
                                        Boas-vindas
                                        {sendWelcome && <span className="text-error ml-1">*</span>}
                                    </label>
                                </div>
                                <textarea
                                    {...register('welcomeText', { required: sendWelcome })}
                                    rows={3}
                                    placeholder={DEFAULTS.welcomeText}
                                    className={`w-full px-3 py-2 bg-primary border ${errors.welcomeText ? 'border-error' : 'border-default'} rounded-md focus:border-focus focus:ring-1 focus:ring-brand shadow-sm transition-all outline-none text-base text-text-primary placeholder:text-text-tertiary`}
                                />
                                {errors.welcomeText && <span className="text-xs text-error block">Este campo é obrigatório.</span>}
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                    <p className="text-sm text-text-tertiary italic">Enviado quando o cliente entra na fila.</p>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setValue('welcomeText', DEFAULTS.welcomeText)}
                                        className="text-text-brand hover:bg-brand-subtle"
                                    >
                                        Restaurar padrão
                                    </Button>
                                </div>
                            </div>

                            {/* Position Message */}
                            <div className="space-y-4 border-t border-subtle pt-6">
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        id="sendPositionUpdates"
                                        {...register('sendPositionUpdates')}
                                        className="h-4 w-4 bg-primary border-default rounded text-brand focus:ring-brand focus:ring-offset-0 transition-colors"
                                    />
                                    <label htmlFor="sendPositionUpdates" className="text-base font-medium text-text-primary flex items-center">
                                        Atualização de Posição
                                        {sendPositionUpdates && <span className="text-error ml-1">*</span>}
                                    </label>
                                </div>
                                <textarea
                                    {...register('positionUpdateText', { required: sendPositionUpdates })}
                                    rows={3}
                                    placeholder={DEFAULTS.positionUpdateText}
                                    className={`w-full px-3 py-2 bg-primary border ${errors.positionUpdateText ? 'border-error' : 'border-default'} rounded-md focus:border-focus focus:ring-1 focus:ring-brand shadow-sm transition-all outline-none text-base text-text-primary placeholder:text-text-tertiary`}
                                />
                                {errors.positionUpdateText && <span className="text-xs text-error block">Este campo é obrigatório.</span>}
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                    <p className="text-sm text-text-tertiary italic">Enviado quando a fila anda.</p>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setValue('positionUpdateText', DEFAULTS.positionUpdateText)}
                                        className="text-text-brand hover:bg-brand-subtle"
                                    >
                                        Restaurar padrão
                                    </Button>
                                </div>
                            </div>

                            {/* Turn Message */}
                            <div className="space-y-4 border-t border-subtle pt-6">
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        id="sendTurnMessage"
                                        {...register('sendTurnMessage')}
                                        className="h-4 w-4 bg-primary border-default rounded text-brand focus:ring-brand focus:ring-offset-0 transition-colors"
                                    />
                                    <label htmlFor="sendTurnMessage" className="text-base font-medium text-text-primary flex items-center">
                                        Sua Vez
                                        {sendTurnMessage && <span className="text-error ml-1">*</span>}
                                    </label>
                                </div>
                                <textarea
                                    {...register('yourTurnText', { required: sendTurnMessage })}
                                    rows={3}
                                    placeholder={DEFAULTS.yourTurnText}
                                    className={`w-full px-3 py-2 bg-primary border ${errors.yourTurnText ? 'border-error' : 'border-default'} rounded-md focus:border-focus focus:ring-1 focus:ring-brand shadow-sm transition-all outline-none text-base text-text-primary placeholder:text-text-tertiary`}
                                />
                                {errors.yourTurnText && <span className="text-xs text-error block">Este campo é obrigatório.</span>}
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                    <p className="text-sm text-text-tertiary italic">Enviado quando você chama o cliente.</p>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setValue('yourTurnText', DEFAULTS.yourTurnText)}
                                        className="text-text-brand hover:bg-brand-subtle"
                                    >
                                        Restaurar padrão
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Pickup Orders Section */}
                    <Card className="flex flex-col shadow-md border-default radius-lg overflow-hidden">
                        <div className="p-6 border-b border-default bg-elevated">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-brand-subtle rounded-lg">
                                    <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-medium text-text-primary">Pedidos (Retirada)</h2>
                                    <p className="text-sm text-text-secondary">Gerencie módulo de pedidos e notificações de retirada.</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-8">
                            <h3 className="text-lg font-medium text-text-primary border-b border-default pb-4">{t('orderMessages.title')}</h3>

                            {/* Order Created */}
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        id="sendOrderCreated"
                                        {...register('sendOrderCreated')}
                                        className="h-4 w-4 bg-primary border-default rounded text-brand focus:ring-brand focus:ring-offset-0 transition-colors"
                                    />
                                    <label htmlFor="sendOrderCreated" className="text-base font-medium text-text-primary flex items-center">
                                        {t('orderMessages.created.label')}
                                        {sendOrderCreated && <span className="text-error ml-1">*</span>}
                                    </label>
                                </div>
                                <textarea
                                    {...register('orderCreatedText', { required: sendOrderCreated })}
                                    rows={3}
                                    placeholder={DEFAULTS.orderCreatedText}
                                    className={`w-full px-3 py-2 bg-primary border ${errors.orderCreatedText ? 'border-error' : 'border-default'} rounded-md focus:border-focus focus:ring-1 focus:ring-brand shadow-sm transition-all outline-none text-base text-text-primary placeholder:text-text-tertiary`}
                                />
                                {errors.orderCreatedText && <span className="text-xs text-error block">{t('orderMessages.errors.required')}</span>}
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                    <p className="text-sm text-text-tertiary italic">{t('orderMessages.created.help')}</p>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setValue('orderCreatedText', DEFAULTS.orderCreatedText)}
                                        className="text-text-brand hover:bg-brand-subtle"
                                    >
                                        Restaurar padrão
                                    </Button>
                                </div>
                            </div>

                            {/* Order Ready */}
                            <div className="space-y-4 border-t border-subtle pt-6">
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        id="sendOrderReady"
                                        {...register('sendOrderReady')}
                                        className="h-4 w-4 bg-primary border-default rounded text-brand focus:ring-brand focus:ring-offset-0 transition-colors"
                                    />
                                    <label htmlFor="sendOrderReady" className="text-base font-medium text-text-primary flex items-center">
                                        {t('orderMessages.ready.label')}
                                        {sendOrderReady && <span className="text-error ml-1">*</span>}
                                    </label>
                                </div>
                                <textarea
                                    {...register('orderReadyText', { required: sendOrderReady })}
                                    rows={3}
                                    placeholder={DEFAULTS.orderReadyText}
                                    className={`w-full px-3 py-2 bg-primary border ${errors.orderReadyText ? 'border-error' : 'border-default'} rounded-md focus:border-focus focus:ring-1 focus:ring-brand shadow-sm transition-all outline-none text-base text-text-primary placeholder:text-text-tertiary`}
                                />
                                {errors.orderReadyText && <span className="text-xs text-error block">{t('orderMessages.errors.required')}</span>}
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                    <p className="text-sm text-text-tertiary italic">{t('orderMessages.ready.help')}</p>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setValue('orderReadyText', DEFAULTS.orderReadyText)}
                                        className="text-text-brand hover:bg-brand-subtle"
                                    >
                                        Restaurar padrão
                                    </Button>
                                </div>
                            </div>

                            {/* Not Picked Up */}
                            <div className="space-y-4 border-t border-subtle pt-6">
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        id="sendOrderNotPickedUp"
                                        {...register('sendOrderNotPickedUp')}
                                        className="h-4 w-4 bg-primary border-default rounded text-brand focus:ring-brand focus:ring-offset-0 transition-colors"
                                    />
                                    <label htmlFor="sendOrderNotPickedUp" className="text-base font-medium text-text-primary flex items-center">
                                        {t('orderMessages.notPickedUp.label')}
                                        {sendOrderNotPickedUp && <span className="text-error ml-1">*</span>}
                                    </label>
                                </div>
                                <textarea
                                    {...register('orderNotPickedUpText', { required: sendOrderNotPickedUp })}
                                    rows={3}
                                    placeholder={DEFAULTS.orderNotPickedUpText}
                                    className={`w-full px-3 py-2 bg-primary border ${errors.orderNotPickedUpText ? 'border-error' : 'border-default'} rounded-md focus:border-focus focus:ring-1 focus:ring-brand shadow-sm transition-all outline-none text-base text-text-primary placeholder:text-text-tertiary`}
                                />
                                {errors.orderNotPickedUpText && <span className="text-xs text-error block">{t('orderMessages.errors.required')}</span>}
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                    <p className="text-sm text-text-tertiary italic">{t('orderMessages.notPickedUp.help')}</p>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setValue('orderNotPickedUpText', DEFAULTS.orderNotPickedUpText)}
                                        className="text-text-brand hover:bg-brand-subtle"
                                    >
                                        Restaurar padrão
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Sticky Right Sidebar: Variables */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-6">
                        <Card className="shadow-md border-brand-subtle bg-elevated radius-lg">
                            <div className="p-6 border-b border-default bg-brand-subtle/30">
                                <h4 className="flex items-center gap-2 font-medium text-text-primary">
                                    <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Variáveis Disponíveis
                                </h4>
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-text-secondary mb-6">
                                    Use estas variáveis nos seus templates para personalizar as mensagens automaticamente.
                                </p>
                                <div className="space-y-6">
                                    <div>
                                        <h5 className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-4">Fila de Espera</h5>
                                        <div className="flex flex-wrap gap-2">
                                            {['{{customer_name}}', '{{party_size}}', '{{position}}', '{{business_name}}', '{{eta_minutes}}'].map(v => (
                                                <code key={v} className="px-2 py-1 bg-secondary border border-subtle rounded-md text-xs font-mono text-text-brand">{v}</code>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="border-t border-subtle pt-6">
                                        <h5 className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-4">Pedidos / Outros</h5>
                                        <div className="flex flex-wrap gap-2">
                                            {['{{order_code}}', '{{business_name}}'].map(v => (
                                                <code key={v} className="px-2 py-1 bg-secondary border border-subtle rounded-md text-xs font-mono text-text-brand">{v}</code>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Status Tip */}
                        <div className="bg-info/10 border border-info-subtle p-4 rounded-lg flex gap-3 items-start">
                            <svg className="w-5 h-5 text-info flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.674a1 1 0 00.996-1.09L14.535 7H9.462l-.799 8.91a1 1 0 00.996 1.09H9.663z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 7V5a1 1 0 011-1h0a1 1 0 011 1v2" />
                            </svg>
                            <p className="text-xs text-text-info leading-relaxed">
                                <strong>Dica:</strong> Certifique-se de que os templates sejam claros e cordiais para melhorar a experiência do cliente.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Page Actions */}
            <div className="flex items-center justify-end gap-4 mt-8">
                {successMessage && (
                    <span className="text-sm text-success font-medium flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {successMessage}
                    </span>
                )}
                <Button
                    type="submit"
                    variant="primary"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? 'Salvando...' : 'Salvar'}
                </Button>
            </div>
        </form>
    );
}

