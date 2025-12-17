# Backend - Restaurant Queue Management System

Backend API for the restaurant queue management system built with Node.js, TypeScript, Express, Prisma, and MySQL.

## Features

- 🔐 **Authentication**: JWT-based authentication with access and refresh tokens
- 📋 **Waitlist Management**: Real-time queue management with WebSocket updates
- 📅 **Reservations**: Table reservation system with status tracking
- 👥 **Customer CRM**: Customer database with visit history and NPS tracking
- 🍽️ **Digital Menu**: Menu categories and items management
- 📊 **NPS Surveys**: Net Promoter Score collection and calculation
- 📧 **Campaigns**: Mock email/SMS campaign system
- 📈 **Reports**: Operational analytics and metrics

## Prerequisites

- Node.js 18+ and npm
- MySQL 8.0+

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy the example environment file and update with your MySQL credentials:

```bash
cp .env.example .env
```

Edit `.env` and update:

```env
DATABASE_URL="mysql://your_user:your_password@localhost:3306/fila_restaurante"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production"
```

### 3. Create MySQL Database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE fila_restaurante CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 4. Run Migrations

```bash
npx prisma migrate dev
```

### 5. Seed Database

```bash
npm run seed
```

This will create:
- A sample restaurant
- An admin user (email: `admin@restaurantedemo.com.br`, password: `admin123`)
- Sample customers, waitlist entries, reservations, menu items, and NPS responses

### 6. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## API Documentation

Once the server is running, access the Swagger documentation at:

**http://localhost:3001/api-docs**

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed script
├── src/
│   ├── config/            # Configuration files
│   │   ├── database.ts    # Prisma client
│   │   └── env.ts         # Environment validation
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Express middleware
│   │   ├── auth.ts        # Authentication middleware
│   │   └── errorHandler.ts
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions
│   │   ├── jwt.ts         # JWT utilities
│   │   └── password.ts    # Password hashing
│   ├── validators/        # Zod validation schemas
│   ├── websocket/         # WebSocket setup
│   ├── swagger.ts         # API documentation
│   └── server.ts          # Main application
└── package.json
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new restaurant and admin user
- `POST /auth/login` - Login with email and password
- `POST /auth/refresh` - Refresh access token

### Waitlist
- `GET /waitlist` - Get current waitlist
- `POST /waitlist` - Add entry to waitlist
- `PATCH /waitlist/:id/call` - Call next customer
- `PATCH /waitlist/:id/seat` - Mark as seated
- `PATCH /waitlist/:id/cancel` - Cancel entry
- `PATCH /waitlist/:id/no-show` - Mark as no-show

### Reservations
- `GET /reservations` - List reservations (filter by date)
- `POST /reservations` - Create reservation
- `PATCH /reservations/:id/status` - Update status

### Customers
- `GET /customers` - List customers (with stats)
- `GET /customers/:id` - Get customer details
- `POST /customers` - Create customer
- `POST /customers/import` - Import customers from CSV

### Menu
- `GET /menu/categories` - List categories
- `POST /menu/categories` - Create category
- `PATCH /menu/categories/:id` - Update category
- `DELETE /menu/categories/:id` - Delete category
- `GET /menu/items` - List items
- `POST /menu/items` - Create item
- `PATCH /menu/items/:id` - Update item
- `DELETE /menu/items/:id` - Delete item

### NPS
- `GET /nps/surveys` - List surveys
- `POST /nps/surveys` - Create survey
- `PATCH /nps/surveys/:id` - Update survey
- `GET /nps/responses` - List responses
- `POST /nps/responses` - Submit response

### Campaigns
- `GET /campaigns` - List campaigns
- `POST /campaigns` - Create campaign
- `POST /campaigns/:id/simulate-send` - Simulate sending

### Reports
- `GET /reports/waitlist-summary` - Waitlist metrics
- `GET /reports/reservations-summary` - Reservations analytics
- `GET /reports/nps-summary` - NPS metrics

## WebSocket Events

Connect to WebSocket with authentication token:

```javascript
const socket = io('http://localhost:3001', {
  auth: { token: 'your-jwt-token' }
});
```

Events:
- `waitlist:created` - New entry added
- `waitlist:updated` - Entry status changed

## Database Schema

See `prisma/schema.prisma` for the complete database schema.

Key entities:
- `Restaurant` - Restaurant information
- `User` - System users (admin, manager, hostess)
- `Customer` - Customer database
- `WaitlistEntry` - Queue entries
- `Reservation` - Table reservations
- `MenuCategory` & `MenuItem` - Digital menu
- `NpsSurvey` & `NpsResponse` - NPS system
- `Campaign` & `CampaignLog` - Marketing campaigns

## Development

The backend uses a layered architecture:

1. **Routes** - Define API endpoints
2. **Controllers** - Handle HTTP requests/responses
3. **Services** - Business logic
4. **Prisma** - Database access

All endpoints (except auth) require JWT authentication via `Authorization: Bearer <token>` header.
