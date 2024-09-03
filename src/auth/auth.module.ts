import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategy/google.strategy';
import { UserService } from 'src/user/user.service';
import { RoleService } from 'src/role/role.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { UserDto } from 'src/user/dto/user.dto';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'google' }), UserDto],
  providers: [
    AuthService,
    GoogleStrategy,
    UserService,
    RoleService,
    JwtService,
    EmailService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
