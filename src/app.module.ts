import { Module } from '@nestjs/common';
import { RoomsModule } from './rooms/room.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './config/mongodb/mongo.config';
import { ConfigModule } from '@nestjs/config';
import { ReserveModule } from './reserve/reserve.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    RoomsModule,
    ReserveModule,
  ],
})
export class AppModule {}
