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
    checkout(userId: string, packageId: string, voucherCode?: string): Promise<{
        success: boolean;
        bypassed: boolean;
        subscriptionId: string;
        checkoutUrl?: undefined;
    } | {
        checkoutUrl: any;
        subscriptionId: string;
        success?: undefined;
        bypassed?: undefined;
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
        paymentRef: string | null;
        startDate: Date;
        endDate: Date | null;
        packageId: string;
        voucherId: string | null;
    }) | null>;
}
