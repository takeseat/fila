import React, { useState, useEffect, useCallback } from 'react';
import api from '../../lib/api';
import { Spinner } from '../ui';
import { Modal } from '../ui/Modal';
import { useCreatePickupOrder } from '../../hooks/usePickupOrders';
import { InternationalPhoneInput } from '../ui/InternationalPhoneInput';
import { getCountryByCode, DEFAULT_COUNTRY } from '../../data/countries';
import { buildFullPhone } from '../../utils/phoneUtils';

interface CreatePickupOrderModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreatePickupOrderModal({ onClose, onSuccess }: CreatePickupOrderModalProps) {
    const [orderCode, setOrderCode] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY.code);
    const [customerPhone, setCustomerPhone] = useState('');
    const [notes, setNotes] = useState('');

    const [isLookingUp, setIsLookingUp] = useState(false);
    const [customerFound, setCustomerFound] = useState<any>(null);

    // Debounced customer lookup
    const lookupCustomer = useCallback(
        async (fullPhone: string, signal?: AbortSignal) => {
            if (!fullPhone) {
                setCustomerFound(null);
                return;
            }

            setIsLookingUp(true);
            try {
                const { data } = await api.get(`/customers?fullPhone=${encodeURIComponent(fullPhone)}`, { signal });

                if (data.success && data.data) {
                    setCustomerFound(data.data);
                    // Auto-fill form
                    if (data.data.name) setCustomerName(data.data.name);
                    if (data.data.notes) setNotes(data.data.notes);
                    // WhatsApp opt-in is always true, no longer configurable per customer
                } else {
                    setCustomerFound(null);
                    // Clear name if it was auto-filled? Better to keep what user typed if they started typing before lookup
                }
            } catch (error: any) {
                if (error.name !== 'CanceledError') {
                    setCustomerFound(null);
                }
            } finally {
                setIsLookingUp(false);
            }
        },
        []
    );

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const timer = setTimeout(() => {
            const minLength = countryCode === 'BR' ? 10 : 6;
            const digitsOnly = customerPhone.replace(/\D/g, '');

            if (digitsOnly.length >= minLength) {
                const country = getCountryByCode(countryCode) || DEFAULT_COUNTRY;
                const fullPhone = buildFullPhone(country.ddi, customerPhone);
                lookupCustomer(fullPhone, signal);
            } else {
                setCustomerFound(null);
            }
        }, 500);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [customerPhone, countryCode, lookupCustomer]);

    const createOrder = useCreatePickupOrder();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Format to E.164 using the selected country DDI
        const country = getCountryByCode(countryCode) || DEFAULT_COUNTRY;
        const phoneE164 = buildFullPhone(country.ddi, customerPhone);

        await createOrder.mutateAsync({
            orderCode,
            customerName: customerName || undefined,
            customerPhoneE164: phoneE164,
            customerCountryCode: countryCode,
            notes: notes || undefined,
            whatsappOptIn: true,
        });

        onSuccess();
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Novo Pedido">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Order Code */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                        Código do Pedido *
                    </label>
                    <input
                        type="text"
                        required
                        value={orderCode}
                        onChange={(e) => setOrderCode(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Ex: #001"
                    />
                </div>

                {/* Customer Phone */}
                <div>
                    <InternationalPhoneInput
                        label="Celular do Cliente"
                        countryCode={countryCode}
                        phoneNumber={customerPhone}
                        onChange={(code, phone) => {
                            setCountryCode(code);
                            setCustomerPhone(phone);
                        }}
                        required
                    />
                    <div className="mt-1 h-5">
                        {isLookingUp && (
                            <p className="text-xs text-blue-600 flex items-center gap-1">
                                <Spinner size="sm" />
                                Buscando cliente...
                            </p>
                        )}
                        {!isLookingUp && customerFound && (
                            <p className="text-xs text-green-600 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Cliente encontrado
                            </p>
                        )}
                        {!isLookingUp && !customerFound && customerPhone.length >= (countryCode === 'BR' ? 10 : 6) && (
                            <p className="text-xs text-text-tertiary flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Novo cliente
                            </p>
                        )}
                    </div>
                </div>

                {/* Customer Name */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                        Nome do Cliente
                    </label>
                    <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Opcional"
                    />
                </div>

                {/* Notes */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                        Observações
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Observações sobre o pedido..."
                    />
                </div>



                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-text-secondary hover:bg-bg-subtle rounded-lg"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={createOrder.isPending}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {createOrder.isPending ? 'Adicionando...' : 'Adicionar'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
