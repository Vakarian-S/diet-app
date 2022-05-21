import { prop } from '@typegoose/typegoose';

export class FoodTypeModel {
  @prop({ required: true })
  type: string;

  @prop({ required: true })
  portion: string;

  @prop({ index: true, type: Date })
  lastConsumed: Date;
}
