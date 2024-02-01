import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoomDto } from './dto/room.dto';
import { IRoom } from './interface/room.interface';
import { ReserveModel } from '../reserve/models/reserve.model';
import { ROOM_NOTFOUND } from '../config/constants/constant';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel('RoomsModel') private readonly roomsModel: Model<IRoom>,
    @InjectModel('ReserveModel')
    private readonly reserveModel: Model<ReserveModel>,
  ) {}

  // -------------Создание комнаты
  async createRoom(room: RoomDto): Promise<IRoom> {
    const createdNote = new this.roomsModel(room);
    return createdNote.save();
  }

  // -----------------Обновление дынных комнаты
  async updateRoom(roomId: string, updateRoom: RoomDto): Promise<IRoom> {
    const existingRoom = await this.roomsModel.findByIdAndUpdate(
      roomId,
      updateRoom,
      { new: true },
    );
    if (!existingRoom) {
      throw new NotFoundException(`${ROOM_NOTFOUND} ${roomId}`);
    }

    return existingRoom;
  }

  // -----------------Вывод всех комнат
  async getAllRooms(): Promise<IRoom[]> {
    const roomData = await this.roomsModel.find();
    if (!roomData || roomData.length == 0) {
      throw new NotFoundException(ROOM_NOTFOUND);
    }
    return roomData;
  }

  // -----------------Удаление комнаты
  async deleteRoom(roomId: string): Promise<IRoom> {
    const deletedRoom = await this.roomsModel.findByIdAndDelete(roomId);
    if (!deletedRoom) {
      throw new NotFoundException(`${ROOM_NOTFOUND} ${roomId}`);
    }
    return deletedRoom;
  }
}
