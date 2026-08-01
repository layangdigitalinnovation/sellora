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
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
let SubscriptionsService = class SubscriptionsService {
    prisma;
    configService;
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
    }
    async getPackages() {
        return this.prisma.subscriptionPackage.findMany({
            where: { isActive: true },
            orderBy: { price: 'asc' }
        });
    }
    async getPackage(id) {
        const pkg = await this.prisma.subscriptionPackage.findUnique({ where: { id } });
        if (!pkg)
            throw new common_1.NotFoundException('Package not found');
        return pkg;
    }
    async createPackage(data) {
        return this.prisma.subscriptionPackage.create({
            data: {
                name: data.name,
                slug: data.slug,
                price: data.price,
                billingPeriod: data.billingPeriod,
                features: data.features,
            }
        });
    }
    async updatePackage(id, data) {
        return this.prisma.subscriptionPackage.update({
            where: { id },
            data
        });
    }
    async checkout(userId, packageId) {
        const pkg = await this.prisma.subscriptionPackage.findUnique({ where: { id: packageId } });
        if (!pkg)
            throw new common_1.NotFoundException('Package not found');
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const subscription = await this.prisma.userSubscription.create({
            data: {
                userId,
                packageId,
                status: 'PENDING',
            }
        });
        const secretKey = this.configService.get('XENDIT_SECRET_KEY') || 'xnd_development_placeholder';
        const authString = Buffer.from(`${secretKey}:`).toString('base64');
        try {
            const response = await fetch('https://api.xendit.co/v2/invoices', {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${authString}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    external_id: `sub_${subscription.id}`,
                    amount: pkg.price,
                    description: `Pembayaran Langganan Paket ${pkg.name} (${pkg.billingPeriod})`,
                    payer_email: user.email,
                    customer: {
                        given_names: user.name,
                        email: user.email,
                    },
                    success_redirect_url: `http://localhost:3000/dashboard/subscription?status=success`,
                    failure_redirect_url: `http://localhost:3000/dashboard/subscription?status=failed`,
                    currency: 'IDR'
                })
            });
            const invoice = await response.json();
            if (!response.ok) {
                throw new Error(invoice.message || 'Xendit API error');
            }
            await this.prisma.userSubscription.update({
                where: { id: subscription.id },
                data: { paymentRef: invoice.id }
            });
            return { checkoutUrl: invoice.invoice_url, subscriptionId: subscription.id };
        }
        catch (e) {
            console.error('Xendit error:', e);
            throw new common_1.BadRequestException('Failed to generate payment url: ' + e.message);
        }
    }
    async handleWebhook(data, callbackToken) {
        const expectedToken = this.configService.get('XENDIT_WEBHOOK_TOKEN');
        if (expectedToken && callbackToken !== expectedToken) {
            throw new common_1.BadRequestException('Invalid webhook token');
        }
        if (data.status === 'PAID' || data.status === 'SETTLED') {
            const externalId = data.external_id;
            if (externalId && externalId.startsWith('sub_')) {
                const subId = externalId.replace('sub_', '');
                const sub = await this.prisma.userSubscription.findUnique({
                    where: { id: subId },
                    include: { package: true }
                });
                if (sub && sub.status !== 'ACTIVE') {
                    const now = new Date(data.paid_at || new Date());
                    const endDate = new Date(now);
                    if (sub.package.billingPeriod === 'YEARLY') {
                        endDate.setFullYear(endDate.getFullYear() + 1);
                    }
                    else {
                        endDate.setMonth(endDate.getMonth() + 1);
                    }
                    await this.prisma.$transaction([
                        this.prisma.userSubscription.update({
                            where: { id: subId },
                            data: {
                                status: 'ACTIVE',
                                startDate: now,
                                endDate: endDate
                            }
                        }),
                        this.prisma.user.update({
                            where: { id: sub.userId },
                            data: {
                                plan: sub.package.name.toUpperCase() || 'PRO'
                            }
                        })
                    ]);
                }
            }
        }
        return { success: true };
    }
    async getUserSubscription(userId) {
        return this.prisma.userSubscription.findFirst({
            where: { userId, status: 'ACTIVE' },
            include: { package: true },
            orderBy: { endDate: 'desc' }
        });
    }
};
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map