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
            <div className="p-4 sm:p-6 flex items-center justify-between hover:bg-white/50 transition-colors group backdrop-blur-sm">
                <div className="flex items-center gap-4 sm:gap-6">
                    <span className="text-xs font-bold text-indigo-900/40 w-6 text-center">{index + 1}</span>
                    <div className="w-10 h-10 rounded-full bg-white border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs shadow-sm">
                        {initials}
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 font-display">
                            {entry.customerName} 
                            <span className="text-[10px] font-normal text-slate-400 ml-2">
                                {entry.customerPhone.slice(-4).padStart(entry.customerPhone.length, '*')}
                            </span>
                        </h4>
                        <span className="text-xs text-slate-500">
                            Mesa p/ {entry.partySize} • {entry.status === 'CALLED' ? 'Chamado' : 'Aguardando'}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-8">
                    <div className="hidden sm:block text-right">
                        <p className="text-[10px] font-bold text-indigo-900/40 uppercase tracking-wider">Espera</p>
                        <p className="text-sm font-semibold text-slate-900 font-display">{elapsedString}</p>
                    </div>
                    <OverflowMenu
                        onCancel={() => onCancel(entry.id)}
                        isLoading={isActionLoading.cancel}
                        t={t}
                    />
                </div>
            </div>
        );
    }

    // Highlight Variant - Neumorphic + Glass
    return (
        <div className="bg-white/70 backdrop-blur-2xl border border-white/50 rounded-[2rem] p-6 md:p-10 flex flex-col md:flex-row justify-between items-center shadow-[0_20px_50px_-12px_rgba(79,70,229,0.15)] relative overflow-hidden group transition-all transform hover:scale-[1.01] ring-1 ring-white/20">
            {/* Soft Ambient Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl"></div>
            
            {/* Status Badge - Neumorphic */}
            <div className="absolute top-0 right-0">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white bg-indigo-600 px-6 py-3 rounded-bl-3xl shadow-lg shadow-indigo-600/20 font-display">
                    Próximo da Fila
                </span>
            </div>

            <div className="flex items-center gap-8 w-full md:w-auto mb-8 md:mb-0 pl-2 z-10">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-indigo-600 text-white border-4 border-white/80 flex items-center justify-center text-2xl md:text-3xl font-bold shrink-0 shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4)]">
                    {initials}
                </div>
                <div>
                    <h3 className="text-xl md:text-3xl font-black text-slate-900 leading-tight font-display tracking-tight">
                        {entry.customerName} 
                        <span className="text-xs font-normal text-slate-400 ml-3">
                            {entry.customerPhone.slice(-4).padStart(entry.customerPhone.length, '*')}
                        </span>
                    </h3>
                    <div className="flex flex-wrap gap-6 mt-4">
                        <div className="flex items-center gap-2 text-slate-600 text-sm md:text-base font-semibold">
                            <Icon name="users" size="sm" className="text-indigo-600" />
                            {entry.partySize} Pessoas
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 text-sm md:text-base border-l border-indigo-100 pl-6 font-semibold">
                            <Icon name="waitTime" size="sm" className="text-indigo-600" />
                            Esperando há {elapsedString}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 w-full md:w-auto z-10">
                <Button
                    variant="outline"
                    onClick={() => onCall(entry.id)}
                    className="flex-1 md:flex-none h-14 px-8 border-2 border-indigo-200 bg-white/50 backdrop-blur-md hover:bg-indigo-50 hover:border-indigo-500 text-indigo-700 font-bold transition-all flex items-center justify-center gap-2 rounded-2xl"
                    isLoading={isActionLoading.call}
                >
                    <Icon name="notify" size="sm" />
                    Chamar
                </Button>
                <Button
                    variant="primary"
                    onClick={() => onSeat(entry.id)}
                    className="flex-1 md:flex-none h-14 px-10 bg-indigo-600 text-white rounded-2xl font-black shadow-[0_15px_30px_-5px_rgba(79,70,229,0.3)] hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 font-display uppercase tracking-widest text-xs"
                    isLoading={isActionLoading.seat}
                >
                    <Icon name="tableService" size="sm" />
                    Sentar
                </Button>
            </div>
        </div>
    );
}
