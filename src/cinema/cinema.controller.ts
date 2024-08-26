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
  update(@Param('id') id: number, @Body() updateMovieDto: CinemaDTO) {
    return this.cinemaService.update(id, updateMovieDto);
  }

  @Delete('delete/:id')
  delete(@Param('id') id: number) {
    return this.cinemaService.delete(id);
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.cinemaService.findById(id);
  }
}
