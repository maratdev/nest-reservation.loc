import { TRoomType } from '../dto/room.dto';
import { Document } from 'mongoose';

export interface IRoom extends Document {
  room_number: number;
  room_type: TRoomType;
  description: string;
  sea_view: boolean;
}
