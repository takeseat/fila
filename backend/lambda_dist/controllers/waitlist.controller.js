"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaitlistController = void 0;
const waitlist_service_1 = require("../services/waitlist.service");
const waitlist_validator_1 = require("../validators/waitlist.validator");
const waitlistService = new waitlist_service_1.WaitlistService();
class WaitlistController {
    async getWaitlist(req, res) {
        try {
            const restaurantId = req.user.restaurantId;
            const entries = await waitlistService.getWaitlist(restaurantId);
            res.json(entries);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async getMetrics(req, res) {
        try {
            const restaurantId = req.user.restaurantId;
            const metrics = await waitlistService.getQueueMetrics(restaurantId);
            res.json(metrics);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async createEntry(req, res) {
        try {
            const restaurantId = req.user.restaurantId;
            const data = waitlist_validator_1.CreateWaitlistEntryInputSchema.parse(req.body);
            const entry = await waitlistService.createEntry(restaurantId, data);
            res.status(201).json(entry);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async callEntry(req, res) {
        try {
            const restaurantId = req.user.restaurantId;
            const { id } = req.params;
            const entry = await waitlistService.callEntry(restaurantId, id);
            res.json(entry);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async seatEntry(req, res) {
        try {
            const restaurantId = req.user.restaurantId;
            const { id } = req.params;
            const entry = await waitlistService.seatEntry(restaurantId, id);
            res.json(entry);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async cancelEntry(req, res) {
        try {
            const restaurantId = req.user.restaurantId;
            const { id } = req.params;
            const entry = await waitlistService.cancelEntry(restaurantId, id);
            res.json(entry);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async markNoShow(req, res) {
        try {
            const restaurantId = req.user.restaurantId;
            const { id } = req.params;
            const entry = await waitlistService.markNoShow(restaurantId, id);
            res.json(entry);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.WaitlistController = WaitlistController;
//# sourceMappingURL=waitlist.controller.js.map