import { IsNotEmpty, IsNumber, IsString, Max } from 'class-validator';

export class ReserveDto {
  @IsString()
  @IsNotEmpty()
  readonly room_id: string;

  @IsNumber()
  @IsNotEmpty()
  @Max(31)
  readonly checkInDate: number;
}
