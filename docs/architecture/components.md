# Componentes e Responsabilidades

A arquitetura do Fila é composta por uma aplicação web monolítica no frontend e microsserviços (funções Lambda) no backend, compartilhando um banco de dados relacional.

## Diagrama de Container (Visão Lógica)

```mermaid
graph TD
    User[Browser Usuário] --> |HTTPS| CDN[AWS CloudFront]
    CDN --> |Serves| FE[Frontend Web (SPA)]
    
    FE --> |API Requests| APIG[AWS API Gateway]
    APIG --> |Invoke| LambdaAPI[AWS Lambda (API Monolith)]
    
    LambdaAPI --> |Read/Write| DB[(Aurora Serverless MySQL)]
    LambdaAPI --> |Envio msg| WhatsAppModule[Módulo WhatsApp]
    
    WhatsAppModule --> |HTTP| ExternalAPI[Z-API]
    
    MigrateLambda[AWS Lambda (Migrate)] --> |Schema Updates| DB
```

## Componentes Principais

### 1. Frontend Web
*   **Tecnologia:** React, Vite (provável), TypeScript.
*   **Responsabilidade:**
    *   Interface do Operador — Fila, Relatório de Desempenho, Configurações.
    *   Gestão de estado da UI e comunicação via REST com o Backend.
*   **O que NÃO faz:**
    *   Regras de negócio críticas (ex: cálculo de posição oficial).
    *   Comunicação direta com o banco de dados.

### 2. Backend API (Lambda)
*   **Tecnologia:** Node.js 20.x, TypeScript, Express (via `serverless-express`).
*   **Responsabilidade:**
    *   Expor endpoints REST seguros.
    *   Autenticação (JWT) e Autorização.
    *   Lógica de domínio (Fila, Restaurantes).
    *   Validações de entrada.
*   **Dependências:**
    *   `prisma`: ORM para acesso ao banco.
    *   `dotenv`: Gestão de configuração.
    *   `bcrypt`: Hashing de senhas.

### 3. Banco de Dados
*   **Tecnologia:** AWS Aurora Serverless v2 (MySQL compatível).
*   **Responsabilidade:**
    *   Persistência relacional de dados.
    *   Garantia de integridade referencial.
    *   Stored state (única fonte de verdade).

### 4. Módulo de Integrações (WhatsApp)
*   **Localização:** Dentro do Backend API (`src/services/whatsapp.service.ts` e `src/providers`).
*   **Responsabilidade:**
    *   Abstrair a complexidade do envio de mensagens.
    *   Gerenciar templates de texto.
    *   Tratar erros de timeout e falhas de rede (ex: logs de erro, retentativas se implementado).
    *   Verificar configurações de opt-in e habilitação por restaurante.

### 5. Migration Runner
*   **Tecnologia:** AWS Lambda (`takeseat-migrate-prod`).
*   **Responsabilidade:**
    *   Executar `prisma migrate deploy` em ambiente produtivo.
    *   Garantir que o schema do banco esteja sincronizado com o código.
*   **Justificativa:** Como o acesso ao banco é restrito (ou idealmente seria), um Lambda dedicado dentro da mesma rede/permissão é a forma mais segura de evoluir o schema via CI/CD.

## Separação de Responsabilidades (Domínios)

O código backend é organizado em serviços por domínio:

*   **WaitlistService:** Core do negócio. Adicionar, Chamar, Sentar, Cancelar.
*   **CustomersService:** Identificação e lookup de clientes por telefone (usado internamente pelo WaitlistService).
*   **WhatsAppService:** Orquestração de notificações.
*   **AuthService:** Login, Refresh Token.
