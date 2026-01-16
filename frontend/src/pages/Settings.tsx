import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TabNavigation } from '../components/settings/TabNavigation';
import { BusinessDataTab } from '../components/settings/BusinessDataTab';
import { ParametersTab } from '../components/settings/ParametersTab';
import { TeamTab } from '../components/settings/TeamTab';
import { WhatsAppTab } from '../components/settings/WhatsAppTab';
import PickupOrdersSettings from './Settings/PickupOrdersSettings';
import { PlanSettings } from '../components/settings/PlanSettings';

export function Settings() {
    const { t } = useTranslation('settings');
    const [activeTab, setActiveTab] = useState<'business' | 'plan' | 'parameters' | 'team' | 'whatsapp' | 'pickup'>('business');

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
            id: 'plan',
            label: 'Plano', // Todo: move to i18n
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            )
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
        {
            id: 'team',
            label: t('tabs.team'),
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
        },
        {
            id: 'whatsapp',
            label: 'WhatsApp',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
            ),
        },
        {
            id: 'pickup',
            label: 'Pedidos (Retirada)',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
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
                    onTabChange={(tabId) => setActiveTab(tabId as any)}
                    tabs={tabs}
                />

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === 'business' && <BusinessDataTab />}
                    {activeTab === 'plan' && <PlanSettings />}
                    {activeTab === 'parameters' && <ParametersTab />}
                    {activeTab === 'team' && <TeamTab />}
                    {activeTab === 'whatsapp' && <WhatsAppTab />}
                    {activeTab === 'pickup' && <PickupOrdersSettings />}
                </div>
            </div>
        </div>
    );
}
