import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getAnalytics(): Promise<{
        totalSellers: number;
        totalStores: number;
        totalProducts: number;
        totalOrders: number;
        activeSubscriptions: number;
        monthlyRecurringRevenue: number;
        totalTransactionVolume: number;
        chartData: any[];
    }>;
    getSellers(): Promise<({
        Store: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            customDomain: string | null;
            description: string | null;
            logoUrl: string | null;
            theme: string | null;
            primaryColor: string | null;
            customCss: string | null;
            headerImageUrl: string | null;
            profileImageUrl: string | null;
            socialLinks: import("@prisma/client/runtime/client").JsonValue | null;
            contentBgColor: string | null;
            bannerImageUrl: string | null;
            ctaText: string | null;
            ctaLink: string | null;
            isVerified: boolean;
            isActive: boolean;
            userId: string;
        }[];
        subscriptions: ({
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
        })[];
    } & {
        id: string;
        email: string;
        password: string;
        name: string;
        avatar: string | null;
        role: import("@prisma/client").$Enums.Role;
        plan: import("@prisma/client").$Enums.Plan;
        balance: number;
        pendingBalance: number;
        bankName: string | null;
        accountNumber: string | null;
        accountHolder: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
}
