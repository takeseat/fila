import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../lib/api';
import { AuthLayout } from '../components/auth/AuthLayout';
import { BrandingSection } from '../components/auth/BrandingSection';
import { Button, Input } from '../components/ui';
import { validatePasswordStrength, getPasswordStrengthLabel, getPasswordStrengthColor, getPasswordStrengthTextColor, PasswordStrength } from '../utils/passwordUtils';

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { t } = useTranslation(['auth', 'common']);
    // Removed unused login hook
    // Actually, AuthContext.login takes email/pass. We have the tokens returned from complete-signup.
    // We should probably redirect to login or manually set storage.
    // Let's manually set storage to auto-login.

    const token = searchParams.get('token');

    const [status, setStatus] = useState<'verifying' | 'form' | 'success' | 'error'>('verifying');
    const [message, setMessage] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        userName: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({ score: 0, feedback: [], isStrong: false });
    const [touched, setTouched] = useState({ userName: false, password: false });
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState(''); // Store email from verification check

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setStatus('error');
                setMessage(t('verifyEmail.noToken', { ns: 'auth' }));
                return;
            }

            try {
                // Verify token validity first. API should return email if valid.
                const { data } = await api.get(`/auth/verify-email?token=${token}`);
                if (data.email) {
                    setEmail(data.email);
                    setStatus('form');
                } else {
                    // Fallback if API doesn't return email but says valid?
                    setStatus('form');
                }
            } catch (error: any) {
                setStatus('error');
                setMessage(error.response?.data?.error || t('verifyEmail.verifyError', { ns: 'auth' }));
            }
        };

        verify();
    }, [token, t]);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData({ ...formData, password: value });
        setPasswordStrength(validatePasswordStrength(value, email));
    };

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
        setMessage(''); // Clear error messages

        setTouched({ userName: true, password: true });

        if (!formData.userName.trim()) return;
        if (!passwordStrength.isStrong) return;

        setLoading(true);

        try {
            const { data } = await api.post('/auth/complete-signup', {
                token,
                userName: formData.userName,
                password: formData.password
            });

            // Auto-login
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('restaurant', JSON.stringify(data.restaurant));

            // Force a reload or update context? 
            // Since we are outside AuthProvider for "setSession", simple reload works or navigation to a protected route that re-fetches.
            // But wait, we are wrapping VerifyEmail in App, so AuthProvider is up.
            // We can't easily access setUser without exposing it.
            // Easier to just reload window to /dashboard
            window.location.href = '/dashboard';

        } catch (error: any) {
            setMessage(error.response?.data?.error || t('errors.registerFailed', { ns: 'auth' }));
        } finally {
            setLoading(false);
        }
    };

    const isNameInvalid = touched.userName && formData.userName.trim().length < 2;

    return (
        <AuthLayout branding={<BrandingSection />}>
            <div className="fixed top-6 right-6 z-50">
                {/* LanguageSelector import missing in this file, skipping for brevity or add if strictly needed */}
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
                {status === 'verifying' && (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                        <h2 className="text-xl font-bold mb-2">{t('verifyEmail.verifying', { ns: 'auth' })}</h2>
                    </div>
                )}

                {status === 'form' && (
                    <div>
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('verifyEmail.title', { ns: 'auth' })}</h1>
                            <p className="text-gray-600">
                                {t('verifyEmail.emailVerified', { ns: 'auth' })} <strong>{email}</strong>
                            </p>
                        </div>

                        {message && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">{message}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Input
                                    label={t('signup.userName', { ns: 'auth' })} // Ensure key exists or fallback
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    className={isNameInvalid ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}
                                />
                                {isNameInvalid && (
                                    <p className="mt-1 text-xs text-red-600">{t('validation.nameRequired', { ns: 'auth' })}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('signup.password', { ns: 'auth' })} <span className="text-red-600">*</span>
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
                                        <span className="text-xs">{showPassword ? t('hide', { ns: 'common' }) : t('show', { ns: 'common' })}</span>
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
                                                {getPasswordStrengthLabel(passwordStrength.score)}
                                            </span>
                                        </div>
                                        {passwordStrength.feedback.length > 0 && (
                                            <div className="text-xs text-gray-600">
                                                <ul className="space-y-0.5">
                                                    {passwordStrength.feedback.map((reqKey, idx) => (
                                                        <li key={idx} className="flex items-center gap-1">
                                                            <span className="text-red-500">✗</span>
                                                            <span>{reqKey}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                isLoading={loading}
                            >
                                {t('verifyEmail.completeButton', { ns: 'auth' })}
                            </Button>
                        </form>
                    </div>
                )}

                {status === 'error' && (
                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('verifyEmail.failedTitle', { ns: 'auth' })}</h2>
                        <p className="text-red-500 mb-6">{message}</p>
                        <Button
                            onClick={() => navigate('/login')}
                            className="w-full"
                            size="lg"
                            variant="outline"
                        >
                            {t('verifyEmail.backToLogin', { ns: 'auth' })}
                        </Button>
                    </div>
                )}
            </div>
        </AuthLayout>
    );
}
