import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export enum RoomTypes {
  OneRoom = 'Одна комната',
  TwoRooms = 'Две комнаты',
  ThreeRooms = 'Три комнаты',
  FourRooms = 'Четыре комнаты',
}

export type TRoomType = (typeof RoomTypes)[keyof typeof RoomTypes];

export class RoomDto {
  @IsNumber()
  @IsNotEmpty()
  readonly room_number: number;

  @IsString()
  @IsNotEmpty()
  readonly room_type: TRoomType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  readonly description: string;

  @IsBoolean()
  readonly sea_view: boolean;
}
