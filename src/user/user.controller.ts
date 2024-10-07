import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import * as argon2 from 'argon2';
import { RoleService } from 'src/role/role.service';
import { Response, Request } from 'express';
import { ConflictException } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/strategy/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}

  @Post('getInfo') // Sử dụng @Post
  @UseGuards(JwtAuthGuard) // Sử dụng guard để xác thực token
  async getInfor(@Req() req: Request) {
    // Sử dụng type assertion để cho TypeScript biết rằng req có thuộc tính user
    const user = (req as any).user; // Hoặc có thể sử dụng `req as { user: any }`

    // Kiểm tra xem user có tồn tại không
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userFound = await this.userService.findByEmail(user.email);
    console.log('User data:', userFound);
    return {
      id: user.userId,
      email: userFound.email,
      firstName: userFound.firstName,
      lastName: userFound.lastName,
      role: user.role,
      phoneNumber: userFound.phoneNumber,
      picture: userFound.picture,
    };
  }
}
