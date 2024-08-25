import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
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
}
