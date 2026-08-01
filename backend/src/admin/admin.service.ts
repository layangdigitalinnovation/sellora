import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getAnalytics() {
    const totalSellers = await this.prisma.user.count({ where: { role: 'SELLER' } });
    
    // Revenue from subscriptions (where status = PAID or ACTIVE...)
    // Wait, UserSubscription doesn't store price paid directly, but we can aggregate order or subscription if needed.
    // For simplicity, we can fetch all active subscriptions and sum the package price.
    const activeSubs = await this.prisma.userSubscription.findMany({
      where: { status: 'ACTIVE' },
      include: { package: true }
    });

    const mrr = activeSubs.reduce((acc, sub) => {
      // rough MRR estimation
      if (sub.package.billingPeriod === 'YEARLY') return acc + (sub.package.price / 12);
      return acc + sub.package.price;
    }, 0);

    const totalStores = await this.prisma.store.count();
    const totalProducts = await this.prisma.product.count();
    const totalOrders = await this.prisma.order.count();

    const revenueFromOrders = await this.prisma.order.aggregate({
      where: { status: 'PAID' },
      _sum: { amount: true }
    });

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const recentUsers = await this.prisma.user.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true }
    });

    const recentStores = await this.prisma.store.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true }
    });

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const chartData: any[] = [];
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthStr = months[d.getMonth()];
      const year = d.getFullYear();
      
      const uCount = recentUsers.filter(u => u.createdAt.getMonth() === d.getMonth() && u.createdAt.getFullYear() === year).length;
      const sCount = recentStores.filter(s => s.createdAt.getMonth() === d.getMonth() && s.createdAt.getFullYear() === year).length;
      
      chartData.push({
        name: `${monthStr}`,
        Sellers: uCount,
        Stores: sCount
      });
    }

    return {
      totalSellers,
      totalStores,
      totalProducts,
      totalOrders,
      activeSubscriptions: activeSubs.length,
      monthlyRecurringRevenue: Math.round(mrr),
      totalTransactionVolume: revenueFromOrders._sum.amount || 0,
      chartData
    };
  }

  async getSellers() {
    return this.prisma.user.findMany({
      where: { role: 'SELLER' },
      include: {
        subscriptions: {
          where: { status: 'ACTIVE' },
          include: { package: true },
          orderBy: { endDate: 'desc' },
          take: 1
        },
        Store: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
