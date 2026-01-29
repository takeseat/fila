import React, { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { ImpersonationProvider } from './contexts/ImpersonationContext';
import { useAuth } from './hooks/useAuth';
import { Layout } from './components/layout/Layout';
import { ImpersonationBanner } from './components/ImpersonationBanner';
import { GlobalListeners } from './components/GlobalListeners';
import { Home } from './pages/Home';
import { Login, Register } from './pages/Auth';
import VerifyEmail from './pages/VerifyEmail';
import { Waitlist } from './pages/Waitlist';
import { Customers } from './pages/Customers';
import { Settings } from './pages/Settings';
import { ProfileSettings } from './pages/Settings/Profile';
import { PerformanceReport } from './pages/reports/Performance';
import { ExecutiveReport } from './pages/reports/Executive';
import { FlowReport } from './pages/reports/Flow';
import { QueueEntriesReport } from './pages/reports/QueueEntriesReport';
import { ImpersonatePage } from './pages/ImpersonatePage';
import { OnboardingWizard } from './pages/OnboardingWizard';
import PickupOrders from './pages/PickupOrders';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

function PrivateRoute({
    children,
    requireOnboarding = false,
    mobileShell = false
}: {
    children: React.ReactNode,
    requireOnboarding?: boolean,
    mobileShell?: boolean
}) {
    const { user, restaurant, loading } = useAuth();

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

    // Onboarding Logic
    if (requireOnboarding) {
        // If we are on /onboarding, but onboarding is already done, go to Home
        if (!restaurant?.onboardingPending) {
            return <Navigate to="/" replace />;
        }
        // If pending, allow access to wizard
        return <Layout simple>{children}</Layout>; // Use simple layout for wizard
    } else {
        // If strict protected route, check if onboarding is pending
        if (restaurant?.onboardingPending) {
            return <Navigate to="/onboarding" replace />;
        }
    }

    return <Layout mobileShell={mobileShell}>{children}</Layout>;
}

// Guard to wait for language to be ready
function LanguageGuard({ children }: { children: ReactNode }) {
    const { isReady } = useLanguage();

    if (!isReady) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-subtle">
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
                <ImpersonationProvider>
                    <LanguageProvider>
                        <LanguageGuard>
                            <ImpersonationBanner />
                            <GlobalListeners />
                            <BrowserRouter>
                                <Routes>
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<Register />} />
                                    <Route path="/verify-email" element={<VerifyEmail />} />
                                    <Route
                                        path="/onboarding"
                                        element={
                                            <PrivateRoute requireOnboarding>
                                                <OnboardingWizard />
                                            </PrivateRoute>
                                        }
                                    />
                                    <Route path="/impersonate" element={<ImpersonatePage />} />

                                    {/* Home Page (Always the starting point) */}
                                    <Route
                                        path="/"
                                        element={
                                            <PrivateRoute mobileShell>
                                                <Home />
                                            </PrivateRoute>
                                        }
                                    />


                                    <Route
                                        path="/waitlist"
                                        element={
                                            <PrivateRoute mobileShell>
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
                                        path="/pickup-orders"
                                        element={
                                            <PrivateRoute mobileShell>
                                                <PickupOrders />
                                            </PrivateRoute>
                                        }
                                    />

                                    <Route
                                        path="/reports/performance"
                                        element={
                                            <PrivateRoute>
                                                <PerformanceReport />
                                            </PrivateRoute>
                                        }
                                    />

                                    <Route
                                        path="/reports/executive"
                                        element={
                                            <PrivateRoute>
                                                <ExecutiveReport />
                                            </PrivateRoute>
                                        }
                                    />

                                    <Route
                                        path="/reports/flow"
                                        element={
                                            <PrivateRoute>
                                                <FlowReport />
                                            </PrivateRoute>
                                        }
                                    />

                                    <Route
                                        path="/reports/queue-entries"
                                        element={
                                            <PrivateRoute>
                                                <QueueEntriesReport />
                                            </PrivateRoute>
                                        }
                                    />

                                    {/* Redirect /reports to /reports/performance */}
                                    <Route
                                        path="/reports"
                                        element={<Navigate to="/reports/performance" replace />}
                                    />

                                    <Route
                                        path="/settings/profile"
                                        element={
                                            <PrivateRoute mobileShell>
                                                <ProfileSettings />
                                            </PrivateRoute>
                                        }
                                    />

                                    <Route
                                        path="/settings"
                                        element={
                                            <PrivateRoute mobileShell>
                                                <Settings />
                                            </PrivateRoute>
                                        }
                                    />

                                    {/* Catch all others */}
                                    <Route path="*" element={<Navigate to="/" replace />} />
                                </Routes>
                            </BrowserRouter>
                        </LanguageGuard>
                    </LanguageProvider>
                </ImpersonationProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default App;
