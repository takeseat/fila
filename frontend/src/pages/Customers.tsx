import { useState, useEffect } from 'react';
import { useCustomers, useCreateCustomer, useUpdateCustomer, useDeleteCustomer } from '../hooks/useCustomers';
import { Button, Modal, Input, EmptyState, Spinner } from '../components/ui';
import { CountrySelect } from '../components/ui/CountrySelect';
import { Customer, CustomerFormData } from '../types/customer.types';
import { format } from 'date-fns';
import { DEFAULT_COUNTRY } from '../data/countries';
import { removeMask, applyBrazilianMask, buildFullPhone } from '../utils/phoneUtils';

export function Customers() {
    const [filters, setFilters] = useState({
        name: '',
        phone: '',
        lastVisitAfter: '',
        page: 1,
        pageSize: 20,
    });
    const [phoneFilterDisplay, setPhoneFilterDisplay] = useState('');

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);

    const [formData, setFormData] = useState<CustomerFormData>({
        country: DEFAULT_COUNTRY,
        phone: '',
        name: '',
        email: '',
        notes: '',
    });
    const [phoneDisplay, setPhoneDisplay] = useState('');

    // Debounced filters
    const [debouncedFilters, setDebouncedFilters] = useState(filters);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedFilters(filters);
        }, 500);

        return () => clearTimeout(timer);
    }, [filters]);

    const { data, isLoading } = useCustomers(debouncedFilters);
    const createMutation = useCreateCustomer();
    const updateMutation = useUpdateCustomer();
    const deleteMutation = useDeleteCustomer();

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;

        if (formData.country.code === 'BR') {
            const masked = applyBrazilianMask(input);
            setPhoneDisplay(masked);
            setFormData({ ...formData, phone: removeMask(input) });
        } else {
            const digits = removeMask(input);
            setPhoneDisplay(digits);
            setFormData({ ...formData, phone: digits });
        }
    };

    const handleOpenCreateModal = () => {
        setEditingCustomer(null);
        setFormData({
            country: DEFAULT_COUNTRY,
            phone: '',
            name: '',
            email: '',
            notes: '',
        });
        setPhoneDisplay('');
        setIsFormModalOpen(true);
    };

    const handleOpenEditModal = (customer: Customer) => {
        setEditingCustomer(customer);

        // Find country by ddi
        const country = DEFAULT_COUNTRY; // You might want to find the actual country from the list

        setFormData({
            country,
            phone: customer.phone,
            name: customer.name,
            email: customer.email || '',
            notes: customer.notes || '',
        });

        // Set phone display
        if (customer.countryCode === 'BR') {
            setPhoneDisplay(applyBrazilianMask(customer.phone));
        } else {
            setPhoneDisplay(customer.phone);
        }

        setIsFormModalOpen(true);
    };

    const handleSubmitForm = (e: React.FormEvent) => {
        e.preventDefault();

        const fullPhone = buildFullPhone(formData.country.ddi, formData.phone);

        const payload = {
            name: formData.name,
            countryCode: formData.country.code,
            ddi: formData.country.ddi,
            phone: formData.phone,
            fullPhone,
            email: formData.email || undefined,
            notes: formData.notes || undefined,
        };

        if (editingCustomer) {
            updateMutation.mutate(
                { id: editingCustomer.id, data: payload },
                {
                    onSuccess: () => {
                        setIsFormModalOpen(false);
                    },
                }
            );
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => {
                    setIsFormModalOpen(false);
                },
            });
        }
    };

    const handleDelete = () => {
        if (deletingCustomer) {
            deleteMutation.mutate(deletingCustomer.id, {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setDeletingCustomer(null);
                },
            });
        }
    };

    const formatPhone = (customer: Customer) => {
        if (customer.countryCode === 'BR') {
            return `${customer.ddi} ${applyBrazilianMask(customer.phone)}`;
        }
        return `${customer.ddi} ${customer.phone}`;
    };

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return 'Nunca';
        return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    };

    const handlePhoneFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        const masked = applyBrazilianMask(input);
        setPhoneFilterDisplay(masked);
        setFilters({ ...filters, phone: removeMask(input), page: 1 });
    };

    const clearFilters = () => {
        setFilters({
            name: '',
            phone: '',
            lastVisitAfter: '',
            page: 1,
            pageSize: 20,
        });
        setPhoneFilterDisplay('');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <Spinner size="lg" className="mx-auto mb-4" />
                    <p className="text-dark-500">Carregando clientes...</p>
                </div>
            </div>
        );
    }

    const customers = data?.data || [];
    const meta = data?.meta;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-dark-900 mb-2">Clientes</h1>
                    <p className="text-dark-500">Gerencie o cadastro de clientes do restaurante</p>
                </div>
                <Button onClick={handleOpenCreateModal} size="lg" className="gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Novo Cliente
                </Button>
            </div>

            {/* Filters */}
            <div className="card-premium p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Input
                        label="Nome"
                        placeholder="Buscar por nome..."
                        value={filters.name}
                        onChange={(e) => setFilters({ ...filters, name: e.target.value, page: 1 })}
                        leftIcon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        }
                    />

                    <Input
                        label="Telefone"
                        placeholder="(DDD) Número"
                        value={phoneFilterDisplay}
                        onChange={handlePhoneFilterChange}
                        leftIcon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        }
                    />

                    <Input
                        label="Última visita após"
                        type="date"
                        value={filters.lastVisitAfter}
                        onChange={(e) => setFilters({ ...filters, lastVisitAfter: e.target.value, page: 1 })}
                        leftIcon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        }
                    />

                    <div className="flex items-end">
                        <Button
                            variant="secondary"
                            onClick={clearFilters}
                            className="w-full"
                        >
                            Limpar Filtros
                        </Button>
                    </div>
                </div>
            </div>

            {/* Table */}
            {customers.length === 0 ? (
                <div className="card-premium">
                    <EmptyState
                        icon={
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        }
                        title="Nenhum cliente encontrado"
                        description="Cadastre o primeiro cliente ou ajuste os filtros de busca"
                        action={
                            <Button onClick={handleOpenCreateModal}>
                                Cadastrar Cliente
                            </Button>
                        }
                    />
                </div>
            ) : (
                <>
                    <div className="card-premium overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-light-50 border-b border-light-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-dark-600 uppercase tracking-wider">
                                            Nome
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-dark-600 uppercase tracking-wider">
                                            Telefone
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-dark-600 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-dark-600 uppercase tracking-wider">
                                            Última Visita
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-dark-600 uppercase tracking-wider">
                                            Nº Visitas
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-dark-600 uppercase tracking-wider">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-light-200">
                                    {customers.map((customer) => (
                                        <tr key={customer.id} className="hover:bg-light-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-dark-900">{customer.name}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-dark-700">{formatPhone(customer)}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-dark-700">{customer.email || '-'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-dark-700">{formatDate(customer.lastVisitAt)}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-dark-900 font-semibold">{customer.totalVisits}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleOpenEditModal(customer)}
                                                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                        title="Editar"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setDeletingCustomer(customer);
                                                            setIsDeleteModalOpen(true);
                                                        }}
                                                        className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                                                        title="Remover"
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
                    </div>

                    {/* Pagination */}
                    {meta && meta.totalPages > 1 && (
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-dark-600">
                                Mostrando {((meta.page - 1) * meta.pageSize) + 1} a {Math.min(meta.page * meta.pageSize, meta.total)} de {meta.total} clientes
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                                    disabled={filters.page === 1}
                                >
                                    Anterior
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                                    disabled={filters.page >= meta.totalPages}
                                >
                                    Próxima
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Form Modal */}
            <Modal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                title={editingCustomer ? 'Editar Cliente' : 'Novo Cliente'}
            >
                <form onSubmit={handleSubmitForm} className="space-y-5">
                    <CountrySelect
                        value={formData.country.code}
                        onChange={(country) => {
                            setFormData({ ...formData, country, phone: '' });
                            setPhoneDisplay('');
                        }}
                        required
                    />

                    <Input
                        label="Telefone"
                        value={phoneDisplay}
                        onChange={handlePhoneChange}
                        required
                        placeholder={formData.country.code === 'BR' ? '(DDD) Número' : 'Número de telefone'}
                        leftIcon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        }
                    />

                    <Input
                        label="Nome"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        leftIcon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        }
                    />

                    <Input
                        label="Email (opcional)"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        leftIcon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        }
                    />

                    <Input
                        label="Observações (opcional)"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Ex: Cliente VIP, preferências especiais..."
                        leftIcon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                        }
                    />

                    <div className="flex gap-3 justify-end pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsFormModalOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            isLoading={createMutation.isPending || updateMutation.isPending}
                        >
                            {editingCustomer ? 'Salvar Alterações' : 'Cadastrar Cliente'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setDeletingCustomer(null);
                }}
                title="Confirmar Exclusão"
            >
                <div className="space-y-4">
                    <p className="text-dark-700">
                        Tem certeza que deseja remover o cliente <strong>{deletingCustomer?.name}</strong>?
                    </p>
                    <p className="text-sm text-dark-500">
                        Esta ação não pode ser desfeita. O histórico de visitas será mantido, mas o cliente não poderá mais ser associado a novas entradas.
                    </p>

                    <div className="flex gap-3 justify-end pt-4">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setIsDeleteModalOpen(false);
                                setDeletingCustomer(null);
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDelete}
                            isLoading={deleteMutation.isPending}
                        >
                            Remover Cliente
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
