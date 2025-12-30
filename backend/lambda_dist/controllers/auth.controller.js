"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const auth_validator_1 = require("../validators/auth.validator");
const authService = new auth_service_1.AuthService();
class AuthController {
    async register(req, res) {
        try {
            const data = auth_validator_1.registerSchema.parse(req.body);
            const result = await authService.register(data);
            res.status(201).json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async login(req, res) {
        try {
            const data = auth_validator_1.loginSchema.parse(req.body);
            const result = await authService.login(data);
            res.json(result);
        }
        catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
    async refresh(req, res) {
        try {
            const { refreshToken } = auth_validator_1.refreshTokenSchema.parse(req.body);
            const result = await authService.refreshToken(refreshToken);
            res.json(result);
        }
        catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map