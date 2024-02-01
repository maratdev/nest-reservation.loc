import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReserveModel } from './models/reserve.model';
import { ReserveDto } from './dto/reserve.dto';
import { IRoom } from '../rooms/interface/room.interface';
import { GetReserveDto } from './dto/getReserve.dto';

@Injectable()
export class ReserveService {
  constructor(
    @InjectModel('RoomsModel') private readonly roomsModel: Model<IRoom>,
    @InjectModel('ReserveModel')
    private readonly reserveModel: Model<ReserveModel>,
  ) {}

  //--------- Создание брони
  async createReserve(reserve: ReserveDto): Promise<ReserveModel> {
    await this.searchReserveId(reserve);
    const createReserve = new this.reserveModel(reserve);
    return createReserve.save();
  }

  //--------- Обновление брони
  async updateReserve(
    objId: GetReserveDto,
    updateReserveDto: ReserveDto,
  ): Promise<ReserveModel> {
    await this.searchReserveId(updateReserveDto);
    await this.searchReserveById(objId);

    const existingReserve = await this.reserveModel.findByIdAndUpdate(
      objId.id,
      updateReserveDto,
      { new: true },
    );
    if (!existingReserve) {
      throw new NotFoundException();
    }
    return existingReserve;
  }

  async getReserve(dto: GetReserveDto) {
    const existingReserve = await this.reserveModel.findById(dto.id);

    if (!existingReserve) {
      throw new NotFoundException();
    }
    return existingReserve;
  }

  //--------------------- Вспомогательные методы --------------------/
  private async searchReserveId(dto: ReserveDto): Promise<boolean> {
    const findReserve = await this.reserveModel.findOne({
      room_id: dto.room_id,
      checkInDate: dto.checkInDate,
    });
    if (findReserve) throw new ConflictException();
    return !!findReserve;
  }

  private async searchReserveById(dto: GetReserveDto): Promise<boolean> {
    const findReserve = await this.reserveModel.findOne({
      _id: dto.id,
    });
    return !!findReserve;
  }
}
