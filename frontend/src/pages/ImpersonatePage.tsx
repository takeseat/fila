import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useImpersonation } from '../contexts/ImpersonationContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function ImpersonatePage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setImpersonation } = useImpersonation();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            setError('No impersonation token provided');
            setLoading(false);
            return;
        }

        // Validate token and get restaurant info
        const validateAndSetup = async () => {
            try {
                // Make a test request with the impersonation token to get restaurant context
                const response = await axios.get(`${API_URL}/restaurants/current`, {
                    headers: {
                        'X-Impersonation-Token': token,
                    },
                });

                const restaurant = response.data;

                // Extract logId from token (JWT payload)
                const payload = JSON.parse(atob(token.split('.')[1]));
                const logId = payload.impersonationLogId;

                // Set impersonation context
                setImpersonation({
                    token,
                    logId,
                    restaurantName: restaurant.name,
                });

                // Store the impersonation token for API requests
                sessionStorage.setItem('impersonation_token', token);

                // Redirect to dashboard
                navigate('/dashboard', { replace: true });
            } catch (err: any) {
                console.error('Impersonation setup error:', err);
                setError(
                    err.response?.data?.error || 'Failed to validate impersonation token'
                );
                setLoading(false);
            }
        };

        validateAndSetup();
    }, [searchParams, navigate, setImpersonation]);

    if (loading) {
        return (
            <div
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#0f172a',
                }}
            >
                <div style={{ textAlign: 'center', color: '#f1f5f9' }}>
                    <div
                        style={{
                            width: '48px',
                            height: '48px',
                            border: '4px solid #334155',
                            borderTopColor: '#3b82f6',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 1rem',
                        }}
                    />
                    <p>Setting up support mode...</p>
                </div>
                <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
            </div>
        );
    }

    if (error) {
        return (
            <div
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#0f172a',
                }}
            >
                <div
                    style={{
                        maxWidth: '400px',
                        padding: '2rem',
                        background: '#1e293b',
                        borderRadius: '12px',
                        textAlign: 'center',
                    }}
                >
                    <div
                        style={{
                            width: '64px',
                            height: '64px',
                            background: '#7f1d1d',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1rem',
                            fontSize: '2rem',
                        }}
                    >
                        ⚠️
                    </div>
                    <h2 style={{ color: '#f1f5f9', marginBottom: '0.5rem' }}>
                        Impersonation Failed
                    </h2>
                    <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>{error}</p>
                    <button
                        onClick={() => (window.location.href = '/login')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: '#3b82f6',
                            color: 'white',
                            borderRadius: '6px',
                            fontWeight: '500',
                        }}
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return null;
}
