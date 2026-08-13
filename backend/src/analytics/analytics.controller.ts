import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  getStats(@Request() req: any) {
    return this.analyticsService.getStats(req.user.userId);
  }

  @Post('track')
  trackEvent(@Body() body: { storeId: string; productId?: string; eventType: string; visitorId: string }) {
    return this.analyticsService.trackEvent(body.storeId, body.productId, body.eventType, body.visitorId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('funnel')
  getFunnel(@Request() req: any, @Query('period') period?: '30_days' | '90_days') {
    return this.analyticsService.getFunnelData(req.user.userId, period);
  }

  @UseGuards(JwtAuthGuard)
  @Get('chart')
  getChart(@Request() req: any, @Query('period') period?: 'weekly' | 'monthly') {
    return this.analyticsService.getChartData(req.user.userId, period);
  }
}
