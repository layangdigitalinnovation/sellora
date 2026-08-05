import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: { name: string; slug: string }) {
    const existing = await this.prisma.store.findUnique({ where: { slug: data.slug } });
    if (existing) throw new ConflictException('Slug is already taken');

    return this.prisma.store.create({
      data: {
        userId,
        name: data.name,
        slug: data.slug,
      },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.store.findFirst({
      where: { userId },
    });
  }

  async getOrdersByUserId(userId: string) {
    const store = await this.findByUserId(userId);
    if (!store) throw new NotFoundException('Store not found');

    return this.prisma.order.findMany({
      where: { storeId: store.id },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    const store = await this.prisma.store.findUnique({
      where: { slug },
      include: { products: { where: { isActive: true } } }
    });
    if (!store) throw new NotFoundException('Store not found');
    return store;
  }

  async update(userId: string, data: Prisma.StoreUpdateInput) {
    const store = await this.findByUserId(userId);
    if (!store) throw new NotFoundException('Store not found');

    return this.prisma.store.update({
      where: { id: store.id },
      data,
    });
  }
}
