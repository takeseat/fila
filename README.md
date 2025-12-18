# Fila - Restaurant Queue Management System

Sistema completo de gestão de filas para restaurantes, SaaS, desenvolvido com Node.js, React.js e MySQL.

## 🚀 Visão Geral

Este é um sistema completo de gestão de filas para restaurantes, incluindo:

- **Fila de Espera**: Gerenciamento em tempo real com WebSocket
- **Relatórios**: Métricas operacionais e analytics

## 📋 Pré-requisitos

- **Node.js** 18+ e npm
- **MySQL** 8.0+
- Git

## 🛠️ Tecnologias

### Backend
- Node.js + TypeScript
- Express.js
- Prisma ORM
- MySQL
- JWT (autenticação)
- Socket.io (WebSocket)
- Zod (validação)
- Swagger/OpenAPI (documentação)

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router
- React Query
- Axios
- Socket.io Client
- Recharts

## 📦 Estrutura do Projeto

```
fila/
├── backend/          # API Node.js
│   ├── prisma/       # Schema e migrations
│   ├── src/
│   │   ├── config/   # Configurações
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── validators/
│   │   ├── websocket/
│   │   └── server.ts
│   └── package.json
│
├── frontend/         # App React
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   └── main.tsx
│   └── package.json
│
└── README.md
```

## 🚀 Instalação e Configuração

### 1. Clone o Repositório

```bash
git clone <repository-url>
cd fila
```

### 2. Configure o Backend

```bash
cd backend
npm install
```

Copie o arquivo de ambiente:

```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais do MySQL:

```env
DATABASE_URL="mysql://user:password@localhost:3306/fila_restaurante"
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
```

### 3. Configure o Banco de Dados

Crie o banco de dados no MySQL:

```bash
mysql -u root -p
```

```sql
CREATE DATABASE fila_restaurante CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

Execute as migrations:

```bash
npx prisma migrate dev
```

Popule o banco com dados de exemplo:

```bash
npm run seed
```

### 4. Configure o Frontend

```bash
cd ../frontend
npm install
```

Copie o arquivo de ambiente:

```bash
cp .env.example .env
```

O arquivo `.env` deve conter:

```env
VITE_API_URL=http://localhost:3001
```

## ▶️ Executando o Projeto

### Backend

```bash
cd backend
npm run dev
```

O backend estará disponível em `http://localhost:3001`

Documentação da API (Swagger): `http://localhost:3001/api-docs`

### Frontend

Em outro terminal:

```bash
cd frontend
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

## 👤 Conta de Demonstração

Após executar o seed, você pode fazer login com:

- **E-mail**: admin@restaurantedemo.com.br
- **Password**: admin123

## 📚 Documentação

- [Backend README](./backend/README.md) - Documentação completa da API
- [Frontend README](./frontend/README.md) - Documentação do frontend

## 🎯 Funcionalidades Principais

### ✅ Implementado

- [x] Autenticação JWT com refresh token
- [x] Registro de restaurantes
- [x] Dashboard com métricas em tempo real
- [x] Fila de espera com WebSocket
- [x] CRUD completo de waitlist
- [x] Sistema de reservas
- [x] CRM de clientes com histórico
- [x] Importação de clientes via CSV
- [x] Cardápio digital (categorias e itens)
- [x] NPS (surveys e respostas)
- [x] Campanhas (mock de envio)
- [x] Relatórios operacionais
- [x] Documentação Swagger

### 🚧 Em Desenvolvimento (Frontend)

- [ ] Página completa de Reservas com calendário
- [ ] Página completa de Clientes com detalhes
- [ ] Página completa de Cardápio
- [ ] Página completa de NPS
- [ ] Página completa de Campanhas
- [ ] Página completa de Relatórios
- [ ] Página de Configurações

## 🔌 API Endpoints

### Autenticação
- `POST /auth/register` - Cadastro
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh token

### Fila de Espera
- `GET /waitlist` - Listar fila
- `POST /waitlist` - Adicionar à fila
- `PATCH /waitlist/:id/call` - Chamar cliente
- `PATCH /waitlist/:id/seat` - Marcar como sentado
- `PATCH /waitlist/:id/cancel` - Cancelar
- `PATCH /waitlist/:id/no-show` - Marcar como faltoso

### Clientes
- `GET /customers` - Listar clientes
- `GET /customers/:id` - Detalhes do cliente
- `POST /customers` - Criar cliente
- `POST /customers/import` - Importar CSV

### Relatórios
- `GET /reports/waitlist-summary` - Resumo da fila

## 🔄 WebSocket

O sistema usa WebSocket para atualizações em tempo real da fila de espera:

- Conexão autenticada via JWT
- Eventos: `waitlist:created`, `waitlist:updated`
- Atualização automática da interface

## 🏗️ Arquitetura

### Backend
- **Camadas**: Routes → Controllers → Services → Prisma
- **Autenticação**: JWT com access e refresh tokens
- **Validação**: Zod schemas
- **Real-time**: Socket.io
- **Documentação**: Swagger/OpenAPI

### Frontend
- **Roteamento**: React Router
- **Estado**: React Query + Context API
- **Estilização**: Tailwind CSS
- **Real-time**: Socket.io Client
- **Gráficos**: Recharts

## 🧪 Testes

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📦 Build para Produção

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
npm run preview
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

Desenvolvido como um sistema completo de gestão de filas para restaurantes.

## 🙏 Agradecimentos

- Construído com tecnologias modernas e escaláveis
- Arquitetura limpa e extensível