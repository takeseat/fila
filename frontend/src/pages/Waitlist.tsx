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

            <PageContent className="p-4 sm:p-6 lg:p-8 space-y-6 animate-fade-in max-w-5xl mx-auto">
                
                {/* 1. HEADER */}
                <div className="hidden md:flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary">Fila de Espera</h1>
                        <p className="text-text-secondary mt-1">
                            Hoje: <span className="font-medium text-text-primary">{metrics?.servedToday ?? 0} atendidos</span> • Tempo médio: <span className="font-medium text-text-primary">{metrics ? Math.round(metrics.averageWaitSeconds / 60) : 0} min</span>
                        </p>
                    </div>
                    <Button onClick={() => handleOpenModal()} size="lg" className="shadow-sm" leftIcon={<Icon name="add" size="sm" />}>
                        + Adicionar
                    </Button>
                </div>

                {/* 2. CAMPO PRINCIPAL DE BUSCA/ADICIONAR */}
                <div className="relative">
                    <Input
                        placeholder="Buscar ou adicionar cliente..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                        leftIcon={<Icon name="search" size="md" className="text-text-muted" />}
                        className="w-full text-lg shadow-sm"
                        autoComplete="off"
                    />
                    
                    {/* Botão rápido para adicionar o que foi digitado caso não encontre */}
                    {searchQuery && filteredActiveEntries.length === 0 && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            <Button size="sm" variant="primary" onClick={() => handleOpenModal(searchQuery)}>
                                + Adicionar "{searchQuery}"
                            </Button>
                        </div>
                    )}
                </div>

                {/* 3. LISTA */}
                <div>
                    <h2 className="text-lg font-semibold text-text-primary mb-4">Fila Ativa</h2>
                    
                    {/* 4. ESTADO VAZIO */}
                    {activeEntries.length === 0 ? (
                        <div className="py-16 text-center">
                            <p className="text-lg font-medium text-text-secondary">Comece adicionando um cliente à fila</p>
                            <Button variant="ghost" onClick={() => handleOpenModal()} className="mt-4 text-primary-600">
                                + Adicionar agora
                            </Button>
                        </div>
                    ) : filteredActiveEntries.length === 0 ? (
                        <div className="py-12 text-center text-text-secondary">
                            Nenhum cliente encontrado com "{searchQuery}"
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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

                {/* MODAL DE ADICIONAR */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={t('form.title')}
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                                <p className="text-xs text-primary-600 flex items-center gap-1">
                                    <Spinner size="sm" />
                                    {t('form.lookingUp')}
                                </p>
                            )}
                            {!isLookingUp && customerFound && (
                                <p className="text-xs text-status-success flex items-center gap-1">
                                    <Icon name="check" size="sm" />
                                    {t('form.customerFound', { name: customerFound.name })}
                                </p>
                            )}
                        </div>

                        <Input
                            label={t('form.customerName')}
                            value={formData.customerName}
                            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                            required
                            placeholder={t('form.fullName')}
                            leftIcon={<Icon name="user" size="sm" />}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label={t('form.partySize')}
                                type="number"
                                inputMode="numeric"
                                min="1"
                                max="20"
                                value={formData.partySize}
                                onChange={(e) => setFormData({ ...formData, partySize: parseInt(e.target.value) || 1 })}
                                required
                                leftIcon={<Icon name="users" size="sm" />}
                            />
                        </div>

                        <Input
                            label={t('form.notes')}
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder={t('form.notesPlaceholder')}
                            leftIcon={<Icon name="info" size="sm" />}
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
                                Adicionar
                            </Button>
                        </div>
                    </form>
                </Modal>
            </PageContent>
        </PageShell>
    );
}
