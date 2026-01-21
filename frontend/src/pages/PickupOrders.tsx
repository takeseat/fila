import { useState, useMemo } from 'react';

import { usePickupOrders, useChangePickupOrderStatus, useResendWhatsApp } from '../hooks/usePickupOrders';
import { Button, Input, EmptyState } from '../components/ui';

import CreatePickupOrderModal from '../components/pickup-orders/CreatePickupOrderModal';
import { PageShell, PageContent } from '../components/mobile/PageShell';
import { MobilePageHeader } from '../components/mobile/MobilePageHeader';
import { KPICard } from '../components/pickup-orders/KPICard';
import { OrderCard } from '../components/pickup-orders/OrderCard';
import { FilterChips } from '../components/pickup-orders/FilterChips';

export default function PickupOrders() {
    const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'called' | 'completed'>('pending');
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);

    const { data, isLoading, refetch } = usePickupOrders({});
    const changeStatus = useChangePickupOrderStatus();
    const resendWhatsApp = useResendWhatsApp();

    // Calculate metrics
    const metrics = useMemo(() => {
        const orders = data?.data || [];
        const ready = orders.filter(o => o.status === 'READY_FOR_PICKUP').length;
        const called = orders.filter(o => o.status === 'READY_FOR_PICKUP' && o.lastWhatsAppNotifiedAt).length;

        // Calculate average wait time for ready orders
        const readyOrders = orders.filter(o => o.status === 'READY_FOR_PICKUP');
        const avgWait = readyOrders.length > 0
            ? Math.floor(readyOrders.reduce((sum, o) => {
                const mins = Math.floor((new Date().getTime() - new Date(o.createdAt).getTime()) / (1000 * 60));
                return sum + mins;
            }, 0) / readyOrders.length)
            : 0;

        return { ready, called, avgWait };
    }, [data]);

    // Filter and sort orders
    const filteredOrders = useMemo(() => {
        let orders = data?.data || [];

        // Apply status filter
        if (activeFilter === 'pending') {
            orders = orders.filter(o => o.status === 'CREATED' || o.status === 'READY_FOR_PICKUP');
        } else if (activeFilter === 'called') {
            orders = orders.filter(o => o.status === 'READY_FOR_PICKUP');
        } else if (activeFilter === 'completed') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            orders = orders.filter(o => {
                const orderDate = new Date(o.createdAt);
                return o.status === 'PICKED_UP' && orderDate >= today;
            });
        }

        // Apply search
        if (searchTerm.trim()) {
            orders = orders.filter(o =>
                o.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort by urgency
        return orders.sort((a, b) => {
            // Late orders first (>30min and ready)
            const aLate = a.status === 'READY_FOR_PICKUP' &&
                Math.floor((new Date().getTime() - new Date(a.createdAt).getTime()) / (1000 * 60)) > 30;
            const bLate = b.status === 'READY_FOR_PICKUP' &&
                Math.floor((new Date().getTime() - new Date(b.createdAt).getTime()) / (1000 * 60)) > 30;

            if (aLate && !bLate) return -1;
            if (!aLate && bLate) return 1;

            // Then by status priority
            const statusPriority = {
                'READY_FOR_PICKUP': 1,
                'CREATED': 2,
                'PICKED_UP': 3,
                'NOT_PICKED_UP': 4,
            };
            return (statusPriority[a.status] || 99) - (statusPriority[b.status] || 99);
        });
    }, [data, activeFilter, searchTerm]);

    const handleMarkReady = async (orderId: string) => {
        await changeStatus.mutateAsync({ id: orderId, status: 'READY_FOR_PICKUP' });
        refetch();
    };

    const handleCall = async (orderId: string) => {
        await resendWhatsApp.mutateAsync(orderId);
        refetch();
    };

    const handlePickedUp = async (orderId: string) => {
        await changeStatus.mutateAsync({ id: orderId, status: 'PICKED_UP' });
        refetch();
    };

    const handleNotPickedUp = async (orderId: string) => {
        await changeStatus.mutateAsync({ id: orderId, status: 'NOT_PICKED_UP' });
        refetch();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Carregando...</div>
            </div>
        );
    }

    return (
        <PageShell>
            <MobilePageHeader
                title="Pedidos para Retirada"
                subtitle="Chame clientes e finalize retiradas"
                actions={
                    <Button onClick={() => setShowCreateModal(true)} size="sm" className="gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Adicionar
                    </Button>
                }
            />

            <PageContent className="p-4 space-y-6">
                {/* Desktop Header */}
                <div className="hidden lg:flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-dark-900 mb-2">Pedidos para Retirada</h1>
                        <p className="text-dark-500">Chame clientes e finalize retiradas</p>
                    </div>
                    <Button onClick={() => setShowCreateModal(true)} size="lg" className="gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Novo Pedido
                    </Button>
                </div>

                {/* KPI Cards */}
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 md:grid md:grid-cols-3">
                    <KPICard
                        icon={
                            <svg className="w-4 h-4 md:w-6 md:h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        }
                        value={metrics.ready}
                        label="Prontos"
                        iconBgColor="bg-warning-100"
                    />
                    <KPICard
                        icon={
                            <svg className="w-4 h-4 md:w-6 md:h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                        value={`${metrics.avgWait} min`}
                        label="Tempo médio"
                        iconBgColor="bg-primary-100"
                    />
                    <KPICard
                        icon={
                            <svg className="w-4 h-4 md:w-6 md:h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        }
                        value={metrics.called}
                        label="Chamados"
                        iconBgColor="bg-success-100"
                    />
                </div>

                {/* Filters */}
                <div className="space-y-3">
                    <FilterChips
                        activeFilter={activeFilter}
                        onFilterChange={setActiveFilter}
                    />
                    <Input
                        placeholder="Buscar por código ou nome..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        leftIcon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        }
                    />
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="card-premium">
                        <EmptyState
                            icon={
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            }
                            title="Nenhum pedido encontrado"
                            description={searchTerm || activeFilter !== 'all'
                                ? "Tente ajustar os filtros para ver mais resultados"
                                : "Crie seu primeiro pedido para começar"
                            }
                            action={
                                (searchTerm || activeFilter !== 'all') ? (
                                    <Button onClick={() => { setSearchTerm(''); setActiveFilter('all'); }} variant="outline">
                                        Limpar Filtros
                                    </Button>
                                ) : (
                                    <Button onClick={() => setShowCreateModal(true)}>
                                        Novo Pedido
                                    </Button>
                                )
                            }
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {filteredOrders.map((order) => (
                            <OrderCard
                                key={order.id}
                                order={{
                                    id: order.id,
                                    orderCode: order.orderCode,
                                    customerName: order.customerName || 'Cliente',
                                    customerPhone: order.customerPhoneE164,
                                    status: order.status,
                                    createdAt: order.createdAt,
                                    whatsappSent: !!order.lastWhatsAppNotifiedAt,
                                }}
                                onMarkReady={() => handleMarkReady(order.id)}
                                onCall={() => handleCall(order.id)}
                                onPickedUp={() => handlePickedUp(order.id)}
                                onNotPickedUp={() => handleNotPickedUp(order.id)}
                                isLoading={changeStatus.isPending || resendWhatsApp.isPending}
                            />
                        ))}
                    </div>
                )}
            </PageContent>

            {showCreateModal && (
                <CreatePickupOrderModal
                    onClose={() => setShowCreateModal(true)}
                    onSuccess={() => {
                        setShowCreateModal(false);
                        refetch();
                    }}
                />
            )}
        </PageShell>
    );
}
