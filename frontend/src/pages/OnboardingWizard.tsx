import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import api from '../lib/api';
import { Button, Input } from '../components/ui';
import { CountrySelect } from '../components/ui/CountrySelect';
import { LanguageSelector } from '../components/LanguageSelector';

export function OnboardingWizard() {
    const { user, restaurant, refreshProfile } = useAuth();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation('auth');

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        restaurantName: restaurant?.name || '',
        countryCode: restaurant?.countryCode || 'BR',
        language: user?.language || i18n.language || 'en', // Initialize with user language or current i18n language
    });

    // Ensure we start with the correct language if user has one saved
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
            if (step === 1) {
                // Save Step 1: Name and Country
                await api.put('/onboarding/step1', {
                    restaurantName: formData.restaurantName,
                    countryCode: formData.countryCode,
                });
                setStep(2);
            } else if (step === 2) {
                // Save Step 2: Language
                await api.put('/onboarding/step2', {
                    language: formData.language,
                });

                // Complete Onboarding
                await api.post('/onboarding/complete');

                // Refresh profile to update onboardingPending state locally
                await refreshProfile();

                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || t('errors.generic', { defaultValue: 'An error occurred' }));
        } finally {
            setLoading(false);
        }
    };

    const handleLanguageSelect = (lang: string) => {
        setFormData({ ...formData, language: lang });
        i18n.changeLanguage(lang); // Preview language immediately
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <img
                    className="mx-auto h-12 w-auto mb-6"
                    src="/assets/logo-icon.png"
                    alt="TakeSeat"
                />
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                    {t('onboarding.welcomeTitle', { defaultValue: 'Welcome to TakeSeat!' })}
                </h2>
                <p className="text-gray-600">
                    {t('onboarding.welcomeSubtitle', { defaultValue: "Let's set up your restaurant in just 2 steps." })}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="h-2 bg-gray-200 rounded-full mb-2">
                            <div
                                className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                                style={{ width: step === 1 ? '50%' : '100%' }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-xs font-medium">
                            <span className={step >= 1 ? 'text-blue-600' : 'text-gray-500'}>
                                {t('onboarding.step1', { defaultValue: 'Restaurant Details' })}
                            </span>
                            <span className={step >= 2 ? 'text-blue-600' : 'text-gray-500'}>
                                {t('onboarding.step2', { defaultValue: 'Language' })}
                            </span>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <div className="space-y-6">
                        {step === 1 && (
                            <>
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
                            </>
                        )}

                        {step === 2 && (
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    {t('onboarding.selectLanguage', { defaultValue: 'Select your preferred language' })}
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handleLanguageSelect('en')}
                                        className={`p-4 border rounded-lg text-center transition-all ${formData.language === 'en'
                                            ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500 ring-opacity-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="text-2xl mb-1">🇺🇸</div>
                                        <div className="font-medium">English</div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleLanguageSelect('pt')}
                                        className={`p-4 border rounded-lg text-center transition-all ${formData.language === 'pt'
                                            ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500 ring-opacity-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="text-2xl mb-1">🇧🇷</div>
                                        <div className="font-medium">Português</div>
                                    </button>
                                </div>
                            </div>
                        )}

                        <div>
                            <Button
                                onClick={handleNext}
                                isLoading={loading}
                                className="w-full flex justify-center py-3"
                                size="lg"
                                disabled={step === 1 && !formData.restaurantName}
                            >
                                {step === 1 ? t('onboarding.nextStep', { defaultValue: 'Next Step' }) : t('onboarding.finishSetup', { defaultValue: 'Finish Setup' })}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
