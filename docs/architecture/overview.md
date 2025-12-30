# Arquitetura — Visão Geral

## Visão Macro
O **Fila** (projeto TakeSeat) é uma plataforma SaaS (Software as a Service) projetada para gestão eficiente de filas de espera em restaurantes e estabelecimentos similares.

O objetivo principal é substituir os tradicionais "pagers" físicos e listas de papel por uma experiência digital, onde o cliente acompanha sua posição em tempo real pelo celular e recebe notificações via WhatsApp.

## Princípios Arquiteturais

A arquitetura foi desenhada priorizando escalabilidade, baixo custo operacional em ociosidade (serverless) e isolamento de dados.

1.  **Multi-tenant por Restaurante**
    *   A aplicação serve múltiplos restaurantes simultaneamente.
    *   O isolamento é lógico (mesmo banco de dados), com `restaurantId` sendo a chave de particionamento mandatória em todas as operações de negócio.

2.  **Backend Stateless (Serverless)**
    *   Toda a lógica de backend reside em funções AWS Lambda.
    *   Não há servidores "always-on" (EC2) para a API, garantindo zero custo quando não há uso e escala automática em picos.
    *   O estado é mantido estritamente no banco de dados (Aurora Serverless/MySQL).

3.  **Eventos Assíncronos**
    *   Operações críticas (entra na fila, sai da fila) são síncronas para o usuário.
    *   Operações colaterais (envio de notificações, logs, webhooks) são tratadas de forma desacoplada onde possível, ou encadeadas de forma não-bloqueante (como visto no `WaitlistService` com chamadas otimizadas).

4.  **Provider Plugável (WhatsApp)**
    *   O sistema foi desenhado para não depender de um único provedor de mensageria.
    *   Atualmente utiliza **Z-API** (solução de gateway WhatsApp não-oficial para MVP), mas a arquitetura abstrai a implementação (`IWhatsAppProvider`) para facilitar a migração futura para a Meta Cloud API oficial.

## Principais Domínios

*   **Fila (Waitlist):** Núcleo do sistema. Gerencia posições, tempos de espera estimados e status (Aguardando, Chamado, Sentado, Cancelado, No-Show).
*   **Clientes (Customers):** Cadastro único de clientes (CRM leve), permitindo histórico de visitas e preferências.
*   **Negócio (Restaurant):** Configurações do estabelecimento, regras de fila e personalização.
*   **Comunicação:** Orquestração de mensagens de WhatsApp (Boas-vindas, Sua vez, Atualização de posição).
*   **Autenticação/Usuários:** Controle de acesso para operadores e gestores do restaurante.
