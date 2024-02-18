import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RoomDto } from './dto/room.dto';
import { RoomsModel } from './models/room.model';
import { RoomIdDto } from './dto/roomId.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(RoomsModel.name)
    private readonly roomsModel: Model<RoomsModel>,
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
    await this.searchDuplicateRoomNumber(room);
    const createdNote = new this.roomsModel(room);
    return createdNote.save();
  }

  // -----------------Обновление дынных комнаты
  async updateRoom(
    roomId: RoomIdDto,
    updateRoomDto: RoomDto,
  ): Promise<RoomsModel> {
    await this.checkRoomById(new Types.ObjectId(roomId.id));
    return this.roomsModel.findByIdAndUpdate(roomId.id, updateRoomDto, {
      new: true,
    });
  }

  //--------- Вывод информации о комнате
  async getRoom(dto: RoomIdDto): Promise<RoomsModel> {
    await this.checkRoomById(new Types.ObjectId(dto.id));
    return this.roomsModel.findById(dto.id);
  }

  // -----------------Удаление комнаты
  async deleteRoom(roomId: RoomIdDto): Promise<void> {
    await this.checkRoomById(new Types.ObjectId(roomId.id));
    await this.roomsModel.findByIdAndDelete(roomId.id);
  }

  //--------------------- Вспомогательные методы --------------------/
  // -----------------Поиск комнаты по id
  public async checkRoomById(id: Types.ObjectId): Promise<boolean> {
    const findRoom = await this.roomsModel.findById(new Types.ObjectId(id));
    if (!findRoom)
      throw new NotFoundException(new Types.ObjectId(id).toString());
    return !!findRoom;
  }

  //--------- Поиск дубликата комнаты
  private async searchDuplicateRoomNumber(dto: RoomDto): Promise<boolean> {
    const findReserve = await this.roomsModel.findOne({
      room_number: dto.room_number,
    });
    if (findReserve) throw new ConflictException();
    return !!findReserve;
  }
}
