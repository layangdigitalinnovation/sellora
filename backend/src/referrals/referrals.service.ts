import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReferralsService {
  constructor(private prisma: PrismaService) {}

  async getStats(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        referrals: true,
        referralCommissionsAsReferrer: true
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    let referralCode = user.referralCode;
    
    if (!referralCode) {
      const crypto = require('crypto');
      referralCode = crypto.randomBytes(4).toString('hex');
      await this.prisma.user.update({
        where: { id: userId },
        data: { referralCode }
      });
    }

    const totalEarned = user.referralCommissionsAsReferrer.reduce((acc, curr) => acc + curr.amount, 0);

    const typeSetting = await this.prisma.systemSetting.findUnique({ where: { key: 'AFFILIATE_COMMISSION_TYPE' } });
    const valSetting = await this.prisma.systemSetting.findUnique({ where: { key: 'AFFILIATE_COMMISSION_VALUE' } });
    const commissionType = typeSetting?.value || 'PERCENTAGE';
    const commissionValue = valSetting?.value || '20';

    return {
      referralCode,
      totalReferrals: user.referrals.length,
      totalEarned,
      currentBalance: user.balance,
      commissionType,
      commissionValue
    };
  }

  async getHistory(userId: string) {
    return this.prisma.referralCommission.findMany({
      where: { referrerId: userId },
      include: {
        referee: {
          select: { name: true, email: true }
        },
        subscription: {
          include: { package: { select: { name: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
