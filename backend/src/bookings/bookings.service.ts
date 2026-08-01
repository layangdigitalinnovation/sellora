import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: { productId: string; startTime: Date; endTime: Date; maxParticipants?: number; meetingLink?: string; }) {
    const product = await this.prisma.product.findUnique({
      where: { id: data.productId },
      include: { store: true }
    });
    if (!product || product.store.userId !== userId) throw new UnauthorizedException('Invalid product');

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

  async getByProduct(productId: string) {
    return this.prisma.bookingSlot.findMany({
      where: { productId },
      orderBy: { startTime: 'asc' }
    });
  }

  async remove(userId: string, id: string) {
    const slot = await this.prisma.bookingSlot.findUnique({
      where: { id },
      include: { product: { include: { store: true } } }
    });
    if (!slot || slot.product.store.userId !== userId) throw new UnauthorizedException('Unauthorized');
    return this.prisma.bookingSlot.delete({ where: { id } });
  }
}
