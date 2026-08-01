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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStats(userId) {
        const store = await this.prisma.store.findFirst({
            where: { userId },
        });
        if (!store)
            throw new common_1.NotFoundException('Store not found');
        const [totalProducts, totalCustomers, totalOrders, totalRevenue] = await Promise.all([
            this.prisma.product.count({ where: { storeId: store.id } }),
            this.prisma.customer.count({ where: { storeId: store.id } }),
            this.prisma.order.count({ where: { storeId: store.id, status: 'PAID' } }),
            this.prisma.order.aggregate({
                where: { storeId: store.id, status: 'PAID' },
                _sum: { amount: true },
            }),
        ]);
        return {
            totalProducts,
            totalCustomers,
            totalOrders,
            totalRevenue: totalRevenue._sum.amount || 0,
        };
    }
    async trackEvent(storeId, productId, eventType, visitorId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const existing = await this.prisma.analyticsEvent.findFirst({
            where: {
                storeId,
                productId,
                eventType,
                visitorId,
                createdAt: { gte: today }
            }
        });
        if (existing)
            return existing;
        return this.prisma.analyticsEvent.create({
            data: {
                storeId,
                productId,
                eventType,
                visitorId,
            }
        });
    }
    async getFunnelData(userId, period = '30_days') {
        const store = await this.prisma.store.findFirst({ where: { userId } });
        if (!store)
            throw new common_1.NotFoundException('Store not found');
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
    async getChartData(userId, period = 'weekly') {
        const store = await this.prisma.store.findFirst({ where: { userId } });
        if (!store)
            throw new common_1.NotFoundException('Store not found');
        const now = new Date();
        const data = [];
        const labels = [];
        if (period === 'weekly') {
            for (let i = 6; i >= 0; i--) {
                const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
                labels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
                const start = new Date(d);
                start.setHours(0, 0, 0, 0);
                const end = new Date(d);
                end.setHours(23, 59, 59, 999);
                const count = await this.prisma.analyticsEvent.count({
                    where: { storeId: store.id, eventType: 'VIEW', createdAt: { gte: start, lte: end } }
                });
                data.push(count);
            }
        }
        else {
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
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map