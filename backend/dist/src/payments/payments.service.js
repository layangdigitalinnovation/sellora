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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
let PaymentsService = class PaymentsService {
    prisma;
    configService;
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
    }
    async checkout(data) {
        const product = await this.prisma.product.findUnique({ where: { id: data.productId }, include: { store: true } });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        let finalPrice = product.price;
        if (product.isPwyw) {
            if (data.amount === undefined || data.amount < (product.minPwywPrice || 0)) {
                throw new common_1.BadRequestException(`Minimum price for this product is ${product.minPwywPrice || 0}`);
            }
            finalPrice = data.amount;
        }
        if (product.flashSaleEndDate && new Date() < product.flashSaleEndDate) {
            if (product.flashSaleMaxQuota) {
                const soldCount = await this.prisma.order.count({
                    where: { productId: product.id, status: 'PAID' }
                });
                if (soldCount >= product.flashSaleMaxQuota) {
                    throw new common_1.BadRequestException('Maaf, kuota Flash Sale untuk produk ini baru saja habis. Anda masih dapat membelinya dengan harga normal.');
                }
            }
        }
        else if (product.flashSaleEndDate && new Date() >= product.flashSaleEndDate && product.originalPrice) {
            finalPrice = product.originalPrice;
        }
        if (product.type === 'BOOKING' || product.type === 'EVENT') {
            if (!data.bookingSlotId)
                throw new common_1.BadRequestException('Booking slot is required');
            const slot = await this.prisma.bookingSlot.findUnique({ where: { id: data.bookingSlotId } });
            if (!slot)
                throw new common_1.NotFoundException('Booking slot not found');
            const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000);
            const participants = await this.prisma.order.count({
                where: {
                    bookingSlotId: slot.id,
                    OR: [
                        { status: 'PAID' },
                        { status: 'PENDING', createdAt: { gte: tenMinsAgo } }
                    ]
                }
            });
            if (participants >= slot.maxParticipants) {
                throw new common_1.BadRequestException('Maaf, slot jadwal ini baru saja diambil oleh pengguna lain beberapa detik lalu. Silakan pilih slot waktu yang lain.');
            }
        }
        const order = await this.prisma.order.create({
            data: {
                storeId: product.storeId,
                productId: product.id,
                bookingSlotId: data.bookingSlotId,
                buyerName: data.buyerName,
                buyerEmail: data.buyerEmail,
                buyerPhone: data.buyerPhone,
                buyerAddress: data.buyerAddress,
                amount: finalPrice,
                status: 'PENDING',
                paymentGateway: 'XENDIT',
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
                    external_id: order.id,
                    amount: finalPrice,
                    description: `Pembelian ${product.title} di ${product.store.name}`,
                    payer_email: data.buyerEmail,
                    customer: {
                        given_names: data.buyerName,
                        email: data.buyerEmail,
                        mobile_number: data.buyerPhone,
                        addresses: data.buyerAddress ? [{
                                country: 'ID',
                                street_line1: data.buyerAddress
                            }] : undefined
                    },
                    success_redirect_url: `http://localhost:3000/payment-success?orderId=${order.id}&slug=${product.store.slug}`,
                    failure_redirect_url: data.failureRedirectUrl || `http://localhost:3000/${product.store.slug}`,
                    currency: 'IDR'
                })
            });
            const invoice = await response.json();
            if (!response.ok) {
                throw new Error(invoice.message || 'Xendit API error');
            }
            await this.prisma.order.update({
                where: { id: order.id },
                data: { paymentRef: invoice.id }
            });
            return { checkoutUrl: invoice.invoice_url, orderId: order.id };
        }
        catch (e) {
            console.error('Xendit error:', e);
            throw new common_1.BadRequestException('Failed to generate payment url: ' + e.message);
        }
    }
    async handleXenditWebhook(data, callbackToken) {
        const expectedToken = this.configService.get('XENDIT_WEBHOOK_TOKEN');
        if (expectedToken && callbackToken !== expectedToken) {
            throw new common_1.BadRequestException('Invalid webhook token');
        }
        if (data.status === 'PAID' || data.status === 'SETTLED') {
            try {
                const order = await this.prisma.order.update({
                    where: { id: data.external_id },
                    data: {
                        status: 'PAID',
                        paidAt: new Date(data.paid_at || new Date()),
                        paymentMethod: data.payment_method,
                    },
                    include: { store: true }
                });
                if (order && order.store) {
                    await this.prisma.user.update({
                        where: { id: order.store.userId },
                        data: {
                            balance: {
                                increment: order.amount
                            }
                        }
                    });
                }
            }
            catch (e) {
                console.warn(`Webhook warning: Order with external_id ${data.external_id} not found or could not be updated.`);
            }
        }
        return { success: true };
    }
    async getOrder(orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { product: true, store: true }
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map