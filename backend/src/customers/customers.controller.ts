import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req: any) {
    return this.customersService.findAllByUserId(req.user.userId);
  }
}
