import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TabNavigation } from '../components/settings/TabNavigation';
import { BusinessDataTab } from '../components/settings/BusinessDataTab';
import { ParametersTab } from '../components/settings/ParametersTab';

export function Settings() {
    const { t } = useTranslation('settings');
    const [activeTab, setActiveTab] = useState<'business' | 'parameters'>('business');

    const tabs = [
        {
            id: 'business',
            label: t('tabs.business'),
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
        },
        {
            id: 'parameters',
            label: t('tabs.parameters'),
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
        },
    ];

    return (
        <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-light-200 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-light-200">
                    <h1 className="text-2xl font-bold text-dark-900">{t('title')}</h1>
                    <p className="text-sm text-dark-500 mt-1">{t('subtitle')}</p>
                </div>

                {/* Tab Navigation */}
                <TabNavigation
                    activeTab={activeTab}
                    onTabChange={(tabId) => setActiveTab(tabId as 'business' | 'parameters')}
                    tabs={tabs}
                />

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === 'business' && <BusinessDataTab />}
                    {activeTab === 'parameters' && <ParametersTab />}
                </div>
            </div>
        </div>
    );
}
