import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User, CreateUserData, UpdateUserData } from '../../hooks/useUsers';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface UserFormProps {
    user?: User;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateUserData | UpdateUserData) => Promise<void>;
}

const AVAILABLE_LANGUAGES = [
    { code: 'pt-BR', name: 'Português (BR)' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'it', name: 'Italiano' },
    { code: 'ja', name: '日本語' },
    { code: 'pl', name: 'Polski' },
    { code: 'ar', name: 'العربية' },
    { code: 'ru', name: 'Русский' },
    { code: 'zh-CN', name: '中文' },
];

export function UserForm({ user, isOpen, onClose, onSubmit }: UserFormProps) {
    const { t, i18n } = useTranslation('users');
    const isEditing = !!user;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'MANAGER' as 'ADMIN' | 'MANAGER' | 'HOSTESS',
        language: i18n.language, // Default to current user's language
        isActive: true,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                password: '',
                role: user.role,
                language: user.language,
                isActive: user.isActive,
            });
        } else {
            // Reset form for new user, keeping current language
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'MANAGER',
                language: i18n.language,
                isActive: true,
            });
        }
    }, [user, i18n.language]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isEditing) {
                // Update - don't send password if empty
                const updateData: UpdateUserData = {
                    name: formData.name,
                    email: formData.email,
                    role: formData.role,
                    language: formData.language,
                    isActive: formData.isActive,
                };
                await onSubmit(updateData);
            } else {
                // Create - password is required
                if (!formData.password || formData.password.length < 6) {
                    setError(t('errors.required'));
                    setLoading(false);
                    return;
                }
                await onSubmit(formData as CreateUserData);
            }
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.error || t('errors.createFailed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? t('editUser') : t('addUser')}>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('fields.name')} <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={t('placeholders.name')}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-300 focus:border-primary-500 focus:ring-primary-500/20 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4"
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('fields.email')} <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder={t('placeholders.email')}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-300 focus:border-primary-500 focus:ring-primary-500/20 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4"
                    />
                </div>

                {/* Password (only for new users or if changing) */}
                {!isEditing && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('fields.password')} <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder={t('placeholders.password')}
                            required={!isEditing}
                            minLength={6}
                            className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-300 focus:border-primary-500 focus:ring-primary-500/20 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4"
                        />
                    </div>
                )}

                {/* Role */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('fields.role')} <span className="text-red-600">*</span>
                    </label>
                    <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-300 focus:border-primary-500 focus:ring-primary-500/20 bg-white text-gray-900 focus:outline-none focus:ring-4"
                    >
                        <option value="ADMIN">{t('roles.ADMIN')}</option>
                        <option value="MANAGER">{t('roles.MANAGER')}</option>
                        <option value="HOSTESS">{t('roles.HOSTESS')}</option>
                    </select>
                </div>

                {/* Language */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('fields.language')} <span className="text-red-600">*</span>
                    </label>
                    <select
                        value={formData.language}
                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-300 focus:border-primary-500 focus:ring-primary-500/20 bg-white text-gray-900 focus:outline-none focus:ring-4"
                    >
                        {AVAILABLE_LANGUAGES.map((lang) => (
                            <option key={lang.code} value={lang.code}>
                                {lang.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Status (only for editing) */}
                {isEditing && (
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                            {t('status.active')}
                        </label>
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        {t('actions.cancel')}
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        loading={loading}
                    >
                        {isEditing ? t('actions.save') : t('actions.create')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
