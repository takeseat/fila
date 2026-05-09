import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import api from '../lib/api';
import { usePlan } from '../hooks/usePlan';
import { Button, Input, EmptyState, Spinner } from '../components/ui';
import { Modal } from '../components/ui/Modal';
import { WaitlistCard } from '../components/waitlist/WaitlistCard';
import { Icon } from '../design-system/icons/Icon';
import { PageShell, PageContent } from '../components/mobile/PageShell';
import { MobilePageHeader } from '../components/mobile/MobilePageHeader';
import { InternationalPhoneInput } from '../components/ui/InternationalPhoneInput';
import { DEFAULT_COUNTRY, getCountryByCode } from '../data/countries';
import { buildFullPhone } from '../utils/phoneUtils';

export function Waitlist() {
    const { t } = useTranslation(['waitlist', 'plans', 'common']);
    const { canUseWhatsApp } = usePlan();
    
    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        country: DEFAULT_COUNTRY,
        phone: '',
        customerName: '',
        partySize: 2,
        notes: '',
        whatsappOptIn: false,
    });
    
    // Lookup State
    const [customerFound, setCustomerFound] = useState<any>(null);
    const [isLookingUp, setIsLookingUp] = useState(false);
    
    // Universal Search State
    const [searchQuery, setSearchQuery] = useState('');
    
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

                if (data.success && data.data) {
                    setCustomerFound(data.data);
                    setFormData(prev => ({
                        ...prev,
                        customerName: data.data.name || '',
                        notes: data.data.notes || '',
                        whatsappOptIn: data.data.whatsappOptIn ?? !!whatsappSettings?.isEnabled,
                    }));
                } else {
                    setCustomerFound(null);
                    setFormData(prev => ({
                        ...prev,
                        customerName: '',
                        notes: '',
                        whatsappOptIn: !!whatsappSettings?.isEnabled,
                    }));
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
            whatsappOptIn: !!whatsappSettings?.isEnabled 
        });
        
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
        },
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
        };
        createMutation.mutate(payload);
    };

    // Current time state
    const [currentTime, setCurrentTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Filter Logic
    const activeEntries = waitlist.filter((e: any) => e.status === 'WAITING' || e.status === 'CALLED');
    
    const filteredActiveEntries = activeEntries.filter((entry: any) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            entry.customerName.toLowerCase().includes(query) || 
            entry.customerPhone.includes(query)
        );
    });

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // If pressing enter on search, and no results, open modal with query
            if (filteredActiveEntries.length === 0) {
                handleOpenModal(searchQuery);
            }
        }
    };

    const [showMetrics, setShowMetrics] = useState(false);

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
        <PageShell>
            {/* Mobile Header */}
            <MobilePageHeader
                title="Fila de Espera"
                actions={
                    <Button onClick={() => handleOpenModal()} size="sm" leftIcon={<Icon name="add" size="sm" />}>
                        Adicionar
                    </Button>
                }
            />

            <PageContent className="p-6 sm:p-10 lg:p-12 space-y-12 animate-fade-in max-w-6xl mx-auto">
                
                {/* 1. HEADER REFINADO */}
                <div className="hidden md:flex flex-col md:flex-row md:items-start justify-between gap-8 mb-4">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-extrabold tracking-tight text-text-primary">Fila de Espera</h1>
                        <div className="flex items-center gap-4">
                            <p className="text-text-muted font-medium text-sm">
                                Hoje: <span className="text-text-secondary">{metrics?.servedToday ?? 0} atendidos</span> • Tempo médio: <span className="text-text-secondary">{metrics ? Math.round(metrics.averageWaitSeconds / 60) : 0} min</span>
                            </p>
                            <button 
                                onClick={() => setShowMetrics(!showMetrics)}
                                className="text-[10px] font-bold uppercase tracking-widest text-primary-500 hover:text-primary-600 transition-colors flex items-center gap-1"
                            >
                                {showMetrics ? 'Ocultar Detalhes' : 'Ver Métricas'}
                                <Icon name={showMetrics ? 'chevronUp' : 'chevronDown'} size="xs" />
                            </button>
                        </div>
                    </div>
                    <Button onClick={() => handleOpenModal()} size="lg" className="shadow-lg shadow-primary-500/10 px-8 py-6 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all" leftIcon={<Icon name="add" size="sm" />}>
                        + Adicionar Cliente
                    </Button>
                </div>

                {/* 1.1 MÉTRICAS COLAPSÁVEIS */}
                {showMetrics && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-in-down">
                        <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary mb-1">Na Fila Agora</p>
                            <p className="text-3xl font-bold text-text-primary">{activeEntries.length}</p>
                        </div>
                        <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary mb-1">Atendidos Hoje</p>
                            <p className="text-3xl font-bold text-text-primary">{metrics?.servedToday ?? 0}</p>
                        </div>
                        <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary mb-1">Tempo de Espera</p>
                            <p className="text-3xl font-bold text-text-primary">{metrics ? Math.round(metrics.averageWaitSeconds / 60) : 0} min</p>
                        </div>
                    </div>
                )}

                {/* 2. CAMPO PRINCIPAL REFINADO */}
                <div className="relative group max-w-4xl">
                    <Input
                        placeholder="Buscar cliente por nome ou celular..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                        leftIcon={<Icon name="search" size="md" className="text-text-tertiary group-focus-within:text-primary-500 transition-colors ml-2" />}
                        className="w-full text-xl shadow-xl shadow-black/[0.02] border-border-subtle focus:border-primary-400 transition-all rounded-3xl h-16 px-6"
                        autoComplete="off"
                    />
                    
                    {searchQuery && filteredActiveEntries.length === 0 && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <Button size="md" variant="primary" onClick={() => handleOpenModal(searchQuery)} className="rounded-xl shadow-md">
                                + Adicionar "{searchQuery}"
                            </Button>
                        </div>
                    )}
                </div>

                {/* 3. LISTA REFINADA */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-text-tertiary">Gerenciamento de Fila</h2>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                            <span className="text-xs font-bold text-text-secondary">{filteredActiveEntries.length} Ativos</span>
                        </div>
                    </div>
                    
                    {activeEntries.length === 0 ? (
                        <div className="py-32 text-center max-w-lg mx-auto space-y-8">
                            <div className="bg-bg-subtle w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 opacity-40">
                                <Icon name="users" size="lg" className="text-text-tertiary scale-150" />
                            </div>
                            <div className="space-y-3">
                                <p className="text-2xl font-bold text-text-primary">Sua fila está livre</p>
                                <p className="text-text-muted text-base leading-relaxed">
                                    Não há ninguém esperando no momento. Que tal adicionar um novo cliente para testar o sistema?
                                </p>
                            </div>
                            <Button variant="primary" onClick={() => handleOpenModal()} className="px-10 py-4 rounded-2xl shadow-lg">
                                + Adicionar Primeiro Cliente
                            </Button>
                        </div>
                    ) : filteredActiveEntries.length === 0 ? (
                        <div className="py-20 text-center text-text-muted font-medium bg-bg-subtle/50 border border-dashed border-border-subtle rounded-[2rem]">
                            Nenhum resultado para "<span className="text-text-primary">{searchQuery}</span>"
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {filteredActiveEntries.map((entry: any, index: number) => (
                                <WaitlistCard
                                    key={entry.id}
                                    entry={entry}
                                    index={index}
                                    metrics={metrics}
                                    settings={settings}
                                    currentTime={currentTime}
                                    onCall={(id: string) => callMutation.mutate(id)}
                                    onSeat={(id: string) => seatMutation.mutate(id)}
                                    onCancel={(id: string) => cancelMutation.mutate(id)}
                                    onNoShow={(id: string) => noShowMutation.mutate(id)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* MODAL DE ADICIONAR REFINADO */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Novo Cliente na Fila"
                >
                    <form onSubmit={handleSubmit} className="p-2 space-y-6">
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
                                <p className="text-[10px] font-bold text-primary-500 flex items-center gap-2 px-1">
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
                            placeholder="Ex: João Silva"
                            leftIcon={<Icon name="user" size="sm" />}
                            className="h-12 rounded-xl"
                        />

                        <div className="grid grid-cols-2 gap-6">
                            <Input
                                label="Pessoas"
                                type="number"
                                inputMode="numeric"
                                min="1"
                                max="20"
                                value={formData.partySize}
                                onChange={(e) => setFormData({ ...formData, partySize: parseInt(e.target.value) || 1 })}
                                required
                                leftIcon={<Icon name="users" size="sm" />}
                                className="h-12 rounded-xl"
                            />
                        </div>

                        <Input
                            label="Observações (Opcional)"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Ex: Mesa externa, aniversário..."
                            leftIcon={<Icon name="info" size="sm" />}
                            className="h-12 rounded-xl"
                        />

                        <div className="flex gap-4 pt-4">
                            <Button
                                type="button"
                                variant="ghost"
                                className="flex-1 rounded-xl h-12"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="flex-2 rounded-xl h-12 shadow-md"
                                isLoading={createMutation.isPending}
                            >
                                Adicionar à Fila
                            </Button>
                        </div>
                    </form>
                </Modal>
            </PageContent>
        </PageShell>
    );
}
