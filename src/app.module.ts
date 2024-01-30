import { Module } from '@nestjs/common';
import { RoomsModule } from './rooms/room.module';
import { TimetableModule } from './timetable/timetable.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './config/mongodb/mongo.config';
import { ConfigModule } from '@nestjs/config';

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
    TimetableModule,
  ],
})
export class AppModule {}
