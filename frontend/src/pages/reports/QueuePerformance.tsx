import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { format, subDays } from 'date-fns';
import { ptBR, enUS, es } from 'date-fns/locale';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../lib/api';
import { KPICard } from '../../components/ui/KPICard';
import { Icon } from '../../design-system/icons/Icon';
import { Spinner } from '../../components/ui';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export function QueuePerformance() {
    const { t } = useTranslation(['reports', 'common']);
    const { currentLanguage } = useLanguage();

    const getDateLocale = () => {
        switch (currentLanguage) {
            case 'pt-BR': return ptBR;
            case 'es': return es;
            default: return enUS;
        }
    };

    const endDate = new Date();
    const startDate = subDays(endDate, 7);

    // Endpoint genérico para buscar dados se o backend ainda não tiver uma rota consolidada
    // Assumimos que usaremos o `/reports/performance` e processaremos aqui
    const { data, isLoading } = useQuery({
        queryKey: ['report-queue-performance'],
        queryFn: async () => {
            const startStr = format(startDate, 'yyyy-MM-dd');
            const endStr = format(endDate, 'yyyy-MM-dd');
            const { data } = await api.get(`/reports/waitlist-performance?startDate=${startStr}&endDate=${endStr}`);
            return data;
        }
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <Spinner size="lg" className="mx-auto mb-4" />
                    <p className="text-text-secondary">{t('common:loading')}</p>
                </div>
            </div>
        );
    }

    const metrics = data?.metrics || { totalServed: 0, averageWaitTime: 0 };
    const chartData = data?.dailyData || [];

    const formatTime = (seconds: number) => {
        const mins = Math.round(seconds / 60);
        return `${mins} min`;
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary mb-2">Desempenho da Fila</h1>
                    <p className="text-text-secondary">Acompanhe a eficiência do seu atendimento nos últimos 7 dias</p>
                </div>
            </div>

            {/* Top KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <KPICard
                    label="Volume Atendido"
                    value={metrics.totalServed}
                    icon={<Icon name="users" tone="brand" />}
                />
                <KPICard
                    label="Tempo Médio de Espera"
                    value={formatTime(metrics.averageWaitTime)}
                    icon={<Icon name="waitTime" tone="warning" />}
                />
            </div>

            {/* Killer Chart */}
            <div className="bg-bg-surface border border-border-default rounded-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-text-primary mb-6">Tempo de Espera vs Volume por Dia</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickFormatter={(val) => format(new Date(val), 'dd/MM', { locale: getDateLocale() })}
                                stroke="#94a3b8"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis 
                                yAxisId="left" 
                                stroke="#94a3b8" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false}
                                tickFormatter={(val) => `${Math.round(val/60)}m`}
                            />
                            <YAxis 
                                yAxisId="right" 
                                orientation="right" 
                                stroke="#94a3b8" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                labelFormatter={(val) => format(new Date(val), 'dd MMM yyyy', { locale: getDateLocale() })}
                                formatter={(value: number, name: string) => {
                                    if (name === 'averageWaitTime') return [formatTime(value), 'Tempo de Espera'];
                                    return [value, 'Clientes Atendidos'];
                                }}
                            />
                            <Line yAxisId="left" type="monotone" dataKey="averageWaitTime" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="averageWaitTime" />
                            <Line yAxisId="right" type="monotone" dataKey="totalServed" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="totalServed" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
