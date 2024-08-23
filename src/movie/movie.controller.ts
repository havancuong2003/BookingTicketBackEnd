import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieDto } from './dto/movie.dto';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('getAll')
  getAll() {
    return this.movieService.getAll();
  }

  @Post('create')
  create(@Body() createMovieDto: MovieDto) {
    return this.movieService.create(createMovieDto);
  }

  @Put('update/:id')
  update(@Param('id') id: number, @Body() updateMovieDto: MovieDto) {
    return this.movieService.update(id, updateMovieDto);
  }

  @Delete('delete/:id')
  delete(@Param('id') id: number) {
    return this.movieService.delete(id);
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.movieService.findById(id);
  }
}
