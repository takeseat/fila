import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';

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
};

export function WhatsAppTab() {
    const queryClient = useQueryClient();
    const [successMessage, setSuccessMessage] = useState('');

    const { register, handleSubmit, reset } = useForm<WhatsAppSettings>();

    const { data: settings, isLoading } = useQuery<WhatsAppSettings>({
        queryKey: ['whatsapp-settings'],
        queryFn: async () => {
            const response = await api.get('/whatsapp-settings');
            return response.data;
        }
    });

    useEffect(() => {
        if (settings) {
            reset({
                ...settings,
                welcomeText: settings.welcomeText || '',
                positionUpdateText: settings.positionUpdateText || '',
                yourTurnText: settings.yourTurnText || '',
                minSecondsBetweenUpdates: settings.minSecondsBetweenUpdates || 300,
                minPositionsChangeToNotify: settings.minPositionsChangeToNotify || 5,
            });
        }
    }, [settings, reset]);

    const mutation = useMutation({
        mutationFn: async (data: WhatsAppSettings) => {
            const response = await api.put('/whatsapp-settings', data);
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

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-xl font-semibold text-dark-900">Integração WhatsApp</h2>
                <p className="text-dark-500 mt-1">Configure o envio automático de mensagens para seus clientes.</p>
            </div>

            {/* Enable Toggle */}
            <div className="flex items-center space-x-3 bg-light-50 p-4 rounded-lg border border-light-200">
                <input
                    type="checkbox"
                    id="isEnabled"
                    {...register('isEnabled')}
                    className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isEnabled" className="font-medium text-dark-900 cursor-pointer">
                    Ativar envio de mensagens pelo WhatsApp
                </label>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Message Types */}
                <div className="space-y-6">
                    <h3 className="text-lg font-medium text-dark-900 border-b pb-2">Tipos de Mensagem</h3>

                    {/* Welcome Message */}
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="sendWelcome"
                                {...register('sendWelcome')}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <label htmlFor="sendWelcome" className="font-medium text-dark-800">Boas-vindas</label>
                        </div>
                        <textarea
                            {...register('welcomeText')}
                            rows={3}
                            placeholder="Olá {{customer_name}}! Você entrou na fila de {{business_name}}..."
                            className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-1 focus:ring-primary-500 outline-none text-sm"
                        />
                        <p className="text-xs text-dark-400">Enviado quando o cliente entra na fila.</p>
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
                            <label htmlFor="sendPositionUpdates" className="font-medium text-dark-800">Atualização de Posição</label>
                        </div>
                        <textarea
                            {...register('positionUpdateText')}
                            rows={3}
                            placeholder="Sua posição atual é: {{position}}..."
                            className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-1 focus:ring-primary-500 outline-none text-sm"
                        />
                        <p className="text-xs text-dark-400">Enviado quando a fila anda (respeitando limites).</p>
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
                            <label htmlFor="sendTurnMessage" className="font-medium text-dark-800">Sua Vez</label>
                        </div>
                        <textarea
                            {...register('yourTurnText')}
                            rows={3}
                            placeholder="Olá {{customer_name}}, sua mesa está pronta!..."
                            className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-1 focus:ring-primary-500 outline-none text-sm"
                        />
                        <p className="text-xs text-dark-400">Enviado quando você chama o cliente.</p>
                    </div>
                </div>

                {/* Placeholders Help & Rate Limits */}
                <div className="space-y-6">
                    <div className="bg-primary-50 p-4 rounded-lg border border-primary-100">
                        <h4 className="font-medium text-primary-900 mb-2">Variáveis Disponíveis</h4>
                        <ul className="text-sm text-primary-800 space-y-1 list-disc list-inside">
                            <li>Waitlist Entry: <code>{`{{customer_name}}`}</code>, <code>{`{{party_size}}`}</code></li>
                            <li>Queue: <code>{`{{position}}`}</code>, <code>{`{{business_name}}`}</code></li>
                            <li>Estimates: <code>{`{{eta_minutes}}`}</code></li>
                        </ul>
                    </div>

                    <h3 className="text-lg font-medium text-dark-900 border-b pb-2">Limites de Envio (Anti-Spam)</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-1">
                                Intervalo mínimo entre atualizações (segundos)
                            </label>
                            <input
                                type="number"
                                {...register('minSecondsBetweenUpdates', { valueAsNumber: true })}
                                className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-1 focus:ring-primary-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-1">
                                Mudança mínima de posições para notificar
                            </label>
                            <input
                                type="number"
                                {...register('minPositionsChangeToNotify', { valueAsNumber: true })}
                                className="w-full px-3 py-2 border border-light-300 rounded-lg focus:ring-1 focus:ring-primary-500 outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end pt-6 border-t border-light-200 gap-4">
                {successMessage && (
                    <span className="text-sm text-success-600 font-medium animate-fade-in">
                        {successMessage}
                    </span>
                )}
                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {mutation.isPending ? 'Salvando...' : 'Salvar Configurações'}
                </button>
            </div>
        </form>
    );
}
