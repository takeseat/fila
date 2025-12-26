import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { Button, Input } from '../components/ui';
import { CountrySelect } from '../components/ui/CountrySelect';
import { LanguageSelector } from '../components/LanguageSelector';
import { AuthLayout } from '../components/auth/AuthLayout';
import { BrandingSection } from '../components/auth/BrandingSection';
import { COUNTRIES, getStatesByCountryCode } from '../data/countriesExtended';
import { detectCountryFromBrowser } from '../utils/localeUtils';
import { getBusinessIdInfo, getBusinessIdLabel, applyBusinessIdMask } from '../utils/businessIdUtils';
import { removeMask, applyPhoneMask, buildFullPhone, getPhonePlaceholder } from '../utils/phoneUtils';
import { validatePasswordStrength, getPasswordStrengthLabel, getPasswordStrengthColor, getPasswordStrengthTextColor } from '../utils/passwordUtils';

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
            // Check if it's a 401 (unauthorized) error
            if (err.response?.status === 401) {
                setError(t('errors.invalidCredentials'));
            } else {
                setError(err.response?.data?.error || t('errors.loginFailed'));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout branding={<BrandingSection />}>
            {/* Language Selector - top right */}
            <div className="fixed top-6 right-6 z-50">
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
        // Restaurant Info
        restaurantName: '',
        tradeName: '',
        businessId: '', // CNPJ, EIN, etc.
        countryCode: 'BR', // Will be set by locale detection
        stateCode: '',
        city: '',
        addressLine: '',
        addressNumber: '',
        addressComplement: '',
        postalCode: '',
        // User Info
        userName: '',
        userEmail: '',
        userPhone: '',
        password: '',
    });
    const [businessIdDisplay, setBusinessIdDisplay] = useState('');
    const [userPhoneDisplay, setUserPhoneDisplay] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(validatePasswordStrength(''));
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

    const handleBusinessIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        const masked = applyBusinessIdMask(input, formData.countryCode);
        setBusinessIdDisplay(masked);
        setFormData({ ...formData, businessId: removeMask(input) });
    };

    const handleUserPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        const masked = applyPhoneMask(input, formData.countryCode);
        setUserPhoneDisplay(masked);
        setFormData({ ...formData, userPhone: removeMask(input) });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData({ ...formData, password: value });
        setPasswordStrength(validatePasswordStrength(value));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Reset state when country changes
        if (name === 'countryCode') {
            setFormData(prev => ({ ...prev, countryCode: value, stateCode: '', businessId: '' }));
            setBusinessIdDisplay('');
        }
    };

    const states = getStatesByCountryCode(formData.countryCode);
    const businessIdInfo = getBusinessIdInfo(formData.countryCode);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate password strength
        if (!passwordStrength.isStrong) {
            setError(t('errors.weakPassword') || 'Please use a stronger password');
            return;
        }

        setLoading(true);

        try {
            // Build full phone for user
            const userCountry = COUNTRIES.find(c => c.code === formData.countryCode);
            const userFullPhone = userCountry ? buildFullPhone(userCountry.ddi, formData.userPhone) : formData.userPhone;

            // Prepare payload
            const payload = {
                restaurantName: formData.restaurantName,
                tradeName: formData.tradeName || undefined,
                businessId: formData.businessId,
                countryCode: formData.countryCode,
                stateCode: formData.stateCode || undefined,
                city: formData.city,
                addressLine: formData.addressLine || undefined,
                addressNumber: formData.addressNumber || undefined,
                addressComplement: formData.addressComplement || undefined,
                postalCode: formData.postalCode || undefined,
                userName: formData.userName,
                userEmail: formData.userEmail,
                userPhone: formData.userPhone,
                userCountryCode: formData.countryCode,
                userFullPhone,
                password: formData.password,
            };

            await register(payload);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || t('errors.registerFailed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout branding={<BrandingSection />}>
            {/* Language Selector - top right */}
            <div className="fixed top-6 right-6 z-50">
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

                        {/* Country Selection - First Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Country <span className="text-red-600">*</span>
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('signup.restaurantName')} <span className="text-red-600">*</span>
                            </label>
                            <input
                                name="restaurantName"
                                value={formData.restaurantName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 rounded-xl border-2 border-light-300 focus:border-primary-500 focus:ring-primary-500/20 bg-white text-dark-900 placeholder:text-dark-400 focus:outline-none focus:ring-4"
                            />
                        </div>

                        <Input
                            label={t('signup.tradeName')}
                            name="tradeName"
                            value={formData.tradeName}
                            onChange={handleChange}
                            required
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {getBusinessIdLabel(formData.countryCode, t('signup.companyId'))} <span className="text-red-600">*</span>
                            </label>
                            <input
                                value={businessIdDisplay}
                                onChange={handleBusinessIdChange}
                                placeholder={businessIdInfo.placeholder}
                                maxLength={businessIdInfo.maxLength}
                                required
                                className="w-full px-4 py-2.5 rounded-xl border-2 border-light-300 focus:border-primary-500 focus:ring-primary-500/20 bg-white text-dark-900 placeholder:text-dark-400 focus:outline-none focus:ring-4"
                            />
                        </div>

                        {/* Address Section */}
                        <div className="pt-4 border-t border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">{t('signup.addressSection')}</h4>

                            {/* State and City */}
                            {states.length > 0 ? (
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('signup.state')}
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

                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('signup.city')} <span className="text-red-600">*</span>
                                </label>
                                <input
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="Enter city"
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border-2 border-light-300 focus:border-primary-500 focus:ring-primary-500/20 bg-white text-dark-900 placeholder:text-dark-400 focus:outline-none focus:ring-4"
                                />
                            </div>

                            {/* Address Line and Number */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('signup.addressLine')} <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        name="addressLine"
                                        value={formData.addressLine}
                                        onChange={handleChange}
                                        placeholder={t('signup.streetPlaceholder')}
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border-2 border-light-300 focus:border-primary-500 focus:ring-primary-500/20 bg-white text-dark-900 placeholder:text-dark-400 focus:outline-none focus:ring-4"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('signup.addressNumber')} <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        name="addressNumber"
                                        value={formData.addressNumber}
                                        onChange={handleChange}
                                        placeholder="#"
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border-2 border-light-300 focus:border-primary-500 focus:ring-primary-500/20 bg-white text-dark-900 placeholder:text-dark-400 focus:outline-none focus:ring-4"
                                    />
                                </div>
                            </div>

                            {/* Complement and Postal Code */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Input
                                    label={t('signup.complement')}
                                    name="addressComplement"
                                    value={formData.addressComplement}
                                    onChange={handleChange}
                                    placeholder={t('signup.complementPlaceholder')}
                                />
                                {/* Postal Code */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('signup.postalCode')} <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleChange}
                                        placeholder={t('signup.postalCodePlaceholder')}
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border-2 border-light-300 focus:border-primary-500 focus:ring-primary-500/20 bg-white text-dark-900 placeholder:text-dark-400 focus:outline-none focus:ring-4"
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

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('signup.userName')} <span className="text-red-600">*</span>
                                </label>
                                <input
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border-2 border-light-300 focus:border-primary-500 focus:ring-primary-500/20 bg-white text-dark-900 placeholder:text-dark-400 focus:outline-none focus:ring-4"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('signup.userEmail')} <span className="text-red-600">*</span>
                                </label>
                                <input
                                    name="userEmail"
                                    type="email"
                                    value={formData.userEmail}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border-2 border-light-300 focus:border-primary-500 focus:ring-primary-500/20 bg-white text-dark-900 placeholder:text-dark-400 focus:outline-none focus:ring-4"
                                />
                            </div>

                            {/* User Phone - Uses same country as restaurant */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('signup.phone')} <span className="text-red-600">*</span>
                                </label>
                                <div className="flex">
                                    <div className="w-20">
                                        <CountrySelect
                                            value={formData.countryCode}
                                            onChange={() => { }} // Read-only, controlled by main country selector
                                            compact
                                        />
                                    </div>
                                    <input
                                        type="tel"
                                        value={userPhoneDisplay}
                                        onChange={handleUserPhoneChange}
                                        required
                                        placeholder={getPhonePlaceholder(formData.countryCode)}
                                        className="flex-1 px-4 py-2.5 border-2 border-l-0 border-dark-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('signup.password')} <span className="text-red-600">*</span>
                                </label>
                                <input
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handlePasswordChange}
                                    placeholder="••••••••"
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border-2 border-light-300 focus:border-primary-500 focus:ring-primary-500/20 bg-white text-dark-900 placeholder:text-dark-400 focus:outline-none focus:ring-4"
                                />

                                {/* Password Strength Indicator */}
                                {formData.password && (
                                    <div className="mt-3">
                                        {/* Strength Bar */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength.score)}`}
                                                    style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                                                />
                                            </div>
                                            <span className={`text-xs font-medium ${getPasswordStrengthTextColor(passwordStrength.score)}`}>
                                                {t(`passwordStrength.${getPasswordStrengthLabel(passwordStrength.score).toLowerCase().replace(' ', '')}`)}
                                            </span>
                                        </div>

                                        {/* Requirements Checklist */}
                                        {passwordStrength.feedback.length > 0 && (
                                            <div className="text-xs text-gray-600">
                                                <p className="font-medium mb-1">{t('passwordStrength.requirements')}</p>
                                                <ul className="space-y-0.5">
                                                    {passwordStrength.feedback.map((req, idx) => (
                                                        <li key={idx} className="flex items-center gap-1">
                                                            <span className="text-red-500">✗</span>
                                                            <span>{req}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Success Message */}
                                        {passwordStrength.isStrong && (
                                            <div className="flex items-center gap-1 text-xs text-green-600">
                                                <span>✓</span>
                                                <span className="font-medium">Strong password!</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
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
