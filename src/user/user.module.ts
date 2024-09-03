import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RoleService } from 'src/role/role.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './dto/user.dto'; // Add this import

@Module({
  imports: [JwtModule],
  controllers: [UserController],
  providers: [
    UserService,
    RoleService,
    PrismaService,
    UserDto, // Add this provider
  ],
})
export class UserModule {}
