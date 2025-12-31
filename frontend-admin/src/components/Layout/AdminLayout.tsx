import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Building2 } from 'lucide-react'

interface AdminLayoutProps {
    children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('admin_user') || '{}')

    const handleLogout = () => {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_user')
        navigate('/login')
    }

    return (
        <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex' }}>
            {/* Sidebar */}
            <div style={{ width: '250px', background: '#1e293b', borderRight: '1px solid #334155', padding: '1.5rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#f1f5f9' }}>
                        TakeSeat Admin
                    </h1>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                        System Administrator
                    </p>
                </div>

                <nav>
                    <button
                        onClick={() => navigate('/restaurants')}
                        style={{ width: '100%', padding: '0.75rem', textAlign: 'left', borderRadius: '6px', background: '#334155', color: '#f1f5f9', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Building2 size={18} />
                        Restaurants
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <div style={{ height: '64px', background: '#1e293b', borderBottom: '1px solid #334155', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>{user.name}</span>
                        <button
                            onClick={handleLogout}
                            style={{ padding: '0.5rem', borderRadius: '6px', background: '#334155', color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Page Content */}
                <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                    {children}
                </div>
            </div>
        </div>
    )
}
