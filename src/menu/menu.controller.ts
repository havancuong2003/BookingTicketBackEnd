import { MenuDto } from './dto/menu.dto';
import {
  Body,
  Controller,
  Post,
  Put,
  Param,
  Get,
  Delete,
} from '@nestjs/common';
import { ComboDto } from './dto/combo.dto';
import { MenuService } from './menu.service';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post('item')
  createMenuItem(@Body() menu: MenuDto) {
    return this.menuService.createMenuItem(menu); // Call service method
  }

  @Put('item/:id')
  updateMenuItem(@Param('id') id: string, @Body() menu: MenuDto) {
    return this.menuService.updateMenuItem(id, menu); // Call service method
  }

  @Post('combo')
  createCombo(@Body() combo: ComboDto) {
    return this.menuService.createCombo(combo); // Call service method
  }

  @Put('combo/:id')
  updateCombo(@Param('id') id: number, @Body() combo: ComboDto) {
    return this.menuService.updateCombo(id, combo); // Call service method
  }

  @Get('item')
  getMenuItems() {
    return this.menuService.getMenuItems(); // Call service method to get menu items
  }

  @Get('combo')
  getCombos() {
    return this.menuService.getCombos(); // Call service method to get combos
  }

  @Delete('item/:id')
  async deleteMenuItem(@Param('id') id: number) {
    return await this.menuService.deleteMenuItem(id); // Gọi service để xóa menu item
  }

  @Delete('combo/:id')
  async deleteCombo(@Param('id') id: number) {
    return await this.menuService.deleteCombo(id); // Gọi service để xóa combo
  }
}
