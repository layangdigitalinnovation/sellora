import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class SubscriptionsService {
    private prisma;
    private configService;
    constructor(prisma: PrismaService, configService: ConfigService);
    getPackages(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        isActive: boolean;
        price: number;
        billingPeriod: string;
        features: import("@prisma/client/runtime/client").JsonValue;
    }[]>;
    getPackage(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        isActive: boolean;
        price: number;
        billingPeriod: string;
        features: import("@prisma/client/runtime/client").JsonValue;
    }>;
    createPackage(data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        isActive: boolean;
        price: number;
        billingPeriod: string;
        features: import("@prisma/client/runtime/client").JsonValue;
    }>;
    updatePackage(id: string, data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        isActive: boolean;
        price: number;
        billingPeriod: string;
        features: import("@prisma/client/runtime/client").JsonValue;
    }>;
    checkout(userId: string, packageId: string): Promise<{
        checkoutUrl: any;
        subscriptionId: string;
    }>;
    handleWebhook(data: any, callbackToken: string): Promise<{
        success: boolean;
    }>;
    getUserSubscription(userId: string): Promise<({
        package: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            isActive: boolean;
            price: number;
            billingPeriod: string;
            features: import("@prisma/client/runtime/client").JsonValue;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import("@prisma/client").$Enums.SubscriptionStatus;
        startDate: Date;
        endDate: Date | null;
        paymentRef: string | null;
        packageId: string;
    }) | null>;
}
