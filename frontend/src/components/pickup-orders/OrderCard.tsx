import { Button, Progress, Badge, Card } from '../ui';
import { Icon } from '../../design-system/icons/Icon';

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

    // Status badge configuration
    const getStatusBadge = (status: typeof order.status) => {
        const statusConfig = {
            CREATED: { label: 'Criado', variant: 'neutral' as const },
            READY_FOR_PICKUP: { label: 'Pronto', variant: 'warning' as const },
            PICKED_UP: { label: 'Retirado', variant: 'success' as const },
            NOT_PICKED_UP: { label: 'Não Retirou', variant: 'danger' as const },
        };
        const config = statusConfig[status];
        return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
    };

    // Determine card border based on urgency (only if not completed)
    let borderClass = '';
    let timerClass = 'text-text-primary';
    const isCompleted = order.status === 'PICKED_UP' || order.status === 'NOT_PICKED_UP';

    if (!isCompleted && minutesWaiting > 30) {
        borderClass = 'border-l-4 border-l-status-danger-bg bg-status-danger-bg/5';
        timerClass = 'text-status-danger-fg font-bold';
    } else if (!isCompleted && minutesWaiting > 15) {
        borderClass = 'border-l-4 border-l-status-warning-bg bg-status-warning-bg/5';
        timerClass = 'text-status-warning-fg font-bold';
    }

    // Map timer class to tone
    const getTimerTone = () => {
        if (!isCompleted && minutesWaiting > 30) return 'error';
        if (!isCompleted && minutesWaiting > 15) return 'warning';
        return 'primary';
    };

    return (
        <Card padding="md" className={`hover:shadow-xl transition-all duration-200 relative overflow-hidden ${borderClass}`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    {/* Order Code Badge */}
                    <div className="w-10 h-10 bg-action-primary-bg rounded-control flex items-center justify-center text-white font-bold shadow-md">
                        #{order.orderCode.slice(-2)}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-text-primary">
                            {order.customerName}
                        </h3>
                        <p className="text-sm text-text-secondary flex items-center gap-2">
                            <Icon name="smartphone" size="sm" tone="secondary" />
                            {order.customerPhone}
                        </p>
                    </div>
                </div>
                {getStatusBadge(order.status)}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-bg-subtle rounded-control p-3">
                    <p className="text-xs text-text-secondary mb-1">Código</p>
                    <p className="text-lg font-semibold text-text-primary flex items-center gap-2">
                        <Icon name="hash" size="sm" tone="secondary" />
                        {order.orderCode}
                    </p>
                </div>

                {/* Only show time if not completed */}
                {!isCompleted && (
                    <div className="bg-bg-subtle rounded-control p-3">
                        <p className="text-xs text-text-secondary mb-1">Tempo aguardando</p>
                        <p className={`text-lg font-semibold flex items-center gap-2 ${timerClass}`}>
                            <Icon name="waitTime" size="sm" tone={getTimerTone()} />
                            <span>{minutesWaiting} min</span>
                        </p>
                    </div>
                )}
            </div>

            {/* Progress Bar (Only if not completed) */}
            {!isCompleted && (
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-text-secondary">
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
                            <Icon name="check" size="sm" className="mr-2" />
                            Marcar Pronto
                        </Button>
                        <Button
                            onClick={onCall}
                            isLoading={isLoading}
                            variant="secondary"
                            size="sm"
                            className="px-2"
                        >
                            <Icon name="notify" size="sm" />
                        </Button>
                    </>
                )}

                {/* READY_FOR_PICKUP: Chamar Novamente, Entregar, Não Retirou */}
                {order.status === 'READY_FOR_PICKUP' && (
                    <>
                        <Button
                            onClick={onCall}
                            isLoading={isLoading}
                            variant="secondary"
                            size="sm"
                        >
                            <Icon name="notify" size="sm" className={order.whatsappSent ? 'mr-2' : ''} />
                            {order.whatsappSent ? 'Chamar Novamente' : 'Chamar'}
                        </Button>
                        <Button
                            onClick={onPickedUp}
                            isLoading={isLoading}
                            variant="primary"
                            className="flex-1"
                            size="sm"
                        >
                            <Icon name="check" size="sm" className="mr-2" />
                            Entregar
                        </Button>
                        <Button
                            onClick={() => {
                                if (window.confirm('Deseja realmente marcar este pedido como não retirado?')) {
                                    onNotPickedUp?.();
                                }
                            }}
                            isLoading={isLoading}
                            variant="ghost"
                            size="sm"
                        >
                            <Icon name="close" size="sm" />
                        </Button>
                    </>
                )}
            </div>
        </Card>
    );
}
