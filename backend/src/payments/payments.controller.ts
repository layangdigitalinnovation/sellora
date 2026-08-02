import { Controller, Post, Body, HttpCode, HttpStatus, Req, Get, Param, Res, BadRequestException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { StorageService } from '../storage/storage.service';
import type { Response } from 'express';

@Controller('api/payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly storageService: StorageService
  ) {}

  @Post('checkout')
  async checkout(@Body() body: any) {
    return this.paymentsService.checkout(body);
  }

  @Post('webhook/xendit')
  @HttpCode(HttpStatus.OK)
  async xenditWebhook(@Body() body: any, @Req() req: any) {
    const webhookToken = req.headers['x-callback-token'];
    await this.paymentsService.handleXenditWebhook(body, webhookToken);
    return { success: true };
  }

  @Get('order/:id')
  async getOrder(@Param('id') id: string) {
    return this.paymentsService.getOrder(id);
  }

  @Get('order/:id/video-url')
  async getVideoUrl(@Param('id') id: string) {
    const order = await this.paymentsService.getOrder(id);
    if (order.status !== 'PAID') throw new BadRequestException('Order is not paid');
    if (!order.product.fileUrl) throw new BadRequestException('Product has no file');

    const key = order.product.fileUrl; 
    const url = await this.storageService.getVideoSignedUrl(key, 900);
    return { url };
  }

  @Get('order/:id/download-file')
  async downloadFile(@Param('id') id: string, @Res() res: Response) {
    const order = await this.paymentsService.getOrder(id);
    if (order.status !== 'PAID') throw new BadRequestException('Order is not paid');
    if (!order.product.fileUrl) throw new BadRequestException('Product has no file');

    const key = order.product.fileUrl; 
    const url = await this.storageService.getVideoSignedUrl(key, 900);
    return res.redirect(url);
  }

  @Get('order/:id/download-pdf')
  async downloadPdf(@Param('id') id: string, @Res() res: Response) {
    const order = await this.paymentsService.getOrder(id);
    if (order.status !== 'PAID') throw new BadRequestException('Order is not paid');
    if (!order.product.fileUrl) throw new BadRequestException('Product has no file');

    const key = order.product.fileUrl;
    const pdfBytes = await this.storageService.getWatermarkedPdf(
      key, 
      order.buyerName, 
      order.buyerEmail, 
      order.buyerPhone || ''
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${order.product.title}.pdf"`,
      'Content-Length': pdfBytes.length,
    });

    res.send(Buffer.from(pdfBytes));
  }
}
