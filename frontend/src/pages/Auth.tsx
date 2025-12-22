import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { Button, Input } from '../components/ui';
import { LanguageSelector } from '../components/LanguageSelector';
import { AuthLayout } from '../components/auth/AuthLayout';
import { BrandingSection } from '../components/auth/BrandingSection';
import { COUNTRIES, getStatesByCountryCode } from '../data/countriesExtended';
import { detectCountryFromBrowser } from '../utils/localeUtils';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation('auth');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || t('errors.loginFailed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout branding={<BrandingSection />}>
            {/* Language Selector - top right */}
            <div className="absolute top-6 right-6 z-10">
                <LanguageSelector />
            </div>

            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
                <img
                    src="/assets/logo-dark.png"
                    alt="TakeSeat"
                    className="h-8 w-auto mx-auto mb-2"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const textLogo = document.createElement('div');
                        textLogo.className = 'text-2xl font-bold text-gray-900';
                        textLogo.textContent = 'TakeSeat';
                        e.currentTarget.parentElement?.appendChild(textLogo);
                    }}
                />
                <p className="text-sm text-gray-600">{t('branding.headline')}</p>
            </div>

            {/* Auth Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {t('login.title')}
                    </h1>
                    <p className="text-gray-600">
                        {t('login.subtitle')}
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        label={t('login.email')}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                    />

                    <Input
                        label={t('login.password')}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                    />

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span>{t('login.rememberMe')}</span>
                        </label>
                        <a href="#" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
                            {t('login.forgotPassword')}
                        </a>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        isLoading={loading}
                    >
                        {t('login.button')}
                    </Button>
                </form>

                {/* Demo Account Info */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        {t('login.demoAccount')}
                    </p>
                    <p className="text-xs text-blue-800 font-mono">
                        E-mail: admin@restaurantedemo.com.br<br />
                        Senha: admin123
                    </p>
                </div>

                {/* Toggle to Sign Up */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        {t('login.noAccount')}{' '}
                        <a
                            href="/register"
                            className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                        >
                            {t('login.createOne')}
                        </a>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}

export function Register() {
    const [formData, setFormData] = useState({
        restaurantName: '',
        tradeName: '',
        cnpj: '',
        phone: '',
        email: '',
        countryCode: 'BR', // Will be set by locale detection
        stateCode: '',
        city: '',
        addressLine: '',
        addressNumber: '',
        addressComplement: '',
        postalCode: '',
        userName: '',
        userEmail: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation('auth');

    // Detect country from browser locale on mount
    useEffect(() => {
        const detectedCountry = detectCountryFromBrowser();
        setFormData(prev => ({ ...prev, countryCode: detectedCountry }));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await register(formData);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || t('errors.registerFailed'));
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Reset state when country changes
        if (name === 'countryCode') {
            setFormData(prev => ({ ...prev, countryCode: value, stateCode: '' }));
        }
    };

    const states = getStatesByCountryCode(formData.countryCode);

    return (
        <AuthLayout branding={<BrandingSection />}>
            {/* Language Selector - top right */}
            <div className="absolute top-6 right-6 z-10">
                <LanguageSelector />
            </div>

            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
                <img
                    src="/assets/logo-dark.png"
                    alt="TakeSeat"
                    className="h-8 w-auto mx-auto mb-2"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const textLogo = document.createElement('div');
                        textLogo.className = 'text-2xl font-bold text-gray-900';
                        textLogo.textContent = 'TakeSeat';
                        e.currentTarget.parentElement?.appendChild(textLogo);
                    }}
                />
                <p className="text-sm text-gray-600">{t('branding.headline')}</p>
            </div>

            {/* Auth Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {t('signup.title')}
                    </h1>
                    <p className="text-gray-600">
                        {t('signup.subtitle')}
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Restaurant Information */}
                    <div className="space-y-5">
                        <div className="border-b border-gray-200 pb-2">
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                                {t('signup.restaurantInfo')}
                            </h3>
                        </div>

                        <Input
                            label={t('signup.restaurantName')}
                            name="restaurantName"
                            value={formData.restaurantName}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label={t('signup.tradeName')}
                            name="tradeName"
                            value={formData.tradeName}
                            onChange={handleChange}
                            placeholder="Optional"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label={t('signup.cnpj')}
                                name="cnpj"
                                value={formData.cnpj}
                                onChange={handleChange}
                            />

                            <Input
                                label={t('signup.phone')}
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <Input
                            label={t('signup.email')}
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        {/* Address Section */}
                        <div className="pt-4 border-t border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Address</h4>

                            {/* Country */}
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Country
                                </label>
                                <select
                                    name="countryCode"
                                    value={formData.countryCode}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                    required
                                >
                                    {COUNTRIES.map(country => (
                                        <option key={country.code} value={country.code}>
                                            {country.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* State and City */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                                {states.length > 0 ? (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            State / Province
                                        </label>
                                        <select
                                            name="stateCode"
                                            value={formData.stateCode}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                        >
                                            <option value="">Select state</option>
                                            {states.map(state => (
                                                <option key={state.code} value={state.code}>
                                                    {state.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ) : null}

                                <Input
                                    label={t('signup.city')}
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Address Line and Number */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                                <div className="sm:col-span-2">
                                    <Input
                                        label="Address"
                                        name="addressLine"
                                        value={formData.addressLine}
                                        onChange={handleChange}
                                        placeholder="Street name"
                                    />
                                </div>
                                <Input
                                    label="Number"
                                    name="addressNumber"
                                    value={formData.addressNumber}
                                    onChange={handleChange}
                                    placeholder="#"
                                />
                            </div>

                            {/* Complement and Postal Code */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Input
                                    label="Complement"
                                    name="addressComplement"
                                    value={formData.addressComplement}
                                    onChange={handleChange}
                                    placeholder="Apt, suite, etc."
                                />
                                <Input
                                    label="Postal Code / ZIP"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    placeholder="Enter postal code"
                                />
                            </div>
                        </div>
                    </div>

                    {/* User Information */}
                    <div className="space-y-5 pt-4">
                        <div className="border-b border-gray-200 pb-2">
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                                {t('signup.userInfo')}
                            </h3>
                        </div>

                        <Input
                            label={t('signup.userName')}
                            name="userName"
                            value={formData.userName}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label={t('signup.userEmail')}
                            name="userEmail"
                            type="email"
                            value={formData.userEmail}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label={t('signup.password')}
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        isLoading={loading}
                    >
                        {t('signup.button')}
                    </Button>
                </form>

                {/* Toggle to Sign In */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        {t('signup.hasAccount')}{' '}
                        <a
                            href="/login"
                            className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                        >
                            {t('signup.signIn')}
                        </a>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}
