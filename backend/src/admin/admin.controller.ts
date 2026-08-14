import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('analytics')
  async getAnalytics() {
    return this.adminService.getAnalytics();
  }

  @Get('sellers')
  async getSellers() {
    return this.adminService.getSellers();
  }

  @Get('settings')
  async getSettings() {
    return this.adminService.getSettings();
  }

  @Post('settings')
  async updateSettings(@Body() body: Record<string, string>) {
    return this.adminService.updateSettings(body);
  }

  @Get('backfill')
  async backfill() {
    return this.adminService.backfillCustomers();
  }

  // Voucher Management Endpoints
  @Get('vouchers')
  async getVouchers() {
    return this.adminService.getVouchers();
  }

  @Post('vouchers')
  async createVoucher(@Body() body: { code: string; discountPercent: number; isActive?: boolean }) {
    return this.adminService.createVoucher(body);
  }

  @Put('vouchers/:id')
  async updateVoucher(@Param('id') id: string, @Body() body: { code?: string; discountPercent?: number; isActive?: boolean }) {
    return this.adminService.updateVoucher(id, body);
  }

  @Delete('vouchers/:id')
  async deleteVoucher(@Param('id') id: string) {
    return this.adminService.deleteVoucher(id);
  }
}
