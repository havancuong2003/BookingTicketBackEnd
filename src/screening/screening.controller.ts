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
  @Get('getByRoomId/:roomId')
  async getByRoomId(@Param('roomId') roomId: string) {
    const screenings = await this.screeningService.getScreeningByRoomId(
      Number(roomId),
    );
    return screenings.map((screen) => ({
      movieId: screen.movieId,
      roomId: screen.roomId,
      screeningId: screen.screeningId,
      roomCode: screen.room.roomCode,
      movieName: screen.movie.title,
      startTime: screen.startTime,
      endTime: screen.endTime,
    }));
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

  @Get('inforScreening/:screeningId')
  async getSeatDetails(@Param('screeningId') screeningId: number) {
    return this.screeningService.getAllInforScreening(Number(screeningId));
  }
}
