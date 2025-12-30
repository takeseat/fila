"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeWebSocket = initializeWebSocket;
exports.getIO = getIO;
const socket_io_1 = require("socket.io");
const jwt_1 = require("../utils/jwt");
let io;
function initializeWebSocket(httpServer) {
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
            methods: ['GET', 'POST'],
        },
    });
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error'));
            }
            const payload = (0, jwt_1.verifyAccessToken)(token);
            socket.data.user = payload;
            next();
        }
        catch (error) {
            next(new Error('Authentication error'));
        }
    });
    io.on('connection', (socket) => {
        const restaurantId = socket.data.user.restaurantId;
        // Join restaurant room
        socket.join(`restaurant:${restaurantId}`);
        console.log(`User connected to restaurant:${restaurantId}`);
        socket.on('disconnect', () => {
            console.log(`User disconnected from restaurant:${restaurantId}`);
        });
    });
    return io;
}
function getIO() {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
}
//# sourceMappingURL=index.js.map