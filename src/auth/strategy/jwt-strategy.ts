import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as tokenService from '../../utils';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET, // Đảm bảo đúng secret
      passReqToCallback: true, // Cho phép truy cập request trong validate
    });
  }

  async validate(req: any, payload: any) {
    try {
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      await tokenService.verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
      return { userId: payload.id, email: payload.email, role: payload.role };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
