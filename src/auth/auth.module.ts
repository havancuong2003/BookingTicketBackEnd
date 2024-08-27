import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategy/google.strategy';
import { UserService } from 'src/user/user.service';
import { RoleService } from 'src/role/role.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'google' })],
  providers: [
    AuthService,
    GoogleStrategy,
    UserService,
    RoleService,
    JwtService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
