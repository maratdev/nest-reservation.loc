import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ReserveService } from './reserve.service';
import { ReserveDto } from './dto/reserve.dto';
import { GetIdReserveDto } from './dto/reserve-id.dto';
import { RESERVE } from './constants';
import { ROOM } from '../rooms/constants';
import { STATUS } from '../config/constants/default';

@UsePipes(new ValidationPipe())
@Controller('reserve')
export class ReserveController {
  @Inject()
  private readonly reserveService: ReserveService;

  //--------- Вывод всех броней
  @Get('all')
  async getAllReserve(@Res() response) {
    try {
      const allReserve = await this.reserveService.getAllReserve();
      response.status(HttpStatus.OK).json(allReserve);
    } catch (err) {
      if (err instanceof HttpException) {
        if (err.getStatus() === HttpStatus.NOT_FOUND) {
          throw new NotFoundException(RESERVE.NOTFOUND);
        }
        return response.status(err.getStatus()).json({
          statusCode: HttpStatus.BAD_GATEWAY,
          message: STATUS.SERVER_ERROR,
        });
      }
    }
  }

  //--------- Создание брони
  @Post('create')
  async createReserve(@Res() response, @Body() dto: ReserveDto) {
    try {
      const newReserve = await this.reserveService.createReserve(dto);
      return response.status(HttpStatus.CREATED).json({
        message: RESERVE.CREATED_SUCCESS,
        newReserve,
      });
    } catch (err) {
      if (err instanceof HttpException) {
        if (err.getStatus() === HttpStatus.CONFLICT) {
          throw new ConflictException(RESERVE.CONFLICT);
        }
        if (err.getStatus() === HttpStatus.NOT_FOUND) {
          throw new NotFoundException(`${ROOM.NOTFOUND} ${dto.room_id}`);
        }
      }
      return response.status(HttpStatus.BAD_GATEWAY).json({
        statusCode: HttpStatus.BAD_GATEWAY,
        message: STATUS.SERVER_ERROR,
      });
    }
  }

  //--------- Обновление брони
  @Patch('/:id')
  async updateReserve(
    @Res() response,
    @Param() objId: GetIdReserveDto,
    @Body() updateReserveDto: ReserveDto,
  ) {
    try {
      const existingReserve = await this.reserveService.updateReserve(
        objId,
        updateReserveDto,
      );
      return response.status(HttpStatus.OK).json({
        message: RESERVE.UPDATE_SUCCESS,
        existingReserve,
      });
    } catch (err) {
      if (err instanceof HttpException) {
        if (err.getStatus() === HttpStatus.NOT_FOUND) {
          throw new NotFoundException(`${RESERVE.NOTFOUND} ${err.message}`);
        }

        if (err.getStatus() === HttpStatus.CONFLICT) {
          console.log(err.getResponse());
          throw new ConflictException(
            `${RESERVE.UPDATE_CONFLICT} ${String(err.getResponse())}`,
          );
        }

        return response.status(err.getStatus()).json({
          statusCode: HttpStatus.BAD_GATEWAY,
          message: STATUS.SERVER_ERROR,
        });
      }
    }
  }

  //--------- Запрос брони по id
  @Get('/:id')
  async getReserve(@Res() response, @Param() objId: GetIdReserveDto) {
    try {
      const existingReserve = await this.reserveService.getReserve(objId);
      return response.status(HttpStatus.OK).json(existingReserve);
    } catch (err) {
      if (err instanceof HttpException) {
        if (err.getStatus() === HttpStatus.NOT_FOUND) {
          throw new NotFoundException(`${RESERVE.NOTFOUND} ${objId.id}`);
        }
        return response.status(err.getStatus()).json({
          statusCode: HttpStatus.BAD_GATEWAY,
          message: STATUS.SERVER_ERROR,
        });
      }
    }
  }

  //--------- Удаление брони по id
  @Delete('/:id')
  async deleteReserve(@Res() response, @Param() objId: GetIdReserveDto) {
    try {
      await this.reserveService.deleteReserve(objId);
      return response.status(HttpStatus.OK).json({
        message: `${RESERVE.DELETED} ${objId.id}`,
      });
    } catch (err) {
      if (err instanceof HttpException) {
        if (err.getStatus() === HttpStatus.NOT_FOUND) {
          throw new NotFoundException(`${RESERVE.NOTFOUND} ${objId.id}`);
        }
        return response.status(err.getStatus()).json({
          statusCode: HttpStatus.BAD_GATEWAY,
          message: STATUS.SERVER_ERROR,
        });
      }
    }
  }
}
