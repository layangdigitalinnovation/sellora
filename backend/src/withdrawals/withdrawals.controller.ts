import { Controller, Get, Post, Put, Body, UseGuards, Request } from '@nestjs/common';
import { WithdrawalsService } from './withdrawals.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/withdrawals')
@UseGuards(JwtAuthGuard)
export class WithdrawalsController {
  constructor(private readonly withdrawalsService: WithdrawalsService) {}

  @Get()
  async getWithdrawals(@Request() req: any) {
    return this.withdrawalsService.getWithdrawals(req.user.userId);
  }

  @Post()
  async requestWithdrawal(@Request() req: any, @Body() body: { amount: number }) {
    return this.withdrawalsService.requestWithdrawal(req.user.userId, body.amount);
  }

  @Put('bank')
  async updateBankDetails(@Request() req: any, @Body() body: { bankName: string; accountNumber: string; accountHolder: string }) {
    return this.withdrawalsService.updateBankDetails(req.user.userId, body);
  }
}
