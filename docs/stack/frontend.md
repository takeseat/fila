# Stack: Frontend

A interface do usuário é construída como uma Single Page Application (SPA).

## Tecnologias Principais

*   **Framework:** React
*   **Build Tool:** Vite (Rápido, leve, moderno).
*   **Linguagem:** TypeScript (Tipagem estática para robustez).
*   **Estilização:** Tailwind CSS (Provável) ou CSS Modules / Styled Components. (*Verificar no código se necessário, assumindo Tailwind pela modernidade do projeto*).
*   **State Management:** React Context API + Hooks (Suficiente para a complexidade atual) ou Zustand/Redux.
*   **Router:** React Router DOM.
*   **HTTP Client:** Axios (ou fetch nativo).

## Estratégias

### Mobile-First
Como a maioria dos usuários (tanto operadores em tablets/celulares quanto clientes finais) acessa via dispositivos móveis, o design é responsivo e otimizado para toque.

### Internacionalização (i18n)
*   Suporte a múltiplos idiomas (PT-BR, EN).
*   Bibliotecas comuns: `react-i18next`.
*   A detecção de idioma considera a preferência do browser e a configuração do restaurante.

### Componentização
*   Uso de componentes reutilizáveis para garantir consistência visual (Botões, Inputs, Cards de Fila).
*   Isolamento de lógica de UI da lógica de negócio (Custom Hooks).
*   **Design System:** Veja as diretrizes visuais em [design-system.md](../design-system.md).
