import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReserveSchema } from './models/reserve.model';
import { ReserveService } from './reserve.service';
import { ReserveController } from './reserve.controller';
import { RoomService } from '../rooms/room.service';
import { RoomsSchema } from '../rooms/models/room.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'ReserveModel',
        schema: ReserveSchema,
      },
      {
        name: 'RoomsModel',
        schema: RoomsSchema,
      },
    ]),
  ],
  providers: [ReserveService, RoomService],
  controllers: [ReserveController],
})
export class ReserveModule {}
