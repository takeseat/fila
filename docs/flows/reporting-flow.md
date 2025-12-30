# Fluxo: Relatórios

Acesso a métricas para tomada de decisão.

## Dashboard (Tempo Real)
*   **Objetivo:** Operação diária.
*   **Dados:**
    *   Tamanho atual da fila.
    *   Clientes chamados.
    *   Tempo de espera médio *atual* (dos últimos X minutos).

## Relatórios Analíticos (Histórico)
*   **Request:** `GET /reports/waiting-times`.
*   **Processamento:**
    *   Backend agrega `QueueEntries` finalizadas.
    *   Filtra por período (Hoje, Semana, Mês).
*   **Métricas Calculadas:**
    *   Tempo Médio de Espera (Wait Time).
    *   Taxa de Abandono (Cancelled/No-Show vs Seated).
    *   Pico de Horário (Busy Hours).

## Exportação
*   Possibilidade de exportar dados brutos (CSV) para análise externa (Excel/BI).
