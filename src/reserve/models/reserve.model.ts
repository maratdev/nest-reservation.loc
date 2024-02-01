import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RoomsModel } from '../../rooms/models/room.model';

@Schema({
  collection: 'reserve',
  versionKey: false,
  timestamps: true,
})
export class ReserveModel extends Document {
  @Prop({
    required: true,
    min: 1,
    max: 31,
  })
  checkInDate: number;

  @Prop({
    type: Types.ObjectId,
    ref: 'RoomsSchema',
    required: true,
  })
  room_id: RoomsModel;
}

export const ReserveSchema = SchemaFactory.createForClass(ReserveModel);
