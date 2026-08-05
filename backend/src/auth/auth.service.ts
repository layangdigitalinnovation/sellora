import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async getUserById(id: string) {
    const user = await this.usersService.findById(id);
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, name: user.name, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        role: user.role
      }
    };
  }

  async register(data: any) {
    const existingUser = await this.usersService.findOne(data.email);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }
    
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    let referredById: string | null = null;
    if (data.referralCode) {
      const referrer = await this.usersService.findByReferralCode(data.referralCode);
      if (referrer) {
        referredById = referrer.id;
      }
    }

    const referralCode = crypto.randomBytes(4).toString('hex'); // 8-char random hex

    const user = await this.usersService.create({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      referralCode,
      ...(referredById ? { referredBy: { connect: { id: referredById } } } : {})
    });

    const { password, ...result } = user;
    return this.login(result);
  }
}
