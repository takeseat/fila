import { useState, useRef, useEffect } from 'react';
import { Country, COUNTRIES, DEFAULT_COUNTRY } from '../../data/countries';

interface CountrySelectProps {
    value: string; // countryCode
    onChange: (country: Country) => void;
    label?: string;
    required?: boolean;
    className?: string;
    compact?: boolean;
}

export function CountrySelect({
    value,
    onChange,
    label,
    required = false,
    className = '',
    compact = false
}: CountrySelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedCountry = COUNTRIES.find(c => c.code === value) || DEFAULT_COUNTRY;

    // Filter countries by search
    const filteredCountries = COUNTRIES.filter(country =>
        country.name.toLowerCase().includes(search.toLowerCase()) ||
        country.code.toLowerCase().includes(search.toLowerCase()) ||
        country.ddi.includes(search)
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearch('');
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    const handleSelect = (country: Country) => {
        onChange(country);
        setIsOpen(false);
        setSearch('');
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {label && (
                <label className="block text-sm font-medium text-dark-700 mb-2">
                    {label}
                    {required && <span className="text-danger-600 ml-1">*</span>}
                </label>
            )}

            {/* Selected Country Display */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between gap-2 px-4 py-3 bg-white border-2 border-dark-200 hover:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${compact ? 'justify-center rounded-l-xl rounded-r-none border-r-0' : 'rounded-xl'}`}
            >
                {compact ? (
                    <div className="flex items-center gap-1">
                        <span className="text-xl leading-none">{selectedCountry.flag}</span>
                        <svg
                            className={`w-3 h-3 text-dark-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{selectedCountry.flag}</span>
                            <div className="text-left">
                                <div className="text-sm font-medium text-dark-900">
                                    {selectedCountry.name}
                                </div>
                                <div className="text-xs text-dark-500">
                                    {selectedCountry.ddi}
                                </div>
                            </div>
                        </div>
                        <svg
                            className={`w-5 h-5 text-dark-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 w-[240px] mt-2 bg-white border border-dark-200 rounded-xl shadow-xl max-h-80 overflow-hidden left-0">
                    {/* Search Input */}
                    <div className="p-3 border-b border-dark-100">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar país..."
                            className="w-full px-3 py-2 text-sm border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            autoFocus
                        />
                    </div>

                    {/* Countries List */}
                    <div className="overflow-y-auto max-h-64">
                        {filteredCountries.length === 0 ? (
                            <div className="p-4 text-center text-sm text-dark-500">
                                Nenhum país encontrado
                            </div>
                        ) : (
                            filteredCountries.map((country) => (
                                <button
                                    key={country.code}
                                    type="button"
                                    onClick={() => handleSelect(country)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-primary-50 transition-colors ${country.code === selectedCountry.code ? 'bg-primary-50' : ''
                                        }`}
                                >
                                    <span className="text-2xl">{country.flag}</span>
                                    <div className="flex-1 text-left">
                                        <div className="text-sm font-medium text-dark-900">
                                            {country.name}
                                        </div>
                                        <div className="text-xs text-dark-500">
                                            {country.ddi}
                                        </div>
                                    </div>
                                    {country.code === selectedCountry.code && (
                                        <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
