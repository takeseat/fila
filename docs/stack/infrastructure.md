# Stack: Infraestrutura (AWS)

A infraestrutura é hospedada na AWS, totalmente serverless.

## Serviços Utilizados

### 1. Compute
*   **AWS Lambda:**
    *   Execução de código backend sob demanda.
    *   Escala automática de 0 a N requisições concorrentes.
    *   Cobrança por milissegundo de execução.

### 2. Networking & API
*   **AWS API Gateway (HTTP API):**
    *   Porta de entrada para o Lambda.
    *   Gerencia rotas, CORS e (opcionalmente) autorização/Throttling.
    *   Custo menor e menor latência que REST API.

### 3. Banco de Dados
*   **Amazon Aurora Serverless v2:**
    *   MySQL-compatible.
    *   Escala vertical automática de capacidade (ACUs) baseada na carga de CPU/Memória.
    *   Alta disponibilidade e backup automático.

### 4. Storage Estático
*   **Amazon S3:**
    *   Hospedagem do build estático do Frontend (arquivos HTML, JS, CSS).
    *   Armazenamento dos pacotes `.zip` de deploy do Lambda.

### 5. CDN (Content Delivery Network)
*   **Amazon CloudFront:**
    *   Distribuição global de conteúdo com baixa latência.
    *   Cache na borda (Edge Caching).
    *   Terminação SSL/TLS (Certificados ACM).

### 6. Configuração e Segredos
*   **AWS Secrets Manager:**
    *   Armazenamento seguro da senha do banco de dados.
    *   Rotação automática (se configurado).
