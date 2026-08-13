import { Controller, Get, Post, Put, Body, Param, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('packages')
  async getPackages() {
    return this.subscriptionsService.getPackages();
  }

  @Post('checkout')
  async checkout(@Body() body: any, @Req() req: any) {
    const userId = body.userId; // in real app, extracted from JWT
    const packageId = body.packageId;
    return this.subscriptionsService.checkout(userId, packageId);
  }

  @Post('webhook/xendit')
  @HttpCode(HttpStatus.OK)
  async xenditWebhook(@Body() body: any, @Req() req: any) {
    const webhookToken = req.headers['x-callback-token'];
    await this.subscriptionsService.handleWebhook(body, webhookToken);
    return { success: true };
  }

  @Get('user/:userId')
  async getUserSubscription(@Param('userId') userId: string) {
    const sub = await this.subscriptionsService.getUserSubscription(userId);
    return sub || {};
  }

  // Admin APIs for packages
  @Post('packages')
  async createPackage(@Body() body: any) {
    return this.subscriptionsService.createPackage(body);
  }

  @Put('packages/:id')
  async updatePackage(@Param('id') id: string, @Body() body: any) {
    return this.subscriptionsService.updatePackage(id, body);
  }
}
