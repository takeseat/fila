# Stack: Integrações

## WhatsApp (Mensageria)

A principal integração externa do sistema é com o WhatsApp para notificação de clientes.

### Provedor Atual: Z-API
*   **Tipo:** Gateway não-oficial (WhatsApp Web Automation).
*   **Por que foi escolhido (POC/MVP):**
    *   Custo fixo baixo (por instância) comparado ao modelo por conversa da Meta (para baixo volume).
    *   Facilidade de conexão (scan QR Code) sem necessidade de verificação de negócio complexa imediata (Meta Business Verification).
    *   Permite usar um número existente do restaurante facilmente.

### Arquitetura de Integração
*   **Envio:** API REST (POST) para o endpoint da Z-API.
*   **Recebimento (Webhooks):** Endpoint no backend para receber status de entrega (`SENT`, `DELIVERED`, `READ`) e desconexão.

### Estratégia de Migração (Futuro)
*   **Meta Cloud API (Oficial):**
    *   Recomendado para escala e estabilidade a longo prazo.
    *   Modelo de precificação por janela de conversação (24h).
    *   Exige templates pré-aprovados para início de conversa (Marketing/Utility).
*   **Abstração:** O código utiliza interfaces (`IWhatsAppProvider`) para que a troca do backend de Z-API para Meta API exija apenas a criação de uma nova classe `MetaWhatsAppProvider`, sem alterar a lógica de negócio dos serviços.
