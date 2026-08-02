import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getStats(userId: string) {
    const store = await this.prisma.store.findFirst({
      where: { userId },
    });

    if (!store) throw new NotFoundException('Store not found');

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const [
      totalProducts, 
      totalCustomers, 
      totalOrders, 
      totalRevenue,
      currCustomers, prevCustomers,
      currOrders, prevOrders,
      currRevenue, prevRevenue
    ] = await Promise.all([
      this.prisma.product.count({ where: { storeId: store.id } }),
      this.prisma.customer.count({ where: { storeId: store.id } }),
      this.prisma.order.count({ where: { storeId: store.id, status: 'PAID' } }),
      this.prisma.order.aggregate({
        where: { storeId: store.id, status: 'PAID' },
        _sum: { amount: true },
      }),
      // Customers trend
      this.prisma.customer.count({ where: { storeId: store.id, createdAt: { gte: thirtyDaysAgo } } }),
      this.prisma.customer.count({ where: { storeId: store.id, createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
      // Orders trend
      this.prisma.order.count({ where: { storeId: store.id, status: 'PAID', createdAt: { gte: thirtyDaysAgo } } }),
      this.prisma.order.count({ where: { storeId: store.id, status: 'PAID', createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
      // Revenue trend
      this.prisma.order.aggregate({
        where: { storeId: store.id, status: 'PAID', createdAt: { gte: thirtyDaysAgo } },
        _sum: { amount: true },
      }),
      this.prisma.order.aggregate({
        where: { storeId: store.id, status: 'PAID', createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } },
        _sum: { amount: true },
      })
    ]);

    const calcTrend = (curr: number, prev: number) => prev === 0 ? (curr > 0 ? 100 : 0) : ((curr - prev) / prev) * 100;

    const currRevVal = currRevenue._sum.amount || 0;
    const prevRevVal = prevRevenue._sum.amount || 0;

    return {
      totalProducts,
      totalCustomers,
      totalOrders,
      totalRevenue: totalRevenue._sum.amount || 0,
      customersTrend: calcTrend(currCustomers, prevCustomers),
      ordersTrend: calcTrend(currOrders, prevOrders),
      revenueTrend: calcTrend(currRevVal, prevRevVal)
    };
  }

  async trackEvent(storeId: string, productId: string | undefined, eventType: string, visitorId: string) {
    const today = new Date();
    today.setHours(0,0,0,0);
    const existing = await this.prisma.analyticsEvent.findFirst({
      where: {
        storeId,
        productId,
        eventType,
        visitorId,
        createdAt: { gte: today }
      }
    });

    if (existing) return existing;

    return this.prisma.analyticsEvent.create({
      data: {
        storeId,
        productId,
        eventType,
        visitorId,
      }
    });
  }

  async getFunnelData(userId: string, period: '30_days' | '90_days' = '30_days') {
    const store = await this.prisma.store.findFirst({ where: { userId } });
    if (!store) throw new NotFoundException('Store not found');

    const days = period === '30_days' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const views = await this.prisma.analyticsEvent.count({
      where: { storeId: store.id, eventType: 'VIEW', createdAt: { gte: startDate } }
    });

    const clicks = await this.prisma.analyticsEvent.count({
      where: { storeId: store.id, eventType: 'CHECKOUT_CLICK', createdAt: { gte: startDate } }
    });

    const paid = await this.prisma.order.count({
      where: { storeId: store.id, status: 'PAID', createdAt: { gte: startDate } }
    });

    return { views, clicks, paid };
  }

  async getChartData(userId: string, period: 'weekly' | 'monthly' = 'weekly') {
    const store = await this.prisma.store.findFirst({ where: { userId } });
    if (!store) throw new NotFoundException('Store not found');

    const now = new Date();
    const data: number[] = [];
    const labels: string[] = [];

    if (period === 'weekly') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        labels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
        const start = new Date(d); start.setHours(0,0,0,0);
        const end = new Date(d); end.setHours(23,59,59,999);
        const count = await this.prisma.analyticsEvent.count({
          where: { storeId: store.id, eventType: 'VIEW', createdAt: { gte: start, lte: end } }
        });
        data.push(count);
      }
    } else {
      // Last 4 weeks
      for (let i = 3; i >= 0; i--) {
        labels.push(`Week ${4 - i}`);
        const end = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
        const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
        const count = await this.prisma.analyticsEvent.count({
          where: { storeId: store.id, eventType: 'VIEW', createdAt: { gte: start, lte: end } }
        });
        data.push(count);
      }
    }

    return { labels, data };
  }
}
