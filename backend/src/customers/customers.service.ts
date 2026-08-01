import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async findAllByUserId(userId: string) {
    const store = await this.prisma.store.findFirst({
      where: { userId },
    });

    if (!store) throw new NotFoundException('Store not found');

    return this.prisma.customer.findMany({
      where: { storeId: store.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(userId: string, customerId: string) {
    const store = await this.prisma.store.findFirst({
      where: { userId },
    });

    if (!store) throw new NotFoundException('Store not found');

    const customer = await this.prisma.customer.findFirst({
      where: { id: customerId, storeId: store.id },
    });

    if (!customer) throw new NotFoundException('Customer not found');

    return customer;
  }
}
