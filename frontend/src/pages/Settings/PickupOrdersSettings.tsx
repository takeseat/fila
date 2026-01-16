import React, { useState } from 'react';
import { usePickupOrdersConfig, useUpdatePickupOrdersConfig } from '../../hooks/usePickupOrders';
import pickupOrdersApi from '../../services/pickupOrdersApi';

// TEMPLATE_VARIABLES removed as it is not used in the UI anymore


export default function PickupOrdersSettings() {
    const { data: config, isLoading } = usePickupOrdersConfig();
    const updateConfig = useUpdatePickupOrdersConfig();

    const [whatsappEnabled, setWhatsappEnabled] = useState(true);
    const [autoTimeout, setAutoTimeout] = useState(30);

    const [createdEnabled, setCreatedEnabled] = useState(false);
    const [createdTemplate, setCreatedTemplate] = useState('');

    const [readyEnabled, setReadyEnabled] = useState(true);
    const [readyTemplate, setReadyTemplate] = useState('');

    const [notPickedUpEnabled, setNotPickedUpEnabled] = useState(false);
    const [notPickedUpTemplate, setNotPickedUpTemplate] = useState('');

    // Load config when available
    React.useEffect(() => {
        if (config) {

            setNotPickedUpEnabled(config.config.messages.notPickedUp.enabled);
            setNotPickedUpTemplate(config.config.messages.notPickedUp.template);
        }
    }, [config]);

    const handleSave = () => {
        updateConfig.mutate({
            enabled: true, // Always enabled if accessed (gated by Plan)
            whatsappEnabled,
            config: {
                messages: {
                    created: {
                        enabled: createdEnabled,
                        template: createdTemplate,
                    },
                    ready: {
                        enabled: readyEnabled,
                        template: readyTemplate,
                    },
                    notPickedUp: {
                        enabled: notPickedUpEnabled,
                        template: notPickedUpTemplate,
                    },
                },
                pickupInstructions: '', // Deprecated
                autoNotPickedUpMinutes: autoTimeout,
                sendCreatedMessage: createdEnabled,
            },
        });
    };

    const loadDefaults = async () => {
        const defaults = await pickupOrdersApi.getDefaults('pt-BR');
        setCreatedTemplate(defaults.messages.created.template);
        setReadyTemplate(defaults.messages.ready.template);
        setNotPickedUpTemplate(defaults.messages.notPickedUp.template);

        setAutoTimeout(defaults.autoNotPickedUpMinutes);
    };

    if (isLoading) {
        return <div className="p-4">Carregando...</div>;
    }

    return (
        <div className="space-y-6">
            {/* WhatsApp Settings */}
            <div className="space-y-4">
                <div className="flex items-center space-x-3 mb-6">
                    <input
                        type="checkbox"
                        checked={whatsappEnabled}
                        onChange={(e) => setWhatsappEnabled(e.target.checked)}
                        className="w-5 h-5 text-blue-600 rounded"
                    />
                    <label className="font-medium text-gray-900">Ativar envio de mensagens por WhatsApp para pedidos</label>
                </div>

                {whatsappEnabled && (
                    <div className="space-y-6 pl-0 md:pl-4">

                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                            <h4 className="font-medium text-blue-900 mb-2">Variáveis Disponíveis</h4>
                            <div className="flex flex-wrap gap-2 text-sm text-blue-800">
                                <span className="bg-white px-2 py-1 rounded border border-blue-100"><code>{`{{business_name}}`}</code>: Nome do restaurante</span>
                                <span className="bg-white px-2 py-1 rounded border border-blue-100"><code>{`{{order_code}}`}</code>: Código do pedido</span>
                                <span className="bg-white px-2 py-1 rounded border border-blue-100"><code>{`{{customer_name}}`}</code>: Nome do cliente</span>
                            </div>
                        </div>

                        {/* Created Message */}
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={createdEnabled}
                                    onChange={(e) => setCreatedEnabled(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded"
                                />
                                <span className="font-medium">Pedido criado</span>
                            </label>
                            {createdEnabled && (
                                <textarea
                                    value={createdTemplate}
                                    onChange={(e) => setCreatedTemplate(e.target.value)}
                                    rows={3}
                                    className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Mensagem quando pedido é criado"
                                />
                            )}
                        </div>

                        {/* Ready Message */}
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={readyEnabled}
                                    onChange={(e) => setReadyEnabled(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded"
                                />
                                <span className="font-medium">Pedido pronto</span>
                            </label>
                            {readyEnabled && (
                                <textarea
                                    value={readyTemplate}
                                    onChange={(e) => setReadyTemplate(e.target.value)}
                                    rows={3}
                                    className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Mensagem quando pedido está pronto"
                                />
                            )}
                        </div>

                        {/* Not Picked Up Message */}
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={notPickedUpEnabled}
                                    onChange={(e) => setNotPickedUpEnabled(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded"
                                />
                                <span className="font-medium">Não retirado</span>
                            </label>
                            {notPickedUpEnabled && (
                                <textarea
                                    value={notPickedUpTemplate}
                                    onChange={(e) => setNotPickedUpTemplate(e.target.value)}
                                    rows={3}
                                    className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Mensagem quando pedido não foi retirado"
                                />
                            )}
                        </div>

                        <button
                            onClick={loadDefaults}
                            className="text-sm text-blue-600 hover:text-blue-700 underline"
                        >
                            Restaurar mensagens padrão
                        </button>
                    </div>
                )}
            </div>

            {/* Auto Timeout */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-2">
                <label className="block">
                    <span className="font-medium text-gray-900">Tempo limite para retirada</span>
                    <div className="flex items-center space-x-2 mt-2">
                        <input
                            type="number"
                            value={autoTimeout}
                            onChange={(e) => setAutoTimeout(parseInt(e.target.value) || 30)}
                            min="5"
                            max="120"
                            className="w-24 p-2 border rounded"
                        />
                        <span className="text-sm text-gray-600">minutos antes de marcar como "Não retirado"</span>
                    </div>
                </label>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
                <button
                    onClick={handleSave}
                    disabled={updateConfig.isPending}
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 font-medium"
                >
                    {updateConfig.isPending ? 'Salvando...' : 'Salvar Configurações de Pedidos'}
                </button>
            </div>
        </div>
    );
}
