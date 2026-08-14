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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const payments_service_1 = require("./payments.service");
const storage_service_1 = require("../storage/storage.service");
const subscriptions_service_1 = require("../subscriptions/subscriptions.service");
let PaymentsController = class PaymentsController {
    paymentsService;
    storageService;
    subscriptionsService;
    constructor(paymentsService, storageService, subscriptionsService) {
        this.paymentsService = paymentsService;
        this.storageService = storageService;
        this.subscriptionsService = subscriptionsService;
    }
    async checkout(body) {
        return this.paymentsService.checkout(body);
    }
    async xenditWebhook(body, req) {
        const webhookToken = req.headers['x-callback-token'];
        if (body && body.external_id && body.external_id.startsWith('sub_')) {
            await this.subscriptionsService.handleWebhook(body, webhookToken);
        }
        else {
            await this.paymentsService.handleXenditWebhook(body, webhookToken);
        }
        return { success: true };
    }
    async getOrder(id) {
        return this.paymentsService.getOrder(id);
    }
    async getVideoUrl(id) {
        const order = await this.paymentsService.getOrder(id);
        if (order.status !== 'PAID')
            throw new common_1.BadRequestException('Order is not paid');
        if (!order.product.fileUrl)
            throw new common_1.BadRequestException('Product has no file');
        const key = order.product.fileUrl;
        const url = await this.storageService.getVideoSignedUrl(key, 900);
        return { url };
    }
    async downloadFile(id, res) {
        const order = await this.paymentsService.getOrder(id);
        if (order.status !== 'PAID')
            throw new common_1.BadRequestException('Order is not paid');
        if (!order.product.fileUrl)
            throw new common_1.BadRequestException('Product has no file');
        const key = order.product.fileUrl;
        const url = await this.storageService.getVideoSignedUrl(key, 900);
        return res.redirect(url);
    }
    async downloadPdf(id, res) {
        const order = await this.paymentsService.getOrder(id);
        if (order.status !== 'PAID')
            throw new common_1.BadRequestException('Order is not paid');
        if (!order.product.fileUrl)
            throw new common_1.BadRequestException('Product has no file');
        const key = order.product.fileUrl;
        const pdfBytes = await this.storageService.getWatermarkedPdf(key, order.buyerName, order.buyerEmail, order.buyerPhone || '');
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${order.product.title}.pdf"`,
            'Content-Length': pdfBytes.length,
        });
        res.send(Buffer.from(pdfBytes));
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)('checkout'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "checkout", null);
__decorate([
    (0, common_1.Post)('webhook/xendit'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "xenditWebhook", null);
__decorate([
    (0, common_1.Get)('order/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getOrder", null);
__decorate([
    (0, common_1.Get)('order/:id/video-url'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getVideoUrl", null);
__decorate([
    (0, common_1.Get)('order/:id/download-file'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "downloadFile", null);
__decorate([
    (0, common_1.Get)('order/:id/download-pdf'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "downloadPdf", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService,
        storage_service_1.StorageService,
        subscriptions_service_1.SubscriptionsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map