import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ReferralsService } from './referrals.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/referrals')
@UseGuards(JwtAuthGuard)
export class ReferralsController {
  constructor(private readonly referralsService: ReferralsService) {}

  @Get('stats')
  async getStats(@Request() req: any) {
    return this.referralsService.getStats(req.user.userId);
  }

  @Get('history')
  async getHistory(@Request() req: any) {
    return this.referralsService.getHistory(req.user.userId);
  }
}
