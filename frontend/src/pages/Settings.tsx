import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
// import { useAuth } from '../hooks/useAuth'; // Unused

type SettingsForm = {
    waitingAlertMinutes: number | null;
    calledAlertMinutes: number | null;
    avgWaitWindowMinutes: number | null;
    avgWaitFallbackMinutes: number | null;
};

export function Settings() {
    // const { user } = useAuth(); // Unused
    const queryClient = useQueryClient();
    const [successMessage, setSuccessMessage] = useState('');

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<SettingsForm>();

    const { data: settings, isLoading } = useQuery({
        queryKey: ['settings'],
        queryFn: async () => {
            const response = await api.get('/restaurants/settings');
            return response.data;
        }
    });

    const mutation = useMutation({
        mutationFn: async (data: SettingsForm) => {
            const response = await api.put('/restaurants/settings', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['settings'] });
            setSuccessMessage('Configurações salvas com sucesso!');
            setTimeout(() => setSuccessMessage(''), 3000);
        }
    });

    useEffect(() => {
        if (settings) {
            setValue('waitingAlertMinutes', settings.waitingAlertMinutes);
            setValue('calledAlertMinutes', settings.calledAlertMinutes);
            setValue('avgWaitWindowMinutes', settings.avgWaitWindowMinutes ?? 90);
            setValue('avgWaitFallbackMinutes', settings.avgWaitFallbackMinutes ?? 15);
        }
    }, [settings, setValue]);

    const onSubmit = (data: SettingsForm) => {
        // Convert empty strings to null for optional fields if needed, though react-hook-form handles numbers usually
        const formattedData = {
            waitingAlertMinutes: data.waitingAlertMinutes ? Number(data.waitingAlertMinutes) : null,
            calledAlertMinutes: data.calledAlertMinutes ? Number(data.calledAlertMinutes) : null,
            avgWaitWindowMinutes: data.avgWaitWindowMinutes ? Number(data.avgWaitWindowMinutes) : 90,
            avgWaitFallbackMinutes: data.avgWaitFallbackMinutes ? Number(data.avgWaitFallbackMinutes) : 15,
        };
        mutation.mutate(formattedData);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-light-200 overflow-hidden">
                <div className="p-6 border-b border-light-200">
                    <h1 className="text-xl font-bold text-dark-900">Configurações do Restaurante</h1>
                    <p className="text-sm text-dark-500 mt-1">Gerencie as preferências e alertas da sua operação.</p>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        {/* Queue Alerts Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 border-b border-light-200 pb-2">
                                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-lg font-semibold text-dark-800">Alertas de Tempo da Fila</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Waiting Alert */}
                                <div>
                                    <label className="block text-sm font-medium text-dark-700 mb-1">
                                        Alerta para Cliente Aguardando (minutos)
                                    </label>
                                    <p className="text-xs text-dark-500 mb-2">
                                        Define após quanto tempo de espera o cliente será marcado com um alerta visual.
                                        <br />
                                        <span className="italic">Deixe em branco para desativar.</span>
                                    </p>
                                    <input
                                        type="number"
                                        {...register('waitingAlertMinutes', { min: 1 })}
                                        className="w-full px-4 py-2 rounded-lg border border-light-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                        placeholder="Ex: 15"
                                    />
                                    {errors.waitingAlertMinutes && (
                                        <p className="mt-1 text-xs text-danger-500">Valor deve ser maior que 0</p>
                                    )}
                                </div>

                                {/* Called Alert */}
                                <div>
                                    <label className="block text-sm font-medium text-dark-700 mb-1">
                                        Alerta para Cliente Chamado (minutos)
                                    </label>
                                    <p className="text-xs text-dark-500 mb-2">
                                        Define após quanto tempo de ser chamado (sem sentar) o cliente será marcado com alerta.
                                        <br />
                                        <span className="italic">Deixe em branco para desativar.</span>
                                    </p>
                                    <input
                                        type="number"
                                        {...register('calledAlertMinutes', { min: 1 })}
                                        className="w-full px-4 py-2 rounded-lg border border-light-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                        placeholder="Ex: 5"
                                    />
                                    {errors.calledAlertMinutes && (
                                        <p className="mt-1 text-xs text-danger-500">Valor deve ser maior que 0</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Average Wait Time Calculation Section */}
                        <div className="space-y-6 pt-6 border-t border-light-200">
                            <div className="flex items-center gap-2 border-b border-light-200 pb-2">
                                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-lg font-semibold text-dark-800">Cálculo do Tempo Médio da Fila</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Calculation Window */}
                                <div>
                                    <label className="block text-sm font-medium text-dark-700 mb-1">
                                        Janela de cálculo (minutos)
                                    </label>
                                    <p className="text-xs text-dark-500 mb-2">
                                        Considerar apenas clientes que entraram na fila nos últimos X minutos para calcular o tempo médio.
                                    </p>
                                    <input
                                        type="number"
                                        {...register('avgWaitWindowMinutes', { min: 1 })}
                                        className="w-full px-4 py-2 rounded-lg border border-light-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                        placeholder="90"
                                    />
                                    {errors.avgWaitWindowMinutes && (
                                        <p className="mt-1 text-xs text-danger-500">Valor deve ser maior que 0</p>
                                    )}
                                </div>

                                {/* Fallback Time */}
                                <div>
                                    <label className="block text-sm font-medium text-dark-700 mb-1">
                                        Fallback do tempo médio (minutos)
                                    </label>
                                    <p className="text-xs text-dark-500 mb-2">
                                        Valor exibido quando não houver dados suficientes na janela configurada.
                                    </p>
                                    <input
                                        type="number"
                                        {...register('avgWaitFallbackMinutes', { min: 1 })}
                                        className="w-full px-4 py-2 rounded-lg border border-light-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                        placeholder="15"
                                    />
                                    {errors.avgWaitFallbackMinutes && (
                                        <p className="mt-1 text-xs text-danger-500">Valor deve ser maior que 0</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Submit Actions */}
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
                                {mutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
