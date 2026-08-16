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
            userId: string;
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
            paymentRef: string | null;
            startDate: Date;
            endDate: Date | null;
            packageId: string;
            voucherId: string | null;
        })[];
    } & {
        id: string;
        email: string;
        referralCode: string | null;
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
        referredById: string | null;
    })[]>;
    getSettings(): Promise<Record<string, string>>;
    updateSettings(body: Record<string, string>): Promise<Record<string, string>>;
    backfill(): Promise<{
        success: boolean;
        message: string;
    }>;
    getVouchers(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        code: string;
        discountPercent: number;
    }[]>;
    createVoucher(body: {
        code: string;
        discountPercent: number;
        isActive?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        code: string;
        discountPercent: number;
    }>;
    updateVoucher(id: string, body: {
        code?: string;
        discountPercent?: number;
        isActive?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        code: string;
        discountPercent: number;
    }>;
    deleteVoucher(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        code: string;
        discountPercent: number;
    }>;
}
