import { IsMongoId, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { SafeMongoIdTransform } from '../../config/filter/mongo-exception.filter';
import { Types } from 'mongoose';

export class GetIdReserveDto {
  @IsMongoId()
  @IsString()
  @Transform((value) => SafeMongoIdTransform(value))
  id: Types.ObjectId;
}
