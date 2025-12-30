"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const env_1 = require("./config/env");
const errorHandler_1 = require("./middleware/errorHandler");
const swagger_1 = require("./swagger");
// Routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const waitlist_routes_1 = __importDefault(require("./routes/waitlist.routes"));
const index_1 = require("./routes/index");
const customers_routes_1 = __importDefault(require("./routes/customers.routes"));
const restaurants_routes_1 = __importDefault(require("./routes/restaurants.routes"));
const users_routes_1 = __importDefault(require("./routes/users.routes"));
exports.app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(exports.app);
// Middleware
exports.app.use((0, cors_1.default)({ origin: env_1.env.CORS_ORIGIN }));
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
// Swagger documentation
(0, swagger_1.setupSwagger)(exports.app);
// Health check
exports.app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// API Routes
exports.app.use('/auth', auth_routes_1.default);
exports.app.use('/waitlist', waitlist_routes_1.default);
exports.app.use('/customers', customers_routes_1.default);
exports.app.use('/restaurants', restaurants_routes_1.default);
exports.app.use('/users', users_routes_1.default);
exports.app.use('/users-management', index_1.usersManagementRouter);
exports.app.use('/dashboard', index_1.dashboardRouter);
exports.app.use('/reports', index_1.reportsRouter);
// Error handler (must be last)
exports.app.use(errorHandler_1.errorHandler);
// Start server (only in development/non-Lambda)
if (process.env.NODE_ENV !== 'production') {
    const PORT = parseInt(env_1.env.PORT);
    httpServer.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
        console.log(`🔌 WebSocket server ready`);
    });
}
exports.default = exports.app;
//# sourceMappingURL=server.js.map