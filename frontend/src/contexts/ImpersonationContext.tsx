import React, { createContext, useContext, useState, useEffect } from 'react';

interface ImpersonationContextType {
    isImpersonating: boolean;
    impersonationData: {
        token: string;
        logId: string;
        restaurantName: string;
    } | null;
    setImpersonation: (data: { token: string; logId: string; restaurantName: string }) => void;
    exitImpersonation: () => void;
}

const ImpersonationContext = createContext<ImpersonationContextType | undefined>(undefined);

export function ImpersonationProvider({ children }: { children: React.ReactNode }) {
    const [impersonationData, setImpersonationData] = useState<{
        token: string;
        logId: string;
        restaurantName: string;
    } | null>(null);

    useEffect(() => {
        // Check if impersonation data exists in sessionStorage
        const stored = sessionStorage.getItem('impersonation');
        if (stored) {
            try {
                setImpersonationData(JSON.parse(stored));
            } catch (e) {
                sessionStorage.removeItem('impersonation');
            }
        }
    }, []);

    const setImpersonation = (data: { token: string; logId: string; restaurantName: string }) => {
        setImpersonationData(data);
        sessionStorage.setItem('impersonation', JSON.stringify(data));
    };

    const exitImpersonation = () => {
        setImpersonationData(null);
        sessionStorage.removeItem('impersonation');
        sessionStorage.removeItem('token'); // Clear regular auth token
        window.location.href = '/login';
    };

    return (
        <ImpersonationContext.Provider
            value={{
                isImpersonating: !!impersonationData,
                impersonationData,
                setImpersonation,
                exitImpersonation,
            }}
        >
            {children}
        </ImpersonationContext.Provider>
    );
}

export function useImpersonation() {
    const context = useContext(ImpersonationContext);
    if (!context) {
        throw new Error('useImpersonation must be used within ImpersonationProvider');
    }
    return context;
}
