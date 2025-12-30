# Fluxo: Comunicação WhatsApp

Descreve como as notificações são geradas, processadas e enviadas.

## Gatilhos de Envio

O envio de mensagens é disparado por eventos de mudança de estado na fila, orquestrados pelo `WaitlistService`.

### 1. Mensagem de Boas-vindas (Welcome)
*   **Gatilho:** Cliente entra na fila (`WAITING`).
*   **Condições:**
    *   `whatsappOptIn` do cliente é `true`.
    *   Configuração `sendWelcome` do restaurante é `true`.
*   **Conteúdo:** "Olá [Nome], você entrou na fila do [Restaurante]. Sua posição é [N]."

### 2. Mensagem de Chamada (Your Turn)
*   **Gatilho:** Status muda para `CALLED`.
*   **Condições:** Opt-in e `isEnabled`.
*   **Conteúdo:** "Olá [Nome], sua mesa está pronta! Compareça à recepção."

## Processo de Envio (Técnico)

1.  **Preparação:**
    *   `WaitlistService` chama `WhatsAppService` (agora com `await`).
    *   Service busca template de mensagem e faz interpolação de variáveis ({name}, {position}, etc).

2.  **Envio ao Provider:**
    *   `WhatsAppService` delega para o provider configurado (`ZApiWhatsAppProvider`).
    *   **Normalização:** Telefone é limpo (apenas dígitos).
    *   **Request:** `POST` para API externa com timeout de 10s.

3.  **Logs:**
    *   Registro em `console.log` (CloudWatch) para debug.
    *   *(Planejado/Futuro)* Persistência em tabela `WhatsAppMessageLog` para auditoria no banco.

## Webhooks (Retorno)
*   A Z-API envia notificações de status (`SENT`, `DELIVERED`, `READ`) para o endpoint configurado no backend.
*   O backend processa para atualizar estatísticas de entrega (se implementado).
