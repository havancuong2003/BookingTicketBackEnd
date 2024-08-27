import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomService } from './room.service';
import { RoomDTO } from './dto/room.dto';

@Controller('room')
export class RoomController {
  constructor(private roomService: RoomService) {}
  @Get('getAll')
  async getAll() {
    const room = this.roomService.getCinemaByRoomId();
    return (await room).map((room) => ({
      roomId: room.roomId,
      roomCode: room.roomCode,
      cinemaId: room.cinemaId,
      cinemaName: room.cinema.name,
    }));
  }

  @Post('create')
  async create(@Body() data: RoomDTO) {
    return this.roomService.create(data);
  }

  @Put('update/:id')
  async update(@Body() data: RoomDTO, @Param('id') roomId: string) {
    return this.roomService.update(Number(roomId), data);
  }

  @Delete('delete/:id')
  async delete(@Param('id') roomId: string) {
    return this.roomService.delete(Number(roomId));
  }

  @Get('details/:id')
  async findById(@Param('id') roomId: string) {
    console.log('roomId:', roomId);

    return this.roomService.findById(Number(roomId));
  }
}
