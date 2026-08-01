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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStoreByUserId(userId) {
        const store = await this.prisma.store.findFirst({ where: { userId } });
        if (!store)
            throw new common_1.NotFoundException('Store not found for this user');
        return store;
    }
    async create(userId, data) {
        const store = await this.getStoreByUserId(userId);
        const productData = {
            store: { connect: { id: store.id } },
            title: data.title,
            type: data.type,
            price: data.price,
            originalPrice: data.originalPrice,
            description: data.description,
            fileUrl: data.fileUrl,
            imageUrl: data.imageUrl,
            isPwyw: data.isPwyw || false,
            minPwywPrice: data.minPwywPrice ? parseFloat(data.minPwywPrice) : null,
            flashSaleEndDate: data.flashSaleEndDate ? new Date(data.flashSaleEndDate) : null,
            flashSaleMaxQuota: data.flashSaleMaxQuota ? parseInt(data.flashSaleMaxQuota, 10) : null,
        };
        if (data.type === 'BOOKING' && data.bookingSlots && data.bookingSlots.length > 0) {
            productData.bookingSlots = {
                create: data.bookingSlots.map((slot) => ({
                    startTime: new Date(slot.startTime),
                    endTime: new Date(slot.endTime),
                    maxParticipants: slot.maxParticipants ? parseInt(slot.maxParticipants, 10) : 1,
                    meetingLink: slot.meetingLink || null,
                })),
            };
        }
        return this.prisma.product.create({
            data: productData,
        });
    }
    async findAllByUserId(userId) {
        const store = await this.getStoreByUserId(userId);
        return this.prisma.product.findMany({
            where: { storeId: store.id },
            include: { bookingSlots: true }
        });
    }
    async findById(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { bookingSlots: true }
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async update(userId, id, data) {
        const store = await this.getStoreByUserId(userId);
        const product = await this.findById(id);
        if (product.storeId !== store.id) {
            throw new common_1.UnauthorizedException('You do not own this product');
        }
        const updateData = {
            title: data.title,
            type: data.type,
            price: data.price !== undefined ? data.price : undefined,
            originalPrice: data.originalPrice !== undefined ? data.originalPrice : undefined,
            description: data.description !== undefined ? data.description : undefined,
            fileUrl: data.fileUrl !== undefined ? data.fileUrl : undefined,
            imageUrl: data.imageUrl !== undefined ? data.imageUrl : undefined,
            isActive: data.isActive !== undefined ? data.isActive : undefined,
            isPwyw: data.isPwyw !== undefined ? data.isPwyw : undefined,
            minPwywPrice: data.minPwywPrice !== undefined ? (data.minPwywPrice ? parseFloat(data.minPwywPrice) : null) : undefined,
            flashSaleEndDate: data.flashSaleEndDate !== undefined ? (data.flashSaleEndDate ? new Date(data.flashSaleEndDate) : null) : undefined,
            flashSaleMaxQuota: data.flashSaleMaxQuota !== undefined ? (data.flashSaleMaxQuota ? parseInt(data.flashSaleMaxQuota, 10) : null) : undefined,
        };
        if (data.type === 'BOOKING' && data.bookingSlots) {
            updateData.bookingSlots = {
                deleteMany: {},
                create: data.bookingSlots.map((slot) => ({
                    startTime: new Date(slot.startTime),
                    endTime: new Date(slot.endTime),
                    maxParticipants: slot.maxParticipants ? parseInt(slot.maxParticipants, 10) : 1,
                    meetingLink: slot.meetingLink || null,
                })),
            };
        }
        return this.prisma.product.update({
            where: { id },
            data: updateData,
        });
    }
    async remove(userId, id) {
        const store = await this.getStoreByUserId(userId);
        const product = await this.findById(id);
        if (product.storeId !== store.id) {
            throw new common_1.UnauthorizedException('You do not own this product');
        }
        return this.prisma.product.delete({
            where: { id },
        });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map