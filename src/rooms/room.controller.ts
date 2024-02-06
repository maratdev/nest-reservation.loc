import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomDto } from './dto/room.dto';
import {
  MONGO_DUPLICATE_STATUS,
  ROOM_CREATED_SUCCESS,
  ROOM_DELETE_SUCCESS,
  ROOM_FOUND_CONFLICT,
  ROOM_NOT_CREATED,
  ROOM_NOTFOUND,
  ROOM_UPDATE_SUCCESS,
  SERVER_ERROR,
} from '../config/constants/constant';
import { RoomIdDto } from './dto/roomId.dto';
import { GetReserveDto } from '../reserve/dto/getReserve.dto';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  // -----------------Вывод всех комнат

  @Get('all')
  async getRoom(@Res() response) {
    try {
      const roomData = await this.roomService.getAllRooms();
      response.status(HttpStatus.OK).json(roomData);
    } catch (err) {
      if (err.status === HttpStatus.NOT_FOUND) {
        throw new NotFoundException(ROOM_NOTFOUND);
      }
      return response.status(err?.status).json({
        statusCode: HttpStatus.BAD_GATEWAY,
        message: SERVER_ERROR,
      });
    }
  }

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
  @Patch('/:id')
  async updateRoom(
    @Res() response,
    @Param() roomId: RoomIdDto,
    @Body() updateRoomDto: RoomDto,
  ) {
    try {
      const existingRoom = await this.roomService.updateRoom(
        roomId,
        updateRoomDto,
      );
      return response.status(HttpStatus.OK).json({
        message: ROOM_UPDATE_SUCCESS,
        existingRoom,
      });
    } catch (err) {
      if (err.status === HttpStatus.NOT_FOUND) {
        throw new NotFoundException(`${ROOM_NOTFOUND} ${roomId.id}`);
      }
      if (err?.status === HttpStatus.CONFLICT) {
        throw new ConflictException(ROOM_FOUND_CONFLICT);
      }
      return response.status(err?.status).json({
        statusCode: HttpStatus.BAD_GATEWAY,
        message: SERVER_ERROR,
      });
    }
  }

  //--------- Запрос комнаты по id
  @Get('/:id')
  async getReserve(@Res() response, @Param() objId: GetReserveDto) {
    try {
      const existingRoom = await this.roomService.getRoom(objId);
      return response.status(HttpStatus.OK).json(existingRoom);
    } catch (err) {
      if (err.status === HttpStatus.NOT_FOUND) {
        throw new NotFoundException(`${ROOM_NOTFOUND} ${objId.id}`);
      }
      return response.status(err?.status).json({
        statusCode: HttpStatus.BAD_GATEWAY,
        message: SERVER_ERROR,
      });
    }
  }

  // -----------------Удаление комнаты по id
  @Delete('/:id')
  async deleteRoom(@Res() response, @Param() roomId: RoomIdDto) {
    try {
      await this.roomService.deleteRoom(roomId);
      return response.status(HttpStatus.OK).json({
        message: `${ROOM_DELETE_SUCCESS} ${roomId.id}`,
      });
    } catch (err) {
      if (err.status === HttpStatus.NOT_FOUND) {
        throw new NotFoundException(`${ROOM_NOTFOUND} ${roomId.id}`);
      }
      return response.status(err?.status).json({
        statusCode: HttpStatus.BAD_GATEWAY,
        message: SERVER_ERROR,
      });
    }
  }
}
