"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersController = void 0;
const customers_service_1 = require("../services/customers.service");
const customers_validator_1 = require("../validators/customers.validator");
const customersService = new customers_service_1.CustomersService();
class CustomersController {
    async getCustomers(req, res) {
        try {
            const restaurantId = req.user.restaurantId;
            const { name, phone, fullPhone, lastVisitAfter, page, pageSize } = req.query;
            // Direct lookup by fullPhone (normalized)
            if (fullPhone) {
                const customer = await customersService.getCustomerByFullPhone(restaurantId, fullPhone);
                // Option A: Always 200 with data or null
                res.json({
                    success: true,
                    data: customer || null
                });
                return;
            }
            const result = await customersService.getCustomers(restaurantId, {
                name: name,
                phone: phone,
                lastVisitAfter: lastVisitAfter,
                page: page ? parseInt(page) : undefined,
                pageSize: pageSize ? parseInt(pageSize) : undefined,
            });
            res.json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async getCustomer(req, res) {
        try {
            const restaurantId = req.user.restaurantId;
            const { id } = req.params;
            const details = await customersService.getCustomerDetails(restaurantId, id);
            res.json(details);
        }
        catch (error) {
            if (error.message === 'Customer not found') {
                res.status(404).json({ error: error.message });
                return;
            }
            res.status(400).json({ error: error.message });
        }
    }
    async createCustomer(req, res) {
        try {
            const restaurantId = req.user.restaurantId;
            const data = customers_validator_1.CreateCustomerInputSchema.parse(req.body);
            const customer = await customersService.createCustomer(restaurantId, data);
            res.status(201).json(customer);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async updateCustomer(req, res) {
        try {
            const restaurantId = req.user.restaurantId;
            const { id } = req.params;
            const data = customers_validator_1.UpdateCustomerInputSchema.parse(req.body);
            const customer = await customersService.updateCustomer(restaurantId, id, data);
            res.json(customer);
        }
        catch (error) {
            if (error.message === 'Customer not found') {
                res.status(404).json({ error: error.message });
                return;
            }
            res.status(400).json({ error: error.message });
        }
    }
    async deleteCustomer(req, res) {
        try {
            const restaurantId = req.user.restaurantId;
            const { id } = req.params;
            await customersService.deleteCustomer(restaurantId, id);
            res.status(204).send();
        }
        catch (error) {
            if (error.message === 'Customer not found') {
                res.status(404).json({ error: error.message });
                return;
            }
            res.status(400).json({ error: error.message });
        }
    }
}
exports.CustomersController = CustomersController;
//# sourceMappingURL=customers.controller.js.map