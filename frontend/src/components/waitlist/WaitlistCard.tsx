import { useMemo, useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui';
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
                        className="w-full px-4 py-2 text-left text-sm text-text-error hover:bg-bg-error/10 flex items-center gap-2 transition-colors"
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
    variant?: 'highlight' | 'row';
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
    variant = 'highlight',
    metrics,
    settings: _settings,
    currentTime,
    onCall,
    onSeat,
    onCancel,
    onNoShow: _onNoShow,
    isActionLoading = {},
}: WaitlistCardProps) {
    const { t } = useTranslation('waitlist');

    // Initials for Avatar
    const initials = entry.customerName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    // Metrics Calculation
    const { elapsedString } = useMemo(() => {
        const now = currentTime.getTime();
        const start = new Date(entry.createdAt).getTime();
        const elapsedSeconds = Math.max(0, (now - start) / 1000);

        const elapsedMinutes = Math.floor(elapsedSeconds / 60);
        const elapsedString = `${elapsedMinutes} min`;

        if (entry.status !== 'WAITING') {
            return { elapsedString, progress: 0, etaString: '', variant: 'default' };
        }

        const avgWaitSeconds = metrics?.averageWaitSeconds || 0;
        let progress = 0;
        let variant: 'success' | 'warning' | 'danger' = 'success';
        let etaString = '';

        if (avgWaitSeconds > 0) {
            progress = Math.min((elapsedSeconds / avgWaitSeconds) * 100, 100);
            const remainingSeconds = Math.max(0, avgWaitSeconds - elapsedSeconds);
            const remMin = Math.floor(remainingSeconds / 60);
            etaString = `${remMin} min`;
        }

        if (progress > 75) variant = 'warning';
        if (progress >= 100) variant = 'danger';

        return { elapsedString, progress, etaString, variant };
    }, [entry.createdAt, entry.status, metrics?.averageWaitSeconds, currentTime]);

    if (variant === 'row') {
        return (
            <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-slate-400 w-5">#{index + 1}</span>
                    <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                        {initials}
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">
                            {entry.customerName}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-medium">
                            {entry.customerPhone.slice(-4).padStart(entry.customerPhone.length, '*')}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className="bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Icon name="users" size={10} className="text-slate-500" />
                            <span className="text-[10px] font-bold text-slate-600">{entry.partySize}</span>
                        </div>
                        <div className="bg-slate-50 px-2 py-0.5 rounded-md flex items-center gap-1 border border-slate-100">
                            <Icon name="waitTime" size={10} className="text-slate-500" />
                            <span className="text-[10px] font-bold text-slate-600">{elapsedString}</span>
                        </div>
                    </div>
                    <OverflowMenu
                        onCancel={() => onCancel(entry.id)}
                        isLoading={isActionLoading.cancel}
                        t={t}
                    />
                </div>
            </div>
        );
    }    // Highlight Variant - Mobile Modernized
    return (
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm relative overflow-hidden flex flex-col gap-5">
            {/* Top Bar: Status + Position */}
            <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-1.5 text-indigo-600 font-bold text-[10px] uppercase tracking-wide">
                    <Icon name="star" size={12} fill="currentColor" />
                    Próximo da Fila
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    Posição #{index + 1}
                </div>
            </div>

            {/* Name + Info */}
            <div className="flex flex-col gap-3 z-10">
                <h3 className="text-2xl font-bold text-slate-900 leading-tight">
                    {entry.customerName}
                </h3>
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg flex items-center gap-1.5 text-xs font-bold">
                        <Icon name="users" size="xs" />
                        {entry.partySize} Pessoas
                    </div>
                    <div className="bg-red-50 text-red-600 px-3 py-1 rounded-lg flex items-center gap-1.5 text-xs font-bold">
                        <Icon name="waitTime" size="xs" />
                        {elapsedString}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 w-full z-10">
                <Button
                    variant="primary"
                    onClick={() => onCall(entry.id)}
                    className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
                    isLoading={isActionLoading.call}
                    leftIcon={<Icon name="notify" size="sm" />}
                >
                    Chamar
                </Button>
                <Button
                    variant="outline"
                    onClick={() => onSeat(entry.id)}
                    className="flex-1 h-12 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                    isLoading={isActionLoading.seat}
                    leftIcon={<Icon name="tableService" size="sm" />}
                >
                    Sentar
                </Button>
            </div>
        </div>
    );
}
