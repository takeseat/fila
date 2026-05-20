import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import api from '../lib/api';
import { Button, Input } from '../components/ui';
import { CountrySelect } from '../components/ui/CountrySelect';

export function OnboardingWizard() {
    const { user, restaurant, refreshProfile } = useAuth();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation('auth');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        restaurantName: '',
        countryCode: restaurant?.countryCode || 'BR',
        language: user?.language || i18n.language || 'en',
    });

    React.useEffect(() => {
        if (user?.language && user.language !== i18n.language) {
            i18n.changeLanguage(user.language);
            setFormData(prev => ({ ...prev, language: user.language }));
        }
    }, [user, i18n]);

    const handleFinish = async () => {
        setError('');
        setLoading(true);

        try {
            // Save Step 1: Name and Country
            await api.put('/onboarding/step1', {
                restaurantName: formData.restaurantName,
                countryCode: formData.countryCode,
            });

            // Save Step 2: Language
            await api.put('/onboarding/step2', {
                language: formData.language, // Keep full locale (e.g., pt-BR instead of just pt)
            });

            // Complete Onboarding (backend will auto-start PRO trial)
            await api.post('/onboarding/complete');

            // Refresh profile to update onboardingPending state
            await refreshProfile();

            // Navigate to dashboard
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || t('errors.generic', { defaultValue: 'An error occurred' }));
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-subtle flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <img
                    className="mx-auto h-16 w-auto mb-6"
                    src="/assets/logo-icon.png"
                    alt="TakeSeat"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const textLogo = document.createElement('div');
                        textLogo.className = 'text-3xl font-bold text-text-primary';
                        textLogo.textContent = 'TakeSeat';
                        e.currentTarget.parentElement?.appendChild(textLogo);
                    }}
                />
                <h2 className="text-3xl font-extrabold text-text-primary mb-2">
                    {t('onboarding.welcomeTitle', { defaultValue: 'Welcome to TakeSeat!' })}
                </h2>
                <p className="text-text-secondary mb-8">
                    {t('onboarding.welcomeSubtitle', { defaultValue: "Let's set up your restaurant." })}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-bg-surface py-8 px-4 shadow sm:rounded-lg sm:px-10">

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <div className="space-y-6 animate-fade-in">
                            <Input
                                label={t('onboarding.restaurantName', { defaultValue: 'Restaurant Name' })}
                                value={formData.restaurantName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, restaurantName: e.target.value })}
                                placeholder={t('onboarding.restaurantNamePlaceholder', { defaultValue: 'My Great Restaurant' })}
                                helperText={t('onboarding.restaurantNameHint', { defaultValue: 'This is how your restaurant will appear to customers.' })}
                            />

                        <div>
                            <label className="block text-sm font-normal text-text-tertiary mb-1.5">
                                {t('onboarding.country', { defaultValue: 'Country location' })}
                            </label>
                            <CountrySelect
                                value={formData.countryCode}
                                onChange={(country) => setFormData({ ...formData, countryCode: country.code })}
                                showDdi={false}
                                className="w-full"
                            />
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                            <p className="text-sm text-blue-800 font-medium mb-1">
                                🎉 {t('onboarding.trialMessage', { defaultValue: '7-Day PRO Trial Included!' })}
                            </p>
                            <p className="text-xs text-blue-600">
                                {t('onboarding.trialDescription', { defaultValue: 'Get full access to all features for 7 days. No credit card required.' })}
                            </p>
                        </div>

                        <div>
                            <Button
                                onClick={handleFinish}
                                isLoading={loading}
                                className="w-full flex justify-center py-3"
                                size="lg"
                                disabled={!formData.restaurantName}
                            >
                                {t('onboarding.start', { defaultValue: 'Start Trial' })}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
