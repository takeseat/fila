# Fluxo: Gestão de Usuários

## Criação de Usuário (Admin)

1.  **Atores:** Apenas usuários com role `ADMIN` ou `OWNER` podem criar novos operadores.
2.  **Dados:** Nome, Email, Senha Inicial, Role (Operator/Admin).
3.  **Processo:**
    *   Verifica se email já existe.
    *   Cria registro `User`.
    *   Associa `User` ao `Restaurant` atual.
    *   Define idioma padrão (herda do restaurante ou do criador).

## Herança e Configurações

*   **Idioma:** O usuário tem preferência de idioma (`pt-BR`, `en`). Isso dita a UI do painel administrativo.
*   **Status:** Admin pode inativar um usuário (soft delete ou flag `isActive: false`), revogando acesso imediato (no próximo refresh de token).

## Reset de Senha
*(Fluxo Típico - Verificar implementação específica)*
1.  Admin pode resetar senha de operador manualmente.
2.  Usuário pode alterar a própria senha no perfil.
