# Deployment e Infraestrutura

A infraestrutura é 100% definida como código (IaC) utilizando Terraform e o deployment é automatizado via GitHub Actions.

## Infraestrutura (AWS)

Recursos provisionados via Terraform (`infra/terraform/`):

1.  **Compute:**
    *   **AWS Lambda:** Executa o código da API e scripts de migração.
    *   **Runtime:** Node.js 20.x no Amazon Linux 2023.
    *   **Networking:** Lambdas configurados *fora* da VPC (acesso direto à internet e ao endpoint público do banco) para simplificar conectividade com APIs externas (Z-API) e evitar custos de NAT Gateway.

2.  **Banco de Dados:**
    *   **Amazon Aurora Serverless v2:** Cluster MySQL compatível.
    *   **Acesso:** Endpoint público habilitado (protegido por Security Groups e autenticação forte).
    *   **Credenciais:** Gerenciadas via AWS Secrets Manager.

3.  **Storage & Delivery:**
    *   **S3:** Armazenamento de assets do frontend e pacotes de deploy do Lambda.
    *   **CloudFront:** CDN para entrega estática do frontend (cache, HTTPS, compressão).

## Pipeline de Automação (CI/CD)

Fluxo definido em `.github/workflows/deploy-prod.yml`:

1.  **Trigger:** Push na branch `main`.
2.  **Build Frontend:**
    *   Instala dependências (`npm ci`).
    *   Build estático via Vite.
    *   Sync para bucket S3 público.
    *   Invalidação de cache do CloudFront.
3.  **Build Backend:**
    *   Instala dependências (`npm ci`).
    *   **Hack Importante:** Recompila `bcrypt` para arquitetura Linux (`npm rebuild bcrypt --build-from-source`) ou baixa binários pré-compilados.
    *   Transpila TypeScript.
    *   Empacota `.zip` incluindo `node_modules`.
4.  **Deploy Backend:**
    *   Upload do zip para S3.
    *   Atualização do código das funções `migrate` e `api`.
    *   **Migração:** Invocação imediata do Lambda `migrate` para aplicar mudanças de schema pendentes.

## Segredos e Variáveis

*   **Variáveis de Ambiente (.env):** Injetadas durante o build (copiadas para dentro do pacote Lambda) ou definidas nas configurações do Lambda via Terraform.
*   **Segredos Sensíveis:** (DB Password, API Keys) Devem residir no Secrets Manager ou GitHub Secrets, nunca no código.
