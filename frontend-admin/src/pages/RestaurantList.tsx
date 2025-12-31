import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../services/adminApi'
import { Search, Power, PowerOff, Eye } from 'lucide-react'
import type { RestaurantFilters } from '../types'

export function RestaurantList() {
    const queryClient = useQueryClient()
    const [page, setPage] = useState(1)
    const [filters, setFilters] = useState<RestaurantFilters>({})
    const [search, setSearch] = useState('')

    const { data, isLoading } = useQuery({
        queryKey: ['restaurants', filters, page],
        queryFn: () => adminApi.listRestaurants(filters, page, 20),
    })

    const toggleStatusMutation = useMutation({
        mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
            adminApi.toggleRestaurantStatus(id, isActive),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['restaurants'] })
        },
    })

    const impersonateMutation = useMutation({
        mutationFn: (restaurantId: string) => adminApi.generateImpersonationToken(restaurantId),
        onSuccess: (data) => {
            // Open restaurant portal in new tab with impersonation token
            const appUrl = import.meta.env.VITE_APP_URL || 'http://localhost:5173'
            window.open(`${appUrl}/impersonate?token=${data.token}`, '_blank')
        },
    })

    const handleSearch = () => {
        setFilters({ ...filters, search })
        setPage(1)
    }

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#f1f5f9', marginBottom: '0.5rem' }}>
                    Restaurants
                </h1>
                <p style={{ color: '#94a3b8' }}>
                    Manage all restaurant tenants
                </p>
            </div>

            {/* Filters */}
            <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.875rem' }}>
                            Search
                        </label>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Name, email, or CNPJ..."
                            style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#f1f5f9' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.875rem' }}>
                            Status
                        </label>
                        <select
                            value={filters.isActive === undefined ? 'all' : filters.isActive ? 'active' : 'inactive'}
                            onChange={(e) => {
                                const value = e.target.value
                                setFilters({
                                    ...filters,
                                    isActive: value === 'all' ? undefined : value === 'active',
                                })
                                setPage(1)
                            }}
                            style={{ padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#f1f5f9' }}
                        >
                            <option value="all">All</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <button
                        onClick={handleSearch}
                        style={{ padding: '0.75rem 1.5rem', background: '#3b82f6', color: 'white', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Search size={18} />
                        Search
                    </button>
                </div>
            </div>

            {/* Table */}
            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    Loading...
                </div>
            ) : (
                <>
                    <div style={{ background: '#1e293b', borderRadius: '8px', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#0f172a' }}>
                                <tr>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: '#cbd5e1', fontWeight: '500' }}>Name</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: '#cbd5e1', fontWeight: '500' }}>City</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: '#cbd5e1', fontWeight: '500' }}>Status</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', color: '#cbd5e1', fontWeight: '500' }}>Users</th>
                                    <th style={{ padding: '1rem', textAlign: 'right', color: '#cbd5e1', fontWeight: '500' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.data.map((restaurant) => (
                                    <tr key={restaurant.id} style={{ borderTop: '1px solid #334155' }}>
                                        <td style={{ padding: '1rem', color: '#f1f5f9' }}>
                                            <div style={{ fontWeight: '500' }}>{restaurant.name}</div>
                                            {restaurant.email && (
                                                <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{restaurant.email}</div>
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem', color: '#cbd5e1' }}>
                                            {restaurant.city}, {restaurant.stateCode || restaurant.countryCode}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.75rem',
                                                fontWeight: '500',
                                                background: restaurant.isActive ? '#065f46' : '#7f1d1d',
                                                color: restaurant.isActive ? '#6ee7b7' : '#fecaca'
                                            }}>
                                                {restaurant.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', color: '#cbd5e1' }}>
                                            {restaurant._count?.users || 0}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <button
                                                    onClick={() => impersonateMutation.mutate(restaurant.id)}
                                                    disabled={!restaurant.isActive}
                                                    title="Impersonate"
                                                    style={{ padding: '0.5rem', borderRadius: '6px', background: '#334155', color: '#f1f5f9', opacity: restaurant.isActive ? 1 : 0.5 }}
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => toggleStatusMutation.mutate({
                                                        id: restaurant.id,
                                                        isActive: !restaurant.isActive
                                                    })}
                                                    title={restaurant.isActive ? 'Deactivate' : 'Activate'}
                                                    style={{ padding: '0.5rem', borderRadius: '6px', background: restaurant.isActive ? '#7f1d1d' : '#065f46', color: 'white' }}
                                                >
                                                    {restaurant.isActive ? <PowerOff size={16} /> : <Power size={16} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {data && data.pagination.totalPages > 1 && (
                        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                style={{ padding: '0.5rem 1rem', background: '#334155', color: '#f1f5f9', borderRadius: '6px', opacity: page === 1 ? 0.5 : 1 }}
                            >
                                Previous
                            </button>
                            <span style={{ padding: '0.5rem 1rem', color: '#cbd5e1' }}>
                                Page {page} of {data.pagination.totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(data.pagination.totalPages, p + 1))}
                                disabled={page === data.pagination.totalPages}
                                style={{ padding: '0.5rem 1rem', background: '#334155', color: '#f1f5f9', borderRadius: '6px', opacity: page === data.pagination.totalPages ? 0.5 : 1 }}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
