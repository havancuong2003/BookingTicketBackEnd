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
    console.log('comboDto', comboDto);

    const { name, price, image, items } = comboDto;

    // Kiểm tra và kết nối items, đảm bảo từng item có id
    const itemConnections = items.map((item: MenuDto) => {
      if (item.id) {
        // Kiểm tra nếu item.id tồn tại
        return { id: item.id };
      }
      throw new Error('Item must have an id.'); // Ném lỗi nếu không có id
    });

    const combo = await this.prisma.combo.create({
      data: {
        name,
        price,
        image,
        items: {
          connect: itemConnections,
        },
      },
      include: {
        items: true,
      },
    });

    console.log('combo', combo);

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
    return await this.prisma.combo.findMany(); // Fetch all combos
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
