import { IsMongoId, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { SafeMongoIdTransform } from '../../config/filter/mongo-exception.filter';

export class GetReserveDto {
  @IsMongoId()
  @IsString()
  @Transform((value) => SafeMongoIdTransform(value))
  id: string;
}
