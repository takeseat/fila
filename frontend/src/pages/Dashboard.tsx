import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Card, Skeleton } from '../components/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export function Dashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        waitingNow: 0,
        avgWaitTime: 0,
        totalCustomersToday: 0,
    });

    const { data: waitlist, isLoading } = useQuery({
        queryKey: ['waitlist'],
        queryFn: async () => {
            const { data } = await api.get('/waitlist');
            return data;
        },
    });

    useEffect(() => {
        if (waitlist) {
            const waiting = waitlist.filter((e: any) => e.status === 'WAITING' || e.status === 'CALLED');
            const seated = waitlist.filter((e: any) => e.status === 'SEATED');
            const avgWait = waiting.length > 0
                ? Math.round(waiting.reduce((sum: number, e: any) => sum + (e.estimatedWaitMinutes || 0), 0) / waiting.length)
                : 0;

            setStats({
                waitingNow: waiting.length,
                avgWaitTime: avgWait,
                totalCustomersToday: seated.length,
            });
        }
    }, [waitlist]);

    // Mock hourly data
    const hourlyData = [
        { hour: '11h', clientes: 5 },
        { hour: '12h', clientes: 12 },
        { hour: '13h', clientes: 18 },
        { hour: '14h', clientes: 8 },
        { hour: '15h', clientes: 3 },
        { hour: '18h', clientes: 6 },
        { hour: '19h', clientes: 22 },
        { hour: '20h', clientes: 28 },
        { hour: '21h', clientes: 24 },
        { hour: '22h', clientes: 14 },
        { hour: '23h', clientes: 6 },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-dark-900 mb-2">
                    Visão Geral
                </h1>
                <p className="text-dark-500">
                    Acompanhe as métricas do seu restaurante em tempo real
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Waiting Now */}
                <div className="card-premium p-6 hover-lift group">
                    {isLoading ? (
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-16" />
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="px-2 py-1 bg-success-100 rounded-lg">
                                    <span className="text-xs font-semibold text-success-700 flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                                        </svg>
                                        +12%
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm font-medium text-dark-600 mb-2">Na Fila Agora</p>
                            <p className="text-4xl font-bold text-dark-900 mb-1">{stats.waitingNow}</p>
                            <p className="text-xs text-dark-500">vs ontem</p>
                        </div>
                    )}
                </div>

                {/* Average Wait Time */}
                <div className="card-premium p-6 hover-lift group">
                    {isLoading ? (
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-16" />
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-warning-500 to-warning-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div className="px-2 py-1 bg-danger-100 rounded-lg">
                                    <span className="text-xs font-semibold text-danger-700 flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                                        </svg>
                                        +3 min
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm font-medium text-dark-600 mb-2">Tempo Médio</p>
                            <p className="text-4xl font-bold text-dark-900 mb-1">
                                {stats.avgWaitTime}
                                <span className="text-xl ml-1">min</span>
                            </p>
                            <p className="text-xs text-dark-500">vs ontem</p>
                        </div>
                    )}
                </div>

                {/* Total Customers Today */}
                <div className="card-premium p-6 hover-lift group">
                    {isLoading ? (
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-16" />
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div className="px-2 py-1 bg-success-100 rounded-lg">
                                    <span className="text-xs font-semibold text-success-700 flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                                        </svg>
                                        +15%
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm font-medium text-dark-600 mb-2">Clientes Atendidos</p>
                            <p className="text-4xl font-bold text-dark-900 mb-1">{stats.totalCustomersToday}</p>
                            <p className="text-xs text-dark-500">vs ontem</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Volume Chart */}
                <Card
                    variant="premium"
                    title="Volume por Hora"
                    subtitle="Clientes ao longo do dia"
                    headerAction={
                        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 transition-colors">
                            Ver detalhes
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    }
                >
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
                </Card>

                {/* Trend Chart */}
                <Card
                    variant="premium"
                    title="Tendência Semanal"
                    subtitle="Comparativo dos últimos 7 dias"
                    headerAction={
                        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 transition-colors">
                            Ver detalhes
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    }
                >
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={[
                            { dia: 'Seg', clientes: 45 },
                            { dia: 'Ter', clientes: 52 },
                            { dia: 'Qua', clientes: 48 },
                            { dia: 'Qui', clientes: 61 },
                            { dia: 'Sex', clientes: 78 },
                            { dia: 'Sáb', clientes: 92 },
                            { dia: 'Dom', clientes: 68 },
                        ]}>
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
                </Card>
            </div>

            {/* Quick Actions */}
            <Card variant="premium" title="Ações Rápidas">
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
                            <span className="font-semibold text-dark-900 text-lg">Adicionar à Fila</span>
                        </div>
                        <p className="text-sm text-dark-500">Registre um novo cliente na fila de espera</p>
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
                            <span className="font-semibold text-dark-900 text-lg">Ver Relatórios</span>
                        </div>
                        <p className="text-sm text-dark-500">Analise métricas e desempenho</p>
                    </button>
                </div>
            </Card>
        </div>
    );
}
