import React, { useState } from 'react';
import { usePickupOrdersConfig, useUpdatePickupOrdersConfig } from '../../hooks/usePickupOrders';
import pickupOrdersApi from '../../services/pickupOrdersApi';

const TEMPLATE_VARIABLES = [
    '{{business_name}}',
    '{{order_code}}',
    '{{customer_name}}',
    '{{pickup_instructions}}',
    '{{created_time}}',
    '{{ready_time}}',
];

export default function PickupOrdersSettings() {
    const { data: config, isLoading } = usePickupOrdersConfig();
    const updateConfig = useUpdatePickupOrdersConfig();

    const [enabled, setEnabled] = useState(false);
    const [whatsappEnabled, setWhatsappEnabled] = useState(true);
    const [pickupInstructions, setPickupInstructions] = useState('');
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
            setEnabled(config.enabled);
            setWhatsappEnabled(config.whatsappEnabled);
            setPickupInstructions(config.config.pickupInstructions);
            setAutoTimeout(config.config.autoNotPickedUpMinutes);

            setCreatedEnabled(config.config.messages.created.enabled);
            setCreatedTemplate(config.config.messages.created.template);

            setReadyEnabled(config.config.messages.ready.enabled);
            setReadyTemplate(config.config.messages.ready.template);

            setNotPickedUpEnabled(config.config.messages.notPickedUp.enabled);
            setNotPickedUpTemplate(config.config.messages.notPickedUp.template);
        }
    }, [config]);

    const handleSave = () => {
        updateConfig.mutate({
            enabled,
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
                pickupInstructions,
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
        setPickupInstructions(defaults.pickupInstructions);
        setAutoTimeout(defaults.autoNotPickedUpMinutes);
    };

    if (isLoading) {
        return <div className="p-4">Carregando...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">Pedidos (Retirada)</h3>
                <p className="text-sm text-gray-600 mb-6">
                    Gerencie pedidos para retirada e notifique clientes por WhatsApp quando estiverem prontos.
                </p>
            </div>

            {/* Feature Toggle */}
            <div className="bg-white p-4 rounded-lg shadow">
                <label className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => setEnabled(e.target.checked)}
                        className="w-5 h-5 text-blue-600 rounded"
                    />
                    <div>
                        <div className="font-medium">Ativar Pedidos (Retirada)</div>
                        <div className="text-sm text-gray-500">
                            Habilita o módulo de pedidos para retirada
                        </div>
                    </div>
                </label>
            </div>

            {enabled && (
                <>
                    {/* WhatsApp Settings */}
                    <div className="bg-white p-4 rounded-lg shadow space-y-4">
                        <h4 className="font-medium">WhatsApp</h4>

                        <label className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                checked={whatsappEnabled}
                                onChange={(e) => setWhatsappEnabled(e.target.checked)}
                                className="w-5 h-5 text-blue-600 rounded"
                            />
                            <span>Enviar mensagens por WhatsApp</span>
                        </label>

                        {whatsappEnabled && (
                            <div className="space-y-4 pl-8">
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
                                            className="w-full p-2 border rounded text-sm"
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
                                            className="w-full p-2 border rounded text-sm"
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
                                            className="w-full p-2 border rounded text-sm"
                                            placeholder="Mensagem quando pedido não foi retirado"
                                        />
                                    )}
                                </div>

                                {/* Variables Help */}
                                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                                    <div className="font-medium mb-1">Variáveis disponíveis:</div>
                                    <div className="flex flex-wrap gap-2">
                                        {TEMPLATE_VARIABLES.map((v) => (
                                            <code key={v} className="bg-white px-2 py-1 rounded">
                                                {v}
                                            </code>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={loadDefaults}
                                    className="text-sm text-blue-600 hover:text-blue-700"
                                >
                                    Restaurar mensagens padrão
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Pickup Instructions */}
                    <div className="bg-white p-4 rounded-lg shadow space-y-2">
                        <label className="block">
                            <span className="font-medium">Instruções de retirada</span>
                            <input
                                type="text"
                                value={pickupInstructions}
                                onChange={(e) => setPickupInstructions(e.target.value)}
                                className="mt-1 w-full p-2 border rounded"
                                placeholder="Ex: Dirija-se ao balcão principal"
                            />
                        </label>
                    </div>

                    {/* Auto Timeout */}
                    <div className="bg-white p-4 rounded-lg shadow space-y-2">
                        <label className="block">
                            <span className="font-medium">Tempo para marcar como "Não retirado"</span>
                            <div className="flex items-center space-x-2 mt-1">
                                <input
                                    type="number"
                                    value={autoTimeout}
                                    onChange={(e) => setAutoTimeout(parseInt(e.target.value) || 30)}
                                    min="5"
                                    max="120"
                                    className="w-24 p-2 border rounded"
                                />
                                <span className="text-sm text-gray-600">minutos</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Após este tempo, pedidos prontos serão automaticamente marcados como não retirados
                            </p>
                        </label>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={updateConfig.isPending}
                            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {updateConfig.isPending ? 'Salvando...' : 'Salvar Configurações'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
