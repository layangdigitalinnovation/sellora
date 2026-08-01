import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getStats(req: any): Promise<{
        totalProducts: number;
        totalCustomers: number;
        totalOrders: number;
        totalRevenue: number;
    }>;
    trackEvent(body: {
        storeId: string;
        productId?: string;
        eventType: string;
        visitorId: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        storeId: string;
        productId: string | null;
        eventType: string;
        visitorId: string | null;
    }>;
    getFunnel(req: any, period?: '30_days' | '90_days'): Promise<{
        views: number;
        clicks: number;
        paid: number;
    }>;
    getChart(req: any, period?: 'weekly' | 'monthly'): Promise<{
        labels: string[];
        data: number[];
    }>;
}
