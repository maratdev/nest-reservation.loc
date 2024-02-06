import { TRoomType } from '../dto/room.dto';

export interface IRoom {
  room_number: number;
  room_type: TRoomType;
  description: string;
  sea_view: boolean;
}
