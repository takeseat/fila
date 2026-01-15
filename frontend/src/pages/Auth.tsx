import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { Button, Input } from '../components/ui';
import { LanguageSelector } from '../components/LanguageSelector';
import { AuthLayout } from '../components/auth/AuthLayout';
import { BrandingSection } from '../components/auth/BrandingSection';


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
        userEmail: '',
    });
    const [touched, setTouched] = useState({ userEmail: false });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation('auth');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name } = e.target;
        setTouched({ ...touched, [name]: true });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        setTouched({ userEmail: true });

        if (!formData.userEmail.includes('@')) {
            setError(t('validation.emailInvalid'));
            return;
        }

        setLoading(true);

        try {
            // Register now only takes userEmail
            await register({ userEmail: formData.userEmail });
            setEmailSent(true);
        } catch (err: any) {
            // Map backend error messages to i18n keys
            const backendError = err.response?.data?.error || '';
            let translatedError = '';

            // Be specific with error matching to avoid false positives
            if (backendError === 'User already exists') {
                translatedError = t('errors.userAlreadyExists');
            } else if (backendError === 'Failed to send verification email') {
                translatedError = t('errors.failedToSendEmail');
            } else if (backendError.includes('Invalid') || backendError.includes('expired')) {
                translatedError = backendError;
            } else {
                // Default fallback
                translatedError = backendError || t('errors.registerFailed');
            }

            setError(translatedError);
        } finally {
            setLoading(false);
        }
    };

    const isEmailInvalid = touched.userEmail && !formData.userEmail.includes('@');

    if (emailSent) {
        return (
            <AuthLayout branding={<BrandingSection />}>
                <div className="fixed top-6 right-6 z-50">
                    <LanguageSelector />
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 text-center">
                    <div className="mb-6">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('signup.checkEmail')}</h2>
                        <p className="text-gray-600">
                            {t('signup.verificationSent', { email: formData.userEmail })}
                            <br />{t('signup.spamCheck')}
                        </p>
                    </div>
                    <Button
                        onClick={() => navigate('/login')}
                        className="w-full"
                        size="lg"
                        variant="outline"
                    >
                        {t('signup.backToLogin')}
                    </Button>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout branding={<BrandingSection />}>
            <div className="fixed top-6 right-6 z-50">
                <LanguageSelector />
            </div>

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

            <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {t('signup.title')}
                    </h1>
                    <p className="text-gray-600">
                        {t('signup.subtitle')}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Input
                            label={t('signup.userEmail')} // Ensure key matches
                            name="userEmail"
                            type="email"
                            value={formData.userEmail}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={isEmailInvalid ? t('validation.emailInvalid') : undefined}
                            placeholder={t('signup.emailPlaceholder')}
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        isLoading={loading}
                    >
                        {loading ? 'Sending...' : t('signup.button') || 'Sign Up'}
                    </Button>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        {t('signup.hasAccount')}{' '}
                        <a href="/login" className="font-medium text-primary-600 hover:text-primary-500">
                            {t('signup.signIn')}
                        </a>
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
}
