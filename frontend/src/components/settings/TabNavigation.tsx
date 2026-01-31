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
        <div className="bg-bg-surface border border-border-default rounded-card shadow-card overflow-x-auto scrollbar-hide">
            <nav className="flex space-x-4 md:space-x-8 px-4 md:px-6" aria-label="Tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`
                            flex items-center gap-2 py-3 md:py-4 px-1 border-b-2 font-medium text-xs md:text-sm
                            transition-colors whitespace-nowrap flex-shrink-0
                            ${activeTab === tab.id
                                ? 'border-brand text-brand'
                                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border-subtle'
                            }
                        `}
                        aria-current={activeTab === tab.id ? 'page' : undefined}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
    );
}
