import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../../components/ui';
import { AVAILABLE_LANGUAGES } from '../../lib/languages';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../contexts/LanguageContext';
import { SupportedLanguage } from '../../lib/languageUtils';
import api from '../../lib/api';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    language: string;
    restaurantId: string;
}

export function ProfileSettings() {
    const { t } = useTranslation('profile');
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/users/me');
            setUser(response.data.user);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-light-300">Loading...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-danger-400">Failed to load profile</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-light-50">
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-dark-500 hover:text-dark-900 transition-colors mb-4 flex items-center gap-2 text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Voltar
                    </button>
                    <h1 className="text-3xl font-bold text-dark-900">{t('title')}</h1>
                    <p className="mt-1 text-sm text-dark-500">
                        Gerencie suas informações pessoais e preferências
                    </p>
                </div>

                {/* Cards Container */}
                <div className="space-y-6">
                    {/* Card 1 - Personal Information */}
                    <PersonalInfoCard user={user} onUpdate={fetchProfile} />

                    {/* Card 2 - Language */}
                    <LanguageCard user={user} onUpdate={fetchProfile} />

                    {/* Card 3 - Security */}
                    <SecurityCard />
                </div>
            </div>
        </div>
    );
}

// Card 1 - Personal Information
function PersonalInfoCard({ user, onUpdate }: { user: User; onUpdate: () => void }) {
    const { t } = useTranslation('profile');
    const [name, setName] = useState(user.name);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        setError('');

        try {
            await api.put('/users/me', { name });
            setSuccess(true);
            onUpdate();
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.response?.data?.error || t('profileInfo.error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-light-200">
            {/* Card Header */}
            <div className="px-6 py-5 border-b border-light-200">
                <h2 className="text-lg font-semibold text-dark-900">{t('profileInfo.title')}</h2>
                <p className="mt-1 text-sm text-dark-500">
                    Essas informações são usadas para identificar sua conta.
                </p>
            </div>

            {/* Card Content */}
            <form onSubmit={handleSubmit}>
                <div className="px-6 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name Field */}
                        <div>
                            <Input
                                label={t('profileInfo.name')}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        {/* Email Field (Read-only) */}
                        <div>
                            <Input
                                label={t('profileInfo.email')}
                                value={user.email}
                                disabled
                            />
                            <p className="mt-1.5 text-xs text-dark-400">
                                {t('profileInfo.emailReadonly')}
                            </p>
                        </div>
                    </div>

                    {/* Feedback Messages */}
                    {success && (
                        <div className="mt-4 bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-lg text-sm">
                            {t('profileInfo.success')}
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}
                </div>

                {/* Card Footer */}
                <div className="px-6 py-4 bg-light-50 border-t border-light-200 rounded-b-xl flex justify-end">
                    <Button type="submit" isLoading={loading}>
                        {t('profileInfo.save')}
                    </Button>
                </div>
            </form>
        </div>
    );
}

// Card 2 - Language
function LanguageCard({ user, onUpdate }: { user: User; onUpdate: () => void }) {
    const { t } = useTranslation('profile');
    const { setLanguage } = useLanguage();
    const { updateUser } = useAuth();
    const [language, setLocalLanguage] = useState(user.language);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = async (newLanguage: string) => {
        setLocalLanguage(newLanguage);
        setLoading(true);
        setSuccess(false);
        setError('');

        try {
            // 1. Update backend
            await api.put('/users/me', { language: newLanguage });

            // 2. Update user in AuthContext
            updateUser({ language: newLanguage });

            // 3. Apply globally via LanguageProvider
            setLanguage(newLanguage as SupportedLanguage);

            setSuccess(true);
            onUpdate();
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.response?.data?.error || t('language.error'));
            setLocalLanguage(user.language); // Revert on error
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-light-200">
            {/* Card Header */}
            <div className="px-6 py-5 border-b border-light-200">
                <h2 className="text-lg font-semibold text-dark-900">{t('language.title')}</h2>
                <p className="mt-1 text-sm text-dark-500">
                    {t('language.description')}
                </p>
            </div>

            {/* Card Content */}
            <div className="px-6 py-6">
                <div className="max-w-md">
                    <label className="block text-sm font-medium text-dark-700 mb-2">
                        {t('language.select')}
                    </label>
                    <select
                        value={language}
                        onChange={(e) => handleChange(e.target.value)}
                        disabled={loading}
                        className="w-full bg-white border border-light-300 rounded-lg px-4 py-2.5 text-dark-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {AVAILABLE_LANGUAGES.map((lang) => (
                            <option key={lang.code} value={lang.code}>
                                {lang.flag} {lang.nativeName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Feedback Messages */}
                {success && (
                    <div className="mt-4 bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-lg text-sm">
                        {t('language.success')}
                    </div>
                )}

                {error && (
                    <div className="mt-4 bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}

// Card 3 - Security (Password)
function SecurityCard() {
    const { t } = useTranslation('profile');
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (formData.newPassword.length < 8) {
            newErrors.newPassword = t('password.minLength');
        }

        if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = t('password.mismatch');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        setSuccess(false);
        setErrors({});

        try {
            await api.put('/users/me/password', {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });

            setSuccess(true);
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            if (err.response?.status === 401) {
                setErrors({ currentPassword: t('password.incorrectCurrent') });
            } else {
                setErrors({ general: err.response?.data?.error || t('password.error') });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-light-200">
            {/* Card Header */}
            <div className="px-6 py-5 border-b border-light-200">
                <h2 className="text-lg font-semibold text-dark-900">{t('password.title')}</h2>
                <p className="mt-1 text-sm text-dark-500">
                    Altere sua senha de acesso
                </p>
            </div>

            {/* Card Content */}
            <form onSubmit={handleSubmit}>
                <div className="px-6 py-6">
                    <div className="max-w-md space-y-5">
                        {/* Current Password */}
                        <div>
                            <Input
                                type="password"
                                label={t('password.current')}
                                value={formData.currentPassword}
                                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                error={errors.currentPassword}
                                required
                            />
                        </div>

                        {/* New Password */}
                        <div>
                            <Input
                                type="password"
                                label={t('password.new')}
                                value={formData.newPassword}
                                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                error={errors.newPassword}
                                required
                            />
                            <p className="mt-1.5 text-xs text-dark-400">
                                {t('password.requirements')}
                            </p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <Input
                                type="password"
                                label={t('password.confirm')}
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                error={errors.confirmPassword}
                                required
                            />
                        </div>
                    </div>

                    {/* Feedback Messages */}
                    {success && (
                        <div className="mt-4 bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-lg text-sm">
                            {t('password.success')}
                        </div>
                    )}

                    {errors.general && (
                        <div className="mt-4 bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg text-sm">
                            {errors.general}
                        </div>
                    )}
                </div>

                {/* Card Footer */}
                <div className="px-6 py-4 bg-light-50 border-t border-light-200 rounded-b-xl flex justify-end">
                    <Button type="submit" variant="secondary" isLoading={loading}>
                        {t('password.save')}
                    </Button>
                </div>
            </form>
        </div>
    );
}
