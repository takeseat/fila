# Fluxo: Gestão da Fila

Descreve o ciclo de vida do cliente na fila, desde a entrada até a finalização.

## Estados da Fila (`QueueStatus`)
1.  **WAITING:** Cliente aguardando na fila.
2.  **CALLED:** Cliente foi chamado (mesa pronta).
3.  **SEATED:** Cliente sentou (fluxo de sucesso).
4.  **CANCELLED:** Cliente desistiu ou foi removido manualmente.
5.  **NO_SHOW:** Cliente não apareceu após ser chamado.

## Fluxo Principal

### 1. Entrada na Fila (`POST /queue`)
*   **Atores:** Operador (via Admin) ou Cliente (via Link Público - *se habilitado*).
*   **Dados:** Nome, Telefone, Tamanho da Mesa (Party Size), Notas.
*   **Processo:**
    1.  Procura `Customer` pelo telefone. Se não existir, cria. Se existir, atualiza.
    2.  Verifica se cliente já está em fila ativa no mesmo restaurante (previne duplicidade).
    3.  Cria entrada `QueueEntry` (Status: `WAITING`).
    4.  *(Assíncrono)* Dispara envio de mensagem de Boas-vindas (se Opt-in `true`).

### 2. Acompanhamento
*   O cliente recebe um link único.
*   Acessa `GET /queue/:publicToken`.
*   Visualiza: Posição atual, Tempo estimado (ETA), Status.

### 3. Chamada (`POST /queue/:id/call`)
*   **Atores:** Operador.
*   **Gatilho:** Mesa liberou.
*   **Processo:**
    1.  Atualiza status para `CALLED`.
    2.  *(Assíncrono)* Dispara envio de mensagem "Sua vez!" via WhatsApp.
    3.  Inicia cronômetro de retorno (visual no frontend).

### 4. Finalização
*   **Sentar (`POST /queue/:id/seat`):** Cliente chegou. Status -> `SEATED`. Sai da contagem da fila.
*   **Desistir (`POST /queue/:id/cancel`):** Cliente avisou que não vem. Status -> `CANCELLED`.
*   **No-Show:** Operador marca que cliente não apareceu. Status -> `NO_SHOW`.
