import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUsers, User } from '../../hooks/useUsers';
import { UserForm } from '../users/UserForm';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Toast } from '../ui/Toast';
import { Icon } from '../../design-system/icons/Icon';

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
                return 'bg-indigo-100 text-indigo-800';
            case 'MANAGER':
                return 'bg-blue-100 text-blue-800';
            case 'HOSTESS':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-bg-subtle text-text-primary';
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
            <p className="text-text-secondary">{t('description')}</p>

            {/* Filters and Actions */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                {/* Search */}
                <div className="flex-1 w-full lg:max-w-md">
                    <input
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border-2 border-border-default focus:border-primary-500 focus:ring-primary-500/20 bg-bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-4"
                    />
                </div>

                {/* Filters */}
                <div className="flex gap-3 flex-wrap">
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value as any)}
                        className="px-4 py-2.5 rounded-xl border-2 border-border-default focus:border-primary-500 focus:ring-primary-500/20 bg-bg-surface text-text-primary focus:outline-none focus:ring-4"
                    >
                        <option value="">{t('filters.all')}</option>
                        <option value="ADMIN">{t('roles.ADMIN')}</option>
                        <option value="MANAGER">{t('roles.MANAGER')}</option>
                        <option value="HOSTESS">{t('roles.HOSTESS')}</option>
                    </select>

                    <select
                        value={statusFilter === undefined ? '' : String(statusFilter)}
                        onChange={(e) => setStatusFilter(e.target.value === '' ? undefined : e.target.value === 'true')}
                        className="px-4 py-2.5 rounded-xl border-2 border-border-default focus:border-primary-500 focus:ring-primary-500/20 bg-bg-surface text-text-primary focus:outline-none focus:ring-4"
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
            <div className="bg-bg-surface rounded-xl border border-border-default overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-text-tertiary">
                        {t('loading', { defaultValue: 'Carregando...' })}
                    </div>
                ) : users.length === 0 ? (
                    <div className="p-12 text-center text-text-tertiary">
                        {t('noUsers')}
                    </div>
                ) : (
                    <>
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-bg-subtle border-b border-border-default">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                                        {t('fields.name')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                                        {t('fields.email')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                                        {t('fields.role')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                                        {t('fields.language')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                                        {t('fields.status')}
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-text-tertiary uppercase tracking-wider">
                                        {t('fields.actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-bg-surface divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-bg-subtle transition-colors duration-150 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-text-primary">{user.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-text-tertiary">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                                                {t(`roles.${user.role}`)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-text-tertiary">{user.language}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-bg-subtle text-text-primary'
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
                                                    <Icon name="edit" size="sm" />
                                                </button>
                                                <button
                                                    onClick={() => handleToggleStatus(user)}
                                                    className={`p-2 rounded-lg transition-colors ${user.isActive ? 'text-warning-600 hover:bg-warning-50' : 'text-success-600 hover:bg-success-50'}`}
                                                    title={user.isActive ? t('status.deactivate') : t('status.activate')}
                                                >
                                                    {user.isActive ? (
                                                        <Icon name="lock" size="sm" />
                                                    ) : (
                                                        <Icon name="check" size="sm" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => setDeletingUser(user)}
                                                    className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                                                    title={t('actions.delete')}
                                                >
                                                    <Icon name="delete" size="sm" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile List View */}
                    <div className="md:hidden flex flex-col divide-y divide-border-default">
                        {users.map((user) => (
                            <div key={user.id} className="p-4 flex flex-col gap-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <div className="text-sm font-medium text-text-primary truncate">{user.name}</div>
                                        <div className="text-xs text-text-tertiary truncate">{user.email}</div>
                                    </div>
                                    <span className={`flex-shrink-0 px-2 py-0.5 inline-flex text-[10px] leading-4 font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-bg-subtle text-text-primary'}`}>
                                        {user.isActive ? t('status.active') : t('status.inactive')}
                                    </span>
                                </div>
                                
                                <div className="flex items-center gap-2 text-xs text-text-secondary">
                                    <span className={`px-2 py-0.5 rounded border ${getRoleBadgeColor(user.role)}`}>{t(`roles.${user.role}`)}</span>
                                    <span>•</span>
                                    <span>{user.language}</span>
                                </div>

                                <div className="flex items-center justify-end gap-2 mt-1 pt-3 border-t border-border-default">
                                    <button
                                        onClick={() => handleEdit(user)}
                                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                        title={t('actions.edit')}
                                    >
                                        <Icon name="edit" size="sm" />
                                    </button>
                                    <button
                                        onClick={() => handleToggleStatus(user)}
                                        className={`p-2 rounded-lg transition-colors ${user.isActive ? 'text-warning-600 hover:bg-warning-50' : 'text-success-600 hover:bg-success-50'}`}
                                        title={user.isActive ? t('status.deactivate') : t('status.activate')}
                                    >
                                        {user.isActive ? (
                                            <Icon name="lock" size="sm" />
                                        ) : (
                                            <Icon name="check" size="sm" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setDeletingUser(user)}
                                        className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                                        title={t('actions.delete')}
                                    >
                                        <Icon name="delete" size="sm" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    </>
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
                    <p className="text-text-secondary">{t('confirmDelete')}</p>
                    <p className="text-sm text-text-tertiary">{t('deleteWarning')}</p>

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
