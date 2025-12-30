"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const restaurants_controller_1 = require("../controllers/restaurants.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const controller = new restaurants_controller_1.RestaurantsController();
router.use(auth_1.authenticate);
// Business data endpoints
router.get('/business', (req, res) => controller.getBusinessData(req, res));
router.put('/business', (req, res) => controller.updateBusinessData(req, res));
// Settings endpoints (operational parameters)
router.get('/settings', (req, res) => controller.getSettings(req, res));
router.put('/settings', (req, res) => controller.updateSettings(req, res));
exports.default = router;
//# sourceMappingURL=restaurants.routes.js.map