import { CustomersService } from './customers.service';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    findAll(req: any): Promise<{
        id: string;
        email: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        storeId: string;
        tags: string[];
        phone: string | null;
        totalSpent: number;
        totalOrders: number;
        notes: string | null;
        lastOrderAt: Date | null;
    }[]>;
}
