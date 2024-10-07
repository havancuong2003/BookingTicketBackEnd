import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Đảm bảo đường dẫn đúng
import { MenuDto } from './dto/menu.dto';
import { ComboDto } from './dto/combo.dto';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  async createMenuItem(menu: MenuDto) {
    return await this.prisma.menuItem.create({
      data: menu,
    });
  }

  async updateMenuItem(id: string, menu: MenuDto) {
    return await this.prisma.menuItem.update({
      where: { id: Number(id) },
      data: menu,
    });
  }

  async createCombo(comboDto: ComboDto) {
    const { name, price, image, items } = comboDto;

    const combo = await this.prisma.combo.create({
      data: {
        name,
        price,
        image,
        items: {
          create: items.map((item) => ({
            menuItemId: item.id, // ID của món ăn
            quantity: item.quantity, // Số lượng của món ăn
          })),
        },
      },
      include: {
        items: true, // Bao gồm thông tin về các món ăn trong combo
      },
    });

    return combo;
  }

  // Cập nhật Combo
  async updateCombo(id: number, comboDto: ComboDto) {
    const { name, price, image, items } = comboDto;

    const updatedCombo = await this.prisma.combo.update({
      where: { id },
      data: {
        name,
        price,
        image,
        items: {
          // Đặt lại tất cả các kết nối hiện có
          set: [],
          // Kết nối các mục mới
          connect: items.map((item: MenuDto) => {
            if (item.id) {
              return { id: item.id }; // Chỉ kết nối nếu item có id
            }
            throw new Error('Item must have an id.'); // Ném lỗi nếu không có id
          }),
        },
      },
      include: {
        items: true,
      },
    });

    return updatedCombo;
  }

  async getMenuItems() {
    return await this.prisma.menuItem.findMany(); // Fetch all menu items
  }

  async getCombos() {
    return await this.prisma.combo.findMany({
      include: {
        items: {
          include: {
            menuItem: true, // Bao gồm thông tin về món ăn
          },
        },
      },
    });
  }

  async deleteMenuItem(id: number) {
    return await this.prisma.menuItem.delete({
      where: { id }, // Xóa item theo id
    });
  }

  async deleteCombo(id: number) {
    return await this.prisma.combo.delete({
      where: { id }, // Xóa combo theo id
    });
  }
}
