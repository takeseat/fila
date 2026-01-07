import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { setupSwagger } from './swagger';

// Routes
import authRoutes from './routes/auth.routes';
import waitlistRoutes from './routes/waitlist.routes';
import {
    reportsRouter,
    dashboardRouter,
    usersManagementRouter,
} from './routes/index';
import customersRoutes from './routes/customers.routes';
import restaurantRoutes from './routes/restaurants.routes';
import usersRoutes from './routes/users.routes';
import whatsappSettingsRouter from './routes/whatsapp-settings.routes';
import adminRoutes from './routes/admin.routes';
import pickupOrdersRoutes from './routes/pickup-orders.routes';
import { impersonationMiddleware } from './middleware/impersonation.middleware';
import { WhatsAppWebhookController } from './controllers/whatsapp-webhook.controller';
import { ZApiWebhookController } from './controllers/zapi-webhook.controller';

const whatsappWebhookController = new WhatsAppWebhookController();

export const app = express();
const httpServer = createServer(app);

// Middleware
// CORS - allow multiple origins (main portal and admin portal)
const allowedOrigins = env.CORS_ORIGIN.split(',').map(origin => origin.trim());
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Impersonation-Token', 'X-Requested-With'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Impersonation middleware (must be early to detect tokens)
app.use(impersonationMiddleware);

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
app.use('/users', usersRoutes);
app.use('/users-management', usersManagementRouter);
app.use('/dashboard', dashboardRouter);
app.use('/reports', reportsRouter);
app.use('/whatsapp-settings', whatsappSettingsRouter);
app.use('/pickup-orders', pickupOrdersRoutes);

// Admin routes (SYSADMIN only)
app.use('/admin', adminRoutes);

// Webhook (Public)
app.get('/whatsapp-webhook', whatsappWebhookController.verify.bind(whatsappWebhookController));
app.post('/whatsapp-webhook', whatsappWebhookController.handleWebhook.bind(whatsappWebhookController));

// Z-API Webhooks
const zapiController = new ZApiWebhookController();
app.post('/webhooks/zapi/on-message-status', zapiController.onMessageStatus.bind(zapiController));
app.post('/webhooks/zapi/on-message-send', zapiController.onMessageSend.bind(zapiController));
app.post('/webhooks/zapi/on-message-received', zapiController.onMessageReceived.bind(zapiController));
app.post('/webhooks/zapi/on-disconnect', zapiController.onDisconnect.bind(zapiController));
app.post('/webhooks/zapi/on-connect', zapiController.onConnect.bind(zapiController));
app.post('/webhooks/zapi/on-presence', zapiController.onPresence.bind(zapiController));

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
