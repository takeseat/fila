import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Card, Button, Badge, Progress } from '../ui';
import { Icon } from '../../design-system/icons/Icon';

interface WaitlistEntry {
    id: string;
    customerName: string;
    customerPhone: string;
    partySize: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    calledAt?: string;
    notes?: string;
}

interface WaitlistCardProps {
    entry: WaitlistEntry;
    index: number;
    metrics?: {
        averageWaitSeconds: number;
        isFallbackUsed?: boolean;
    };
    settings?: {
        waitingAlertMinutes?: number;
        calledAlertMinutes?: number;
    };
    currentTime: Date;
    onCall: (id: string) => void;
    onSeat: (id: string) => void;
    onCancel: (id: string) => void;
    onNoShow: (id: string) => void;
    isActionLoading?: {
        call?: boolean;
        seat?: boolean;
        cancel?: boolean;
        noShow?: boolean;
    };
}

export function WaitlistCard({
    entry,
    index,
    metrics,
    settings,
    currentTime,
    onCall,
    onSeat,
    onCancel,
    onNoShow,
    isActionLoading = {},
}: WaitlistCardProps) {
    const { t } = useTranslation('waitlist');

    // Status Badge Logic
    const getStatusBadge = (status: string) => {
        const variants: Record<string, 'warning' | 'info' | 'success' | 'neutral' | 'danger'> = {
            WAITING: 'warning',
            CALLED: 'info',
            SEATED: 'success',
            CANCELLED: 'neutral',
            NO_SHOW: 'danger',
        };

        const labels: Record<string, string> = {
            WAITING: t('status.WAITING'),
            CALLED: t('status.CALLED'),
            SEATED: t('status.SEATED'),
            CANCELLED: t('status.CANCELLED'),
            NO_SHOW: t('status.NO_SHOW'),
        };

        return (
            <Badge variant={variants[status] || 'neutral'} size="md">
                {labels[status] || status}
            </Badge>
        );
    };

    // Metrics Calculation
    const { elapsedString, progress, etaString, variant: progressVariant } = useMemo(() => {
        const now = currentTime.getTime();
        const start = new Date(entry.createdAt).getTime();
        const elapsedSeconds = Math.max(0, (now - start) / 1000);

        // Elapsed time formatting (mm:ss)
        const elapsedMinutes = Math.floor(elapsedSeconds / 60);
        const elapsedRemSeconds = Math.floor(elapsedSeconds % 60);
        const elapsedString = `${elapsedMinutes.toString().padStart(2, '0')}:${elapsedRemSeconds.toString().padStart(2, '0')}`;

        // If not waiting, just return elapsed logic
        if (entry.status !== 'WAITING') {
            return { elapsedString, progress: 0, etaString: '', variant: 'default' };
        }

        const avgWaitSeconds = metrics?.averageWaitSeconds || 0;

        let progress = 0;
        let variant: 'success' | 'warning' | 'danger' = 'success';
        let etaString = '';
        let isOverdue = false;

        if (avgWaitSeconds > 0) {
            progress = Math.min((elapsedSeconds / avgWaitSeconds) * 100, 100);
            const remainingSeconds = Math.max(0, avgWaitSeconds - elapsedSeconds);

            if (remainingSeconds === 0) {
                isOverdue = true;
                etaString = t('entry.callingAnytime');
            } else {
                const remMin = Math.floor(remainingSeconds / 60);
                const remSec = Math.floor(remainingSeconds % 60);
                etaString = `~ ${remMin.toString().padStart(2, '0')}:${remSec.toString().padStart(2, '0')}`;
            }
        } else {
            etaString = t('entry.calculating');
        }

        if (progress > 75) variant = 'warning';
        if (progress >= 100 || isOverdue) variant = 'danger';

        return { elapsedString, progress, etaString, variant };
    }, [entry.createdAt, entry.status, metrics?.averageWaitSeconds, currentTime, t]);

    // Alert Status Logic
    const alertStatus = useMemo(() => {
        if (!settings) return null;
        const now = currentTime.getTime();

        if (entry.status === 'WAITING' && settings.waitingAlertMinutes) {
            const createdAt = new Date(entry.createdAt).getTime();
            const waitingMinutes = (now - createdAt) / 60000;
            if (waitingMinutes >= settings.waitingAlertMinutes) {
                return 'waiting';
            }
        }

        if (entry.status === 'CALLED' && settings.calledAlertMinutes && entry.calledAt) {
            const calledAt = new Date(entry.calledAt).getTime();
            const calledMinutes = (now - calledAt) / 60000;
            if (calledMinutes >= settings.calledAlertMinutes) {
                return 'called';
            }
        }

        return null;
    }, [entry.status, entry.createdAt, entry.calledAt, settings, currentTime]);

    // Styles based on alert status
    let cardBorderClass = '';
    let timerClass = 'text-text-primary';
    let badgeContent = null;

    if (alertStatus === 'waiting') {
        cardBorderClass = 'border-l-4 border-l-warning-500 bg-warning-50/10';
        timerClass = 'text-warning-700 font-bold';
        badgeContent = (
            <div className="absolute top-0 right-0 p-2 flex items-center gap-1">
                <span className="flex h-3 w-3 relative mr-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-warning-500"></span>
                </span>
                <span className="bg-warning-100 text-warning-700 text-xs px-2 py-0.5 rounded-full font-medium border border-warning-200">
                    <Icon name="warning" size="xs" className="mr-1 inline" />
                    {t('entry.delay')}
                </span>
            </div>
        );
    } else if (alertStatus === 'called') {
        cardBorderClass = 'border-l-4 border-l-danger-500 bg-danger-50/10';
        timerClass = 'text-danger-700 font-bold';
        badgeContent = (
            <div className="absolute top-0 right-0 p-2 flex items-center gap-1">
                <span className="flex h-3 w-3 relative mr-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-danger-500"></span>
                </span>
                <span className="bg-danger-100 text-danger-700 text-xs px-2 py-0.5 rounded-full font-medium border border-danger-200">
                    <Icon name="notify" size="xs" className="mr-1 inline" />
                    {t('entry.delaySeating')}
                </span>
            </div>
        );
    }

    return (
        <Card
            padding="md"
            className={`hover:shadow-xl transition-all duration-200 relative overflow-hidden ${cardBorderClass}`}
        >
            {badgeContent}

            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    {/* Position Badge */}
                    <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                        {index + 1}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-text-primary">
                            {entry.customerName}
                        </h3>
                        <p className="text-sm text-text-secondary flex items-center gap-2">
                            <Icon name="smartphone" size="sm" tone="secondary" />
                            {entry.customerPhone}
                        </p>
                    </div>
                </div>
                {getStatusBadge(entry.status)}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-bg-subtle rounded-lg p-3">
                    <p className="text-xs text-text-secondary mb-1">{t('entry.partySize')}</p>
                    <p className="text-lg font-semibold text-text-primary flex items-center gap-2">
                        <Icon name="users" size="sm" tone="secondary" />
                        {entry.partySize}
                    </p>
                </div>
                <div className="bg-bg-subtle rounded-lg p-3">
                    <p className="text-xs text-text-secondary mb-1">
                        {entry.status === 'CALLED' ? t('entry.calledSince') : t('entry.timeInQueue')}
                    </p>
                    <p className={`text-lg font-semibold flex items-center gap-2 ${timerClass}`}>
                        <Icon name="waitTime" size="sm" tone={alertStatus === 'waiting' ? 'warning' : alertStatus === 'called' ? 'error' : 'secondary'} />
                        <span>{elapsedString}</span>
                    </p>
                </div>
            </div>

            {/* Wait Time Progress (Only relevant if still WAITING) */}
            {entry.status === 'WAITING' && (
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-text-secondary">
                            {t('entry.eta', { time: etaString })}
                        </span>
                    </div>
                    <Progress value={progress} variant={progressVariant as any} size="md" />
                </div>
            )}

            {/* For CALLED status, show when they were called */}
            {entry.status === 'CALLED' && (
                <div className="mb-4">
                    <div className="p-3 bg-primary-50 rounded-lg border border-primary-100 flex items-center justify-between">
                        <span className="text-sm text-primary-700 font-medium">{t('entry.customerCalled')}</span>
                        <span className="text-xs text-primary-600">
                            {t('entry.at')} {format(new Date(entry.calledAt || entry.updatedAt), 'HH:mm')}
                        </span>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
                {entry.status === 'WAITING' && (
                    <>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onCall(entry.id)}
                            className="flex-1"
                            isLoading={isActionLoading.call}
                        >
                            <Icon name="notify" size="sm" className="mr-2" />
                            {t('actions.call')}
                        </Button>
                        <Button
                            size="sm"
                            variant="success"
                            onClick={() => onSeat(entry.id)}
                            className="flex-1"
                            isLoading={isActionLoading.seat}
                        >
                            <Icon name="check" size="sm" className="mr-2" />
                            {t('actions.seat')}
                        </Button>
                        <Button
                            size="sm"
                            variant="danger"
                            onClick={() => onCancel(entry.id)}
                            isLoading={isActionLoading.cancel}
                        >
                            <Icon name="close" size="sm" />
                        </Button>
                    </>
                )}
                {entry.status === 'CALLED' && (
                    <>
                        <Button
                            size="sm"
                            variant="success"
                            onClick={() => onSeat(entry.id)}
                            className="flex-1"
                            isLoading={isActionLoading.seat}
                        >
                            <Icon name="check" size="sm" className="mr-2" />
                            {t('actions.seat')}
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                                if (window.confirm('Deseja realmente marcar este cliente como faltoso?')) {
                                    onNoShow(entry.id);
                                }
                            }}
                            className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50"
                            isLoading={isActionLoading.noShow}
                        >
                            <Icon name="close" size="sm" className="mr-2" />
                            {t('actions.noShow')}
                        </Button>
                    </>
                )}
            </div>
        </Card>
    );
}
