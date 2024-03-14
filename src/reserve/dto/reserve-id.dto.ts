import { IsMongoId, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { SafeMongoIdTransform } from '../../config/filter/mongo-exception.filter';
import { Types } from 'mongoose';
import { ReserveDto } from './reserve.dto';

export class GetIdReserveDto extends ReserveDto {
  @IsMongoId()
  @IsString()
  @Transform((value) => SafeMongoIdTransform(value))
  id: Types.ObjectId;
}
