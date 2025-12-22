import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import api from '../../lib/api';
import { COUNTRIES, getStatesByCountryCode } from '../../data/countriesExtended';

type BusinessData = {
    name: string;
    tradeName: string | null;
    email: string;
    cnpj: string | null;
    phone: string;
    countryCode: string;
    stateCode: string | null;
    city: string;
    addressLine: string | null;
    addressNumber: string | null;
    addressComplement: string | null;
    postalCode: string | null;
};

type BusinessDataForm = {
    name: string;
    tradeName: string | null;
    phone: string;
    countryCode: string;
    stateCode: string | null;
    city: string;
    addressLine: string | null;
    addressNumber: string | null;
    addressComplement: string | null;
    postalCode: string | null;
};

export function BusinessDataTab() {
    const { t } = useTranslation('settings');
    const queryClient = useQueryClient();
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('BR');

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<BusinessDataForm>();

    const { data: businessData, isLoading } = useQuery<BusinessData>({
        queryKey: ['business-data'],
        queryFn: async () => {
            const response = await api.get('/restaurants/business');
            return response.data;
        }
    });

    // Update selected country when data loads
    useEffect(() => {
        if (businessData?.countryCode) {
            setSelectedCountry(businessData.countryCode);
        }
    }, [businessData]);

    const mutation = useMutation({
        mutationFn: async (data: BusinessDataForm) => {
            const response = await api.put('/restaurants/business', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['business-data'] });
            setSuccessMessage(t('business.messages.saveSuccess'));
            setTimeout(() => setSuccessMessage(''), 3000);
        }
    });

    const onSubmit = (data: BusinessDataForm) => {
        mutation.mutate(data);
    };

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCountry = e.target.value;
        setSelectedCountry(newCountry);
        setValue('countryCode', newCountry);
        setValue('stateCode', null); // Reset state when country changes
    };

    const states = getStatesByCountryCode(selectedCountry);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Business Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1">
                        {t('business.fields.name.label')}
                    </label>
                    <input
                        type="text"
                        {...register('name', { required: true })}
                        defaultValue={businessData?.name}
                        className="w-full px-4 py-2 rounded-lg border border-light-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                        placeholder={t('business.fields.name.placeholder')}
                    />
                    {errors.name && (
                        <p className="mt-1 text-xs text-danger-500">{t('validation.required')}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1">
                        {t('business.fields.tradeName.label')}
                    </label>
                    <input
                        type="text"
                        {...register('tradeName')}
                        defaultValue={businessData?.tradeName || ''}
                        className="w-full px-4 py-2 rounded-lg border border-light-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                        placeholder={t('business.fields.tradeName.placeholder')}
                    />
                    <p className="mt-1 text-xs text-dark-500">{t('business.fields.tradeName.help')}</p>
                </div>
            </div>

            {/* Read-Only Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1">
                        {t('business.fields.email.label')}
                    </label>
                    <input
                        type="email"
                        value={businessData?.email || ''}
                        disabled
                        className="w-full px-4 py-2 rounded-lg border border-light-300 bg-light-100 text-dark-500 cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-dark-500 italic">{t('business.fields.email.readOnly')}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1">
                        {t('business.fields.taxId.label')}
                    </label>
                    <input
                        type="text"
                        value={businessData?.cnpj || 'N/A'}
                        disabled
                        className="w-full px-4 py-2 rounded-lg border border-light-300 bg-light-100 text-dark-500 cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-dark-500 italic">{t('business.fields.taxId.readOnly')}</p>
                </div>
            </div>

            {/* Phone */}
            <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">
                    {t('business.fields.phone.label')}
                </label>
                <input
                    type="tel"
                    {...register('phone', { required: true })}
                    defaultValue={businessData?.phone}
                    className="w-full px-4 py-2 rounded-lg border border-light-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    placeholder={t('business.fields.phone.placeholder')}
                />
                {errors.phone && (
                    <p className="mt-1 text-xs text-danger-500">{t('validation.required')}</p>
                )}
            </div>

            {/* Address Section */}
            <div className="pt-4 border-t border-light-200">
                <h3 className="text-lg font-semibold text-dark-800 mb-4">Address</h3>

                {/* Country */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-dark-700 mb-1">
                        {t('business.fields.country.label')}
                    </label>
                    <select
                        {...register('countryCode', { required: true })}
                        defaultValue={businessData?.countryCode || 'BR'}
                        onChange={handleCountryChange}
                        className="w-full px-4 py-2 rounded-lg border border-light-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    >
                        {COUNTRIES.map(country => (
                            <option key={country.code} value={country.code}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* State and City */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {states.length > 0 ? (
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-1">
                                {t('business.fields.state.label')}
                            </label>
                            <select
                                {...register('stateCode')}
                                defaultValue={businessData?.stateCode || ''}
                                className="w-full px-4 py-2 rounded-lg border border-light-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                            >
                                <option value="">{t('business.fields.state.placeholder')}</option>
                                {states.map(state => (
                                    <option key={state.code} value={state.code}>
                                        {state.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : null}

                    <div>
                        <label className="block text-sm font-medium text-dark-700 mb-1">
                            {t('business.fields.city.label')}
                        </label>
                        <input
                            type="text"
                            {...register('city', { required: true })}
                            defaultValue={businessData?.city}
                            className="w-full px-4 py-2 rounded-lg border border-light-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                            placeholder={t('business.fields.city.placeholder')}
                        />
                        {errors.city && (
                            <p className="mt-1 text-xs text-danger-500">{t('validation.required')}</p>
                        )}
                    </div>
                </div>

                {/* Address Line and Number */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-dark-700 mb-1">
                            {t('business.fields.addressLine.label')}
                        </label>
                        <input
                            type="text"
                            {...register('addressLine')}
                            defaultValue={businessData?.addressLine || ''}
                            className="w-full px-4 py-2 rounded-lg border border-light-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                            placeholder={t('business.fields.addressLine.placeholder')}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-700 mb-1">
                            {t('business.fields.addressNumber.label')}
                        </label>
                        <input
                            type="text"
                            {...register('addressNumber')}
                            defaultValue={businessData?.addressNumber || ''}
                            className="w-full px-4 py-2 rounded-lg border border-light-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                            placeholder={t('business.fields.addressNumber.placeholder')}
                        />
                    </div>
                </div>

                {/* Complement and Postal Code */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-dark-700 mb-1">
                            {t('business.fields.addressComplement.label')}
                        </label>
                        <input
                            type="text"
                            {...register('addressComplement')}
                            defaultValue={businessData?.addressComplement || ''}
                            className="w-full px-4 py-2 rounded-lg border border-light-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                            placeholder={t('business.fields.addressComplement.placeholder')}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-700 mb-1">
                            {t('business.fields.postalCode.label')}
                        </label>
                        <input
                            type="text"
                            {...register('postalCode')}
                            defaultValue={businessData?.postalCode || ''}
                            className="w-full px-4 py-2 rounded-lg border border-light-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                            placeholder={t('business.fields.postalCode.placeholder')}
                        />
                    </div>
                </div>
            </div>

            {/* Submit Actions */}
            <div className="flex items-center justify-end pt-6 border-t border-light-200 gap-4">
                {successMessage && (
                    <span className="text-sm text-success-600 font-medium animate-fade-in">
                        {successMessage}
                    </span>
                )}
                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {mutation.isPending ? t('business.actions.saving') : t('business.actions.save')}
                </button>
            </div>
        </form>
    );
}
