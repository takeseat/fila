import React, { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { useAuth } from './hooks/useAuth';
import { Layout } from './components/layout/Layout';
import { Login, Register } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Waitlist } from './pages/Waitlist';
import { Customers } from './pages/Customers';
import { Settings } from './pages/Settings';
import { ProfileSettings } from './pages/Settings/Profile';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

function PrivateRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Carregando...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Layout>{children}</Layout>;
}

// Guard to wait for language to be ready
function LanguageGuard({ children }: { children: ReactNode }) {
    const { isReady } = useLanguage();

    if (!isReady) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-light-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <LanguageProvider>
                    <LanguageGuard>
                        <BrowserRouter>
                            <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />

                                <Route
                                    path="/dashboard"
                                    element={
                                        <PrivateRoute>
                                            <Dashboard />
                                        </PrivateRoute>
                                    }
                                />

                                <Route
                                    path="/waitlist"
                                    element={
                                        <PrivateRoute>
                                            <Waitlist />
                                        </PrivateRoute>
                                    }
                                />


                                <Route
                                    path="/customers"
                                    element={
                                        <PrivateRoute>
                                            <Customers />
                                        </PrivateRoute>
                                    }
                                />




                                <Route
                                    path="/reports"
                                    element={
                                        <PrivateRoute>
                                            <div className="text-center py-12">
                                                <h2 className="text-2xl font-bold text-gray-800">Relatórios</h2>
                                                <p className="text-gray-600 mt-2">Em desenvolvimento</p>
                                            </div>
                                        </PrivateRoute>
                                    }
                                />

                                <Route
                                    path="/settings/profile"
                                    element={
                                        <PrivateRoute>
                                            <ProfileSettings />
                                        </PrivateRoute>
                                    }
                                />

                                <Route
                                    path="/settings"
                                    element={
                                        <PrivateRoute>
                                            <Settings />
                                        </PrivateRoute>
                                    }
                                />

                                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            </Routes>
                        </BrowserRouter>
                    </LanguageGuard>
                </LanguageProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default App;
