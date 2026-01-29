import { ReactNode, useState } from 'react';
import clsx from 'clsx';

export interface Tab {
    id: string;
    label: string;
    content: ReactNode;
    disabled?: boolean;
}

export interface TabsProps {
    /**
     * Array of tabs
     */
    tabs: Tab[];

    /**
     * Initially active tab ID
     */
    defaultActiveId?: string;

    /**
     * Controlled active tab ID
     */
    activeId?: string;

    /**
     * Called when tab changes
     */
    onChange?: (tabId: string) => void;

    /**
     * Visual variant (DS Section 6.5)
     */
    variant?: 'line' | 'pill';

    /**
     * Additional class names
     */
    className?: string;
}

/**
 * Tabs component following Design System Section 6.5
 * 
 * Features:
 * - Line and pill variants
 * - Active/hover/disabled states
 * - Controlled and uncontrolled mode
 * - Semantic tokens only
 */
export function Tabs({
    tabs,
    defaultActiveId,
    activeId: controlledActiveId,
    onChange,
    variant = 'line',
    className = '',
}: TabsProps) {
    const [internalActiveId, setInternalActiveId] = useState(
        defaultActiveId || tabs[0]?.id
    );

    const activeId = controlledActiveId !== undefined ? controlledActiveId : internalActiveId;

    const handleTabClick = (tabId: string, disabled?: boolean) => {
        if (disabled) return;

        if (controlledActiveId === undefined) {
            setInternalActiveId(tabId);
        }
        onChange?.(tabId);
    };

    const activeTab = tabs.find(tab => tab.id === activeId);

    // Base tab button styles
    const baseTabStyles = 'px-space-md py-space-sm font-medium transition-all duration-200 focus:outline-none';

    // Variant-specific styles using semantic tokens
    const variantStyles = {
        line: {
            container: 'border-b border-border-default',
            tab: clsx(
                baseTabStyles,
                'border-b-2 border-transparent -mb-px'
            ),
            active: 'border-action-primary-bg text-action-primary-bg',
            inactive: 'text-text-secondary hover:text-text-primary hover:border-border-strong',
            disabled: 'opacity-50 cursor-not-allowed',
        },
        pill: {
            container: 'bg-bg-subtle p-1 rounded-control inline-flex',
            tab: clsx(
                baseTabStyles,
                'rounded-control'
            ),
            active: 'bg-bg-surface text-text-primary shadow-control',
            inactive: 'text-text-secondary hover:text-text-primary',
            disabled: 'opacity-50 cursor-not-allowed',
        },
    };

    const styles = variantStyles[variant];

    return (
        <div className={className}>
            {/* Tab List */}
            <div className={styles.container} role="tablist">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        role="tab"
                        aria-selected={activeId === tab.id}
                        aria-controls={`panel-${tab.id}`}
                        id={`tab-${tab.id}`}
                        disabled={tab.disabled}
                        className={clsx(
                            styles.tab,
                            activeId === tab.id ? styles.active : styles.inactive,
                            tab.disabled && styles.disabled
                        )}
                        onClick={() => handleTabClick(tab.id, tab.disabled)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Panel */}
            {activeTab && (
                <div
                    role="tabpanel"
                    id={`panel-${activeTab.id}`}
                    aria-labelledby={`tab-${activeTab.id}`}
                    className="mt-space-lg"
                >
                    {activeTab.content}
                </div>
            )}
        </div>
    );
}
