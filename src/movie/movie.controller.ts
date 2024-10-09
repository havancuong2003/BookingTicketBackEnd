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
import { MovieStatus } from '@prisma/client';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('getAll')
  getAll() {
    return this.movieService.getAll();
  }

  @Post('create')
  create(@Body() createMovieDto: MovieDto) {
    console.log('createMovieDto', createMovieDto);
    return this.movieService.create(createMovieDto);
  }

  @Put('update/:id')
  update(@Param('id') id: number, @Body() updateMovieDto: MovieDto) {
    console.log('updateMovieDto', updateMovieDto);

    return this.movieService.update(id, updateMovieDto);
  }

  @Delete('delete/:id')
  delete(@Param('id') id: number) {
    return this.movieService.delete(id);
  }

  // @Get(':id')
  // async getMovieById(@Param('id') id: string) {
  //   const movieId = parseInt(id, 10); // Chuyển đổi id từ string sang number
  //   return this.movieService.findById(movieId);
  // }

  @Get('getAllStatus')
  getAllStatus() {
    return Object.values(MovieStatus); // Trả về tất cả các giá trị của enum
  }
}
