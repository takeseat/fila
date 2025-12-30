# Contexto do Sistema

Este documento descreve as fronteiras do sistema Fila e suas interações com atores externos e sistemas terceiros.

## Diagrama de Contexto (C4)

```mermaid
C4Context
    title Diagrama de Contexto do Sistema Fila

    Person(customer, "Cliente Final", "Pessoa que deseja entrar na fila do restaurante.")
    Person(operator, "Operador do Restaurante", "Host/Hostess que gerencia a fila e as mesas.")
    Person(admin, "Admin do Restaurante", "Gestor que configura regras e visualiza relatórios.")

    System(fila_system, "Plataforma Fila", "Sistema de gestão de filas e comunicação com clientes.")

    System_Ext(whatsapp_zapi, "WhatsApp Gateway (Z-API)", "Serviço terceiro para envio de mensagens WhatsApp.")
    System_Ext(meta_api, "Meta Cloud API", "Futura integração oficial (Planejado).")

    Rel(customer, fila_system, "Acompanha posição na fila (Web)", "HTTPS")
    Rel(operator, fila_system, "Adiciona/Chama clientes (Web)", "HTTPS")
    Rel(admin, fila_system, "Configura sistema (Web)", "HTTPS")

    Rel(fila_system, whatsapp_zapi, "Envia notificações", "HTTPS/REST")
    Rel(fila_system, customer, "Envia notificações via WhatsApp", "WhatsApp")
```

## Detalhamento das Interações

### Atores

1.  **Cliente Final (Consumidor)**
    *   **Interação:** Passiva (recebe notificações) e Ativa (consulta status da fila via link web móvel).
    *   **Objetivo:** Saber quanto tempo falta para ser atendido sem precisar ficar fisicamente na porta.

2.  **Operador do Restaurante (Host/Hostess)**
    *   **Interação:** Intensa. Utiliza a interface principal de "Mesa/Fila".
    *   **Objetivo:** Adicionar clientes rapidamente, estimar tempos, chamar clientes e liberar mesas.

3.  **Admin do Restaurante**
    *   **Interação:** Esporádica.
    *   **Objetivo:** Configurar textos de mensagens, horários, criar usuários operadores e visualizar métricas de performance.

### Sistemas Externos

1.  **WhatsApp Gateway (Z-API)**
    *   **Tipo:** Integração atual (POC/MVP).
    *   **Função:** Ponte entre nossa API e a rede do WhatsApp. Simula uma instância de WhatsApp Web vinculada a um QR Code.
    *   **Fluxo:**
        *   Fila -> Z-API: Envio de texto (POST /send-text).
        *   Z-API -> Fila: Webhooks de status de entrega e desconexão (se configurado).

2.  **Meta Cloud API (Futuro)**
    *   **Planejamento:** Substituirá a Z-API para maior estabilidade e compliance oficial.
    *   **Impacto:** A arquitetura já prevê essa troca através da interface `IWhatsAppProvider`.

## Limites do Sistema

*   **DENTRO:**
    *   Lógica de fila e estimativa de tempo.
    *   Armazenamento de dados de clientes e histórico.
    *   Interface web responsiva para gestão.
    *   Interface web pública para acompanhamento (status page do cliente).

*   **FORA:**
    *   Delivery de mensagens (delegado ao WhatsApp).
    *   Gestão profunda de identidade do cliente final (não temos login para o consumidor final, apenas identificação por telefone).
    *   Pagamentos (fora do escopo atual).
