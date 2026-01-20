import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { PlanComparison } from './PlanComparison';
import { StartTrialModal } from './StartTrialModal';
import { usePlan } from '../../hooks/usePlan';
import { useAuth } from '../../hooks/useAuth';
import { restaurantsApi } from '../../services/restaurantsApi';
import toast from 'react-hot-toast';

interface UpgradePlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpgrade: () => void;
}

export function UpgradePlanModal({ isOpen, onClose, onUpgrade }: UpgradePlanModalProps) {
    const { t } = useTranslation('plans');
    const { isPro, hasConsumedTrial, isTrialActive } = usePlan();
    const { refreshProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [isStartTrialModalOpen, setIsStartTrialModalOpen] = useState(false);

    const isTrialEligible = !isPro && !hasConsumedTrial && !isTrialActive;

    const handleStartTrial = async () => {
        try {
            setLoading(true);
            await restaurantsApi.startTrial();
            await refreshProfile();
            toast.success(t('trial.active'));
            onClose();
        } catch (error: any) {
            console.error('Failed to start trial', error);
            if (error.response?.data?.error === 'INCOMPLETE_PROFILE') {
                // Instead of redirecting, open the completion modal
                setIsStartTrialModalOpen(true);
            } else {
                toast.error('Failed to start trial');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleTrialSuccess = () => {
        setIsStartTrialModalOpen(false);
        onClose();
    };

    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={onClose}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-2xl font-bold leading-6 text-gray-900 text-center mb-2"
                                    >
                                        {t('upgrade.modalTitle')}
                                    </Dialog.Title>
                                    <div className="mt-2 text-center text-gray-500 mb-8 max-w-2xl mx-auto">
                                        <p>{t('upgrade.modalDescription')}</p>
                                    </div>

                                    <PlanComparison
                                        currentPlan="BASIC"
                                        isUpgrade={true}
                                        onSelectPro={onUpgrade}
                                        isTrialEligible={isTrialEligible}
                                        onStartTrial={handleStartTrial}
                                        isTrialLoading={loading}
                                    />

                                    <div className="mt-8 text-center">
                                        <button
                                            type="button"
                                            className="text-sm text-gray-500 hover:text-gray-700 underline"
                                            onClick={onClose}
                                        >
                                            {t('upgrade.maybeLater')}
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <StartTrialModal
                isOpen={isStartTrialModalOpen}
                onClose={() => setIsStartTrialModalOpen(false)}
                onSuccess={handleTrialSuccess}
            />
        </>
    );
}
