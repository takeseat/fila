# Stack: Backend

O backend é construído como uma API RESTful serverless.

## Tecnologias Principais

*   **Runtime:** Node.js 20.x (LTS).
*   **Linguagem:** TypeScript (Strict mode).
*   **Framework Web:** Express.js (adaptado para Lambda via `@codegenie/serverless-express` ou similar).
*   **ORM:** Prisma.
    *   Type-safe database access.
    *   Schema-first definition (`schema.prisma`).
    *   Automated migrations.

## Padrões de Arquitetura

### Serverless Monolith
Apesar de rodar em Lambda, o código é estruturado como um monólito modular.
*   **Vantagem:** Facilidade de desenvolvimento local, compartilhamento de tipos e refatoração.
*   **Deploy:** Uma única função Lambda serve toda a API (exceto migrations). O API Gateway faz o roteamento `/{proxy+}` para esta função.

### Camadas (Layered Architecture)
1.  **Routes:** Definição de endpoints e middlewares.
2.  **Controllers:** Tratamento de HTTP (req/res), validação de entrada, formatação de resposta.
3.  **Services:** Regras de negócio puras, orquestração. Não sabem sobre HTTP.
4.  **Repositories/Dal:** (Opcional/Implícito no Prisma) Acesso a dados.

### Provider Pattern
Para integrações externas (como WhatsApp), utiliza-se o padrão Provider.
*   Interface: `IWhatsAppProvider` define os métodos esperados (`sendText`, etc).
*   Implementação: `ZApiWhatsAppProvider` (atual).
*   Benefício: Facilita testes (MockProvider) e troca de fornecedor (MetaProvider).

### Error Handling
*   Middleware global de erro.
*   Logs estruturados (CloudWatch).
