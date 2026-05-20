import { Icon } from '../../design-system/icons/Icon';

interface TakeSeatLogoProps {
    /** 'sm' for mobile/compact, 'md' for standard, 'lg' for branding sections */
    size?: 'sm' | 'md' | 'lg';
    /** Light variant uses white text for dark backgrounds */
    variant?: 'default' | 'light';
    className?: string;
}

const sizeConfig = {
    sm: {
        icon: 'p-1 rounded-md' as const,
        iconSize: 'xs' as const,
        text: 'text-base',
    },
    md: {
        icon: 'p-1.5 rounded-lg shadow-sm' as const,
        iconSize: 'sm' as const,
        text: 'text-xl',
    },
    lg: {
        icon: 'p-2 rounded-lg shadow-sm' as const,
        iconSize: 'md' as const,
        text: 'text-2xl',
    },
};

export function TakeSeatLogo({ size = 'md', variant = 'default', className = '' }: TakeSeatLogoProps) {
    const config = sizeConfig[size];
    const isLight = variant === 'light';

    return (
        <div className={`flex items-center gap-2.5 ${className}`}>
            <div className={`bg-indigo-600 ${config.icon} flex-shrink-0`}>
                <Icon name="tableService" size={config.iconSize} className="text-white" />
            </div>
            <span className={`${config.text} font-bold tracking-tight ${isLight ? 'text-white' : 'text-slate-800'}`}>
                Take<span className={isLight ? 'text-indigo-300' : 'text-indigo-600'}>Seat</span>
            </span>
        </div>
    );
}
