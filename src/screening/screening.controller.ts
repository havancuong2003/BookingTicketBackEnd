import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ScreeningService } from './screening.service';
import { ScreeningDTO } from './dto';

@Controller('screening')
export class ScreeningController {
  constructor(private screeningService: ScreeningService) {}
  @Get('getAll')
  async getAll() {
    return this.screeningService.getAll();
  }

  @Post('create')
  async create(@Body() screeningDTO: any) {
    return this.screeningService.create(screeningDTO);
  }

  @Put('update/:screeningId')
  async update(
    @Body() screeningDTO: any,
    @Param('screeningId') screeningId: string,
  ) {
    return this.screeningService.update(Number(screeningId), screeningDTO);
  }

  @Get('detail/:screeningId')
  async detail(@Param('screeningId') screeningId: string) {
    return this.screeningService.findById(Number(screeningId));
  }

  @Delete('delete/:screeningId')
  async delete(@Param('screeningId') screeningId: string) {
    return this.screeningService.delete(Number(screeningId));
  }
}
