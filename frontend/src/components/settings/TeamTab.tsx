import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUsers, User } from '../../hooks/useUsers';
import { UserForm } from '../users/UserForm';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Toast } from '../ui/Toast';

interface ToastState {
    message: string;
    type: 'success' | 'error' | 'info';
}

export function TeamTab() {
    const { t } = useTranslation('users');
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<'ADMIN' | 'MANAGER' | 'HOSTESS' | ''>('');
    const [statusFilter, setStatusFilter] = useState<boolean | undefined>(undefined);

    const { users, loading, error, createUser, updateUser, updateUserStatus, deleteUser } = useUsers({
        search,
        role: roleFilter || undefined,
        isActive: statusFilter,
    });

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | undefined>();
    const [deletingUser, setDeletingUser] = useState<User | undefined>();
    const [toast, setToast] = useState<ToastState | null>(null);

    const handleCreate = () => {
        setEditingUser(undefined);
        setIsFormOpen(true);
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setIsFormOpen(true);
    };

    const handleFormSubmit = async (data: any) => {
        try {
            if (editingUser) {
                await updateUser(editingUser.id, data);
                setToast({ message: t('updateSuccess'), type: 'success' });
            } else {
                await createUser(data);
                setToast({ message: t('createSuccess'), type: 'success' });
            }
            setIsFormOpen(false);
        } catch (err: any) {
            setToast({
                message: err.response?.data?.error || t('errors.createFailed'),
                type: 'error'
            });
        }
    };

    const handleToggleStatus = async (user: User) => {
        try {
            await updateUserStatus(user.id, !user.isActive);
            setToast({ message: t('statusUpdateSuccess'), type: 'success' });
        } catch (err: any) {
            setToast({
                message: err.response?.data?.error || t('errors.updateFailed'),
                type: 'error'
            });
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deletingUser) return;
        try {
            await deleteUser(deletingUser.id);
            setDeletingUser(undefined);
            setToast({ message: t('deleteSuccess'), type: 'success' });
        } catch (err: any) {
            setToast({
                message: err.response?.data?.error || t('errors.deleteFailed'),
                type: 'error'
            });
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return 'bg-purple-100 text-purple-800';
            case 'MANAGER':
                return 'bg-blue-100 text-blue-800';
            case 'HOSTESS':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {/* Toast Notifications */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Description */}
            <p className="text-gray-600">{t('description')}</p>

            {/* Filters and Actions */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                {/* Search */}
                <div className="flex-1 w-full lg:max-w-md">
                    <input
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-300 focus:border-primary-500 focus:ring-primary-500/20 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4"
                    />
                </div>

                {/* Filters */}
                <div className="flex gap-3 flex-wrap">
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value as any)}
                        className="px-4 py-2.5 rounded-xl border-2 border-gray-300 focus:border-primary-500 focus:ring-primary-500/20 bg-white text-gray-900 focus:outline-none focus:ring-4"
                    >
                        <option value="">{t('filters.all')}</option>
                        <option value="ADMIN">{t('roles.ADMIN')}</option>
                        <option value="MANAGER">{t('roles.MANAGER')}</option>
                        <option value="HOSTESS">{t('roles.HOSTESS')}</option>
                    </select>

                    <select
                        value={statusFilter === undefined ? '' : String(statusFilter)}
                        onChange={(e) => setStatusFilter(e.target.value === '' ? undefined : e.target.value === 'true')}
                        className="px-4 py-2.5 rounded-xl border-2 border-gray-300 focus:border-primary-500 focus:ring-primary-500/20 bg-white text-gray-900 focus:outline-none focus:ring-4"
                    >
                        <option value="">{t('filters.all')}</option>
                        <option value="true">{t('filters.active')}</option>
                        <option value="false">{t('filters.inactive')}</option>
                    </select>

                    <Button onClick={handleCreate} variant="primary">
                        + {t('addUser')}
                    </Button>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Users Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-500">
                        {t('loading', { defaultValue: 'Carregando...' })}
                    </div>
                ) : users.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        {t('noUsers')}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('fields.name')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('fields.email')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('fields.role')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('fields.language')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('fields.status')}
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('fields.actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                                                {t(`roles.${user.role}`)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{user.language}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {user.isActive ? t('status.active') : t('status.inactive')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                    title={t('actions.edit')}
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleToggleStatus(user)}
                                                    className={`p-2 rounded-lg transition-colors ${user.isActive ? 'text-warning-600 hover:bg-warning-50' : 'text-success-600 hover:bg-success-50'}`}
                                                    title={user.isActive ? t('status.deactivate') : t('status.activate')}
                                                >
                                                    {user.isActive ? (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => setDeletingUser(user)}
                                                    className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                                                    title={t('actions.delete')}
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* User Form Modal */}
            <UserForm
                user={editingUser}
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
            />

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={!!deletingUser}
                onClose={() => setDeletingUser(undefined)}
                title={t('deleteUser')}
            >
                <div className="space-y-4">
                    <p className="text-gray-700">{t('confirmDelete')}</p>
                    <p className="text-sm text-gray-500">{t('deleteWarning')}</p>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            variant="secondary"
                            onClick={() => setDeletingUser(undefined)}
                        >
                            {t('actions.cancel')}
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleDeleteConfirm}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {t('actions.delete')}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
