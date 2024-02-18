import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReserveModel, ReserveSchema } from './models/reserve.model';
import { ReserveService } from './reserve.service';
import { ReserveController } from './reserve.controller';
import { RoomsModule } from '../rooms/room.module';

@Module({
  imports: [
    RoomsModule,
    MongooseModule.forFeature([
      {
        name: ReserveModel.name,
        schema: ReserveSchema,
      },
    ]),
  ],
  providers: [ReserveService],
  controllers: [ReserveController],
})
export class ReserveModule {}
