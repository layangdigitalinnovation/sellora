import { Controller, Get, Post, Put, Body, UseGuards, Request, Param } from '@nestjs/common';
import { StoresService } from './stores.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Prisma } from '@prisma/client';

@Controller('api/stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req: any, @Body() body: { name: string; slug: string }) {
    return this.storesService.create(req.user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMine(@Request() req: any) {
    return this.storesService.findByUserId(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  updateMine(@Request() req: any, @Body() body: Prisma.StoreUpdateInput) {
    return this.storesService.update(req.user.userId, body);
  }

  @Get(':slug')
  getBySlug(@Param('slug') slug: string) {
    return this.storesService.findBySlug(slug);
  }
}
