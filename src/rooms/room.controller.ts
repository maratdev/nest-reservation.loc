import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomDto } from './dto/room.dto';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  // -------------Создание комнаты
  @Post('create')
  async create(@Res() response, @Body() dto: RoomDto) {
    try {
      const newRoom = await this.roomService.createRoom(dto);
      return response.status(HttpStatus.CREATED).json({
        message: 'Комната успешно создана',
        newRoom,
      });
    } catch (err) {
      if (err.code === 11000) {
        throw new ConflictException('Такая комната уще существует');
      }
      if (err.code === 400) {
        throw new BadRequestException('Ошибка: Комната не создана!');
      }
      return response.status(HttpStatus.BAD_GATEWAY).json({
        statusCode: 500,
        message: 'Ошибка сервера!',
        error: 'Server error',
      });
    }
  }

  // -----------------Обновление дынных комнаты по id
  @Put('/:id')
  async updateStudent(
    @Res() response,
    @Param('id') roomId: string,
    @Body() dto: RoomDto,
  ) {
    try {
      const existingRoom = await this.roomService.updateRoom(roomId, dto);
      return response.status(HttpStatus.OK).json({
        message: 'Данные комнаты успешно обновлены',
        existingRoom,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  // -----------------Вывод всех комнат

  @Get('all')
  async getStudent(@Res() response) {
    try {
      const roomData = await this.roomService.getAllRooms();
      return response.status(HttpStatus.OK).json({
        message: 'Данные по всем номерам успешно найдены',
        roomData,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
  // -----------------Удаление комнаты по id
  @Delete('/:id')
  async deleteRoom(@Res() response, @Param('id') roomId: string) {
    try {
      const deletedRoom = await this.roomService.deleteRoom(roomId);
      return response.status(HttpStatus.OK).json({
        message: 'Комната успешно удалена',
        deletedRoom,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
}
