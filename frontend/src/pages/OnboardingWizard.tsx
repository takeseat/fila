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
    const { t, i18n } = useTranslation('auth'); // Using auth namespace for now

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        restaurantName: restaurant?.name || '',
        countryCode: restaurant?.countryCode || 'BR',
        language: user?.language || 'en',
    });

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
            setError(err.response?.data?.error || 'An error occurred');
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
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <img
                    className="mx-auto h-12 w-auto"
                    src="/assets/logo-icon.png"
                    alt="TakeSeat"
                />
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Welcome to TakeSeat!
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Let's set up your restaurant in just 2 steps.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="h-2 bg-gray-200 rounded-full">
                            <div
                                className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                                style={{ width: step === 1 ? '50%' : '100%' }}
                            ></div>
                        </div>
                        <div className="mt-2 flex justify-between text-xs text-gray-500 font-medium">
                            <span className={step >= 1 ? 'text-blue-600' : ''}>Restaurant Details</span>
                            <span className={step >= 2 ? 'text-blue-600' : ''}>Language</span>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="space-y-6">
                        {step === 1 && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Restaurant Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.restaurantName}
                                        onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="My Great Restaurant"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        This is how your restaurant will appear to customers.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Country location
                                    </label>
                                    <CountrySelect
                                        value={formData.countryCode}
                                        onChange={(country) => setFormData({ ...formData, countryCode: country.code })}
                                    />
                                </div>
                            </>
                        )}

                        {step === 2 && (
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Select your preferred language
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
                                className="w-full flex justify-center"
                                disabled={step === 1 && !formData.restaurantName}
                            >
                                {step === 1 ? 'Next Step' : 'Finish Setup'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
