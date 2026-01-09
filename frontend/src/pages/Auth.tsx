import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { Button, Input } from '../components/ui';
import { LanguageSelector } from '../components/LanguageSelector';
import { AuthLayout } from '../components/auth/AuthLayout';
import { BrandingSection } from '../components/auth/BrandingSection';
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
        userName: '',
        userEmail: '',
        password: '',
    });
    const [passwordStrength, setPasswordStrength] = useState(validatePasswordStrength(''));
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation('auth');

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData({ ...formData, password: value });
        setPasswordStrength(validatePasswordStrength(value));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


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
            // Prepare payload
            const payload = {
                userName: formData.userName,
                userEmail: formData.userEmail,
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
                    {/* User Information */}
                    <div className="space-y-5">
                        <Input
                            label={t('signup.userName')}
                            name="userName"
                            value={formData.userName}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label={t('signup.userEmail')}
                            type="email"
                            name="userEmail"
                            value={formData.userEmail}
                            onChange={handleChange}
                            required
                        />

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
