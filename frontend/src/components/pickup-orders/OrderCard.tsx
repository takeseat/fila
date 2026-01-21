import { Button, Progress } from '../ui';

interface OrderCardProps {
    order: {
        id: string;
        orderCode: string;
        customerName: string;
        customerPhone: string;
        status: 'CREATED' | 'READY_FOR_PICKUP' | 'PICKED_UP' | 'NOT_PICKED_UP';
        createdAt: string;
        whatsappSent: boolean;
    };
    onMarkReady: () => void;
    onCall: () => void;
    onPickedUp: () => void;
    onNotPickedUp: () => void;
    isLoading?: boolean;
}

export function OrderCard({ order, onMarkReady, onCall, onPickedUp, onNotPickedUp, isLoading }: OrderCardProps) {
    // Calculate time waiting
    const createdAt = new Date(order.createdAt);
    const now = new Date();
    const minutesWaiting = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60));

    // Determine progress bar color based on time
    let progressVariant: 'success' | 'warning' | 'danger' = 'success';
    let progressValue = Math.min((minutesWaiting / 30) * 100, 100);

    if (minutesWaiting > 30) {
        progressVariant = 'danger';
    } else if (minutesWaiting > 15) {
        progressVariant = 'warning';
    }

    // Status badge styling
    const getStatusBadge = (status: typeof order.status) => {
        const statusConfig = {
            CREATED: { label: 'Criado', color: 'bg-gray-100 text-gray-700' },
            READY_FOR_PICKUP: { label: 'Pronto', color: 'bg-warning-100 text-warning-700' },
            PICKED_UP: { label: 'Retirado', color: 'bg-success-100 text-success-700' },
            NOT_PICKED_UP: { label: 'Não Retirou', color: 'bg-danger-100 text-danger-700' },
        };
        const config = statusConfig[status];
        return (
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
                {config.label}
            </div>
        );
    };

    // Determine card border based on urgency (only if not completed)
    let borderClass = '';
    let timerClass = 'text-dark-900';
    const isCompleted = order.status === 'PICKED_UP' || order.status === 'NOT_PICKED_UP';

    if (!isCompleted && minutesWaiting > 30) {
        borderClass = 'border-l-4 border-l-danger-500 bg-danger-50/10';
        timerClass = 'text-danger-700 font-bold';
    } else if (!isCompleted && minutesWaiting > 15) {
        borderClass = 'border-l-4 border-l-warning-500 bg-warning-50/10';
        timerClass = 'text-warning-700 font-bold';
    }

    return (
        <div className={`card-premium p-6 hover:shadow-xl transition-all duration-200 relative overflow-hidden ${borderClass}`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    {/* Order Code Badge */}
                    <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                        #{order.orderCode.slice(-2)}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-dark-900">
                            {order.customerName}
                        </h3>
                        <p className="text-sm text-dark-500 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {order.customerPhone}
                        </p>
                    </div>
                </div>
                {getStatusBadge(order.status)}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-light-50 rounded-lg p-3">
                    <p className="text-xs text-dark-500 mb-1">Código</p>
                    <p className="text-lg font-semibold text-dark-900 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                        {order.orderCode}
                    </p>
                </div>

                {/* Only show time if not completed */}
                {!isCompleted && (
                    <div className="bg-light-50 rounded-lg p-3">
                        <p className="text-xs text-dark-500 mb-1">Tempo aguardando</p>
                        <p className={`text-lg font-semibold flex items-center gap-2 ${timerClass}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{minutesWaiting} min</span>
                        </p>
                    </div>
                )}
            </div>

            {/* Progress Bar (Only if not completed) */}
            {!isCompleted && (
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-dark-600">
                            {order.status === 'READY_FOR_PICKUP'
                                ? 'Pronto para retirada'
                                : 'Em preparo'}
                        </span>
                    </div>
                    <Progress value={progressValue} variant={progressVariant} size="md" />
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
                {/* CREATED: Marcar como Pronto OU Chamar */}
                {order.status === 'CREATED' && (
                    <>
                        <Button
                            onClick={onMarkReady}
                            isLoading={isLoading}
                            className="flex-1"
                            size="sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Marcar Pronto
                        </Button>
                        <Button
                            onClick={onCall}
                            isLoading={isLoading}
                            variant="outline"
                            size="sm"
                            className="px-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </Button>
                    </>
                )}

                {/* READY_FOR_PICKUP: Chamar Novamente, Entregar, Não Retirou */}
                {order.status === 'READY_FOR_PICKUP' && (
                    <>
                        <Button
                            onClick={onCall}
                            isLoading={isLoading}
                            variant="outline"
                            size="sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            {order.whatsappSent ? 'Chamar Novamente' : 'Chamar'}
                        </Button>
                        <Button
                            onClick={onPickedUp}
                            isLoading={isLoading}
                            variant="success"
                            className="flex-1"
                            size="sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Entregar
                        </Button>
                        <Button
                            onClick={() => {
                                if (window.confirm('Deseja realmente marcar este pedido como não retirado?')) {
                                    onNotPickedUp?.();
                                }
                            }}
                            isLoading={isLoading}
                            variant="outline"
                            className="border-gray-300 text-gray-600 hover:bg-gray-50"
                            size="sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
