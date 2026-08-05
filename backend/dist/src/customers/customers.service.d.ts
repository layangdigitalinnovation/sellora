import { PrismaService } from '../prisma/prisma.service';
export declare class CustomersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllByUserId(userId: string): Promise<{
        id: string;
        email: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        storeId: string;
        phone: string | null;
        totalSpent: number;
        totalOrders: number;
        tags: string[];
        notes: string | null;
        lastOrderAt: Date | null;
    }[]>;
    findById(userId: string, customerId: string): Promise<{
        id: string;
        email: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        storeId: string;
        phone: string | null;
        totalSpent: number;
        totalOrders: number;
        tags: string[];
        notes: string | null;
        lastOrderAt: Date | null;
    }>;
}
