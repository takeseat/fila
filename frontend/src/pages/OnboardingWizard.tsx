import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import api from '../lib/api';
import { Button } from '../components/ui';
import { CountrySelect } from '../components/ui/CountrySelect';
import { PlanComparison } from '../components/plans/PlanComparison';

export function OnboardingWizard() {
    const { user, restaurant, refreshProfile } = useAuth();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation('auth');

    const [step, setStep] = useState(1);
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

    const handleNext = async () => {
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
                language: formData.language.slice(0, 2),
            });

            setStep(2);
            setLoading(false);
        } catch (err: any) {
            setError(err.response?.data?.error || t('errors.generic', { defaultValue: 'An error occurred' }));
            setLoading(false);
        }
    };

    const handleFinish = async (plan: 'BASIC' | 'PRO') => {
        setError('');
        setLoading(true);

        try {
            // In a real scenario, we would set the plan here
            // For now, we just complete onboarding (defaults to BASIC in backend)
            // If PRO was selected, we could trigger a payment flow or upgraded flag

            if (plan === 'PRO') {
                // Simulate or log pro selection
                console.log('User selected PRO plan during onboarding');
            }

            // Complete Onboarding
            await api.post('/onboarding/complete');

            // Refresh profile to update onboardingPending state locally
            await refreshProfile();

            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || t('errors.generic', { defaultValue: 'An error occurred' }));
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-4xl text-center">
                <img
                    className="mx-auto h-12 w-auto mb-6"
                    src="/assets/logo-icon.png"
                    alt="TakeSeat"
                />
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                    {step === 1
                        ? t('onboarding.welcomeTitle', { defaultValue: 'Welcome to TakeSeat!' })
                        : t('onboarding.choosePlanTitle', { defaultValue: 'Choose your plan' })
                    }
                </h2>
                <p className="text-gray-600 mb-8">
                    {step === 1
                        ? t('onboarding.welcomeSubtitle', { defaultValue: "Let's set up your restaurant." })
                        : t('onboarding.choosePlanSubtitle', { defaultValue: "Select the plan that fits your needs." })
                    }
                </p>
            </div>

            <div className={`mt-8 sm:mx-auto sm:w-full ${step === 2 ? 'sm:max-w-5xl' : 'sm:max-w-md'}`}>
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    {t('onboarding.restaurantName', { defaultValue: 'Restaurant Name' })}
                                </label>
                                <input
                                    type="text"
                                    value={formData.restaurantName}
                                    onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base placeholder-gray-400"
                                    placeholder={t('onboarding.restaurantNamePlaceholder', { defaultValue: 'My Great Restaurant' })}
                                />
                                <p className="mt-1.5 text-xs text-gray-500">
                                    {t('onboarding.restaurantNameHint', { defaultValue: 'This is how your restaurant will appear to customers.' })}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    {t('onboarding.country', { defaultValue: 'Country location' })}
                                </label>
                                <CountrySelect
                                    value={formData.countryCode}
                                    onChange={(country) => setFormData({ ...formData, countryCode: country.code })}
                                    showDdi={false}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <Button
                                    onClick={handleNext}
                                    isLoading={loading}
                                    className="w-full flex justify-center py-3"
                                    size="lg"
                                    disabled={!formData.restaurantName}
                                >
                                    {t('onboarding.next', { defaultValue: 'Next Step' })}
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-fade-in">
                            <PlanComparison
                                onSelectBasic={() => handleFinish('BASIC')}
                                onSelectPro={() => handleFinish('PRO')}
                                currentPlan="BASIC"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
