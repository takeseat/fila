# Regras de Negócio: Fila de Espera (Waitlist)

Este documento descreve as regras, validações e fluxos que regem o funcionamento da fila de espera no sistema **TakeSeat**.

## 1. Entrada na Fila (Criação de Registro)

### Identificação e Deduplicação
- O sistema utiliza o **telefone completo** (`fullPhone` = DDI + DDD + Número) como identificador único para o cliente dentro de cada restaurante (multi-tenancy).
- **Regra de Duplicidade:** Um cliente não pode ser adicionado à fila se já possuir uma entrada com o status `WAITING`.
    - *Exceção:* Se o cliente já estiver com o status `CALLED` (Chamado), o sistema permite uma nova inserção, entendendo que a posição anterior está em fase de finalização ou foi perdida.

### Vínculo com a Entidade 'Customer'
- Toda entrada na fila gera um `upsert` automático na tabela de clientes (`customers`):
    - Se o telefone já existe no restaurante: Atualiza o nome e as observações.
    - Se o telefone é novo: Cria um novo registro de cliente.
- Isso permite que o histórico de visitas (`totalVisits`, `lastVisitAt`) seja mantido de forma independente das entradas individuais na fila.

### Estimativa de Tempo
- Caso o tempo de espera não seja informado manualmente, o sistema calcula automaticamente: `(Total de pessoas aguardando + 1) * 15 minutos`.

## 2. Fluxo de Estados (Lifecycle)

| Status | Descrição | Ações Gatilhadas |
| :--- | :--- | :--- |
| `WAITING` | Cliente acabou de entrar e está aguardando sua vez. | Disparo de WhatsApp de Boas-vindas (Plano PRO). |
| `CALLED` | O estabelecimento chamou o cliente para se dirigir à recepção. | Disparo de WhatsApp "Sua vez" (Plano PRO). |
| `SEATED` | O cliente foi acomodado na mesa. | Atualiza `totalVisits` e `lastVisitAt` no registro do cliente. |
| `CANCELLED`| O cliente desistiu ou a entrada foi cancelada manualmente. | Nenhuma ação adicional. |
| `NO_SHOW` | O cliente foi chamado mas não compareceu. | Nenhuma ação adicional. |

## 3. Validações Técnicas

### Normalização de Telefone
- Todos os telefones são limpos de caracteres não numéricos (espaços, traços, parênteses) antes da persistência ou busca.
- O DDI é obrigatório e deve começar com `+`.

### Restrições de Plano
- A integração com WhatsApp (`whatsappOptIn`) é verificada contra o plano do restaurante.
- Se o restaurante não for plano `PRO`, o envio de notificações é automaticamente desabilitado, mesmo que o cliente tenha solicitado.

## 4. Métricas e Inteligência
- **Tempo de Espera Médio:** Calculado dinamicamente com base na diferença entre `seatedAt` e `createdAt` das entradas atendidas nas últimas horas.
- **Fluxo Atual:** Classificação automática (Baixa, Média, Alta) baseada no volume de entradas ativas.
