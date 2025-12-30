# ADR 002: Estratégia de Internacionalização (i18n)

## Contexto
O sistema será usado em regiões diferentes (Brasil, EUA, Europa). Tanto a interface administrativa (Staff) quanto a pública (Cliente final) precisam suportar múltiplos idiomas.

## Decisão
A preferência de idioma será resolvida na seguinte ordem de prioridade:

1.  **Usuário Logado (Staff):** Campo `user.language` no banco de dados.
2.  **Cliente Final (Public Link):**
    *   Parâmetro de URL (ex: `?lang=en`).
    *   Configuração do Restaurante (`restaurant.settings.defaultLanguage`).
    *   Detecção do Browser (`navigator.language`).

No código (Frontend), utilizamos bibliotecas padrão de i18n (ex: `react-i18next`) com arquivos de tradução JSON separados.

## Consequências
*   O backend precisa armazenar o locale do usuário.
*   Templates de mensagens (WhatsApp) precisam ter versões em cada idioma suportado e o backend deve selecionar o correto com base no idioma do **Restaurante** (não do operador logado, pois o cliente recebe a mensagem).
