import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoomDto } from './dto/room.dto';
import { IRoom } from './interface/room.interface';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel('RoomsModel')
    private readonly roomsModel: Model<IRoom>,
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
      throw new NotFoundException(`Room #${roomId} not found`);
    }
    return existingRoom;
  }

  // -----------------Вывод всех комнат
  async getAllRooms(): Promise<IRoom[]> {
    const roomData = await this.roomsModel.find();
    if (!roomData || roomData.length == 0) {
      throw new NotFoundException('Rooms data not found!');
    }
    return roomData;
  }

  async deleteRoom(roomId: string): Promise<IRoom> {
    const deletedRoom = await this.roomsModel.findByIdAndDelete(roomId);
    if (!deletedRoom) {
      throw new NotFoundException(`Student #${roomId} not found`);
    }
    return deletedRoom;
  }
}
