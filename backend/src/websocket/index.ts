import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { verifyAccessToken } from '../utils/jwt';

let io: Server;

export function initializeWebSocket(httpServer: HttpServer): Server {
    io = new Server(httpServer, {
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

            const payload = verifyAccessToken(token);
            socket.data.user = payload;
            next();
        } catch (error) {
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

export function getIO(): Server {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
}
