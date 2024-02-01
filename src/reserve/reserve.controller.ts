import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { ReserveService } from './reserve.service';
import { ReserveDto } from './dto/reserve.dto';
import { GetReserveDto } from './dto/getReserve.dto';
import {
  RESERVE_CONFLICT,
  RESERVE_CREATED_SUCCESS,
  RESERVE_FOUND_SUCCESS,
  RESERVE_NOTFOUND,
  RESERVE_UPDATE_CONFLICT,
  RESERVE_UPDATE_SUCCESS,
  SERVER_ERROR,
} from '../config/constants/constant';

@Controller('reserve')
export class ReserveController {
  constructor(private readonly reserveService: ReserveService) {}

  //--------- Создание брони
  @Post('create')
  async create(@Res() response, @Body() dto: ReserveDto) {
    try {
      const newReserve = await this.reserveService.createReserve(dto);
      return response.status(HttpStatus.CREATED).json({
        message: RESERVE_CREATED_SUCCESS,
        newReserve,
      });
    } catch (err) {
      if (err.status === HttpStatus.CONFLICT) {
        throw new ConflictException(RESERVE_CONFLICT);
      }
      return response.status(HttpStatus.BAD_GATEWAY).json({
        statusCode: HttpStatus.BAD_GATEWAY,
        message: SERVER_ERROR,
      });
    }
  }

  //--------- Обновление брони
  @Put('/:id')
  async updateStudent(
    @Res() response,
    @Param() objId: GetReserveDto,
    @Body() updateReserveDto: ReserveDto,
  ) {
    try {
      const existingReserve = await this.reserveService.updateReserve(
        objId,
        updateReserveDto,
      );
      return response.status(HttpStatus.OK).json({
        message: RESERVE_UPDATE_SUCCESS,
        existingReserve,
      });
    } catch (err) {
      if (err.status === HttpStatus.NOT_FOUND) {
        throw new NotFoundException(`${RESERVE_NOTFOUND} ${objId.id}`);
      }

      if (err?.status === HttpStatus.CONFLICT) {
        throw new ConflictException(RESERVE_UPDATE_CONFLICT);
      }

      return response.status(err.status).json(err.response);
    }
  }

  //--------- Запрос брони по id
  @Get('/:id')
  async getReserve(@Res() response, @Param() objId: GetReserveDto) {
    try {
      const existingReserve = await this.reserveService.getReserve(objId);
      return response.status(HttpStatus.OK).json({
        message: RESERVE_FOUND_SUCCESS,
        existingReserve,
      });
    } catch (err) {
      if (err.status === HttpStatus.NOT_FOUND) {
        throw new NotFoundException(`${RESERVE_NOTFOUND} ${objId.id}`);
      }
      return response.status(err?.status).json({
        statusCode: HttpStatus.BAD_GATEWAY,
        message: SERVER_ERROR,
      });
    }
  }
}
