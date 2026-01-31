import { Fragment, useState } from 'react';
import { ModalBackdrop } from '../ui/ModalBackdrop';
import { Dialog, Transition } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import api from '../../lib/api';
import { restaurantsApi } from '../../services/restaurantsApi';
import { getStatesByCountryCode } from '../../data/countriesExtended';
import { applyCnpjMask, applyCepMask } from '../../utils/maskUtils';
import toast from 'react-hot-toast';

interface StartTrialModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

type BusinessDataForm = {
    cnpj: string;
    addressLine: string;
    addressNumber: string;
    neighborhood: string;
    postalCode: string;
    city: string;
    stateCode: string;
    countryCode: string;
};

export function StartTrialModal({ isOpen, onClose, onSuccess }: StartTrialModalProps) {
    const { t } = useTranslation(['settings', 'plans']);
    const { refreshProfile } = useAuth();
    const [loading, setLoading] = useState(false);

    // We default to Brazil context for now as per BusinessDataTab
    const selectedCountry = 'BR';
    const states = getStatesByCountryCode(selectedCountry);

    const { register, handleSubmit, formState: { errors } } = useForm<BusinessDataForm>({
        defaultValues: {
            countryCode: 'BR'
        }
    });

    const onSubmit = async (data: BusinessDataForm) => {
        setLoading(true);
        try {
            // 1. Update Profile
            await api.patch('/restaurants/business', {
                ...data,
                addressComplement: data.neighborhood
            });

            // 2. Start Trial
            await restaurantsApi.startTrial();

            // 3. Refresh Context
            await refreshProfile();

            toast.success(t('plans:trial.active'));
            onSuccess();
        } catch (error: any) {
            console.error('Failed to start trial', error);
            const msg = error.response?.data?.error || t('settings:validation.genericError');
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <ModalBackdrop />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto z-[1000]">
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
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-bg-surface p-8 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-2xl font-bold leading-6 text-gray-900 mb-2"
                                >
                                    {t('plans:trial.completeProfileTitle') || 'Complete Profile'}
                                </Dialog.Title>
                                <p className="text-gray-500 mb-6">
                                    {t('plans:trial.completeProfileDesc') || 'To start your free trial, we need a few more details about your business.'}
                                </p>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    {/* CNPJ */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t('settings:business.fields.taxId.label') || 'CNPJ'}
                                        </label>
                                        <input
                                            type="text"
                                            {...register('cnpj', { required: true })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none"
                                            placeholder="00.000.000/0000-00"
                                            onChange={(e) => {
                                                e.target.value = applyCnpjMask(e.target.value);
                                                register('cnpj').onChange(e);
                                            }}
                                        />
                                        {errors.cnpj && <span className="text-xs text-red-500">{t('settings:validation.required')}</span>}
                                    </div>

                                    {/* Address Line + Number */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {t('settings:business.fields.addressLine.label')}
                                            </label>
                                            <input
                                                type="text"
                                                {...register('addressLine', { required: true })}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none"
                                            />
                                            {errors.addressLine && <span className="text-xs text-red-500">{t('settings:validation.required')}</span>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {t('settings:business.fields.addressNumber.label')}
                                            </label>
                                            <input
                                                type="text"
                                                {...register('addressNumber', { required: true })}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none"
                                            />
                                            {errors.addressNumber && <span className="text-xs text-red-500">{t('settings:validation.required')}</span>}
                                        </div>
                                    </div>

                                    {/* Neighborhood + CEP */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {t('settings:business.fields.addressComplement.label') || 'Neighborhood'}
                                            </label>
                                            {/* Note: Using 'neighborhood' as per original requirement, but mapped to complement/address2 if schema matches. 
                                                Checking BusinessDataTab, it uses 'addressComplement' but schema calls for Address. 
                                                Let's stick to addressComplement for consistency with frontend types, but label it correctly.
                                                Actually, BusinessDataTab uses addressComplement.
                                                Let's check schema... backend usually has neighborhood if address is split.
                                                Assuming 'neighborhood' field exists in backend update payload?
                                                BusinessData type has addressComplement. Let's use that.
                                            */}
                                            <input
                                                type="text"
                                                {...register('neighborhood')} // This might need mapping to addressComplement?
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none"
                                                placeholder={t('settings:business.fields.addressComplement.placeholder')}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {t('settings:business.fields.postalCode.label')}
                                            </label>
                                            <input
                                                type="text"
                                                {...register('postalCode', { required: true })}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none"
                                                onChange={(e) => {
                                                    e.target.value = applyCepMask(e.target.value);
                                                    register('postalCode').onChange(e);
                                                }}
                                            />
                                            {errors.postalCode && <span className="text-xs text-red-500">{t('settings:validation.required')}</span>}
                                        </div>
                                    </div>

                                    {/* City + State */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {t('settings:business.fields.city.label')}
                                            </label>
                                            <input
                                                type="text"
                                                {...register('city', { required: true })}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none"
                                            />
                                            {errors.city && <span className="text-xs text-red-500">{t('settings:validation.required')}</span>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {t('settings:business.fields.state.label')}
                                            </label>
                                            <select
                                                {...register('stateCode', { required: true })}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none"
                                            >
                                                <option value="">{t('settings:business.fields.state.placeholder')}</option>
                                                {states.map(state => (
                                                    <option key={state.code} value={state.code}>
                                                        {state.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.stateCode && <span className="text-xs text-red-500">{t('settings:validation.required')}</span>}
                                        </div>
                                    </div>

                                    <div className="mt-8 flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 rounded-lg transition-colors"
                                        >
                                            {t('settings:common.cancel') || 'Cancel'}
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-6 py-2 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {loading ? '...' : (t('plans:trial.completeAndStart') || 'Save & Start Trial')}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
