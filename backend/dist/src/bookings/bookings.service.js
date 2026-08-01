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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BookingsService = class BookingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, data) {
        const product = await this.prisma.product.findUnique({
            where: { id: data.productId },
            include: { store: true }
        });
        if (!product || product.store.userId !== userId)
            throw new common_1.UnauthorizedException('Invalid product');
        return this.prisma.bookingSlot.create({
            data: {
                productId: data.productId,
                startTime: new Date(data.startTime),
                endTime: new Date(data.endTime),
                maxParticipants: data.maxParticipants || 1,
                meetingLink: data.meetingLink,
            }
        });
    }
    async getByProduct(productId) {
        return this.prisma.bookingSlot.findMany({
            where: { productId },
            orderBy: { startTime: 'asc' }
        });
    }
    async remove(userId, id) {
        const slot = await this.prisma.bookingSlot.findUnique({
            where: { id },
            include: { product: { include: { store: true } } }
        });
        if (!slot || slot.product.store.userId !== userId)
            throw new common_1.UnauthorizedException('Unauthorized');
        return this.prisma.bookingSlot.delete({ where: { id } });
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map