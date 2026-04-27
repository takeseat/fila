import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { verifyAccessToken } from '../utils/jwt';

let io: Server;

export function initializeWebSocket(httpServer: HttpServer): Server {
    const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
        .split(',')
        .map(origin => origin.trim().replace(/\/$/, ''));

    io = new Server(httpServer, {
        cors: {
            origin: function (origin, callback) {
                if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
                    callback(null, true);
                } else {
                    console.warn(`⚠️ [WS CORS] Origem bloqueada: ${origin}. Adicione na CORS_ORIGIN.`);
                    callback(null, false);
                }
            },
            methods: ['GET', 'POST'],
            credentials: true,
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
