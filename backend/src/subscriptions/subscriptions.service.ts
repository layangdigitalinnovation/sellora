import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SubscriptionsService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async getPackages() {
    return this.prisma.subscriptionPackage.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' }
    });
  }

  async getPackage(id: string) {
    const pkg = await this.prisma.subscriptionPackage.findUnique({ where: { id } });
    if (!pkg) throw new NotFoundException('Package not found');
    return pkg;
  }

  async createPackage(data: any) {
    return this.prisma.subscriptionPackage.create({
      data: {
        name: data.name,
        slug: data.slug,
        price: data.price,
        billingPeriod: data.billingPeriod,
        features: data.features,
      }
    });
  }

  async updatePackage(id: string, data: any) {
    return this.prisma.subscriptionPackage.update({
      where: { id },
      data
    });
  }

  async checkout(userId: string, packageId: string) {
    const pkg = await this.prisma.subscriptionPackage.findUnique({ where: { id: packageId } });
    if (!pkg) throw new NotFoundException('Package not found');
    
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const subscription = await this.prisma.userSubscription.create({
      data: {
        userId,
        packageId,
        status: 'PENDING',
      }
    });

    const secretKey = this.configService.get('XENDIT_SECRET_KEY') || 'xnd_development_placeholder';
    const authString = Buffer.from(`${secretKey}:`).toString('base64');

    try {
      const response = await fetch('https://api.xendit.co/v2/invoices', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          external_id: `sub_${subscription.id}`,
          amount: pkg.price,
          description: `Pembayaran Langganan Paket ${pkg.name} (${pkg.billingPeriod})`,
          payer_email: user.email,
          customer: {
            given_names: user.name,
            email: user.email,
          },
          success_redirect_url: `http://localhost:3000/dashboard/subscription?status=success`,
          failure_redirect_url: `http://localhost:3000/dashboard/subscription?status=failed`,
          currency: 'IDR'
        })
      });

      const invoice = await response.json();

      if (!response.ok) {
        throw new Error(invoice.message || 'Xendit API error');
      }

      await this.prisma.userSubscription.update({
        where: { id: subscription.id },
        data: { paymentRef: invoice.id }
      });

      return { checkoutUrl: invoice.invoice_url, subscriptionId: subscription.id };
    } catch (e: any) {
      console.error('Xendit error:', e);
      throw new BadRequestException('Failed to generate payment url: ' + e.message);
    }
  }

  async handleWebhook(data: any, callbackToken: string) {
    const expectedToken = this.configService.get('XENDIT_WEBHOOK_TOKEN');
    if (expectedToken && callbackToken !== expectedToken) {
      throw new BadRequestException('Invalid webhook token');
    }

    if (data.status === 'PAID' || data.status === 'SETTLED') {
      const externalId = data.external_id; // "sub_..."
      if (externalId && externalId.startsWith('sub_')) {
        const subId = externalId.replace('sub_', '');
        
        const sub = await this.prisma.userSubscription.findUnique({
          where: { id: subId },
          include: { package: true }
        });
        
        if (sub && sub.status !== 'ACTIVE') {
          // Calculate endDate
          const now = new Date(data.paid_at || new Date());
          const endDate = new Date(now);
          if (sub.package.billingPeriod === 'YEARLY') {
            endDate.setFullYear(endDate.getFullYear() + 1);
          } else {
            endDate.setMonth(endDate.getMonth() + 1);
          }

          const user = await this.prisma.user.findUnique({ where: { id: sub.userId } });

          // Handle Referral Commission (One-Time)
          let commissionOps: any[] = [];
          if (user && user.referredById) {
            const existingCommission = await this.prisma.referralCommission.findFirst({
              where: { refereeId: user.id }
            });
            if (!existingCommission) {
              const typeSetting = await this.prisma.systemSetting.findUnique({ where: { key: 'AFFILIATE_COMMISSION_TYPE' } });
              const valSetting = await this.prisma.systemSetting.findUnique({ where: { key: 'AFFILIATE_COMMISSION_VALUE' } });
              
              const commType = typeSetting?.value || 'PERCENTAGE';
              const commValue = valSetting?.value ? parseFloat(valSetting.value) : 20;
              
              let commissionAmount = 0;
              if (commType === 'FIXED') {
                commissionAmount = commValue;
              } else {
                commissionAmount = sub.package.price * (commValue / 100);
              }

              commissionOps.push(
                this.prisma.referralCommission.create({
                  data: {
                    referrerId: user.referredById,
                    refereeId: user.id,
                    subscriptionId: sub.id,
                    amount: commissionAmount,
                    status: 'PAID'
                  }
                })
              );
              commissionOps.push(
                this.prisma.user.update({
                  where: { id: user.referredById },
                  data: { balance: { increment: commissionAmount } }
                })
              );
            }
          }

          await this.prisma.$transaction([
            this.prisma.userSubscription.update({
              where: { id: subId },
              data: {
                status: 'ACTIVE',
                startDate: now,
                endDate: endDate
              }
            }),
            this.prisma.user.update({
              where: { id: sub.userId },
              data: {
                plan: (sub.package.name.toUpperCase() as any) || 'PRO'
              }
            }),
            ...commissionOps
          ]);
        }
      }
    }

    return { success: true };
  }

  async getUserSubscription(userId: string) {
    return this.prisma.userSubscription.findFirst({
      where: { userId, status: 'ACTIVE' },
      include: { package: true },
      orderBy: { endDate: 'desc' }
    });
  }
}
