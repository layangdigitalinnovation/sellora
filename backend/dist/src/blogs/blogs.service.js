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
exports.BlogsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BlogsService = class BlogsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllPosts(includeUnpublished = false) {
        return this.prisma.post.findMany({
            where: includeUnpublished ? {} : { published: true },
            include: {
                author: {
                    select: { name: true, avatar: true }
                },
                category: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async findPostBySlug(slug) {
        const post = await this.prisma.post.findUnique({
            where: { slug },
            include: {
                author: {
                    select: { name: true, avatar: true }
                },
                category: true
            }
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
        }
        return post;
    }
    async createPost(data, authorId) {
        const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        return this.prisma.post.create({
            data: {
                title: data.title,
                slug,
                content: data.content,
                excerpt: data.excerpt,
                coverImage: data.coverImage,
                published: data.published || false,
                authorId,
                categoryId: data.categoryId,
                publishedAt: data.published ? new Date() : null,
            }
        });
    }
    async updatePost(id, data) {
        return this.prisma.post.update({
            where: { id },
            data
        });
    }
    async deletePost(id) {
        return this.prisma.post.delete({
            where: { id }
        });
    }
    async findAllCategories() {
        return this.prisma.category.findMany();
    }
    async createCategory(data) {
        const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        return this.prisma.category.create({
            data: {
                name: data.name,
                slug
            }
        });
    }
};
exports.BlogsService = BlogsService;
exports.BlogsService = BlogsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BlogsService);
//# sourceMappingURL=blogs.service.js.map