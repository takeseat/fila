# Fluxo: Autenticação

## Login de Operador

1.  **Credenciais:** Usuário fornece Email e Senha no Frontend.
2.  **Request:** `POST /auth/login`.
3.  **Verificação:**
    *   Busca usuário por email.
    *   Compara hash da senha (bcrypt).
    *   Verifica se usuário está ativo.
4.  **Token:**
    *   Gera **Access Token** (JWT, validade curta, ex: 15min-1h).
    *   Gera **Refresh Token** (validade longa, ex: 7 dias) salvo no banco.
5.  **Contexto:**
    *   Retorna dados do User e do Restaurant vinculado.
    *   Frontend armazena tokens (localStorage ou Cookie httpOnly) e define o idioma da interface baseado no `user.language`.

## Sessão do Cliente (Public Link)

1.  **Acesso:** Cliente clica no link recebido por SMS/WhatsApp (`/queue/abcd-1234`).
2.  **Resolução:**
    *   Backend busca `QueueEntry` onde `token == abcd-1234`.
    *   Se válido e ativo (não arquivado há muito tempo), retorna dados parciais.
3.  **Segurança:**
    *   O token permite apenas **LEITURA** daquela entrada específica.
    *   Não permite ver outros clientes da fila nem alterar status.
