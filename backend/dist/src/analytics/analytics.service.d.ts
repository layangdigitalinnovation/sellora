import { PrismaService } from '../prisma/prisma.service';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getStats(userId: string): Promise<{
        totalProducts: number;
        totalCustomers: number;
        totalOrders: number;
        totalRevenue: number;
        customersTrend: number;
        ordersTrend: number;
        revenueTrend: number;
    }>;
    trackEvent(storeId: string, productId: string | undefined, eventType: string, visitorId: string): Promise<{
        id: string;
        createdAt: Date;
        storeId: string;
        productId: string | null;
        eventType: string;
        visitorId: string | null;
    }>;
    getFunnelData(userId: string, period?: '30_days' | '90_days'): Promise<{
        views: number;
        clicks: number;
        paid: number;
    }>;
    getChartData(userId: string, period?: 'weekly' | 'monthly'): Promise<{
        labels: string[];
        data: number[];
    }>;
}
