import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminApi } from '../services/adminApi'

export function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const { accessToken, user } = await adminApi.login(email, password)

            if (user.role !== 'SYSADMIN') {
                setError('Access denied. SYSADMIN role required.')
                return
            }

            localStorage.setItem('admin_token', accessToken)
            localStorage.setItem('admin_user', JSON.stringify(user))
            navigate('/restaurants')
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
            <div style={{ width: '100%', maxWidth: '400px', padding: '2rem', background: '#1e293b', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#f1f5f9' }}>
                    TakeSeat Admin
                </h1>
                <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
                    SYSADMIN Portal
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.875rem' }}>
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#f1f5f9' }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.875rem' }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#f1f5f9' }}
                        />
                    </div>

                    {error && (
                        <div style={{ padding: '0.75rem', background: '#7f1d1d', border: '1px solid #991b1b', borderRadius: '6px', marginBottom: '1rem', color: '#fecaca' }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{ width: '100%', padding: '0.75rem', background: '#3b82f6', color: 'white', borderRadius: '6px', fontWeight: '500', opacity: loading ? 0.5 : 1 }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    )
}
