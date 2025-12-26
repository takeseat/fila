import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDashboardMetrics } from '../hooks/useDashboardMetrics';
import { Card, Skeleton } from '../components/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export function Dashboard() {
    const { t } = useTranslation('dashboard');
    const navigate = useNavigate();
    const { data: metrics, isLoading, error } = useDashboardMetrics();

    // Format hourly data for chart (fill missing hours with 0)
    const hourlyData = metrics?.hourlyVolume
        ? Array.from({ length: 24 }, (_, i) => {
            // Find data corresponding to this local hour (i)
            // Backend returns UTC hours, so we convert them to local to match 'i'
            const hourData = metrics.hourlyVolume.find(h => {
                const offsetHours = new Date().getTimezoneOffset() / 60;
                let localHour = h.hour - offsetHours;

                // Handle day wrap-around
                if (localHour < 0) localHour += 24;
                if (localHour >= 24) localHour %= 24;

                return Math.floor(localHour) === i;
            });

            return {
                hour: `${i}h`,
                clientes: hourData?.count || 0,
            };
        }).filter((d, idx) => d.clientes > 0 || (idx >= 6 && idx <= 23)) // Show only relevant hours
        : [];

    // Format weekly data for chart - show all 7 days of current week
    const weeklyData = (() => {
        if (!metrics?.weeklyTrend) return [];

        // Get current week's Monday
        const now = new Date();
        const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const monday = new Date(now);
        monday.setDate(now.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
        monday.setHours(0, 0, 0, 0);

        // Create array for all 7 days of the week
        const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
        const weekData = weekDays.map((day, index) => {
            const date = new Date(monday);
            date.setDate(monday.getDate() + index);
            const dateStr = date.toISOString().split('T')[0];

            const dayData = metrics.weeklyTrend.find(d => d.date === dateStr);

            return {
                dia: day,
                clientes: dayData?.count || 0,
            };
        });

        return weekData;
    })();


    return (
        <div className="space-y-6 animate-fade-in">
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-dark-900 mb-2">
                    {t('title')}
                </h1>
                <p className="text-dark-500">
                    {t('subtitle')}
                </p>
            </div>

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <p className="text-red-800 font-medium">Erro ao carregar métricas do dashboard</p>
                    <p className="text-red-600 text-sm mt-1">
                        {(error as any).message || 'Tente novamente mais tarde'}
                    </p>
                </div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Waiting Now */}
                <div className="card-premium p-6 hover-lift group">
                    {isLoading ? (
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-16" />
                        </div>
                    ) : metrics ? (
                        <div>
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-sm font-medium text-dark-600 mb-2">{t('metrics.activeQueue.title')}</p>
                            <p className="text-4xl font-bold text-dark-900">{metrics.activeQueue.count}</p>
                        </div>
                    ) : null}
                </div>

                {/* Average Wait Time */}
                <div className="card-premium p-6 hover-lift group">
                    {isLoading ? (
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-16" />
                        </div>
                    ) : metrics ? (
                        <div>
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-warning-500 to-warning-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-sm font-medium text-dark-600 mb-2">
                                {t('metrics.avgWait.title')}
                                {metrics.avgWaitTime.windowMinutes && (
                                    <span className="text-xs text-dark-400 ml-1">
                                        {t('waitlist:stats.lastMinutes', { minutes: metrics.avgWaitTime.windowMinutes })}
                                    </span>
                                )}
                            </p>
                            <div className="flex items-center gap-2">
                                <p className="text-4xl font-bold text-dark-900">
                                    {metrics.avgWaitTime.minutes !== null ? metrics.avgWaitTime.minutes : '—'}
                                    {metrics.avgWaitTime.minutes !== null && (
                                        <span className="text-xl ml-1">{t('metrics.avgWait.min')}</span>
                                    )}
                                </p>
                                {metrics.avgWaitTime.isFallbackUsed && (
                                    <span
                                        title="Sem dados suficientes na janela. Exibindo fallback."
                                        className="cursor-help text-xs bg-light-200 text-dark-500 px-2 py-1 rounded-full hover:bg-light-300 transition-colors"
                                    >
                                        {t('waitlist:stats.estimated')}
                                    </span>
                                )}
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* Total Customers Today */}
                <div className="card-premium p-6 hover-lift group">
                    {isLoading ? (
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-16" />
                        </div>
                    ) : metrics ? (
                        <div>
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-sm font-medium text-dark-600 mb-2">{t('metrics.seated.title')}</p>
                            <p className="text-4xl font-bold text-dark-900">{metrics.seatedToday.count}</p>
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Volume Chart */}
                <Card
                    variant="premium"
                    title={t('charts.volumeByHour.title')}
                    subtitle={t('charts.volumeByHour.subtitle')}
                >
                    {isLoading ? (
                        <div className="h-[300px] flex items-center justify-center">
                            <Skeleton className="h-full w-full" />
                        </div>
                    ) : hourlyData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={hourlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E8E8ED" vertical={false} />
                                <XAxis
                                    dataKey="hour"
                                    tick={{ fill: '#52525B', fontSize: 12 }}
                                    axisLine={{ stroke: '#E8E8ED' }}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fill: '#52525B', fontSize: 12 }}
                                    axisLine={{ stroke: '#E8E8ED' }}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #E8E8ED',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                    cursor={{ fill: 'rgba(76, 111, 255, 0.05)' }}
                                />
                                <Bar dataKey="clientes" fill="#4C6FFF" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-gray-500">
                            Sem dados para hoje
                        </div>
                    )}
                </Card>

                {/* Trend Chart */}
                <Card
                    variant="premium"
                    title={t('charts.weeklyTrend.title')}
                    subtitle={t('charts.weeklyTrend.subtitle')}
                >
                    {isLoading ? (
                        <div className="h-[300px] flex items-center justify-center">
                            <Skeleton className="h-full w-full" />
                        </div>
                    ) : weeklyData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E8E8ED" vertical={false} />
                                <XAxis
                                    dataKey="dia"
                                    tick={{ fill: '#52525B', fontSize: 12 }}
                                    axisLine={{ stroke: '#E8E8ED' }}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fill: '#52525B', fontSize: 12 }}
                                    axisLine={{ stroke: '#E8E8ED' }}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #E8E8ED',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                    cursor={{ stroke: '#4C6FFF', strokeWidth: 1, strokeDasharray: '5 5' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="clientes"
                                    stroke="#4C6FFF"
                                    strokeWidth={3}
                                    dot={{ fill: '#4C6FFF', r: 5, strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 7, strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-gray-500">
                            Sem dados para esta semana
                        </div>
                    )}
                </Card>
            </div>

            {/* Quick Actions */}
            <Card variant="premium" title={t('quickActions.title')}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={() => navigate('/waitlist')}
                        className="p-5 bg-light-50 hover:bg-light-100 rounded-xl transition-smooth text-left group border-2 border-transparent hover:border-primary-200"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <span className="font-semibold text-dark-900 text-lg">{t('quickActions.addToQueue.title')}</span>
                        </div>
                        <p className="text-sm text-dark-500">{t('quickActions.addToQueue.description')}</p>
                    </button>

                    <button
                        onClick={() => navigate('/reports')}
                        className="p-5 bg-light-50 hover:bg-light-100 rounded-xl transition-smooth text-left group border-2 border-transparent hover:border-warning-200"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-warning rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <span className="font-semibold text-dark-900 text-lg">{t('quickActions.viewReports.title')}</span>
                        </div>
                        <p className="text-sm text-dark-500">{t('quickActions.viewReports.description')}</p>
                    </button>
                </div>
            </Card>
        </div>
    );
}
