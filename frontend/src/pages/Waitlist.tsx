import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { getSocket } from '../lib/socket';
import { Button, Modal, Input, Badge, EmptyState, Progress, Spinner } from '../components/ui';
import { CountrySelect } from '../components/ui/CountrySelect';
import { format } from 'date-fns';
import { DEFAULT_COUNTRY } from '../data/countries';
import { removeMask, applyBrazilianMask, buildFullPhone } from '../utils/phoneUtils';

export function Waitlist() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        country: DEFAULT_COUNTRY,
        phone: '',
        customerName: '',
        partySize: 2,
        notes: '',
    });
    const [phoneDisplay, setPhoneDisplay] = useState('');
    const [customerFound, setCustomerFound] = useState<any>(null);
    const [isLookingUp, setIsLookingUp] = useState(false);
    const queryClient = useQueryClient();

    const { data: waitlist = [], isLoading } = useQuery({
        queryKey: ['waitlist'],
        queryFn: async () => {
            const { data } = await api.get('/waitlist');
            return data;
        },
    });

    const { data: metrics } = useQuery({
        queryKey: ['metrics'],
        queryFn: async () => {
            const { data } = await api.get('/waitlist/metrics');
            return data;
        },
    });

    // WebSocket real-time updates
    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        socket.on('waitlist:created', () => {
            queryClient.invalidateQueries({ queryKey: ['waitlist'] });
            queryClient.invalidateQueries({ queryKey: ['metrics'] });
        });

        socket.on('waitlist:updated', () => {
            queryClient.invalidateQueries({ queryKey: ['waitlist'] });
            queryClient.invalidateQueries({ queryKey: ['metrics'] });
        });

        return () => {
            socket.off('waitlist:created');
            socket.off('waitlist:updated');
        };
    }, [queryClient]);

    // Handle phone input change with masking
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;

        if (formData.country.code === 'BR') {
            // Apply Brazilian mask
            const masked = applyBrazilianMask(input);
            setPhoneDisplay(masked);
            setFormData({ ...formData, phone: removeMask(input) });
        } else {
            // For other countries, just remove non-digits
            const digits = removeMask(input);
            setPhoneDisplay(digits);
            setFormData({ ...formData, phone: digits });
        }
    };

    // Debounced customer lookup
    const lookupCustomer = useCallback(
        async (fullPhone: string, signal?: AbortSignal) => {
            if (!fullPhone) {
                setCustomerFound(null);
                return;
            }

            setIsLookingUp(true);
            try {
                const { data } = await api.get(`/customers?fullPhone=${encodeURIComponent(fullPhone)}`, { signal });

                // Backend returns { success: true, data: customer | null }
                if (data.success && data.data) {
                    setCustomerFound(data.data);

                    // Auto-fill form with customer data
                    setFormData(prev => ({
                        ...prev,
                        customerName: data.data.name || '',
                        notes: data.data.notes || '',
                    }));
                } else {
                    setCustomerFound(null);
                    // Clear fields to avoid using previous customer's data
                    setFormData(prev => ({
                        ...prev,
                        customerName: '',
                        notes: '',
                    }));
                }
            } catch (error: any) {
                // If aborted, do nothing
                if (error.name === 'CanceledError' || error.message === 'canceled') {
                    return;
                }
                // Customer not found or other error
                setCustomerFound(null);
                setFormData(prev => ({
                    ...prev,
                    customerName: '',
                    notes: '',
                }));
            } finally {
                setIsLookingUp(false);
            }
        },
        []
    );

    // Debounce timer for customer lookup
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const timer = setTimeout(() => {
            const minLength = formData.country.code === 'BR' ? 10 : 6;
            const digitsOnly = formData.phone.replace(/\D/g, '');

            if (digitsOnly.length >= minLength) {
                const fullPhone = buildFullPhone(formData.country.ddi, formData.phone);
                lookupCustomer(fullPhone, signal);
            } else {
                setCustomerFound(null);
            }
        }, 500);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [formData.phone, formData.country, lookupCustomer]);

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            await api.post('/waitlist', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['waitlist'] });
            setIsModalOpen(false);
            setFormData({ country: DEFAULT_COUNTRY, phone: '', customerName: '', partySize: 2, notes: '' });
            setPhoneDisplay('');
            setCustomerFound(null);
        },
    });

    const callMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.patch(`/waitlist/${id}/call`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['waitlist'] });
        },
    });

    const seatMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.patch(`/waitlist/${id}/seat`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['waitlist'] });
        },
    });

    const cancelMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.patch(`/waitlist/${id}/cancel`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['waitlist'] });
        },
    });

    const noShowMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.patch(`/waitlist/${id}/no-show`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['waitlist'] });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Build payload with country fields
        const payload = {
            customerName: formData.customerName,
            customerCountryCode: formData.country.code,
            customerDdi: formData.country.ddi,
            customerPhone: formData.phone,
            partySize: formData.partySize,
            notes: formData.notes,
        };

        createMutation.mutate(payload);
    };

    // Fetch restaurant settings for alerts
    const { data: settings } = useQuery({
        queryKey: ['settings'],
        queryFn: async () => {
            const response = await api.get('/restaurants/settings');
            return response.data;
        }
    });

    // Current time state for forcing re-renders every 1s for real-time progress
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000); // Check every 1s
        return () => clearInterval(timer);
    }, []);

    const getStatusBadge = (status: string) => {
        const variants: Record<string, 'warning' | 'info' | 'success' | 'default' | 'danger'> = {
            WAITING: 'warning',
            CALLED: 'info',
            SEATED: 'success',
            CANCELLED: 'default',
            NO_SHOW: 'danger',
        };

        const labels: Record<string, string> = {
            WAITING: 'Aguardando',
            CALLED: 'Chamado',
            SEATED: 'Sentado',
            CANCELLED: 'Cancelado',
            NO_SHOW: 'Não Compareceu',
        };

        // ... existing badge logic ...
        return (
            <Badge variant={variants[status]} size="md">
                {labels[status]}
            </Badge>
        );
    };

    /**
     * Determines if a waitlist entry has triggered an alert.
     */
    const getAlertStatus = (entry: any): 'waiting' | 'called' | null => {
        if (!settings) return null;

        const now = currentTime.getTime();

        if (entry.status === 'WAITING' && settings.waitingAlertMinutes) {
            const createdAt = new Date(entry.createdAt).getTime();
            const waitingMinutes = (now - createdAt) / 60000;
            if (waitingMinutes >= settings.waitingAlertMinutes) {
                return 'waiting';
            }
        }

        if (entry.status === 'CALLED' && settings.calledAlertMinutes && entry.calledAt) {
            const calledAt = new Date(entry.calledAt).getTime();
            const calledMinutes = (now - calledAt) / 60000;
            if (calledMinutes >= settings.calledAlertMinutes) {
                return 'called';
            }
        }

        return null;
    };

    const calculateWaitMetrics = (entry: any) => {
        const now = currentTime.getTime();
        const start = new Date(entry.createdAt).getTime();
        const elapsedSeconds = Math.max(0, (now - start) / 1000);

        // Elapsed time formatting (mm:ss)
        const elapsedMinutes = Math.floor(elapsedSeconds / 60);
        const elapsedRemSeconds = Math.floor(elapsedSeconds % 60);
        const elapsedString = `${elapsedMinutes.toString().padStart(2, '0')}:${elapsedRemSeconds.toString().padStart(2, '0')}`;

        // If not waiting, just return elapsed logic
        if (entry.status !== 'WAITING') {
            return { elapsedString, progress: 0, etaString: '', variant: 'default' };
        }

        const avgWaitSeconds = metrics?.averageWaitSeconds || 0;

        let progress = 0;
        let variant: 'success' | 'warning' | 'danger' = 'success';
        let etaString = '';
        let isOverdue = false;

        if (avgWaitSeconds > 0) {
            progress = Math.min((elapsedSeconds / avgWaitSeconds) * 100, 100);
            const remainingSeconds = Math.max(0, avgWaitSeconds - elapsedSeconds);

            if (remainingSeconds === 0) {
                isOverdue = true;
                etaString = 'Chamando a qualquer momento';
            } else {
                const remMin = Math.floor(remainingSeconds / 60);
                const remSec = Math.floor(remainingSeconds % 60);
                etaString = `~ ${remMin.toString().padStart(2, '0')}:${remSec.toString().padStart(2, '0')}`;
            }
        } else {
            // No metrics available
            etaString = 'Calculando...';
        }

        // Visual variants based on progress/overdue
        if (progress > 75) variant = 'warning';
        if (progress >= 100 || isOverdue) variant = 'danger';

        return { elapsedString, progress, etaString, variant, isOverdue };
    };

    // Filter active entries (not seated, cancelled, or no-show)
    const activeEntries = waitlist.filter((e: any) =>
        e.status === 'WAITING' || e.status === 'CALLED'
    );

    const completedEntries = waitlist.filter((e: any) =>
        e.status === 'SEATED' || e.status === 'CANCELLED' || e.status === 'NO_SHOW'
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <Spinner size="lg" className="mx-auto mb-4" />
                    <p className="text-dark-500">Carregando fila...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header with Stats */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-dark-900 mb-2">Fila de Espera</h1>
                    <p className="text-dark-500">Gerencie os clientes aguardando atendimento</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} size="lg" className="gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Adicionar à Fila
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card-premium p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-dark-600">Na Fila</p>
                            <p className="text-3xl font-bold text-dark-900">{activeEntries.length}</p>
                        </div>
                    </div>
                </div>

                <div className="card-premium p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-dark-600">Atendidos Hoje</p>
                            <p className="text-3xl font-bold text-dark-900">
                                {completedEntries.filter((e: any) => e.status === 'SEATED').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="card-premium p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-dark-600">
                                Tempo Médio até Chamar
                                {metrics?.windowMinutes && <span className="text-xs text-dark-400 ml-1">(últimos {metrics.windowMinutes} min)</span>}
                            </p>
                            <div className="flex items-center gap-2">
                                <p className="text-3xl font-bold text-dark-900">
                                    {metrics ? Math.round(metrics.averageWaitSeconds / 60) : 0}
                                    <span className="text-lg ml-1">min</span>
                                </p>
                                {metrics?.isFallbackUsed && (
                                    <span title="Sem dados suficientes na janela. Exibindo fallback." className="cursor-help text-xs bg-light-200 text-dark-500 px-2 py-1 rounded-full hover:bg-light-300 transition-colors">
                                        Estimado
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Queue */}
            <div>
                <h2 className="text-xl font-semibold text-dark-900 mb-4">Fila Ativa</h2>
                {activeEntries.length === 0 ? (
                    <div className="card-premium">
                        <EmptyState
                            icon={
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            }
                            title="Nenhum cliente na fila"
                            description="Adicione clientes à fila de espera para começar o atendimento"
                            action={
                                <Button onClick={() => setIsModalOpen(true)}>
                                    Adicionar Cliente
                                </Button>
                            }
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {activeEntries.map((entry: any, index: number) => {
                            const { elapsedString, progress, etaString, variant, isOverdue } = calculateWaitMetrics(entry);
                            const alertStatus = getAlertStatus(entry);

                            // Define visual styles based on alert status
                            let cardBorderClass = '';
                            let badgeContent = null;
                            let timerClass = 'text-dark-900';

                            if (alertStatus === 'waiting') {
                                cardBorderClass = 'border-l-4 border-l-warning-500 bg-warning-50/10';
                                timerClass = 'text-warning-700 font-bold';
                                badgeContent = (
                                    <div className="absolute top-0 right-0 p-2 flex items-center gap-1">
                                        <span className="flex h-3 w-3 relative mr-1">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-warning-500"></span>
                                        </span>
                                        <span className="bg-warning-100 text-warning-700 text-xs px-2 py-0.5 rounded-full font-medium border border-warning-200">
                                            ⚠️ Atraso
                                        </span>
                                    </div>
                                );
                            } else if (alertStatus === 'called') {
                                cardBorderClass = 'border-l-4 border-l-danger-500 bg-danger-50/10';
                                timerClass = 'text-danger-700 font-bold';
                                badgeContent = (
                                    <div className="absolute top-0 right-0 p-2 flex items-center gap-1">
                                        <span className="flex h-3 w-3 relative mr-1">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-danger-500"></span>
                                        </span>
                                        <span className="bg-danger-100 text-danger-700 text-xs px-2 py-0.5 rounded-full font-medium border border-danger-200">
                                            📣 Atraso ao Sentar
                                        </span>
                                    </div>
                                );
                            }

                            return (
                                <div
                                    key={entry.id}
                                    className={`
                                        card-premium p-6 hover:shadow-xl transition-all duration-200 relative overflow-hidden
                                        ${cardBorderClass}
                                    `}
                                >
                                    {badgeContent}

                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            {/* Position Badge */}
                                            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-dark-900">
                                                    {entry.customerName}
                                                </h3>
                                                <p className="text-sm text-dark-500 flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    {entry.customerPhone}
                                                </p>
                                            </div>
                                        </div>
                                        {getStatusBadge(entry.status)}
                                    </div>

                                    {/* Info Grid */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="bg-light-50 rounded-lg p-3">
                                            <p className="text-xs text-dark-500 mb-1">Pessoas</p>
                                            <p className="text-lg font-semibold text-dark-900 flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                {entry.partySize}
                                            </p>
                                        </div>
                                        <div className="bg-light-50 rounded-lg p-3">
                                            <p className="text-xs text-dark-500 mb-1">
                                                {entry.status === 'CALLED' ? 'Chamado há' : 'Tempo na Fila'}
                                            </p>
                                            <p className={`text-lg font-semibold flex items-center gap-2 ${timerClass}`}>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>{entry.status === 'CALLED' ? elapsedString : elapsedString}</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Wait Time Progress (Only relevant if still WAITING) */}
                                    {entry.status === 'WAITING' && (
                                        <div className="mb-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs font-medium text-dark-600">
                                                    Estimativa: {etaString}
                                                </span>
                                            </div>
                                            <Progress value={progress} variant={variant as any} size="md" />
                                        </div>
                                    )}

                                    {/* For CALLED status, show when they were called */}
                                    {entry.status === 'CALLED' && (
                                        <div className="mb-4">
                                            <div className="p-3 bg-primary-50 rounded-lg border border-primary-100 flex items-center justify-between">
                                                <span className="text-sm text-primary-700 font-medium">Cliente foi chamado</span>
                                                <span className="text-xs text-primary-600">
                                                    às {format(new Date(entry.calledAt || entry.updatedAt), 'HH:mm')}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        {entry.status === 'WAITING' && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => callMutation.mutate(entry.id)}
                                                    className="flex-1"
                                                    isLoading={callMutation.isPending}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                                    </svg>
                                                    Chamar
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="success"
                                                    onClick={() => seatMutation.mutate(entry.id)}
                                                    className="flex-1"
                                                    isLoading={seatMutation.isPending}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Sentar
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="danger"
                                                    onClick={() => cancelMutation.mutate(entry.id)}
                                                    isLoading={cancelMutation.isPending}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </Button>
                                            </>
                                        )}
                                        {entry.status === 'CALLED' && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    variant="success"
                                                    onClick={() => seatMutation.mutate(entry.id)}
                                                    className="flex-1"
                                                    isLoading={seatMutation.isPending}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Sentar
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="danger"
                                                    onClick={() => noShowMutation.mutate(entry.id)}
                                                    className="flex-1"
                                                    isLoading={noShowMutation.isPending}
                                                >
                                                    Não Compareceu
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>


            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Adicionar à Fila"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-dark-700">Celular do Cliente</label>
                        <div className="flex relative z-20 items-stretch h-11">
                            <div className="w-[72px] flex-shrink-0 z-10 h-full">
                                <CountrySelect
                                    value={formData.country.code}
                                    onChange={(country) => setFormData({ ...formData, country, phone: '' })}
                                    compact={true}
                                    className="h-full"
                                />
                            </div>
                            <div className="flex-1 -ml-[1px] h-full">
                                <Input
                                    placeholder={formData.country.code === 'BR' ? '(11) 99999-9999' : 'Phone number'}
                                    value={phoneDisplay}
                                    onChange={handlePhoneChange}
                                    required
                                    className="rounded-l-none border-l-0 focus:z-20 relative h-full"
                                />
                            </div>
                        </div>
                        {isLookingUp && (
                            <p className="text-xs text-primary-600 flex items-center gap-1">
                                <Spinner size="sm" />
                                Buscando cliente...
                            </p>
                        )}
                        {!isLookingUp && customerFound && (
                            <p className="text-xs text-success-600 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Cliente encontrado: {customerFound.name}
                            </p>
                        )}
                        {!isLookingUp && !customerFound && phoneDisplay.replace(/\D/g, '').length >= (formData.country.code === 'BR' ? 10 : 6) && (
                            <p className="text-xs text-dark-500 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Novo cliente — será cadastrado
                            </p>
                        )}
                    </div>

                    <Input
                        label="Nome do Cliente"
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        required
                        placeholder="Nome completo"
                        leftIcon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        }
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Pessoas"
                            type="number"
                            min="1"
                            max="20"
                            value={formData.partySize}
                            onChange={(e) => setFormData({ ...formData, partySize: parseInt(e.target.value) || 1 })}
                            required
                            leftIcon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            }
                        />
                    </div>

                    <Input
                        label="Observações"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Ex: Mesa na janela, cadeira de bebê..."
                        leftIcon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        }
                    />

                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            className="flex-1"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            isLoading={createMutation.isPending}
                        >
                            Adicionar à Fila
                        </Button>
                    </div>
                </form>
            </Modal>
        </div >
    );
}
