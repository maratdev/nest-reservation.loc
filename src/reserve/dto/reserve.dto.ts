import { IsMongoId, IsNotEmpty, IsNumber, Max } from 'class-validator';
import { Types } from 'mongoose';

export class ReserveDto {
  @IsMongoId()
  @IsNotEmpty()
  readonly room_id: Types.ObjectId;

  @IsNumber()
  @IsNotEmpty()
  @Max(31)
  readonly checkInDate: number;
}
