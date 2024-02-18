import { Module } from '@nestjs/common';
import { RoomsModule } from './rooms/room.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './config/mongodb/mongo.config';
import { ReserveModule } from './reserve/reserve.module';
import { ConfigAppModule } from './config/core/config-app.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    ConfigAppModule,
    RoomsModule,
    ReserveModule,
  ],
})
export class AppModule {}
