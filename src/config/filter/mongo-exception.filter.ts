import { Types } from 'mongoose';
import { BadRequestException } from '@nestjs/common';
import { ID_VALIDATION_FAIL } from '../constants/constant';

export const SafeMongoIdTransform = ({ value }) => {
  try {
    if (
      Types.ObjectId.isValid(value) &&
      new Types.ObjectId(value).toString() === value
    ) {
      return value;
    }
  } catch (error) {
    throw new BadRequestException(ID_VALIDATION_FAIL);
  }
};
