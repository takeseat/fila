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
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(validatePasswordStrength(''));
    const [touched, setTouched] = useState({ userName: false, userEmail: false, password: false });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation('auth');

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData({ ...formData, password: value });
        setPasswordStrength(validatePasswordStrength(value, formData.userEmail));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === 'userEmail' && formData.password) {
            // Re-validate password strength when email changes (for similarity check)
            setPasswordStrength(validatePasswordStrength(formData.password, value));
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name } = e.target;
        setTouched({ ...touched, [name]: true });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Mark all as touched
        setTouched({ userName: true, userEmail: true, password: true });

        // Basic front-end validation check
        if (!formData.userName.trim()) {
            setError(t('validation.nameRequired'));
            return;
        }
        if (!formData.userEmail.includes('@')) {
            setError(t('validation.emailInvalid'));
            return;
        }

        // Validate password strength
        if (!passwordStrength.isStrong) {
            setError(t('errors.weakPassword') || 'Please use a stronger password');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                userName: formData.userName,
                userEmail: formData.userEmail,
                password: formData.password,
            };

            await register(payload);
            setEmailSent(true);
            // navigate('/dashboard'); // Removed auto-login
        } catch (err: any) {
            setError(err.response?.data?.error || t('errors.registerFailed'));
        } finally {
            setLoading(false);
        }
    };

    const isNameInvalid = touched.userName && formData.userName.trim().length < 2;
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
                            We've sent a verification link to <strong>{formData.userEmail}</strong>.
                            <br />Please check your inbox to activate your account.
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

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-5">
                        <div>
                            <Input
                                label={t('signup.userName')}
                                name="userName"
                                value={formData.userName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                className={isNameInvalid ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}
                            />
                            {isNameInvalid && (
                                <p className="mt-1 text-xs text-red-600">{t('validation.nameMin')}</p>
                            )}
                        </div>

                        <div>
                            <Input
                                label={t('signup.userEmail')}
                                type="email"
                                name="userEmail"
                                value={formData.userEmail}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                className={isEmailInvalid ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}
                            />
                            {isEmailInvalid && (
                                <p className="mt-1 text-xs text-red-600">{t('validation.emailInvalid')}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('signup.password')} <span className="text-red-600">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handlePasswordChange}
                                    onBlur={handleBlur}
                                    placeholder="••••••••"
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border-2 border-light-300 focus:border-primary-500 focus:ring-primary-500/20 bg-white text-dark-900 placeholder:text-dark-400 focus:outline-none focus:ring-4 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            {formData.password && (
                                <div className="mt-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength.score)}`}
                                                style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                                            />
                                        </div>
                                        <span className={`text-xs font-medium ${getPasswordStrengthTextColor(passwordStrength.score)}`}>
                                            {t(`passwordStrength.${getPasswordStrengthLabel(passwordStrength.score)}`)}
                                        </span>
                                    </div>

                                    {passwordStrength.feedback.length > 0 && (
                                        <div className="text-xs text-gray-600">
                                            <p className="font-medium mb-1">{t('passwordStrength.requirements')}</p>
                                            <ul className="space-y-0.5">
                                                {passwordStrength.feedback.map((reqKey, idx) => (
                                                    <li key={idx} className="flex items-center gap-1">
                                                        <span className="text-red-500">✗</span>
                                                        <span>{t(`passwordStrength.${reqKey}`)}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

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
