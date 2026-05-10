import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { CustomersService } from '../services/customers.service';

const customersService = new CustomersService();

export class CustomersController {
    async getCustomers(req: AuthRequest, res: Response): Promise<void> {
        try {
            const restaurantId = req.user!.restaurantId;
            const { name, phone, fullPhone, page, pageSize } = req.query;
            
            // If fullPhone is provided, use the specific lookup
            if (fullPhone) {
                const customer = await customersService.getCustomerByFullPhone(restaurantId, fullPhone as string);
                res.json(customer ? [customer] : []);
                return;
            }

            const result = await customersService.getCustomers(restaurantId, {
                name: name as string,
                phone: phone as string,
                page: page ? parseInt(page as string) : undefined,
                pageSize: pageSize ? parseInt(pageSize as string) : undefined,
            });
            
            res.json(result.data);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getCustomerDetails(req: AuthRequest, res: Response): Promise<void> {
        try {
            const restaurantId = req.user!.restaurantId;
            const { id } = req.params;
            const details = await customersService.getCustomerDetails(restaurantId, id);
            res.json(details);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
