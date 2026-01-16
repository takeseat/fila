import { useState } from 'react';

import { usePickupOrders, useChangePickupOrderStatus, useResendWhatsApp } from '../hooks/usePickupOrders';
import { PickupOrder } from '../services/pickupOrdersApi';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import CreatePickupOrderModal from '../components/pickup-orders/CreatePickupOrderModal';

const STATUS_COLORS = {
    CREATED: 'bg-blue-100 text-blue-800',
    READY_FOR_PICKUP: 'bg-green-100 text-green-800',
    PICKED_UP: 'bg-gray-100 text-gray-800',
    NOT_PICKED_UP: 'bg-red-100 text-red-800',
};

const STATUS_LABELS = {
    CREATED: 'Criado',
    READY_FOR_PICKUP: 'Pronto',
    PICKED_UP: 'Retirado',
    NOT_PICKED_UP: 'Não Retirado',
};

export default function PickupOrders() {
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);


    const { data, isLoading, refetch } = usePickupOrders({
        status: statusFilter || undefined,
        search: searchTerm || undefined,
    });

    const changeStatus = useChangePickupOrderStatus();
    const resendWhatsApp = useResendWhatsApp();

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        await changeStatus.mutateAsync({ id: orderId, status: newStatus });
        refetch();
    };

    const handleResendWhatsApp = async (orderId: string) => {
        await resendWhatsApp.mutateAsync(orderId);
    };

    const getAvailableActions = (order: PickupOrder) => {
        const actions: { label: string; status: string; color: string }[] = [];

        if (order.status === 'CREATED') {
            actions.push({ label: 'Marcar como Pronto', status: 'READY_FOR_PICKUP', color: 'green' });
        }

        if (order.status === 'READY_FOR_PICKUP') {
            actions.push({ label: 'Marcar como Retirado', status: 'PICKED_UP', color: 'gray' });
            actions.push({ label: 'Não Retirado', status: 'NOT_PICKED_UP', color: 'red' });
        }

        return actions;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Carregando...</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Pedidos (Retirada)</h1>
                <p className="text-gray-600 mt-1">Gerencie pedidos para retirada</p>
            </div>

            {/* Filters and Actions */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex flex-wrap gap-4">
                    {/* Search */}
                    <div className="flex-1 min-w-[200px]">
                        <input
                            type="text"
                            placeholder="Buscar por código ou nome..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border rounded-lg"
                    >
                        <option value="">Todos os status</option>
                        <option value="CREATED">Criado</option>
                        <option value="READY_FOR_PICKUP">Pronto</option>
                        <option value="PICKED_UP">Retirado</option>
                        <option value="NOT_PICKED_UP">Não Retirado</option>
                    </select>

                    {/* Create Button */}
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        + Novo Pedido
                    </button>
                </div>
            </div>

            {/* Orders List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <>
                    {/* Mobile View: Cards */}
                    <div className="md:hidden space-y-4 p-4 bg-gray-50">
                        {data?.data?.map((order) => (
                            <div key={order.id} className="bg-white p-4 rounded-lg shadow space-y-3 border border-gray-100">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-bold text-gray-900 text-lg">#{order.orderCode}</div>
                                        <div className="text-gray-500 text-xs">{format(new Date(order.createdAt), 'dd/MM HH:mm', { locale: ptBR })}</div>
                                    </div>
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[order.status]}`}
                                    >
                                        {STATUS_LABELS[order.status]}
                                    </span>
                                </div>

                                <div>
                                    <div className="font-medium text-gray-900">{order.customerName || 'Sem nome'}</div>
                                    <div className="text-gray-600 text-sm flex items-center gap-2">
                                        {order.customerPhoneE164}
                                        {order.whatsappOptIn && (
                                            <span className="text-green-600" title="WhatsApp Ativo">
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.16C10.58 20.16 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.05 20.16Z" />
                                                </svg>
                                            </span>
                                        )}
                                    </div>
                                    {order.notes && (
                                        <div className="mt-2 text-sm text-gray-500 bg-gray-50 p-2 rounded">
                                            {order.notes}
                                        </div>
                                    )}
                                </div>

                                <div className="pt-2 border-t border-gray-100 flex flex-wrap gap-2">
                                    {getAvailableActions(order).map((action) => (
                                        <button
                                            key={action.status}
                                            onClick={() => handleStatusChange(order.id, action.status)}
                                            disabled={changeStatus.isPending}
                                            className={`flex-1 min-w-[120px] px-3 py-2 text-xs font-medium rounded border border-${action.color}-200 bg-${action.color}-50 text-${action.color}-700 hover:bg-${action.color}-100 disabled:opacity-50 text-center transition-colors`}
                                        >
                                            {action.label}
                                        </button>
                                    ))}

                                    {order.whatsappOptIn && order.status === 'READY_FOR_PICKUP' && (
                                        <button
                                            onClick={() => handleResendWhatsApp(order.id)}
                                            disabled={resendWhatsApp.isPending}
                                            className="px-3 py-2 text-xs font-medium rounded border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-50 transition-colors"
                                            title="Reenviar WhatsApp"
                                        >
                                            📱 Reenviar
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop View: Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Código
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Cliente
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Telefone
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Criado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {data?.data?.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{order.orderCode}</div>
                                            {order.notes && (
                                                <div className="text-xs text-gray-500 mt-1">{order.notes}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {order.customerName || 'Sem nome'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600">{order.customerPhoneE164}</div>
                                            {order.whatsappOptIn && (
                                                <span className="text-xs text-green-600">✓ WhatsApp</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[order.status]
                                                    }`}
                                            >
                                                {STATUS_LABELS[order.status]}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {format(new Date(order.createdAt), 'dd/MM HH:mm', { locale: ptBR })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {/* Status Actions */}
                                                {getAvailableActions(order).map((action) => (
                                                    <button
                                                        key={action.status}
                                                        onClick={() => handleStatusChange(order.id, action.status)}
                                                        disabled={changeStatus.isPending}
                                                        className={`px-3 py-1 text-xs rounded bg-${action.color}-100 text-${action.color}-700 hover:bg-${action.color}-200 disabled:opacity-50`}
                                                    >
                                                        {action.label}
                                                    </button>
                                                ))}

                                                {/* Resend WhatsApp */}
                                                {order.whatsappOptIn && order.status === 'READY_FOR_PICKUP' && (
                                                    <button
                                                        onClick={() => handleResendWhatsApp(order.id)}
                                                        disabled={resendWhatsApp.isPending}
                                                        className="px-3 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50"
                                                        title="Reenviar WhatsApp"
                                                    >
                                                        📱
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>

                {/* Pagination */}
                {data && data.pagination.totalPages > 1 && (
                    <div className="px-6 py-4 border-t flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Mostrando {data.data.length} de {data.pagination.total} pedidos
                        </div>
                        <div className="text-sm text-gray-600">
                            Página {data.pagination.page} de {data.pagination.totalPages}
                        </div>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <CreatePickupOrderModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        setShowCreateModal(false);
                        refetch();
                    }}
                />
            )}
        </div>
    );
}
