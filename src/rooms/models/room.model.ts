import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'rooms',
  versionKey: false,
  timestamps: true,
})
export class RoomsModel {
  @Prop({
    required: true,
    unique: true,
  })
  room_number: number;

  @Prop({
    required: true,
  })
  room_type: string;

  @Prop()
  description: string;

  @Prop({
    required: true,
    default: false,
  })
  sea_view: boolean;
}

export const RoomsSchema = SchemaFactory.createForClass(RoomsModel);
