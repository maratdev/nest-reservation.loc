import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomsSchema } from './models/room.model';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';

@Module({
  controllers: [RoomController],
  imports: [
    MongooseModule.forFeature([
      {
        name: 'RoomsModel',
        schema: RoomsSchema,
      },
    ]),
  ],
  providers: [RoomService],
})
export class RoomsModule {}
