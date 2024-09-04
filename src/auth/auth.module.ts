import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategy/google.strategy';
import { UserService } from 'src/user/user.service';
import { RoleService } from 'src/role/role.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { UserDto } from 'src/user/dto/user.dto';
import { JwtAuthGuard } from './strategy/jwt-auth.guard';
import { JwtStrategy } from './strategy/jwt-strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'google' }),
    UserDto,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [
    AuthService,
    GoogleStrategy,
    UserService,
    RoleService,
    JwtService,
    EmailService,
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
