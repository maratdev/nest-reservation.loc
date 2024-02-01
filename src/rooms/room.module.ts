import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomsSchema } from './models/room.model';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { ReserveSchema } from '../reserve/models/reserve.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'RoomsModel',
        schema: RoomsSchema,
      },
      {
        name: 'ReserveModel',
        schema: ReserveSchema,
      },
    ]),
  ],
  providers: [RoomService],
  controllers: [RoomController],
})
export class RoomsModule {}
