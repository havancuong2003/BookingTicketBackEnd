import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context) {
    if (err || !user) {
      if (info instanceof Error && info.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired');
      }
      throw err || new UnauthorizedException('Invalid token');
    }
    return user;
  }
}
