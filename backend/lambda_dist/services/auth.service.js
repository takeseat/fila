"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const database_1 = __importDefault(require("../config/database"));
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
class AuthService {
    async register(data) {
        // Check if user already exists
        const existingUser = await database_1.default.user.findUnique({
            where: { email: data.userEmail },
        });
        if (existingUser) {
            throw new Error('User already exists');
        }
        // Create restaurant and user in a transaction
        const passwordHash = await (0, password_1.hashPassword)(data.password);
        const result = await database_1.default.$transaction(async (tx) => {
            const restaurant = await tx.restaurant.create({
                data: {
                    name: data.restaurantName,
                    tradeName: data.tradeName,
                    cnpj: data.businessId, // Using businessId for cnpj field
                    countryCode: data.countryCode,
                    stateCode: data.stateCode,
                    city: data.city,
                    addressLine: data.addressLine,
                    addressNumber: data.addressNumber,
                    addressComplement: data.addressComplement,
                    postalCode: data.postalCode,
                    timezone: data.timezone,
                },
            });
            const user = await tx.user.create({
                data: {
                    restaurantId: restaurant.id,
                    name: data.userName,
                    email: data.userEmail,
                    passwordHash,
                    role: 'ADMIN',
                },
            });
            return { restaurant, user };
        });
        const accessToken = (0, jwt_1.generateAccessToken)({
            userId: result.user.id,
            restaurantId: result.user.restaurantId,
            role: result.user.role,
        });
        const refreshToken = (0, jwt_1.generateRefreshToken)({
            userId: result.user.id,
            restaurantId: result.user.restaurantId,
            role: result.user.role,
        });
        return {
            user: {
                id: result.user.id,
                name: result.user.name,
                email: result.user.email,
                role: result.user.role,
                restaurantId: result.user.restaurantId,
                language: result.user.language,
            },
            restaurant: result.restaurant,
            accessToken,
            refreshToken,
        };
    }
    async login(data) {
        const user = await database_1.default.user.findUnique({
            where: { email: data.email },
            include: { restaurant: true },
        });
        if (!user) {
            throw new Error('Invalid credentials');
        }
        const isValidPassword = await (0, password_1.comparePassword)(data.password, user.passwordHash);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }
        const accessToken = (0, jwt_1.generateAccessToken)({
            userId: user.id,
            restaurantId: user.restaurantId,
            role: user.role,
        });
        const refreshToken = (0, jwt_1.generateRefreshToken)({
            userId: user.id,
            restaurantId: user.restaurantId,
            role: user.role,
        });
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                restaurantId: user.restaurantId,
                language: user.language,
            },
            restaurant: user.restaurant,
            accessToken,
            refreshToken,
        };
    }
    async refreshToken(token) {
        try {
            const payload = (0, jwt_1.verifyRefreshToken)(token);
            const user = await database_1.default.user.findUnique({
                where: { id: payload.userId },
            });
            if (!user) {
                throw new Error('User not found');
            }
            const accessToken = (0, jwt_1.generateAccessToken)({
                userId: user.id,
                restaurantId: user.restaurantId,
                role: user.role,
            });
            return { accessToken };
        }
        catch (error) {
            throw new Error('Invalid refresh token');
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map