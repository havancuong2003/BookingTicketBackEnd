import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async findRole(roleName: string) {
    return await this.prisma.role.findUnique({
      where: { roleName: roleName },
    });
  }
}
