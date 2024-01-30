export enum RoomTypes {
  OneRoom = 'Одна комната',
  TwoRooms = 'Две комнаты',
  ThreeRooms = 'Три комнаты',
  FourRooms = 'Четыре комнаты',
}

export type TRoomType = (typeof RoomTypes)[keyof typeof RoomTypes];

export class RoomDto {
  room_number: number;
  room_type: TRoomType;
  description: string;
  sea_view: boolean;
}
