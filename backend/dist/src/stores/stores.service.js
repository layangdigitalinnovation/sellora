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
exports.StoresService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let StoresService = class StoresService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, data) {
        const existing = await this.prisma.store.findUnique({ where: { slug: data.slug } });
        if (existing)
            throw new common_1.ConflictException('Slug is already taken');
        return this.prisma.store.create({
            data: {
                userId,
                name: data.name,
                slug: data.slug,
            },
        });
    }
    async findByUserId(userId) {
        return this.prisma.store.findFirst({
            where: { userId },
        });
    }
    async findBySlug(slug) {
        const store = await this.prisma.store.findUnique({
            where: { slug },
            include: { products: { where: { isActive: true } } }
        });
        if (!store)
            throw new common_1.NotFoundException('Store not found');
        return store;
    }
    async update(userId, data) {
        const store = await this.findByUserId(userId);
        if (!store)
            throw new common_1.NotFoundException('Store not found');
        return this.prisma.store.update({
            where: { id: store.id },
            data,
        });
    }
};
exports.StoresService = StoresService;
exports.StoresService = StoresService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StoresService);
//# sourceMappingURL=stores.service.js.map