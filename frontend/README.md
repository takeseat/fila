# Frontend - Restaurant Queue Management System

Frontend web application for the restaurant queue management system built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- 🔐 **Authentication**: Login and registration with JWT tokens
- 📊 **Dashboard**: Real-time metrics and analytics
- ⏱️ **Waitlist Management**: Real-time queue with WebSocket updates
- 📅 **Reservations**: Table reservation system (in development)
- 👥 **Customer CRM**: Customer database and history (in development)
- 🍽️ **Digital Menu**: Menu management (in development)
- ⭐ **NPS**: Customer satisfaction surveys (in development)
- 📧 **Campaigns**: Marketing campaigns (in development)
- 📈 **Reports**: Operational analytics (in development)

## Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:3001`

## Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

The `.env` file should contain:

```env
VITE_API_URL=http://localhost:3001
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── layout/      # Layout components (Sidebar, Header)
│   │   └── ui/          # Reusable UI components
│   ├── contexts/        # React contexts
│   │   └── AuthContext.tsx
│   ├── hooks/           # Custom hooks
│   │   └── useAuth.ts
│   ├── lib/             # Utilities and configurations
│   │   ├── api.ts       # Axios instance
│   │   └── socket.ts    # Socket.io client
│   ├── pages/           # Page components
│   │   ├── Auth.tsx     # Login/Register
│   │   ├── Dashboard.tsx
│   │   └── Waitlist.tsx
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Key Technologies

- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **React Query**: Server state management
- **Axios**: HTTP client
- **Socket.io Client**: Real-time WebSocket communication
- **Recharts**: Charts and data visualization
- **date-fns**: Date formatting

## Features Implemented

### Authentication
- Login page with email/password
- Registration page for new restaurants
- JWT token management with automatic refresh
- Protected routes with authentication guards

### Dashboard
- Real-time metrics cards (waitlist count, reservations, avg wait time)
- Hourly volume chart
- Quick overview of restaurant operations

### Waitlist Management
- Real-time list of customers in queue
- Add new customers to waitlist
- Call next customer
- Mark as seated
- Cancel entry
- Mark as no-show
- WebSocket real-time updates
- Status badges and action buttons

### Layout
- Responsive sidebar navigation
- Header with user info and logout
- Clean, modern UI with Tailwind CSS

## Development Notes

### API Integration

The frontend communicates with the backend API using Axios. The API client (`src/lib/api.ts`) includes:

- Automatic JWT token injection
- Token refresh on 401 errors
- Error handling

### Real-time Updates

WebSocket connection is established on login using Socket.io. The waitlist page listens for:

- `waitlist:created` - New entry added
- `waitlist:updated` - Entry status changed

### State Management

- **React Query**: Server state (API data, caching, refetching)
- **Context API**: Authentication state (user, restaurant, tokens)
- **Local State**: Component-specific state (forms, modals)

## Next Steps

The following pages are placeholders and need implementation:

- Reservations (list, calendar, create, manage)
- Customers (list, details, CSV import)
- Menu (categories, items, CRUD)
- NPS (surveys, responses, analytics)
- Campaigns (create, send, logs)
- Reports (detailed analytics)
- Settings (restaurant config, users)

## Demo Account

Use these credentials to test the application:

- **Email**: admin@restaurantedemo.com.br
- **Password**: admin123

## Building for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

To preview the production build:

```bash
npm run preview
```
