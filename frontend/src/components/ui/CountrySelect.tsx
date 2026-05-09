import { useState, useRef, useEffect } from 'react';
import { Country, COUNTRIES, DEFAULT_COUNTRY } from '../../data/countries';
import { Icon } from '../../design-system/icons/Icon';

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
    compact = false,
    showDdi = true
}: CountrySelectProps & { showDdi?: boolean }) {
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
                <label className="block text-sm font-medium text-text-primary mb-2">
                    {label}
                    {required && <span className="text-danger-600 ml-1">*</span>}
                </label>
            )}

            {/* Selected Country Display */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between gap-2 px-4 py-3 bg-bg-surface border-2 border-border-default hover:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${compact ? 'justify-center rounded-l-xl rounded-r-none border-r-0' : 'rounded-xl'}`}
            >
                {compact ? (
                    <div className="flex items-center gap-1">
                        <span className="text-xl leading-none">{selectedCountry.flag}</span>
                        <Icon 
                            name="chevronDown" 
                            size="xs" 
                            tone="secondary" 
                            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                        />
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{selectedCountry.flag}</span>
                            <div className="text-left">
                                <div className="text-sm font-medium text-text-primary">
                                    {selectedCountry.name}
                                </div>
                                {showDdi && (
                                    <div className="text-xs text-text-secondary">
                                        {selectedCountry.ddi}
                                    </div>
                                )}
                            </div>
                        </div>
                        <Icon 
                            name="chevronDown" 
                            size="sm" 
                            tone="secondary" 
                            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                        />
                    </>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 w-[240px] mt-2 bg-bg-surface border border-border-default rounded-xl shadow-xl max-h-80 overflow-hidden left-0">
                    {/* Search Input */}
                    <div className="p-3 border-b border-dark-100">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar país..."
                            className="w-full px-3 py-2 text-sm border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            autoFocus
                        />
                    </div>

                    {/* Countries List */}
                    <div className="overflow-y-auto max-h-64">
                        {filteredCountries.length === 0 ? (
                            <div className="p-4 text-center text-sm text-text-secondary">
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
                                        <div className="text-sm font-medium text-text-primary">
                                            {country.name}
                                        </div>
                                        {showDdi && (
                                            <div className="text-xs text-text-secondary">
                                                {country.ddi}
                                            </div>
                                        )}
                                    </div>
                                    {country.code === selectedCountry.code && (
                                        <Icon name="check" size="sm" tone="primary" />
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
