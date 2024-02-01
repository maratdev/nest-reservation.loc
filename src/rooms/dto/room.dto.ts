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
  @IsString()
  readonly id: string;
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

  @IsBoolean()
  readonly is_reserve: boolean;
}

export class PatchRoomDto extends RoomDto {
  readonly id: string;
}
