import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomsModule } from './rooms/rooms.module';
import { TimetableModule } from './timetable/timetable.module';

@Module({
  imports: [RoomsModule, TimetableModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
