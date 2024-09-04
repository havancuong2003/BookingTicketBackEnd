import { Injectable, Req, Res, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import * as tokenService from '../utils/jwt-helper';
interface JwtPayload {
  email: string;
  id: number;
  role: number;
  firstName: string;
}
@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}
  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: UserDto) {
    return await this.prisma.user.create({ data });
  }

  async update(userId: number, data: Partial<UserDto>) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: data,
    });
  }

  async login(data: any) {
    const user = await this.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (await argon2.verify(user.hashPass, data.password)) {
      delete user.hashPass; // Xóa mật khẩu khỏi đối tượng người dùng

      const userData: JwtPayload = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        role: user.roleId,
      };
      const accessToken = await tokenService.generateToken(
        userData,
        process.env.ACCESS_TOKEN_SECRET,
        process.env.ACCESS_TOKEN_LIFE,
      );

      const refreshToken = await tokenService.generateToken(
        userData,
        process.env.REFRESH_TOKEN_SECRET,
        process.env.REFRESH_TOKEN_LIFE,
      );

      return {
        statusCode: 200,
        message: 'Login successful',
        token: {
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
      };
    }
    throw new UnauthorizedException('Invalid password');
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const payload = await tokenService.verifyToken(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );

      const newPayload: JwtPayload = {
        email: payload.email,
        id: payload.id,
        role: payload.role,
        firstName: payload.firstName,
      };

      return await tokenService.generateToken(
        newPayload,
        process.env.ACCESS_TOKEN_SECRET,
        process.env.ACCESS_TOKEN_LIFE,
      );
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
  async checkRoleLoginGG(email: string): Promise<string> {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const role = await this.prisma.role.findUnique({
      where: { id: user.roleId },
    });
    return role.roleName;
  }

  async getAll() {
    return await this.prisma.user.findMany({});
  }

  async getUserIdByEmail(email: string) {
    const UserDto = await this.prisma.user.findUnique({ where: { email } });
    return UserDto.id;
  }
}
