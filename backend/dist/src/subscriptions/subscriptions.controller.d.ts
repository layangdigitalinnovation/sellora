import { SubscriptionsService } from './subscriptions.service';
export declare class SubscriptionsController {
    private readonly subscriptionsService;
    constructor(subscriptionsService: SubscriptionsService);
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
    checkout(body: any, req: any): Promise<{
        checkoutUrl: any;
        subscriptionId: string;
    }>;
    xenditWebhook(body: any, req: any): Promise<{
        success: boolean;
    }>;
    getUserSubscription(userId: string): Promise<{}>;
    createPackage(body: any): Promise<{
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
    updatePackage(id: string, body: any): Promise<{
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
}
