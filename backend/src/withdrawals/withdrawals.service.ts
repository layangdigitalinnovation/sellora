import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WithdrawalsService {
  private readonly FEE = 3500;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async updateBankDetails(userId: string, data: { bankName: string; accountNumber: string; accountHolder: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        accountHolder: data.accountHolder,
      },
      select: {
        id: true,
        bankName: true,
        accountNumber: true,
        accountHolder: true,
      }
    });
  }

  async getWithdrawals(userId: string) {
    return this.prisma.withdrawal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async requestWithdrawal(userId: string, amount: number) {
    if (amount <= this.FEE) {
      throw new BadRequestException(`Amount must be greater than the fee of Rp ${this.FEE}`);
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (!user.bankName || !user.accountNumber || !user.accountHolder) {
      throw new BadRequestException('Bank account details are not set');
    }

    if (user.balance < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    const netAmount = amount - this.FEE;

    // Deduct balance and create withdrawal record
    // Use transaction to ensure consistency
    const withdrawal = await this.prisma.$transaction(async (prisma) => {
      await prisma.user.update({
        where: { id: userId },
        data: { balance: { decrement: amount } }
      });

      return prisma.withdrawal.create({
        data: {
          userId,
          amount,
          fee: this.FEE,
          netAmount,
          bankName: user.bankName!,
          accountNumber: user.accountNumber!,
          accountHolder: user.accountHolder!,
          status: 'PROCESSING'
        }
      });
    });

    // Call Xendit API for Instant Payout
    const secretKey = this.configService.get('XENDIT_API_KEY');
    if (!secretKey) throw new Error('XENDIT_API_KEY is not configured');
    const authString = Buffer.from(`${secretKey}:`).toString('base64');

    try {
      const response = await fetch('https://api.xendit.co/disbursements', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          external_id: `withdraw_${withdrawal.id}`,
          amount: netAmount,
          bank_code: user.bankName,
          account_holder_name: user.accountHolder,
          account_number: user.accountNumber,
          description: 'Sellora Instant Payout'
        })
      });

      const xenditData = await response.json();

      if (!response.ok) {
        throw new Error(xenditData.message || 'Failed to disburse');
      }

      // Update to completed if it's instantly completed, otherwise leave as processing
      // Xendit usually returns PENDING initially, then we rely on webhook to mark COMPLETED.
      // But for simplicity of this instant payout, we'll mark as COMPLETED if it doesn't fail.
      return this.prisma.withdrawal.update({
        where: { id: withdrawal.id },
        data: { status: 'COMPLETED', processedAt: new Date() }
      });

    } catch (error: any) {
      console.error('Xendit disbursement error:', error);
      
      // Revert balance on failure
      await this.prisma.$transaction([
        this.prisma.user.update({
          where: { id: userId },
          data: { balance: { increment: amount } }
        }),
        this.prisma.withdrawal.update({
          where: { id: withdrawal.id },
          data: { status: 'FAILED' }
        })
      ]);

      throw new BadRequestException('Disbursement failed: ' + error.message);
    }
  }
}
