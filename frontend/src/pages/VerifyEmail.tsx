import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { AuthLayout } from '../components/auth/AuthLayout';
import { BrandingSection } from '../components/auth/BrandingSection';
import { Button } from '../components/ui';

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const token = searchParams.get('token');

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setStatus('error');
                setMessage('No verification token provided.');
                return;
            }

            try {
                await api.get(`/auth/verify-email?token=${token}`);
                setStatus('success');
            } catch (error: any) {
                setStatus('error');
                setMessage(error.response?.data?.error || 'Failed to verify email. Token may be invalid or expired.');
            }
        };

        verify();
    }, [token]);

    return (
        <AuthLayout branding={<BrandingSection />}>
            <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 text-center">
                {status === 'verifying' && (
                    <div>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                        <h2 className="text-xl font-bold mb-2">Verifying Email...</h2>
                    </div>
                )}

                {status === 'success' && (
                    <div>
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
                        <p className="text-gray-600 mb-6">Your account has been successfully activated.</p>
                        <Button
                            onClick={() => navigate('/login')}
                            className="w-full"
                            size="lg"
                        >
                            Log In
                        </Button>
                    </div>
                )}

                {status === 'error' && (
                    <div>
                        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
                        <p className="text-red-500 mb-6">{message}</p>
                        <Button
                            onClick={() => navigate('/login')}
                            className="w-full"
                            size="lg"
                            variant="outline"
                        >
                            Back to Login
                        </Button>
                    </div>
                )}
            </div>
        </AuthLayout>
    );
}
