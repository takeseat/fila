# Segurança

Princípios e implementações de segurança do sistema.

## Autenticação e Autorização

1.  **Operadores (Staff):**
    *   **Método:** Email e Senha.
    *   **Hashing:** `bcrypt` (com salt automático). Nunca armazenamos senhas em texto plano.
    *   **Sessão:** Stateless via **JWT (JSON Web Token)**.
        *   Token contém `userId`, `restaurantId` e `role`.
        *   Assinado com `JWT_SECRET` (HS256).
    *   **Refresh Token:** Implementado (verificar validade) para manter sessões longas sem expôr credenciais repetidamente.

2.  **Clientes Final (Fila Online):**
    *   **Acesso:** Baseado em **Token Público (Hash)** na URL.
    *   **Mecanismo:** Ao entrar na fila, gera-se um ID único/obscuro (UUID ou Hash) que permite apenas *leitura* do status daquela entrada específica.
    *   **Restrição:** O cliente não tem "login"; a segurança é baseada na posse do link (security by obscurity, aceitável para este caso de uso de baixo risco).

## Segurança de Dados

1.  **Banco de Dados:**
    *   Acesso restrito via credenciais fortes.
    *   Conexão via TLS/SSL obrigatória (configuração padrão do Aurora e driver MySQL).
    *   Isolamento Lógico: Todas as queries **DEVEM** incluir `WHERE restaurantId = ?` para evitar vazamento de dados entre tenants.

2.  **Segredos:**
    *   Variáveis de ambiente (`.env`) não são commitadas no repositório.
    *   Em produção, segredos críticos (DB) são rotacionados ou geridos via AWS Secrets Manager.

## Segurança de Redes

*   **HTTPS:** Obrigatório em todas as pontas (Frontend via CloudFront, API via API Gateway).
*   **CORS:** Configurado restritivamente para aceitar requisições apenas do domínio oficial (`takeseat.me` e subdomínios).

## Proteção de API

*   **Validação de Input:** Todos os dados de entrada (body, query, params) devem ser validados (ex: via `zod` ou manual) para prevenir SQL Injection e ataques de payload malicioso.
*   **Rate Limiting:** (Recomendado) Aplicação de limites no API Gateway ou aplicação para prevenir DDoS e abuso de envio de SMS/WhatsApp.
