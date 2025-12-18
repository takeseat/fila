import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { setupSwagger } from './swagger';
import { initializeWebSocket } from './websocket';

// Routes
import authRoutes from './routes/auth.routes';
import waitlistRoutes from './routes/waitlist.routes';
import {
    reportsRouter,
} from './routes/index';
import customersRoutes from './routes/customers.routes';
import restaurantRoutes from './routes/restaurants.routes';

export const app = express();
const httpServer = createServer(app);

// Initialize WebSocket (only in non-Lambda environment)
if (process.env.NODE_ENV !== 'production') {
    initializeWebSocket(httpServer);
}

// Middleware
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger documentation
setupSwagger(app);

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/waitlist', waitlistRoutes);
app.use('/customers', customersRoutes);
app.use('/restaurants', restaurantRoutes);
app.use('/reports', reportsRouter);

// Error handler (must be last)
app.use(errorHandler);

// Start server (only in development/non-Lambda)
if (process.env.NODE_ENV !== 'production') {
    const PORT = parseInt(env.PORT);
    httpServer.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
        console.log(`🔌 WebSocket server ready`);
    });
}

export default app;
