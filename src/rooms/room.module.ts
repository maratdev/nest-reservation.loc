import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomsModel, RoomsSchema } from './models/room.model';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RoomsModel.name,
        schema: RoomsSchema,
      },
    ]),
  ],
  providers: [RoomService],
  exports: [RoomService],
  controllers: [RoomController],
})
export class RoomsModule {}
