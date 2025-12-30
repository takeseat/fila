# ADR 001: Padrão Provider para WhatsApp

## Contexto
O sistema precisa enviar notificações via WhatsApp. Existem múltiplos fornecedores no mercado (Twilio, MessageBird, Z-API, Meta Cloud API), cada um com APIs, custos e requisitos de setup diferentes.

## Decisão
Adotamos o padrão **Strategy/Provider** para abstrair o envio de mensagens.

1.  Criamos uma interface `IWhatsAppProvider` no backend.
2.  A lógica de negócio (`WhatsAppService`) depende apenas desta interface, não de implementações concretas.
3.  A implementação atual é injetada (ou instanciada) em tempo de execução.

## Consequências

### Positivas
*   **Baixo Acoplamento:** Mudar de Z-API para Meta Cloud API exigirá apenas criar uma nova classe `MetaWhatsAppProvider` e alterar uma linha de configuração/injeção.
*   **Testabilidade:** Facilita a criação de `MockWhatsAppProvider` para testes automatizados, evitando custos e spam real durante o desenvolvimento.
*   **Flexibilidade:** Permite estratégias híbridas (ex: usar Meta para alertas críticos e outro provider para marketing) no futuro.

### Negativas
*   Leve aumento na complexidade do código (indireção extra).
*   Necessidade de normalizar os formatos de dados (ex: retorno de IDs de mensagem) entre diferentes providers.
