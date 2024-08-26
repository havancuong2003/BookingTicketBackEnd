import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RoleService } from 'src/role/role.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [],
  providers: [UserService, UserController, RoleService, JwtService],
})
export class UserModule {}
