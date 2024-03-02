import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ReserveModel } from './models/reserve.model';
import { ReserveDto } from './dto/reserve.dto';
import { GetIdReserveDto } from './dto/reserve-id.dto';
import { RoomService } from '../rooms/room.service';

@Injectable()
export class ReserveService {
  constructor(
    @InjectModel(ReserveModel.name)
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
    await this.roomService.checkRoomById(new Types.ObjectId(reserve.room_id));
    await this.checkDuplicateReserve(reserve);

    const createReserve = new this.reserveModel(reserve);
    return createReserve.save();
  }

  //--------- Обновление брони
  async updateReserve(
    idDto: GetIdReserveDto,
    updateReserveDto: ReserveDto,
  ): Promise<ReserveModel> {
    await this.checkReserveById(idDto);
    await this.roomService.checkRoomById(
      new Types.ObjectId(updateReserveDto.room_id),
    );
    await this.checkDuplicateReserve(updateReserveDto);

    return this.reserveModel.findByIdAndUpdate(idDto.id, updateReserveDto, {
      new: true,
    });
  }

  //--------- Вывод информации о брони
  async getReserve(dto: GetIdReserveDto): Promise<ReserveModel> {
    await this.checkReserveById(dto);
    return this.reserveModel.findById(dto.id);
  }

  //--------- Удаление брони
  async deleteReserve(dto: GetIdReserveDto): Promise<void> {
    await this.checkReserveById(dto);
    await this.reserveModel.findByIdAndDelete(dto.id);
  }

  //--------------------- Вспомогательные методы --------------------/
  //--------- Поиск дубликата брони
  private async checkDuplicateReserve(dto: ReserveDto): Promise<boolean> {
    const findReserve = await this.reserveModel.findOne({
      room_id: dto.room_id,
      checkInDate: dto.checkInDate,
    });
    if (findReserve) throw new ConflictException(dto.checkInDate);
    return !!findReserve;
  }

  //--------- Поиск брони по Id
  private async checkReserveById(dto: GetIdReserveDto): Promise<boolean> {
    const findReserveId = await this.reserveModel.findById(dto.id);
    if (!findReserveId) throw new NotFoundException(dto.id);
    return !!findReserveId;
  }
}
