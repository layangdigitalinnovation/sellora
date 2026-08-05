import { Injectable, NotFoundException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, ProductType } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getStoreByUserId(userId: string) {
    const store = await this.prisma.store.findFirst({ where: { userId } });
    if (!store) throw new NotFoundException('Store not found for this user');
    return store;
  }

  async create(userId: string, data: any) {
    const store = await this.getStoreByUserId(userId);

    // Check user plan limits
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user?.plan === 'STARTER') {
      const productCount = await this.prisma.product.count({ where: { storeId: store.id } });
      if (productCount >= 3) {
        throw new ForbiddenException('You have reached the maximum number of products (3) for the Starter plan. Please upgrade to create more products.');
      }
    }

    const productData: Prisma.ProductCreateInput = {
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
        create: data.bookingSlots.map((slot: any) => ({
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

  async findAllByUserId(userId: string) {
    const store = await this.getStoreByUserId(userId);
    return this.prisma.product.findMany({
      where: { storeId: store.id },
      include: { bookingSlots: true }
    });
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({ 
      where: { id },
      include: { bookingSlots: true }
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(userId: string, id: string, data: any) {
    const store = await this.getStoreByUserId(userId);
    const product = await this.findById(id);

    if (product.storeId !== store.id) {
      throw new UnauthorizedException('You do not own this product');
    }

    const updateData: Prisma.ProductUpdateInput = {
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
        create: data.bookingSlots.map((slot: any) => ({
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

  async remove(userId: string, id: string) {
    const store = await this.getStoreByUserId(userId);
    const product = await this.findById(id);

    if (product.storeId !== store.id) {
      throw new UnauthorizedException('You do not own this product');
    }

    return this.prisma.product.delete({
      where: { id },
    });
  }
}
