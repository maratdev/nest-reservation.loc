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
import {
  MONGO_DUPLICATE_STATUS,
  RESERVE_UPDATE_SUCCESS,
  ROOM_ALL_SUCCESS,
  ROOM_CREATED_SUCCESS,
  ROOM_DELETE_SUCCESS,
  ROOM_FOUND_CONFLICT,
  ROOM_NOT_CREATED,
  SERVER_ERROR,
} from '../config/constants/constant';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  // -------------Создание комнаты
  @Post('create')
  async createRoom(@Res() response, @Body() dto: RoomDto) {
    try {
      const newRoom = await this.roomService.createRoom(dto);
      return response.status(HttpStatus.CREATED).json({
        message: ROOM_CREATED_SUCCESS,
        newRoom,
      });
    } catch (err) {
      if (err.code === MONGO_DUPLICATE_STATUS) {
        throw new ConflictException(ROOM_FOUND_CONFLICT);
      }
      if (err.code === HttpStatus.BAD_REQUEST) {
        throw new BadRequestException(ROOM_NOT_CREATED);
      }
      return response.status(HttpStatus.BAD_GATEWAY).json({
        statusCode: HttpStatus.BAD_GATEWAY,
        message: SERVER_ERROR,
      });
    }
  }

  // -----------------Обновление дынных комнаты по id
  @Put('/:id')
  async updateRoom(
    @Res() response,
    @Param('id') roomId: string,
    @Body() dto: RoomDto,
  ) {
    try {
      const existingRoom = await this.roomService.updateRoom(roomId, dto);
      return response.status(HttpStatus.OK).json({
        message: RESERVE_UPDATE_SUCCESS,
        existingRoom,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  // -----------------Вывод всех комнат

  @Get('all')
  async getRoom(@Res() response) {
    try {
      const roomData = await this.roomService.getAllRooms();
      return response.status(HttpStatus.OK).json({
        message: ROOM_ALL_SUCCESS,
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
        message: ROOM_DELETE_SUCCESS,
        deletedRoom,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
}
