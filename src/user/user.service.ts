import { Injectable, Req, Res, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';

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

      const payload = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        sub: user.id,
      };
      console.log('secret:', process.env.JWT_SECRET);
      const accessToken = this.jwt.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1h',
      });

      return {
        statusCode: 200,
        message: 'Login successful',
        user: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          token: accessToken,
        },
      };
    }
    throw new UnauthorizedException('Invalid password');
  }
}
