"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAnalytics() {
        const totalSellers = await this.prisma.user.count({ where: { role: 'SELLER' } });
        const activeSubs = await this.prisma.userSubscription.findMany({
            where: { status: 'ACTIVE' },
            include: { package: true }
        });
        const mrr = activeSubs.reduce((acc, sub) => {
            if (sub.package.billingPeriod === 'YEARLY')
                return acc + (sub.package.price / 12);
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
        const chartData = [];
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
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map