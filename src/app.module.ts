import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TimetableModule } from './timetable/timetable.module';
import { RoomsModule } from './rooms/rooms.module';

@Module({
  imports: [TimetableModule, RoomsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
