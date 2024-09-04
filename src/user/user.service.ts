import {
  ConflictException,
  Injectable,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import * as tokenService from '../utils/jwt-helper';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

  async login(data: { email: string; password: string }) {
    const user = await this.findByEmail(data.email);
    console.log('check hashPass', !user.hashPass);

    if (!user.hashPass) {
      return {
        statusCode: 401,
        message: 'Password not set',
      };
    }
    if (!user) {
      return {
        statusCode: 401,
        message: 'Invalid email ',
      };
    }
    const isPasswordValid = await argon2.verify(user.hashPass, data.password);
    if (!isPasswordValid) {
      return {
        statusCode: 401,
        message: 'Invalidpassword',
      };
    }
    if (!user.isEmailVerified) {
      return {
        statusCode: 403,
        message: 'Email not verified',
        requireEmailVerification: true,
        email: user.email,
      };
    }

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
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.roleId,
      },
    };
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async create(userDto: UserDto) {
    try {
      const newUser = await this.prisma.user.create({
        data: userDto,
      });
      return newUser;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email already exists');
      }
      throw error; // Re-throw other errors
    }
  }

  async update(userId: number, data: Partial<UserDto>) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: data,
    });
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

  async updateUser(
    userId: number,
    updateData: Partial<UserDto>,
  ): Promise<UserDto> {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
    return updatedUser;
  }
}
