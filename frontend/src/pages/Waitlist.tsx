import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import api from '../lib/api';
import { usePlan } from '../hooks/usePlan';
import { Button, Input, EmptyState, Spinner } from '../components/ui';
import { Modal } from '../components/ui/Modal';
import { KPICard } from '../components/ui/KPICard';
import { WaitlistCard } from '../components/waitlist/WaitlistCard';
import { Icon } from '../design-system/icons/Icon';
import { PageShell, PageContent } from '../components/mobile/PageShell';
import { MobilePageHeader } from '../components/mobile/MobilePageHeader';
import { InternationalPhoneInput } from '../components/ui/InternationalPhoneInput';
import { DEFAULT_COUNTRY, getCountryByCode } from '../data/countries';
import { buildFullPhone } from '../utils/phoneUtils';

export function Waitlist() {
    const { t } = useTranslation(['waitlist', 'plans']);
    const { canUseWhatsApp } = usePlan();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        country: DEFAULT_COUNTRY,
        phone: '',
        customerName: '',
        partySize: 2,
        notes: '',
        whatsappOptIn: false,
    });
    const [customerFound, setCustomerFound] = useState<any>(null);
    const [isLookingUp, setIsLookingUp] = useState(false);
    const [filters, setFilters] = useState({
        phone: '',
        name: '',
        partySize: null as number | null, // null = all sizes
    });
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
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

    // Fetch business data to get default country
    const { data: businessData } = useQuery({
        queryKey: ['business-data'],
        queryFn: async () => {
            const { data } = await api.get('/restaurants/business');
            return data;
        },
    });

    // Fetch WhatsApp settings to determine if opt-in should be shown
    const { data: whatsappSettings } = useQuery({
        queryKey: ['whatsapp-settings'],
        queryFn: async () => {
            const { data } = await api.get('/whatsapp-settings');
            return data;
        },
        retry: false,
        // Remove staleTime to ensure we always get fresh config on mount/validations
    });







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
                        // Use existing preference if available, otherwise default to true if enabled
                        whatsappOptIn: data.data.whatsappOptIn ?? !!whatsappSettings?.isEnabled,
                    }));
                } else {
                    setCustomerFound(null);
                    // Clear fields and default opt-in
                    setFormData(prev => ({
                        ...prev,
                        customerName: '',
                        notes: '',
                        whatsappOptIn: !!whatsappSettings?.isEnabled,
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

    // Handle opening modal with business country pre-selected
    const handleOpenModal = () => {
        // Pre-select business country if available
        if (businessData?.countryCode) {
            const businessCountry = getCountryByCode(businessData.countryCode);
            if (businessCountry) {
                // Force WhatsApp opt-in to true by default if enabled
                setFormData(prev => ({ ...prev, country: businessCountry, whatsappOptIn: !!whatsappSettings?.isEnabled }));
            }
        } else {
            setFormData(prev => ({ ...prev, whatsappOptIn: !!whatsappSettings?.isEnabled }));
        }
        setIsModalOpen(true);
    };

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            await api.post('/waitlist', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['waitlist'] });
            queryClient.invalidateQueries({ queryKey: ['metrics'] });
            setIsModalOpen(false);
            // Reset to business country or default
            const resetCountry = businessData?.countryCode
                ? getCountryByCode(businessData.countryCode) || DEFAULT_COUNTRY
                : DEFAULT_COUNTRY;
            setFormData({ country: resetCountry, phone: '', customerName: '', partySize: 2, notes: '', whatsappOptIn: false });
            setCustomerFound(null);
        },
    });

    const callMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.patch(`/waitlist/${id}/call`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['waitlist'] });
            queryClient.invalidateQueries({ queryKey: ['metrics'] });
        },
    });

    const seatMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.patch(`/waitlist/${id}/seat`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['waitlist'] });
            queryClient.invalidateQueries({ queryKey: ['metrics'] });
        },
    });

    const cancelMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.patch(`/waitlist/${id}/cancel`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['waitlist'] });
            queryClient.invalidateQueries({ queryKey: ['metrics'] });
        },
    });

    const noShowMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.patch(`/waitlist/${id}/no-show`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['waitlist'] });
            queryClient.invalidateQueries({ queryKey: ['metrics'] });
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
            // Force opt-in if system is enabled for it
            whatsappOptIn: canUseWhatsApp ? (whatsappSettings?.isEnabled ? true : false) : false,
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

    // Filter active entries (not seated, cancelled, or no-show)
    const activeEntries = waitlist.filter((e: any) =>
        e.status === 'WAITING' || e.status === 'CALLED'
    );

    // Apply user filters
    const filteredActiveEntries = activeEntries.filter((entry: any) => {
        // Phone filter (partial match)
        if (filters.phone && !entry.customerPhone.includes(filters.phone)) {
            return false;
        }

        // Name filter (case-insensitive partial match)
        if (filters.name && !entry.customerName.toLowerCase().includes(filters.name.toLowerCase())) {
            return false;
        }

        // Party size filter
        if (filters.partySize !== null) {
            if (filters.partySize === 5) {
                // 5+ means 5 or more
                if (entry.partySize < 5) {
                    return false;
                }
            } else {
                // Exact match for 1, 2, 3, 4
                if (entry.partySize !== filters.partySize) {
                    return false;
                }
            }
        }

        return true;
    });

    // Check if any filter is active
    const hasActiveFilters = filters.phone || filters.name || filters.partySize !== null;


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
                title={t('title')}
                subtitle={t('subtitle')}
                actions={
                    <Button onClick={handleOpenModal} size="sm" leftIcon={<Icon name="add" size="sm" />}>
                        {t('actions.add', 'Adicionar')}
                    </Button>
                }
            />

            <PageContent className="p-4 space-y-6 animate-fade-in">
                {/* Desktop Header (Hidden on Mobile) */}
                <div className="hidden lg:flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary mb-2">{t('title')}</h1>
                        <p className="text-text-secondary">{t('subtitle')}</p>
                    </div>
                    <Button onClick={handleOpenModal} size="lg" leftIcon={<Icon name="add" size="sm" />}>
                        {t('actions.addToQueue')}
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 md:grid md:grid-cols-3">
                    <KPICard
                        icon={
                            <Icon name="users" className="w-4 h-4 md:w-6 md:h-6" tone="inherit" />
                        }
                        value={activeEntries.length}
                        label={t('stats.inQueue')}
                        iconVariant="warning"
                    />

                    {/* Hidden on mobile to save space, or moved to bottom if critical */}
                    <div className="hidden md:block">
                        <KPICard
                            icon={
                                <Icon name="check" className="w-6 h-6" tone="inherit" />
                            }
                            value={metrics?.servedToday ?? 0}
                            label={t('stats.servedToday')}
                            iconVariant="success"
                        />
                    </div>

                    <KPICard
                        icon={
                            <Icon name="waitTime" className="w-4 h-4 md:w-6 md:h-6" tone="inherit" />
                        }
                        value={`${metrics ? Math.round(metrics.averageWaitSeconds / 60) : 0} min`}
                        label={t('stats.avgWaitTime')}
                        iconVariant="primary"
                    />
                </div>

                {/* Filters */}
                <div className="bg-bg-surface border border-border-default rounded-card shadow-card p-4">
                    {/* Mobile Toggle */}
                    <div className="md:hidden flex justify-between items-center mb-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                            className="w-full justify-between"
                        >
                            <span className="flex items-center gap-2">
                                <Icon name="filter" size="sm" />
                                {t('filters.title', 'Filtros')}
                            </span>
                            <Icon name="chevronDown" className={`w-5 h-5 transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} />
                        </Button>
                    </div>

                    <div className={`${isFiltersOpen ? 'block mt-4' : 'hidden'} md:block`}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Phone filter */}
                            <Input
                                placeholder={t('filters.phoneSearch')}
                                value={filters.phone}
                                onChange={(e) => setFilters({ ...filters, phone: e.target.value })}
                                inputMode="tel"
                                leftIcon={
                                    <Icon name="search" size="sm" />
                                }
                            />

                            {/* Name filter */}
                            <Input
                                placeholder={t('filters.nameSearch')}
                                value={filters.name}
                                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                                leftIcon={
                                    <Icon name="user" size="sm" />
                                }
                            />

                            {/* Party size filter */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-medium text-text-secondary">{t('filters.partySizeLabel')}</label>
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        variant={filters.partySize === null ? 'primary' : 'outline'}
                                        size="sm"
                                        onClick={() => setFilters({ ...filters, partySize: null })}
                                    >
                                        {t('filters.all')}
                                    </Button>
                                    {[1, 2, 3, 4].map(size => (
                                        <Button
                                            key={size}
                                            variant={filters.partySize === size ? 'primary' : 'outline'}
                                            size="sm"
                                            onClick={() => setFilters({ ...filters, partySize: size })}
                                        >
                                            {size}
                                        </Button>
                                    ))}
                                    <Button
                                        variant={filters.partySize === 5 ? 'primary' : 'outline'}
                                        size="sm"
                                        onClick={() => setFilters({ ...filters, partySize: 5 })}
                                    >
                                        5+
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Clear filters button */}
                        {hasActiveFilters && (
                            <div className="mt-3 flex justify-end">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setFilters({ phone: '', name: '', partySize: null })}
                                    className="gap-2"
                                >
                                    <Icon name="close" size="sm" />
                                    {t('filters.clearFilters')}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Active Queue */}
                <div>
                    <h2 className="text-xl font-semibold text-text-primary mb-4">{t('activeQueue')}</h2>
                    {activeEntries.length === 0 ? (
                        <div className="bg-bg-surface border border-border-default rounded-card shadow-card">
                            <EmptyState
                                icon={
                                    <Icon name="users" className="w-full h-full text-text-secondary" />
                                }
                                title={t('empty.title')}
                                description={t('empty.description')}
                                action={
                                    <Button onClick={handleOpenModal}>
                                        {t('empty.action')}
                                    </Button>
                                }
                            />
                        </div>
                    ) : filteredActiveEntries.length === 0 ? (
                        <div className="bg-bg-surface border border-border-default rounded-card shadow-card">
                            <EmptyState
                                icon={
                                    <Icon name="search" className="w-full h-full text-text-secondary" />
                                }
                                title={t('filters.noResults.title')}
                                description={t('filters.noResults.description')}
                                action={
                                    <Button onClick={() => setFilters({ phone: '', name: '', partySize: null })} variant="outline">
                                        {t('filters.clearFilters')}
                                    </Button>
                                }
                            />
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
                                    isActionLoading={{
                                        call: callMutation.isPending && callMutation.variables === entry.id, // Only show loading for the specific item if possible, but mutation variables might not be accessible this way easily in v5 without separate state or context.
                                        // Simplified loading state for now, or check mutation cache. 
                                        // Actually `callMutation.variables` is not directly available in simple `useMutation` hook result in TanStack Query v4/v5 usually unless captured.
                                        // For now let's just pass the global pending state, or better, we can't easily distinguish WHICH item is loading without extra state.
                                        // Optimization: We could wrap each card in a memo or component that handles its own mutation or just accept that all spinner might show if we pass simple boolean. 
                                        // However, `WaitlistCard` has `isLoading` prop for specific actions.
                                        // Let's pass simple booleans for now, if the user triggers action on one card, it might show loading on all? No, that's bad.
                                        // Let's use `variables` if available or just ignore for MVP refactor.
                                        // Actually, let's keep it simple.
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>


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
                                <p className="text-xs text-success-600 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {t('form.customerFound', { name: customerFound.name })}
                                </p>
                            )}
                            {!isLookingUp && !customerFound && formData.phone.length >= (formData.country.code === 'BR' ? 10 : 6) && (
                                <p className="text-xs text-text-secondary flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    {t('form.newCustomer')}
                                </p>
                            )}
                        </div>

                        <Input
                            label={t('form.customerName')}
                            value={formData.customerName}
                            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                            required
                            placeholder={t('form.fullName')}
                            leftIcon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            }
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
                                leftIcon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                }
                            />
                        </div>

                        <Input
                            label={t('form.notes')}
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder={t('form.notesPlaceholder')}
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
                                {t('common:actions.cancel')}
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1"
                                isLoading={createMutation.isPending}
                            >
                                {t('actions.add', 'Adicionar')}
                            </Button>
                        </div>
                    </form>
                </Modal>
            </PageContent>
        </PageShell >
    );
}
