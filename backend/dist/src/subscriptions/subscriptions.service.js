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
    async checkout(userId, packageId, voucherCode) {
        const pkg = await this.prisma.subscriptionPackage.findUnique({ where: { id: packageId } });
        if (!pkg)
            throw new common_1.NotFoundException('Package not found');
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        let voucher = null;
        let finalPrice = pkg.price;
        if (voucherCode) {
            voucher = await this.prisma.voucher.findUnique({ where: { code: voucherCode } });
            if (!voucher || !voucher.isActive) {
                throw new common_1.BadRequestException('Invalid or inactive voucher code');
            }
            finalPrice = pkg.price - (pkg.price * (voucher.discountPercent / 100));
            if (finalPrice < 0)
                finalPrice = 0;
        }
        const subscription = await this.prisma.userSubscription.create({
            data: {
                userId,
                packageId,
                status: finalPrice === 0 ? 'ACTIVE' : 'PENDING',
                voucherId: voucher ? voucher.id : null,
            }
        });
        if (finalPrice === 0) {
            const now = new Date();
            const endDate = new Date(now);
            if (pkg.billingPeriod === 'YEARLY') {
                endDate.setFullYear(endDate.getFullYear() + 1);
            }
            else {
                endDate.setMonth(endDate.getMonth() + 1);
            }
            await this.prisma.$transaction([
                this.prisma.userSubscription.update({
                    where: { id: subscription.id },
                    data: {
                        startDate: now,
                        endDate: endDate
                    }
                }),
                this.prisma.user.update({
                    where: { id: userId },
                    data: {
                        plan: pkg.name.toUpperCase() || 'PRO'
                    }
                })
            ]);
            return { success: true, bypassed: true, subscriptionId: subscription.id };
        }
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
                    amount: finalPrice,
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
                    const user = await this.prisma.user.findUnique({ where: { id: sub.userId } });
                    let commissionOps = [];
                    if (user && user.referredById) {
                        const existingCommission = await this.prisma.referralCommission.findFirst({
                            where: { refereeId: user.id }
                        });
                        if (!existingCommission) {
                            const typeSetting = await this.prisma.systemSetting.findUnique({ where: { key: 'AFFILIATE_COMMISSION_TYPE' } });
                            const valSetting = await this.prisma.systemSetting.findUnique({ where: { key: 'AFFILIATE_COMMISSION_VALUE' } });
                            const commType = typeSetting?.value || 'PERCENTAGE';
                            const commValue = valSetting?.value ? parseFloat(valSetting.value) : 20;
                            let commissionAmount = 0;
                            if (commType === 'FIXED') {
                                commissionAmount = commValue;
                            }
                            else {
                                commissionAmount = sub.package.price * (commValue / 100);
                            }
                            commissionOps.push(this.prisma.referralCommission.create({
                                data: {
                                    referrerId: user.referredById,
                                    refereeId: user.id,
                                    subscriptionId: sub.id,
                                    amount: commissionAmount,
                                    status: 'PAID'
                                }
                            }));
                            commissionOps.push(this.prisma.user.update({
                                where: { id: user.referredById },
                                data: { balance: { increment: commissionAmount } }
                            }));
                        }
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
                        }),
                        ...commissionOps
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