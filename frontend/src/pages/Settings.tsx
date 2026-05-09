import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { TabNavigation } from '../components/settings/TabNavigation';
import { BusinessDataTab } from '../components/settings/BusinessDataTab';
import { ParametersTab } from '../components/settings/ParametersTab';
import { TeamTab } from '../components/settings/TeamTab';
import { PlanSettings } from '../components/settings/PlanSettings';
import { MessagesTab } from '../components/settings/MessagesTab';
import { PageShell, PageContent } from '../components/mobile/PageShell';
import { MobilePageHeader } from '../components/mobile/MobilePageHeader';
import { Card } from '../components/ui';
import { Icon } from '../design-system/icons/Icon';

export function Settings() {
    const { t } = useTranslation('settings');
    const location = useLocation();
    const [activeTab, setActiveTab] = useState<'business' | 'plan' | 'parameters' | 'team' | 'messages'>('business');

    useEffect(() => {
        if (location.state?.activeTab) {
            setActiveTab(location.state.activeTab);
        }
    }, [location.state]);

    const tabs = [
        {
            id: 'business',
            label: t('tabs.business'),
            icon: <Icon name="home" size="sm" tone="inherit" />,
        },
        {
            id: 'plan',
            label: t('tabs.plan'),
            icon: <Icon name="billing" size="sm" tone="inherit" />,
        },
        {
            id: 'parameters',
            label: t('tabs.parameters'),
            icon: <Icon name="settings" size="sm" tone="inherit" />,
        },
        {
            id: 'team',
            label: t('tabs.team'),
            icon: <Icon name="users" size="sm" tone="inherit" />,
        },
        {
            id: 'messages',
            label: t('tabs.messages'),
            icon: <Icon name="message" size="sm" tone="inherit" />,
        },
    ];

    return (
        <PageShell>
            <MobilePageHeader title={t('title')} subtitle={t('subtitle')} />

            <PageContent className="max-w-screen-xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in">
                {/* Desktop Header (Hidden on Mobile) */}
                <div className="hidden lg:block">
                    <h1 className="text-3xl font-bold text-text-primary mb-2">{t('title')}</h1>
                    <p className="text-text-secondary">{t('subtitle')}</p>
                </div>

                {/* Tab Navigation */}
                <TabNavigation
                    activeTab={activeTab}
                    onTabChange={(tabId) => setActiveTab(tabId as any)}
                    tabs={tabs}
                />

                {/* Tab Content */}
                <Card padding="lg">
                    {activeTab === 'business' && <BusinessDataTab />}
                    {activeTab === 'plan' && <PlanSettings />}
                    {activeTab === 'parameters' && <ParametersTab />}
                    {activeTab === 'team' && <TeamTab />}
                    {activeTab === 'messages' && <MessagesTab />}
                </Card>
            </PageContent>
        </PageShell>
    );
}
