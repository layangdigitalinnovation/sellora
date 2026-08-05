import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'sellora-super-secret-key-for-dev-only',
    });
  }

  async validate(payload: any) {
    const userId = payload.sub || payload.userId || payload.id;
    return { userId, email: payload.email, name: payload.name };
  }
}
