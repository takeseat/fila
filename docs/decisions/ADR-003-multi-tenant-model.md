# ADR 003: Modelo Multi-tenant por Database Compartilhado

## Contexto
O sistema SaaS servirá múltiplos clientes (Restaurantes). Precisamos decidir como isolar os dados de cada cliente.

## Decisão
Adotamos o modelo **Database Compartilhado com Coluna Discriminadora** (Shared Database, Shared Schema).

*   Todos os dados residem no mesmo banco de dados e nas mesmas tabelas.
*   Tabelas pertencentes a um tenant possuem uma coluna mandatória `restaurantId`.
*   O isolamento é lógico, aplicado na camada de aplicação (Queries).

## Jusitificativa
*   **Custo:** O Aurora Serverless cobra por ACU. Manter um banco ou schema por cliente seria proibitivo em custo e complexidade de gestão para uma startup inicial.
*   **Migração:** O Prisma Migrate facilita a evolução de um único schema. Gerenciar centenas de schemas diferentes seria um pesadelo operacional no estágio atual.

## Consequências
*   **Risco de Segurança:** Um bug na query (`WHERE` esquecido) pode vazar dados. É crítico ter testes e/ou middlewares (ex: Prisma Middleware ou Row Level Security se evoluirmos para Postgres) para garantir o filtro.
*   **Performance:** Tabelas crescerão com o volume agregado de todos os clientes. Índices compostos (ex: `INDEX(restaurantId, status)`) são vitais.
