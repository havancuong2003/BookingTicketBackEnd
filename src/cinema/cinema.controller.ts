import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CinemaService } from './cinema.service';
import { CinemaDTO } from './dto/cinema.dto';

@Controller('cinema')
export class CinemaController {
  constructor(private cinemaService: CinemaService) {}
  @Get('getAll')
  getAll() {
    return this.cinemaService.getAll();
  }

  @Post('create')
  create(@Body() movieDto: CinemaDTO) {
    return this.cinemaService.create(movieDto);
  }

  @Put('update/:id')
  update(@Param('id') id: string, @Body() updateMovieDto: CinemaDTO) {
    return this.cinemaService.update(Number(id), updateMovieDto);
  }

  @Delete('delete/:id')
  delete(@Param('id') id: number) {
    return this.cinemaService.delete(id);
  }

  @Get('details/:id')
  findById(@Param('id') id: string) {
    return this.cinemaService.findById(Number(id));
  }
}
