import { useEffect, useState } from 'react';
import { UpgradePlanModal } from './plans/UpgradePlanModal';

export function GlobalListeners() {
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

    useEffect(() => {
        const handleOpenUpgradeModal = () => setIsUpgradeModalOpen(true);

        window.addEventListener('open-upgrade-modal', handleOpenUpgradeModal);

        return () => {
            window.removeEventListener('open-upgrade-modal', handleOpenUpgradeModal);
        };
    }, []);

    const handleUpgrade = () => {
        // In a real app, this would redirect to stripe checkout
        // For now, we'll just simulate a successful upgrade
        // Or show a message that billing is coming soon
        alert("Billing integration coming soon! This is a preview.");
        setIsUpgradeModalOpen(false);
    };

    return (
        <UpgradePlanModal
            isOpen={isUpgradeModalOpen}
            onClose={() => setIsUpgradeModalOpen(false)}
            onUpgrade={handleUpgrade}
        />
    );
}
