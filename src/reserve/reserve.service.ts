import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReserveModel } from './models/reserve.model';
import { ReserveDto } from './dto/reserve.dto';
import { GetReserveDto } from './dto/getReserve.dto';
import { RoomService } from '../rooms/room.service';

@Injectable()
export class ReserveService {
  constructor(
    @InjectModel('ReserveModel')
    private readonly reserveModel: Model<ReserveModel>,
    private roomService: RoomService,
  ) {}

  //--------- Вывод всех броней
  async getAllReserve(): Promise<ReserveModel[]> {
    const reserveAllData = await this.reserveModel.find();
    if (!reserveAllData || reserveAllData.length == 0) {
      throw new NotFoundException();
    }
    return reserveAllData;
  }

  //--------- Создание брони
  async createReserve(reserve: ReserveDto): Promise<ReserveModel> {
    await this.ensureRoomExists(reserve.room_id);
    await this.searchReserveId(reserve);

    const createReserve = new this.reserveModel(reserve);
    return createReserve.save();
  }

  //--------- Обновление брони
  async updateReserve(
    objId: GetReserveDto,
    updateReserveDto: ReserveDto,
  ): Promise<ReserveModel> {
    await this.ensureRoomExists(updateReserveDto.room_id);
    await this.searchReserveById(objId);
    await this.searchReserveId(updateReserveDto);

    return this.reserveModel.findByIdAndUpdate(objId.id, updateReserveDto, {
      new: true,
    });
  }

  //--------- Вывод инфомации о брони
  async getReserve(dto: GetReserveDto): Promise<ReserveModel> {
    return this.reserveModel.findById(dto.id);
  }

  //--------- Удаление брони
  async deleteReserve(dto: GetReserveDto): Promise<void> {
    await this.searchReserveById(dto);
    await this.reserveModel.findByIdAndDelete(dto.id);
  }

  //--------------------- Вспомогательные методы --------------------/
  //--------- Поиск дубликата брони
  private async searchReserveId(dto: ReserveDto): Promise<boolean> {
    const findReserve = await this.reserveModel.findOne({
      room_id: dto.room_id,
      checkInDate: dto.checkInDate,
    });
    if (findReserve) throw new ConflictException();
    return !!findReserve;
  }

  //--------- Поиск брони по Id
  private async searchReserveById(dto: GetReserveDto): Promise<boolean> {
    const findReserveId = await this.reserveModel.findById(dto.id);
    if (!findReserveId) throw new NotFoundException();
    return !!findReserveId;
  }

  //--------- Поиск брони по Id
  private async ensureRoomExists(room_id: string) {
    const roomExists = await this.roomService.findRoomById(room_id);
    if (!roomExists) {
      throw new NotFoundException();
    }
  }
}
