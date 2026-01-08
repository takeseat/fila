import React, { useState, useEffect } from 'react';
import { CountrySelect } from './CountrySelect';
import { Input } from './index';
import { applyPhoneMask, removeMask, getPhonePlaceholder } from '../../utils/phoneUtils';
import { Country } from '../../data/countries';

export interface InternationalPhoneInputProps {
    countryCode: string;
    phoneNumber: string; // digits only
    onChange: (countryCode: string, phoneNumber: string) => void;
    label?: string;
    required?: boolean;
    error?: string;
    className?: string;
    disabled?: boolean;
    placeholder?: string;
}

export function InternationalPhoneInput({
    countryCode,
    phoneNumber,
    onChange,
    label,
    required,
    error,
    className = '',
    disabled,
    placeholder
}: InternationalPhoneInputProps) {
    const [displayValue, setDisplayValue] = useState('');

    // Sync display value when props change
    useEffect(() => {
        setDisplayValue(applyPhoneMask(phoneNumber, countryCode));
    }, [phoneNumber, countryCode]);

    const handleCountryChange = (country: Country) => {
        // Clear phone when country switches to avoid mask confusion
        onChange(country.code, '');
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        const digits = removeMask(input);

        // If country is BR, we update mask immediately for better UX
        // But for consistency we let the parent update the prop and we sync via useEffect
        // However, standard inputs usually update local state immediately to avoid cursor jumping
        // Here we rely on masking function which is robust enough

        onChange(countryCode, digits);
    };

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-dark-700 mb-2">
                    {label}
                    {required && <span className="text-danger-600 ml-1">*</span>}
                </label>
            )}
            <div className="flex gap-0 relative">
                <div className="w-[72px] flex-shrink-0 z-10">
                    <CountrySelect
                        value={countryCode}
                        onChange={handleCountryChange}
                        compact={true}
                        required={required}
                        className="h-full"
                    />
                </div>
                <div className="flex-1 -ml-px z-0">
                    <Input
                        value={displayValue}
                        onChange={handlePhoneChange}
                        placeholder={placeholder || getPhonePlaceholder(countryCode)}
                        required={required}
                        disabled={disabled}
                        error={error}
                        className="rounded-l-none border-l-0 focus:z-10 relative"
                    // Note: We don't pass label here as it's handled above
                    />
                </div>
            </div>
        </div>
    );
}
