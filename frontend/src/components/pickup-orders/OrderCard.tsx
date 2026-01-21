import { Button, Progress } from '../ui';

interface OrderCardProps {
    order: {
        id: string;
        orderCode: string;
        customerName: string;
        customerPhone: string;
        status: 'PENDING' | 'READY' | 'CALLED' | 'PICKED_UP';
        createdAt: string;
        whatsappSent: boolean;
    };
    onCall: () => void;
    onComplete: () => void;
    isLoading?: boolean;
}

export function OrderCard({ order, onCall, onComplete, isLoading }: OrderCardProps) {
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
            PENDING: { label: 'Pendente', color: 'bg-gray-100 text-gray-700' },
            READY: { label: 'Pronto', color: 'bg-warning-100 text-warning-700' },
            CALLED: { label: 'Chamado', color: 'bg-primary-100 text-primary-700' },
            PICKED_UP: { label: 'Retirado', color: 'bg-success-100 text-success-700' },
        };
        const config = statusConfig[status];
        return (
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
                {config.label}
            </div>
        );
    };

    // Determine card border based on urgency (only if not picked up)
    let borderClass = '';
    let timerClass = 'text-dark-900';

    if (order.status !== 'PICKED_UP' && minutesWaiting > 30) {
        borderClass = 'border-l-4 border-l-danger-500 bg-danger-50/10';
        timerClass = 'text-danger-700 font-bold';
    } else if (order.status !== 'PICKED_UP' && minutesWaiting > 15) {
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

                {/* Only show time if not picked up */}
                {order.status !== 'PICKED_UP' && (
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

                {/* Show WhatsApp status if picked up */}
                {order.status === 'PICKED_UP' && (
                    <div className="bg-light-50 rounded-lg p-3">
                        <p className="text-xs text-dark-500 mb-1">WhatsApp</p>
                        <p className="text-lg font-semibold flex items-center gap-2 text-dark-900">
                            {order.whatsappSent ? (
                                <>
                                    <svg className="w-4 h-4 text-success-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                    </svg>
                                    Enviado
                                </>
                            ) : (
                                <>-</>
                            )}
                        </p>
                    </div>
                )}
            </div>

            {/* Progress Bar (Only if not picked up) */}
            {order.status !== 'PICKED_UP' && (
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-dark-600">
                            {order.status === 'READY'
                                ? 'Pronto para retirada'
                                : order.status === 'CALLED'
                                    ? 'Cliente chamado'
                                    : 'Em preparo'}
                        </span>
                    </div>
                    <Progress value={progressValue} variant={progressVariant} size="md" />
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
                {order.status === 'READY' && (
                    <Button
                        onClick={onCall}
                        isLoading={isLoading}
                        variant="outline"
                        className="flex-1"
                        size="sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        Chamar
                    </Button>
                )}

                {order.status === 'CALLED' && (
                    <Button
                        onClick={onComplete}
                        isLoading={isLoading}
                        variant="success"
                        className="flex-1"
                        size="sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Confirmar Retirada
                    </Button>
                )}
            </div>
        </div>
    );
}
