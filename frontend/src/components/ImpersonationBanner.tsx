import { useImpersonation } from '../contexts/ImpersonationContext';
import { X, Shield } from 'lucide-react';

export function ImpersonationBanner() {
    const { isImpersonating, impersonationData, exitImpersonation } = useImpersonation();

    if (!isImpersonating || !impersonationData) {
        return null;
    }

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 9999,
                background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                color: 'white',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Shield size={20} />
                <div>
                    <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>
                        Support Mode Active
                    </div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                        Viewing as: {impersonationData.restaurantName}
                    </div>
                </div>
            </div>

            <button
                onClick={exitImpersonation}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '6px',
                    color: 'white',
                    fontWeight: '500',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
            >
                <X size={16} />
                Exit Support Mode
            </button>
        </div>
    );
}
