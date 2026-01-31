interface Tab {
    id: string;
    label: string;
    icon: React.ReactNode;
}

interface TabNavigationProps {
    activeTab: string;
    onTabChange: (tabId: string) => void;
    tabs: Tab[];
}

export function TabNavigation({ activeTab, onTabChange, tabs }: TabNavigationProps) {
    return (
        <div className="border-b border-border-default overflow-x-auto scrollbar-hide">
            <nav className="flex space-x-1" aria-label="Tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`
                            flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-sm
                            transition-colors whitespace-nowrap flex-shrink-0 -mb-px
                            ${activeTab === tab.id
                                ? 'border-brand text-brand'
                                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border-subtle'
                            }
                        `}
                        aria-current={activeTab === tab.id ? 'page' : undefined}
                    >
                        {tab.icon}
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
}
