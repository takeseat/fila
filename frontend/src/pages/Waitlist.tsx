import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import api from '../lib/api';
import { usePlan } from '../hooks/usePlan';
import { Button, Input, Spinner } from '../components/ui';
import { Modal } from '../components/ui/Modal';
import { WaitlistCard } from '../components/waitlist/WaitlistCard';
import { Icon } from '../design-system/icons/Icon';
import { PageShell, PageContent } from '../components/mobile/PageShell';
import { MobilePageHeader } from '../components/mobile/MobilePageHeader';
import { InternationalPhoneInput } from '../components/ui/InternationalPhoneInput';
import { DEFAULT_COUNTRY, getCountryByCode } from '../data/countries';
import { buildFullPhone } from '../utils/phoneUtils';
import { Alert, Toast } from '../components/ui';

export function Waitlist() {
    const { t } = useTranslation(['waitlist', 'plans', 'common']);
    const { canUseWhatsApp } = usePlan();
    
    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [formData, setFormData] = useState({
        country: DEFAULT_COUNTRY,
        phone: '',
        customerName: '',
        partySize: 2,
        notes: '',
        whatsappOptIn: false,
        isPriority: false,
    });
    
    // Lookup State
    const [customerFound, setCustomerFound] = useState<any>(null);
    const [isLookingUp, setIsLookingUp] = useState(false);
    
    // Universal Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [partySizeFilter, setPartySizeFilter] = useState<number | 'all' | '5+'>('all');
    
    const queryClient = useQueryClient();

    // Data Fetching
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

    const { data: businessData } = useQuery({
        queryKey: ['business-data'],
        queryFn: async () => {
            const { data } = await api.get('/restaurants/business');
            return data;
        },
    });

    const { data: whatsappSettings } = useQuery({
        queryKey: ['whatsapp-settings'],
        queryFn: async () => {
            const { data } = await api.get('/whatsapp-settings');
            return data;
        },
        retry: false,
    });

    const { data: settings } = useQuery({
        queryKey: ['settings'],
        queryFn: async () => {
            const response = await api.get('/restaurants/settings');
            return response.data;
        }
    });

    // Customer Lookup
    const lookupCustomer = useCallback(
        async (fullPhone: string, signal?: AbortSignal) => {
            if (!fullPhone) {
                setCustomerFound(null);
                return;
            }

            setIsLookingUp(true);
            try {
                const { data } = await api.get(`/customers?fullPhone=${encodeURIComponent(fullPhone)}`, { signal });

                // The backend returns a raw array of customers for this filter
                const customer = Array.isArray(data) ? data[0] : (data.data || null);

                if (customer) {
                    setCustomerFound(customer);
                    setFormData(prev => ({
                        ...prev,
                        customerName: customer.name || '',
                        notes: customer.notes || '',
                        whatsappOptIn: customer.whatsappOptIn ?? !!whatsappSettings?.isEnabled,
                        isPriority: customer.isPriority ?? false,
                    }));
                } else {
                    setCustomerFound(null);
                    // Do not clear the name/notes if the user is in the middle of typing
                    // only clear if we are sure it's a new entry and we want a clean state
                }
            } catch (error: any) {
                if (error.name === 'CanceledError' || error.message === 'canceled') return;
                setCustomerFound(null);
                setFormData(prev => ({ ...prev, customerName: '', notes: '' }));
            } finally {
                setIsLookingUp(false);
            }
        },
        [whatsappSettings?.isEnabled]
    );

    // Auto-lookup when typing phone in modal
    useEffect(() => {
        const controller = new AbortController();
        const timer = setTimeout(() => {
            const minLength = formData.country.code === 'BR' ? 10 : 6;
            const digitsOnly = formData.phone.replace(/\D/g, '');

            if (digitsOnly.length >= minLength) {
                const fullPhone = buildFullPhone(formData.country.ddi, formData.phone);
                lookupCustomer(fullPhone, controller.signal);
            } else {
                setCustomerFound(null);
            }
        }, 500);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [formData.phone, formData.country, lookupCustomer]);

    const handleOpenModal = (initialNameOrPhone?: string) => {
        let defaultName = '';
        let defaultPhone = '';
        
        if (initialNameOrPhone) {
            // Check if it looks like a phone number (digits) or a name
            const isPhone = /^\d+$/.test(initialNameOrPhone.replace(/\D/g, ''));
            if (isPhone) {
                defaultPhone = initialNameOrPhone.replace(/\D/g, '');
            } else {
                defaultName = initialNameOrPhone;
            }
        }

        const resetCountry = businessData?.countryCode
            ? getCountryByCode(businessData.countryCode) || DEFAULT_COUNTRY
            : DEFAULT_COUNTRY;
            
        setFormData({ 
            country: resetCountry, 
            phone: defaultPhone, 
            customerName: defaultName, 
            partySize: 2, 
            notes: '', 
            whatsappOptIn: !!whatsappSettings?.isEnabled,
            isPriority: false
        });
        
        setError(null);
        setIsModalOpen(true);
    };

    // Mutations
    const createMutation = useMutation({
        mutationFn: async (data: any) => await api.post('/waitlist', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['waitlist'] });
            queryClient.invalidateQueries({ queryKey: ['metrics'] });
            setIsModalOpen(false);
            setSearchQuery(''); // clear search after add
            setCustomerFound(null);
            setToast({ message: "Cliente adicionado com sucesso!", type: 'success' });
        },
        onError: (err: any) => {
            const message = err.response?.data?.error || err.message || 'Erro ao adicionar na fila';
            setError(message);
        }
    });

    const callMutation = useMutation({
        mutationFn: async (id: string) => await api.patch(`/waitlist/${id}/call`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['waitlist'] });
            queryClient.invalidateQueries({ queryKey: ['metrics'] });
        },
    });

    const seatMutation = useMutation({
        mutationFn: async (id: string) => await api.patch(`/waitlist/${id}/seat`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['waitlist'] });
            queryClient.invalidateQueries({ queryKey: ['metrics'] });
        },
    });

    const cancelMutation = useMutation({
        mutationFn: async (id: string) => await api.patch(`/waitlist/${id}/cancel`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['waitlist'] });
            queryClient.invalidateQueries({ queryKey: ['metrics'] });
        },
    });

    const noShowMutation = useMutation({
        mutationFn: async (id: string) => await api.patch(`/waitlist/${id}/no-show`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['waitlist'] });
            queryClient.invalidateQueries({ queryKey: ['metrics'] });
        },
    });

    const togglePriorityMutation = useMutation({
        mutationFn: async (id: string) => await api.patch(`/waitlist/${id}/priority`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['waitlist'] });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            customerName: formData.customerName,
            customerCountryCode: formData.country.code,
            customerDdi: formData.country.ddi,
            customerPhone: formData.phone,
            partySize: formData.partySize,
            notes: formData.notes,
            whatsappOptIn: canUseWhatsApp ? (whatsappSettings?.isEnabled ? true : false) : false,
            isPriority: formData.isPriority,
        };
        createMutation.mutate(payload);
    };

    // Current time state
    const [currentTime, setCurrentTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Listen for the header "Adicionar Cliente" button event
    useEffect(() => {
        const handler = () => handleOpenModal();
        window.addEventListener('openAddCustomerModal', handler);
        return () => window.removeEventListener('openAddCustomerModal', handler);
    }, []);

    // Filter Logic
    const activeEntries = waitlist.filter((e: any) => e.status === 'WAITING' || e.status === 'CALLED');
    
    const filteredActiveEntries = activeEntries.filter((entry: any) => {
        // Search Filter
        const matchesSearch = !searchQuery || 
            entry.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
            entry.customerPhone.includes(searchQuery);

        // Party Size Filter
        let matchesPartySize = true;
        if (partySizeFilter !== 'all') {
            if (partySizeFilter === '5+') {
                matchesPartySize = entry.partySize >= 5;
            } else {
                matchesPartySize = entry.partySize === Number(partySizeFilter);
            }
        }

        return matchesSearch && matchesPartySize;
    });

    const [firstEntry] = filteredActiveEntries;


    const [_showMetrics, _setShowMetrics] = useState(false);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <Spinner size="lg" className="mx-auto mb-4" />
                    <p className="text-text-secondary">{t('loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <PageShell>
            {/* Mobile Header */}
            <MobilePageHeader
                title="Sequência da Fila"
                actions={activeEntries.length > 0 ? (
                    <Button onClick={() => handleOpenModal()} size="sm" leftIcon={<Icon name="add" size="sm" />} className="bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/20">
                        Adicionar
                    </Button>
                ) : null}
            />

            <PageContent className="min-h-full bg-[#fcf9f8] relative overflow-hidden flex flex-col">
                {/* Background Blobs (Organic Shell) */}
                <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-400/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
                <div className="absolute top-[20%] -left-[10%] w-[30%] h-[30%] bg-indigo-300/10 rounded-full blur-[100px] -z-10"></div>
                
                <div className="w-full max-w-6xl mx-auto p-3 sm:p-10 lg:p-12 space-y-12 animate-fade-in relative z-10 pb-24 md:pb-12">
                    
                    {/* Portal for Header Actions */}
                    {document.getElementById('header-actions') && createPortal(
                        <Button 
                            onClick={() => handleOpenModal()} 
                            size="md" 
                            className="bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 px-6 rounded-xl hover:bg-indigo-700 transition-all font-bold text-sm"
                            leftIcon={<Icon name="add" size="sm" />}
                        >
                            Adicionar Cliente
                        </Button>,
                        document.getElementById('header-actions')!
                    )}

                    {/* 2. FILTERS & SEARCH - Neumorphic Style */}
                    {activeEntries.length > 0 && (
                        <section className="space-y-4 md:space-y-6">
                            <div className="hidden md:block">
                                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Sequência da Fila</h2>
                            </div>
                            <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6">
                                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-3 md:px-4 bg-white/40 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm w-full md:w-auto">
                                    <span className="hidden md:inline text-[10px] font-black text-indigo-900/40 uppercase tracking-widest whitespace-nowrap font-display">Filtrar pessoas:</span>
                                    <div className="flex gap-2">
                                        {['all', '1', '2', '3', '4', '5+'].map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setPartySizeFilter(size as any)}
                                                className={`h-8 md:h-10 min-w-[36px] md:min-w-[48px] px-3 md:px-4 flex items-center justify-center rounded-xl md:rounded-2xl text-[10px] md:text-xs font-bold transition-all border whitespace-nowrap ${
                                                    partySizeFilter === size 
                                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/30' 
                                                    : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-400 hover:text-indigo-600 shadow-sm'
                                                }`}
                                            >
                                                {size === 'all' ? 'Todos' : size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="relative w-full md:max-w-xs group">
                                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                        <Icon name="search" size="sm" />
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Buscar cliente ou telefone..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="block w-full pl-11 pr-4 py-4 bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all shadow-xl shadow-slate-200/40 font-medium"
                                    />
                                </div>
                            </div>
                        </section>
                    )}

                    {/* 3. QUEUE LIST */}
                    <section className="space-y-8">
                        {activeEntries.length === 0 ? (
                            <div className="relative overflow-hidden flex-1 flex flex-col items-center justify-center py-12 px-8 min-h-[500px] w-full bg-gradient-to-br from-white to-slate-50/20">
                                {/* Dynamic Background Blobs */}
                                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] animate-pulse"></div>
                                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-slate-500/10 rounded-full blur-[100px]" style={{ animationDelay: '2s' }}></div>

                                {/* Illustration */}
                                <div className="relative mb-10 z-10">
                                    <div className="relative flex items-center justify-center">
                                        <div className="absolute w-64 h-64 bg-indigo-600/15 rounded-full blur-[60px] animate-pulse"></div>
                                        <div className="relative bg-gradient-to-br from-white/90 to-slate-50/90 p-10 rounded-full border border-white/80 shadow-[0_24px_48px_-12px_rgba(79,70,229,0.25)]">
                                            <div className="bg-gradient-to-tr from-indigo-600 via-indigo-500 to-slate-500 p-8 rounded-full shadow-2xl shadow-indigo-600/40 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[72px] text-white" style={{ fontVariationSettings: "'wght' 200, 'FILL' 1" }}>groups_3</span>
                                            </div>
                                            <div className="absolute -top-6 -right-3 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-3 rounded-2xl shadow-xl border-4 border-white transform rotate-12">
                                                <span className="material-symbols-outlined text-xl">celebration</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Text */}
                                <div className="text-center max-w-md mx-auto mb-8 relative z-10">
                                    <h2 className="text-3xl font-bold text-slate-900 mb-3 leading-tight">
                                        Sua fila de espera,{' '}
                                        <span className="bg-gradient-to-r from-indigo-600 to-slate-500 bg-clip-text text-transparent">mais vibrante do que nunca.</span>
                                    </h2>
                                    <p className="text-slate-500 text-base leading-relaxed">
                                        Adicione seu primeiro cliente e comece a gerenciar seu fluxo com excelência.
                                    </p>
                                </div>

                                {/* CTA */}
                                <button
                                    onClick={() => handleOpenModal()}
                                    className="group relative bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-10 py-4 rounded-2xl flex items-center gap-3 transition-all shadow-[0_16px_32px_-8px_rgba(79,70,229,0.4)] hover:shadow-indigo-600/50 active:scale-95 overflow-hidden z-10"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                                    <span className="material-symbols-outlined text-2xl relative z-10" style={{ fontVariationSettings: "'wght' 500" }}>person_add</span>
                                    <span className="text-base font-bold relative z-10">Adicionar Primeiro Cliente</span>
                                </button>
                            </div>
                        ) : filteredActiveEntries.length === 0 ? (
                            <div className="w-full py-20 text-center text-slate-500 font-bold bg-white/30 backdrop-blur-sm border-2 border-dashed border-indigo-200/50 rounded-[3rem] font-display uppercase tracking-widest text-xs">
                                Nenhum cliente encontrado para "<span className="text-indigo-600">{searchQuery}</span>"
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {/* First Item Highlighted (Only if it's truly the overall first) */}
                                {firstEntry && activeEntries[0] && firstEntry.id === activeEntries[0].id && (
                                    <WaitlistCard
                                        entry={firstEntry}
                                        index={waitlist.findIndex((e: any) => e.id === firstEntry.id)}
                                        variant="highlight"
                                        metrics={metrics}
                                        settings={settings}
                                        currentTime={currentTime}
                                        onCall={(id: string) => callMutation.mutate(id)}
                                        onSeat={(id: string) => seatMutation.mutate(id)}
                                        onCancel={(id: string) => cancelMutation.mutate(id)}
                                        onNoShow={(id: string) => noShowMutation.mutate(id)}
                                        onTogglePriority={(id: string) => togglePriorityMutation.mutate(id)}
                                        isActionLoading={{
                                            call: callMutation.isPending,
                                            seat: seatMutation.isPending,
                                            cancel: cancelMutation.isPending,
                                            noShow: noShowMutation.isPending,
                                            priority: togglePriorityMutation.isPending,
                                        }}
                                    />
                                )}

                                {/* Subsequent Items or Filtered Results */}
                                {filteredActiveEntries.length > 0 && (
                                    <div className="bg-white/50 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-900/5 ring-1 ring-white/20">
                                        <div className="divide-y divide-indigo-100/50 max-h-[600px] overflow-y-auto custom-scrollbar">
                                            {filteredActiveEntries.map((entry: any) => {
                                                // Skip if it was already shown as highlight
                                                if (entry.id === activeEntries[0]?.id) return null;
                                                
                                                return (
                                                    <WaitlistCard
                                                        key={entry.id}
                                                        entry={entry}
                                                        index={waitlist.findIndex((e: any) => e.id === entry.id)}
                                                        variant="row"
                                                        metrics={metrics}
                                                        settings={settings}
                                                        currentTime={currentTime}
                                                        onCall={(id: string) => callMutation.mutate(id)}
                                                        onSeat={(id: string) => seatMutation.mutate(id)}
                                                        onCancel={(id: string) => cancelMutation.mutate(id)}
                                                        onNoShow={(id: string) => noShowMutation.mutate(id)}
                                                        onTogglePriority={(id: string) => togglePriorityMutation.mutate(id)}
                                                        isActionLoading={{
                                                            call: callMutation.isPending,
                                                            seat: seatMutation.isPending,
                                                            cancel: cancelMutation.isPending,
                                                            noShow: noShowMutation.isPending,
                                                            priority: togglePriorityMutation.isPending,
                                                        }}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>

                    {/* 4. INSIGHTS BENTO GRID — Stitch Screen 1 style */}
                    {activeEntries.length > 0 && (
                        <section className="grid grid-cols-1 gap-4 md:grid-cols-3 pt-6 border-t border-slate-100">
                            {/* Card 1: Espera Média */}
                            <div className="bg-gradient-to-br from-white to-indigo-50/30 border border-slate-200/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Icon name="waitTime" size="sm" tone="info" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Espera Média</span>
                                    </div>
                                    <div className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <Icon name="trendingDown" size="xs" tone="inherit" />
                                        <span className="text-[10px] font-bold">2min</span>
                                    </div>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <p className="text-5xl font-black text-indigo-600">{metrics ? Math.round(metrics.averageWaitSeconds / 60) : 0}</p>
                                    <p className="text-2xl font-bold text-slate-400">min</p>
                                </div>
                                <p className="text-xs text-slate-400 mt-2">Em relação à última hora</p>
                            </div>

                            {/* Card 2: Fluxo Atual */}
                            <div className="bg-gradient-to-br from-white to-indigo-50/30 border border-slate-200/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex items-center gap-2 mb-4 text-slate-500">
                                    <Icon name="activity" size="sm" tone="info" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Fluxo Atual</span>
                                </div>
                                <p className="text-5xl font-black text-slate-900">Alta</p>
                                <div className="flex items-center gap-1.5 mt-3 text-slate-500">
                                    <Icon name="waitTime" size="xs" tone="secondary" />
                                    <p className="text-xs font-medium">Pico esperado para às 20:30</p>
                                </div>
                            </div>

                            {/* Card 3: Total na Fila */}
                            <div className="bg-gradient-to-br from-white to-indigo-50/30 border border-slate-200/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex items-center gap-2 mb-4 text-slate-500">
                                    <Icon name="users" size="sm" tone="info" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Total na Fila</span>
                                </div>
                                <p className="text-5xl font-black text-slate-900">{activeEntries.length}</p>
                                <p className="text-xs text-slate-500 mt-3 font-medium">Pessoas aguardando atendimento</p>
                            </div>
                        </section>
                    )}

                    {/* Footer Nav removed as per design (handled by Layout) */}
                </div>

                {/* MODAL DE ADICIONAR REFINADO */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Adicionar à Fila"
                >
                    <form onSubmit={handleSubmit} className="p-2 space-y-6">
                        {error && (
                            <Alert severity="danger" className="mb-4">
                                {error}
                            </Alert>
                        )}
                        <div className="space-y-2">
                            <InternationalPhoneInput
                                label={t('form.customerPhone')}
                                countryCode={formData.country.code}
                                phoneNumber={formData.phone}
                                onChange={(code, phone) => {
                                    const country = getCountryByCode(code) || DEFAULT_COUNTRY;
                                    setFormData(prev => ({ ...prev, country, phone }));
                                }}
                                required
                            />
                            {isLookingUp && (
                                <p className="text-[10px] font-bold text-indigo-500 flex items-center gap-2 px-1">
                                    <Spinner size="sm" />
                                    Buscando cadastro...
                                </p>
                            )}
                            {!isLookingUp && customerFound && (
                                <p className="text-[10px] font-bold text-status-success flex items-center gap-2 px-1">
                                    <Icon name="check" size="xs" />
                                    Cliente reconhecido: {customerFound.name}
                                </p>
                            )}
                        </div>

                        <Input
                            label="Nome do Cliente"
                            value={formData.customerName}
                            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                            required
                            placeholder="Nome completo"
                            leftIcon={<Icon name="user" size="sm" className="text-slate-400" />}
                            className="h-12 rounded-xl"
                        />

                        <div className="grid grid-cols-1">
                            <Input
                                label="Pessoas"
                                type="number"
                                inputMode="numeric"
                                min="1"
                                max="20"
                                value={formData.partySize}
                                onChange={(e) => setFormData({ ...formData, partySize: parseInt(e.target.value) || 1 })}
                                required
                                leftIcon={<Icon name="users" size="sm" className="text-slate-400" />}
                                className="h-12 rounded-xl"
                            />
                        </div>

                        <div className="bg-amber-50/50 border border-amber-200/50 rounded-2xl p-4 space-y-2">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center justify-center w-6 h-6 rounded-lg border-2 border-amber-300 group-hover:border-amber-500 transition-colors bg-white">
                                    <input 
                                        type="checkbox"
                                        className="sr-only"
                                        checked={formData.isPriority}
                                        onChange={(e) => setFormData({ ...formData, isPriority: e.target.checked })}
                                    />
                                    {formData.isPriority && (
                                        <div className="w-3 h-3 bg-amber-500 rounded-sm animate-scale-in"></div>
                                    )}
                                </div>
                                <span className="text-sm font-bold text-amber-900">Atendimento Prioritário</span>
                                <div className="ml-auto bg-amber-100 text-amber-700 p-1.5 rounded-lg">
                                    <Icon name="priority" size="xs" tone="inherit" />
                                </div>
                            </label>
                            <p className="text-[11px] text-amber-800/70 leading-relaxed font-medium pl-9">
                                Cliente com atendimento prioritário. Será considerado primeiro quando houver uma mesa compatível com o tamanho do grupo.
                            </p>
                        </div>

                        <Input
                            label="Observações"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Ex: Mesa na janela, cadeira de bebê..."
                            leftIcon={<Icon name="info" size="sm" className="text-slate-400" />}
                            className="h-12 rounded-xl"
                        />

                        <div className="flex gap-4 pt-4">
                            <Button
                                type="button"
                                variant="secondary"
                                className="flex-1 rounded-xl h-12 border-slate-200"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                className="flex-1 rounded-xl h-12 shadow-lg shadow-indigo-600/20"
                                isLoading={createMutation.isPending}
                            >
                                Adicionar
                            </Button>
                        </div>
                    </form>
                </Modal>
            </PageContent>
        </PageShell>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    );
}
