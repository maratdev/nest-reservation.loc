import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export enum RoomTypes {
  OneRoom = 1,
  TwoRooms,
  ThreeRooms,
  FourRooms,
}

export type TRoomType = (typeof RoomTypes)[keyof typeof RoomTypes];

export class RoomDto {
  @IsNumber()
  @IsNotEmpty()
  readonly room_number: number;

  @IsNumber()
  @IsNotEmpty()
  @IsEnum(RoomTypes)
  readonly room_type: TRoomType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  readonly description: string;

  @IsBoolean()
  readonly sea_view: boolean;

  @IsBoolean()
  @IsOptional()
  readonly is_delete?: boolean;
}
