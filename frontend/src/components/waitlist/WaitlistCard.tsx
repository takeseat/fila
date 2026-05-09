import { useMemo, useState, useRef, useEffect } from 'react';
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

// Overflow Menu Component for secondary/destructive actions
interface OverflowMenuProps {
    onCancel: () => void;
    cancelLabel?: string;
    isLoading?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    t: any;
}

function OverflowMenu({ onCancel, cancelLabel, isLoading, t }: OverflowMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCancel = () => {
        if (window.confirm(t('actions.cancelConfirm', 'Deseja realmente cancelar este atendimento?'))) {
            onCancel();
        }
        setIsOpen(false);
    };

    return (
        <div ref={menuRef} className="relative">
            <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsOpen(!isOpen)}
                className="px-2"
                disabled={isLoading}
            >
                <Icon name="more" size="sm" />
            </Button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-1 bg-bg-surface border border-border-subtle rounded-lg shadow-md z-[1000] min-w-[160px] py-1">
                    <button
                        onClick={handleCancel}
                        className="w-full px-4 py-2 text-left text-sm text-danger-600 hover:bg-danger-50 flex items-center gap-2 transition-colors"
                    >
                        <Icon name="close" size="sm" tone="error" />
                        {cancelLabel || t('actions.cancel')}
                    </button>
                </div>
            )}
        </div>
    );
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
            padding="none"
            className={`group hover:shadow-lg transition-all duration-300 relative border-border-subtle hover:border-primary-200 overflow-hidden rounded-2xl bg-bg-surface ${cardBorderClass}`}
        >
            {badgeContent}

            <div className="p-5 flex flex-col gap-4">
                {/* Header Section */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        {/* Position Avatar - Minimalist */}
                        <div className="w-10 h-10 rounded-full bg-bg-subtle flex items-center justify-center text-text-secondary font-bold text-sm border border-border-subtle group-hover:bg-primary-50 group-hover:text-primary-600 group-hover:border-primary-100 transition-colors">
                            {index + 1}
                        </div>
                        <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold text-text-primary tracking-tight">
                                    {entry.customerName}
                                </h3>
                                {index === 0 && entry.status === 'WAITING' && (
                                    <span className="px-2 py-0.5 bg-primary-50 text-primary-600 text-[10px] font-bold uppercase tracking-wider rounded-full border border-primary-100">
                                        Próximo
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-3 text-sm font-medium text-text-muted">
                                <span className="flex items-center gap-1.5">
                                    <Icon name="users" size="xs" className="opacity-70" />
                                    {entry.partySize} {t('entry.partySize')}
                                </span>
                                <span className="w-1 h-1 bg-border-default rounded-full" />
                                <span className={`flex items-center gap-1.5 ${timerClass} font-medium`}>
                                    <Icon name="waitTime" size="xs" className="opacity-70" />
                                    {elapsedString}
                                </span>
                            </div>
                        </div>
                    </div>
                    {getStatusBadge(entry.status)}
                </div>

                {/* Progress Bar - Discrete */}
                {entry.status === 'WAITING' && (
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center px-0.5">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary">
                                {t('entry.eta', { time: etaString })}
                            </span>
                            <span className="text-[10px] font-bold text-text-tertiary">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} variant={progressVariant as any} size="sm" className="bg-bg-subtle" />
                    </div>
                )}

                {/* Called Info - Clean */}
                {entry.status === 'CALLED' && (
                    <div className="flex items-center justify-between px-3 py-2 bg-indigo-50/50 rounded-lg border border-indigo-100/50">
                        <span className="text-xs text-indigo-700 font-medium">{t('entry.customerCalled')}</span>
                        <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">
                            {format(new Date(entry.calledAt || entry.updatedAt), 'HH:mm')}
                        </span>
                    </div>
                )}

                {/* Actions Footer */}
                <div className="flex gap-2 items-center pt-2">
                    {entry.status === 'WAITING' && (
                        <>
                            <Button
                                size="md"
                                variant="primary"
                                onClick={() => onCall(entry.id)}
                                className="flex-[2] rounded-xl shadow-sm hover:shadow-md transition-all font-semibold text-sm"
                                isLoading={isActionLoading.call}
                            >
                                <Icon name="notify" size="sm" className="mr-2" />
                                {t('actions.call')}
                            </Button>
                            <Button
                                size="md"
                                variant="outline"
                                onClick={() => onSeat(entry.id)}
                                className="flex-1 rounded-xl border-border-default text-text-secondary hover:bg-bg-subtle hover:text-text-primary transition-all font-medium text-sm"
                                isLoading={isActionLoading.seat}
                            >
                                {t('actions.seat')}
                            </Button>
                            <OverflowMenu
                                onCancel={() => onCancel(entry.id)}
                                isLoading={isActionLoading.cancel}
                                t={t}
                            />
                        </>
                    )}
                    {entry.status === 'CALLED' && (
                        <>
                            <Button
                                size="md"
                                variant="primary"
                                onClick={() => onSeat(entry.id)}
                                className="flex-[3] rounded-xl shadow-sm hover:shadow-md transition-all font-semibold text-sm"
                                isLoading={isActionLoading.seat}
                            >
                                <Icon name="check" size="sm" className="mr-2" />
                                {t('actions.seat')}
                            </Button>
                            <OverflowMenu
                                onCancel={() => {
                                    if (window.confirm(t('actions.noShowConfirm', 'Deseja realmente marcar este cliente como faltoso?'))) {
                                        onNoShow(entry.id);
                                    }
                                }}
                                cancelLabel={t('actions.noShow')}
                                isLoading={isActionLoading.noShow}
                                t={t}
                            />
                        </>
                    )}
                </div>
            </div>
        </Card>
    );
}
