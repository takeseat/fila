# Fila (TakeSeat)

Plataforma SaaS para gestão inteligente de filas de espera em restaurantes.

## 📚 Documentação

A documentação completa do projeto foi movida para a pasta `/docs`.

### Guia Rápido

*   **[Visão Geral da Arquitetura](docs/architecture/overview.md)**: Entenda os princípios, domínios e o que é o sistema.
*   **[Componentes](docs/architecture/components.md)**: Frontend, Backend, Banco de dados e Workers.
*   **[Modelo de Dados](docs/architecture/data-model.md)**: Entidades principais e relacionamentos.

### Stack Tecnológica

*   **[Frontend](docs/stack/frontend.md)**: React, Vite, TS.
*   **[Backend](docs/stack/backend.md)**: Node.js, Lambda, Prisma, Express.
*   **[Infraestrutura](docs/stack/infrastructure.md)**: AWS, Terraform, CI/CD.
*   **[Integrações](docs/stack/integrations.md)**: WhatsApp (Z-API).

### Fluxos e Decisões

*   **[Fluxos do Sistema](docs/flows/queue-flow.md)**: Detalhamento funcional de Fila, Auth, WhatsApp, etc.
*   **[Decisões Arquiteturais (ADRs)](docs/decisions/ADR-001-whatsapp-provider.md)**: Histórico de escolhas técnicas importantes.

## Desenvolvimento Local

Para rodar o projeto localmente:

1.  Clone o repositório.
2.  Configure os arquivos `.env` (Frontend e Backend).
3.  Instale dependências: `npm install`.
4.  Inicie o ambiente dev (verificar `package.json`).

## Infraestrutura

O deploy é automatizado via GitHub Actions para AWS Lambda e S3/CloudFront.
Para detalhes de infraestrutura as code, consulte a pasta `infra/terraform`.