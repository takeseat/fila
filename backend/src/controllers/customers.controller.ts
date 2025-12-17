import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { CustomersService } from '../services/customers.service';
import { CreateCustomerInputSchema, UpdateCustomerInputSchema } from '../validators/customers.validator';

const customersService = new CustomersService();

export class CustomersController {
    async getCustomers(req: AuthRequest, res: Response): Promise<void> {
        try {
            const restaurantId = req.user!.restaurantId;
            const { name, phone, fullPhone, lastVisitAfter, page, pageSize } = req.query;

            // Direct lookup by fullPhone (normalized)
            if (fullPhone) {
                const customer = await customersService.getCustomerByFullPhone(restaurantId, fullPhone as string);

                // Option A: Always 200 with data or null
                res.json({
                    success: true,
                    data: customer || null
                });
                return;
            }

            const result = await customersService.getCustomers(restaurantId, {
                name: name as string,
                phone: phone as string,
                lastVisitAfter: lastVisitAfter as string,
                page: page ? parseInt(page as string) : undefined,
                pageSize: pageSize ? parseInt(pageSize as string) : undefined,
            });

            res.json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getCustomer(req: AuthRequest, res: Response): Promise<void> {
        try {
            const restaurantId = req.user!.restaurantId;
            const { id } = req.params;

            const details = await customersService.getCustomerDetails(restaurantId, id);
            res.json(details);
        } catch (error: any) {
            if (error.message === 'Customer not found') {
                res.status(404).json({ error: error.message });
                return;
            }
            res.status(400).json({ error: error.message });
        }
    }

    async createCustomer(req: AuthRequest, res: Response): Promise<void> {
        try {
            const restaurantId = req.user!.restaurantId;
            const data = CreateCustomerInputSchema.parse(req.body);

            const customer = await customersService.createCustomer(restaurantId, data);
            res.status(201).json(customer);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateCustomer(req: AuthRequest, res: Response): Promise<void> {
        try {
            const restaurantId = req.user!.restaurantId;
            const { id } = req.params;
            const data = UpdateCustomerInputSchema.parse(req.body);

            const customer = await customersService.updateCustomer(restaurantId, id, data);
            res.json(customer);
        } catch (error: any) {
            if (error.message === 'Customer not found') {
                res.status(404).json({ error: error.message });
                return;
            }
            res.status(400).json({ error: error.message });
        }
    }

    async deleteCustomer(req: AuthRequest, res: Response): Promise<void> {
        try {
            const restaurantId = req.user!.restaurantId;
            const { id } = req.params;

            await customersService.deleteCustomer(restaurantId, id);
            res.status(204).send();
        } catch (error: any) {
            if (error.message === 'Customer not found') {
                res.status(404).json({ error: error.message });
                return;
            }
            res.status(400).json({ error: error.message });
        }
    }
}
