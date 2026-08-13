import { Controller, Post, Body, HttpCode, HttpStatus, Request, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: any) {
    if (!body || !body.email || !body.password) {
      return {
        status: 400,
        message: 'Email and password are required',
      };
    }

    const user = await this.authService.validateUser(
      body.email,
      body.password,
    );

    if (!user) {
      return {
        status: 401,
        message: 'Invalid credentials',
      };
    }

    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req: any) {
    const fullUser = await this.authService.getUserById(req.user.userId);
    return fullUser || req.user;
  }
}
