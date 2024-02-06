import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoomDto } from './dto/room.dto';
import { RoomsModel } from './models/room.model';
import { RoomIdDto } from './dto/roomId.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel('RoomsModel') private readonly roomsModel: Model<RoomsModel>,
  ) {}

  // -----------------Вывод всех комнат
  async getAllRooms(): Promise<RoomsModel[]> {
    const roomAllData = await this.roomsModel.find();
    if (!roomAllData || roomAllData.length == 0) {
      throw new NotFoundException();
    }
    return roomAllData;
  }

  // -------------Создание комнаты
  async createRoom(room: RoomDto): Promise<RoomsModel> {
    const createdNote = new this.roomsModel(room);
    return createdNote.save();
  }

  // -----------------Обновление дынных комнаты
  async updateRoom(
    roomId: RoomIdDto,
    updateRoomDto: RoomDto,
  ): Promise<RoomsModel> {
    console.log(roomId);
    await this.findRoomById(roomId.id);
    await this.searchRoomId(updateRoomDto);
    return this.roomsModel.findByIdAndUpdate(roomId.id, updateRoomDto, {
      new: true,
    });
  }

  //--------- Вывод инфомации о комнате
  async getRoom(dto: RoomIdDto): Promise<RoomsModel> {
    await this.findRoomById(dto.id);
    return this.roomsModel.findById(dto.id);
  }

  // -----------------Удаление комнаты
  async deleteRoom(roomId: RoomIdDto): Promise<void> {
    await this.findRoomById(roomId.id);
    await this.roomsModel.findByIdAndDelete(roomId.id);
  }

  //--------------------- Вспомогательные методы --------------------/
  // -----------------Поиск комнаты по id
  public async findRoomById(id: string): Promise<boolean> {
    const findRoom = await this.roomsModel.findById(id);
    if (!findRoom) throw new NotFoundException();
    return !!findRoom;
  }

  //--------- Поиск дубликата комнаты
  private async searchRoomId(dto: RoomDto): Promise<boolean> {
    const findReserve = await this.roomsModel.findOne({
      room_number: dto.room_number,
    });
    if (findReserve) throw new ConflictException();
    return !!findReserve;
  }
}
