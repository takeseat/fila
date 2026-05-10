# Mapeamento do Projeto Stitch

Este documento descreve a relação entre os componentes do código e as telas desenhadas no **Stitch**.

## Informações do Projeto
- **Título do Projeto:** Queue System Redesign
- **ID do Projeto:** `1441719586690453308`

## Mapeamento de Telas

| Tela no Stitch | ID da Tela | Dispositivo | Componente / Arquivo | Descrição |
| :--- | :--- | :--- | :--- | :--- |
| **Fila de Espera - Métricas Modernizadas** | `6e3ef2fcf5414b67a77dd66f7e465e38` | Desktop | `frontend/src/pages/Waitlist.tsx` | Dashboard principal da fila com os cards de métricas (Espera Média, Fluxo, Total). |
| **TakeSeat - Fila Mobile (Header Modernizado)** | `d4330a532cb348409415b8f82595797a` | Mobile | `frontend/src/pages/Waitlist.tsx` | Versão mobile da fila, utilizando o `MobilePageHeader.tsx` e cards verticais no `WaitlistCard.tsx`. |
| **TakeSeat - Boas-vindas Vibrante** | `dcd511361fa94bf1b2f7b3b673462a68` | Desktop | `frontend/src/pages/Waitlist.tsx` | Estado vazio (Empty State) da fila de espera, com o gradiente imersivo e mensagem de boas-vindas. |
| **Add to Queue Modal Light Design System** | `1bd081bc24fa4e22aaa2768d32e62257` | Desktop | `frontend/src/pages/Waitlist.tsx` | Modal de adição de cliente (incluindo o componente `InternationalPhoneInput`). |
| **Logo TakeSeat** | `bd07f76007ff4df3b994e83ee32d70f6` | - | `frontend/src/components/mobile/MobilePageHeader.tsx` | Ativos de marca e logotipos utilizados no header e na interface. |
| **TakeSeat - Acesso ao Portal** | `5aa3bcfe26cc4ac0aeb1c6ec1018dc68` | Desktop | `frontend/src/pages/Login.tsx` | Tela de login e autenticação do sistema. |
| **design-system.md** | `17415593053329607676` | - | `frontend/src/design-system/` | Documentação de tokens, cores e tipografia aplicada em todo o projeto. |

## Observações
- A lógica de cards (`WaitlistCard.tsx`) é compartilhada entre as telas Desktop e Mobile, utilizando classes responsivas do Tailwind (`md:`) para alternar entre os layouts horizontal e vertical conforme os designs acima.
- O header mobile foi extraído para um componente dedicado (`MobilePageHeader.tsx`) para seguir o padrão moderno de marca definido no Stitch.
