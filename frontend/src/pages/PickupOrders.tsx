import { useState, useMemo } from 'react';

import { usePickupOrders, useChangePickupOrderStatus, useResendWhatsApp } from '../hooks/usePickupOrders';
import { Button, Input, EmptyState } from '../components/ui';

import CreatePickupOrderModal from '../components/pickup-orders/CreatePickupOrderModal';
import { PageShell, PageContent } from '../components/mobile/PageShell';
import { MobilePageHeader } from '../components/mobile/MobilePageHeader';
import { KPICard } from '../components/pickup-orders/KPICard';
import { OrderCard } from '../components/pickup-orders/OrderCard';
import { FilterChips } from '../components/pickup-orders/FilterChips';
import { Icon } from '../design-system/icons/Icon';

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
                        <Icon name="add" size="sm" />
                        Adicionar
                    </Button>
                }
            />

            <PageContent className="p-4 space-y-6">
                {/* Desktop Header */}
                <div className="hidden lg:flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary mb-2">Pedidos para Retirada</h1>
                        <p className="text-text-secondary">Chame clientes e finalize retiradas</p>
                    </div>
                    <Button onClick={() => setShowCreateModal(true)} size="lg" className="gap-2">
                        <Icon name="add" size="sm" />
                        Novo Pedido
                    </Button>
                </div>

                {/* KPI Cards */}
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 md:grid md:grid-cols-3">
                    <KPICard
                        icon={
                            <Icon name="layers" className="w-4 h-4 md:w-6 md:h-6 text-warning-600" />
                        }
                        value={metrics.ready}
                        label="Prontos"
                        iconVariant="warning"
                    />
                    <KPICard
                        icon={
                            <Icon name="waitTime" className="w-4 h-4 md:w-6 md:h-6 text-primary-600" />
                        }
                        value={`${metrics.avgWait} min`}
                        label="Tempo médio"
                        iconVariant="primary"
                    />
                    <KPICard
                        icon={
                            <Icon name="notify" className="w-4 h-4 md:w-6 md:h-6 text-success-600" />
                        }
                        value={metrics.called}
                        label="Chamados"
                        iconVariant="success"
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
                            <Icon name="search" size="sm" />
                        }
                    />
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="bg-bg-surface border border-border-default rounded-card shadow-card">
                        <EmptyState
                            icon={
                                <Icon name="layers" className="w-full h-full text-text-secondary" />
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
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        setShowCreateModal(false);
                        refetch();
                    }}
                />
            )}
        </PageShell>
    );
}
