import React, { useState } from 'react';
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
    const [whatsappOptIn, setWhatsappOptIn] = useState(true);

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
            whatsappOptIn,
        });

        onSuccess();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                {/* Header */}
                <div className="px-6 py-4 border-b">
                    <h2 className="text-xl font-semibold">Novo Pedido</h2>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Order Code */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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

                    {/* Customer Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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

                    {/* Customer Phone */}
                    <div>
                        <InternationalPhoneInput
                            label="Telefone *"
                            countryCode={countryCode}
                            phoneNumber={customerPhone}
                            onChange={(code, phone) => {
                                setCountryCode(code);
                                setCustomerPhone(phone);
                            }}
                            required
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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

                    {/* WhatsApp Opt-in */}
                    <div>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={whatsappOptIn}
                                onChange={(e) => setWhatsappOptIn(e.target.checked)}
                                className="w-4 h-4 text-blue-600 rounded"
                            />
                            <span className="text-sm text-gray-700">
                                Enviar notificações por WhatsApp
                            </span>
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={createOrder.isPending}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {createOrder.isPending ? 'Criando...' : 'Criar Pedido'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
