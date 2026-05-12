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
    isPriority: boolean;
}

interface OverflowMenuProps {
    onCall: () => void;
    onSeat: () => void;
    onCancel: () => void;
    onTogglePriority: () => void;
    isPriority: boolean;
    cancelLabel?: string;
    isLoading?: {
        call?: boolean;
        seat?: boolean;
        cancel?: boolean;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    t: any;
}

function OverflowMenu({ onCall, onSeat, onCancel, onTogglePriority, isPriority, cancelLabel, isLoading, t }: OverflowMenuProps) {
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

    const handleCall = () => {
        onCall();
        setIsOpen(false);
    };

    const handleSeat = () => {
        onSeat();
        setIsOpen(false);
    };

    const handleTogglePriority = () => {
        onTogglePriority();
        setIsOpen(false);
    };

    return (
        <div ref={menuRef} className="relative">
            <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsOpen(!isOpen)}
                className="px-2"
                disabled={isLoading?.call || isLoading?.seat || isLoading?.cancel}
            >
                <Icon name="more" size="sm" />
            </Button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-1 bg-bg-surface border border-border-subtle rounded-lg shadow-md z-[1000] min-w-[160px] py-1">
                    <button
                        onClick={handleCall}
                        disabled={isLoading?.call}
                        className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                        <Icon name="notify" size="sm" tone="brand" />
                        {t('actions.call', 'Chamar')}
                    </button>
                    <button
                        onClick={handleSeat}
                        disabled={isLoading?.seat}
                        className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                        <Icon name="tableService" size="sm" tone="success" />
                        {t('actions.seat', 'Sentar')}
                    </button>
                    <button
                        onClick={handleTogglePriority}
                        className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                    >
                        <Icon name="priority" size="sm" tone={isPriority ? "secondary" : "brand"} />
                        {isPriority ? t('actions.removePriority', 'Remover Prioridade') : t('actions.setPriority', 'Prioridade')}
                    </button>
                    <div className="border-t border-slate-100 my-1" />
                    <button
                        onClick={handleCancel}
                        disabled={isLoading?.cancel}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                        <Icon name="close" size="sm" tone="error" />
                        {cancelLabel || t('actions.cancel', 'Cancelar')}
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
    onTogglePriority: (id: string) => void;
    isActionLoading?: {
        call?: boolean;
        seat?: boolean;
        cancel?: boolean;
        noShow?: boolean;
        priority?: boolean;
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
            <div className="p-4 md:p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-4 md:gap-8">
                    <span className="text-[10px] md:text-xs font-bold text-slate-400 w-5 md:w-8 text-center">#{index + 1}</span>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs md:text-sm">
                        {initials}
                    </div>
                    <div>
                        <h4 className="text-sm md:text-base font-bold text-slate-900 leading-tight">
                            {entry.customerName}
                            {entry.isPriority && (
                                <span className="inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                                    <Icon name="priority" size={10} tone="inherit" />
                                    Prioritário
                                </span>
                            )}
                            <span className="hidden md:inline text-xs font-normal text-slate-400 ml-3">
                                {entry.customerPhone.slice(-4).padStart(entry.customerPhone.length, '*')}
                            </span>
                        </h4>
                        <p className="text-[10px] md:text-xs text-slate-400 font-medium md:mt-1">
                            <span className="md:hidden">{entry.customerPhone.slice(-4).padStart(entry.customerPhone.length, '*')}</span>
                            <span className="hidden md:inline">Mesa p/ {entry.partySize} • {entry.status === 'CALLED' ? 'Chamado' : 'Aguardando'}</span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 md:gap-12">
                    <div className="flex items-center gap-2 md:gap-8">
                        {/* Mobile Badges */}
                        <div className="md:hidden flex gap-2">
                            <div className="bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                                <Icon name="users" size={10} className="text-slate-500" />
                                <span className="text-[10px] font-bold text-slate-600">{entry.partySize}</span>
                            </div>
                            <div className="bg-slate-50 px-2 py-0.5 rounded-md flex items-center gap-1 border border-slate-100">
                                <Icon name="waitTime" size={10} className="text-slate-500" />
                                <span className="text-[10px] font-bold text-slate-600">{elapsedString}</span>
                            </div>
                        </div>
                        {/* Desktop Time */}
                        <div className="hidden md:block text-right">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tempo de espera</p>
                            <p className="text-base font-bold text-slate-900">{elapsedString}</p>
                        </div>
                    </div>
                    <OverflowMenu
                        onCall={() => onCall(entry.id)}
                        onSeat={() => onSeat(entry.id)}
                        onCancel={() => onCancel(entry.id)}
                        onTogglePriority={() => onTogglePriority(entry.id)}
                        isPriority={entry.isPriority}
                        isLoading={isActionLoading}
                        t={t}
                    />
                </div>
            </div>
        );
    }
    return (
        <div className="bg-white border border-indigo-100 md:border-indigo-200 rounded-2xl md:rounded-[2.5rem] p-5 md:p-12 shadow-sm md:shadow-xl md:shadow-indigo-500/5 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-12">
            {/* Desktop Ribbon / Mobile Badge */}
            <div className="absolute top-0 right-0 z-20">
                <span className="hidden md:block text-[10px] font-black uppercase tracking-[0.2em] text-white bg-indigo-600 px-8 py-3 rounded-bl-3xl shadow-lg shadow-indigo-600/20 font-display">
                    Próximo da Fila
                </span>
            </div>

            <div className="flex items-center justify-between md:hidden z-10">
                <div className="flex items-center gap-1.5 text-indigo-600 font-bold text-[10px] uppercase tracking-wide">
                    <Icon name="star" size={12} fill="currentColor" />
                    Próximo da Fila
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    Posição #{index + 1}
                </div>
            </div>

            {/* Content Group (Avatar + Info) */}
            <div className="flex items-center gap-6 md:gap-12 z-10">
                {/* Desktop Avatar */}
                <div className="hidden md:flex w-24 h-24 rounded-full bg-indigo-600 text-white border-4 border-white flex items-center justify-center text-3xl font-bold shadow-lg shadow-indigo-200">
                    {initials}
                </div>

                <div className="flex flex-col gap-3">
                    <h3 className="text-2xl md:text-4xl font-bold text-slate-900 leading-tight tracking-tight flex items-center gap-3 flex-wrap">
                        {entry.customerName}
                        {entry.isPriority && (
                            <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-xl flex items-center gap-2 text-xs md:text-sm font-black uppercase tracking-widest border border-amber-200">
                                <Icon name="priority" size="xs" tone="inherit" />
                                <span>Prioritário</span>
                            </div>
                        )}
                        <span className="hidden md:inline text-base font-normal text-slate-400 font-sans tracking-normal">
                            {entry.customerPhone.slice(-4).padStart(entry.customerPhone.length, '*')}
                        </span>
                    </h3>
                    <div className="flex items-center gap-4 md:gap-8">
                        <div className="bg-indigo-50 md:bg-transparent text-indigo-700 md:text-slate-500 px-3 py-1 md:px-0 md:py-0 rounded-lg flex items-center gap-1.5 md:gap-2 text-xs md:text-lg font-bold md:font-semibold">
                            <Icon name="users" size="sm" className="md:text-indigo-600" />
                            {entry.partySize} Pessoas
                        </div>
                        <div className="bg-red-50 md:bg-transparent text-red-600 md:text-slate-500 px-3 py-1 md:px-0 md:py-0 rounded-lg md:border-l md:border-indigo-100 md:pl-8 flex items-center gap-1.5 md:gap-2 text-xs md:text-lg font-bold md:font-semibold">
                            <Icon name="waitTime" size="sm" className="md:text-indigo-600" />
                            <span className="md:hidden">{elapsedString}</span>
                            <span className="hidden md:inline">Esperando há {elapsedString}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 md:gap-4 w-full md:w-auto z-10">
                <Button
                    variant="outline"
                    onClick={() => onCall(entry.id)}
                    className="flex-1 md:flex-none h-12 md:h-16 px-6 md:px-10 border border-slate-200 md:border-indigo-100 bg-white md:hover:bg-indigo-50 text-slate-700 md:text-indigo-600 rounded-xl md:rounded-2xl font-bold text-sm md:text-base transition-all flex items-center justify-center gap-2"
                    isLoading={isActionLoading.call}
                >
                    <Icon name="notify" size="sm" />
                    Chamar
                </Button>
                <Button
                    variant="primary"
                    onClick={() => onSeat(entry.id)}
                    className="flex-1 md:flex-none h-12 md:h-16 px-6 md:px-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl md:rounded-2xl font-bold text-sm md:text-base transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
                    isLoading={isActionLoading.seat}
                >
                    <Icon name="tableService" size="sm" />
                    Sentar
                </Button>
            </div>
        </div>
    );
}
