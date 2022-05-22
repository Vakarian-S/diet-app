import { prop } from '@typegoose/typegoose';
import { FoodTypeEnum } from '../enums/food-type.enum';

export class FoodType {
  @prop({ required: true, unique: true })
  name: string;

  @prop({ required: true, enum: FoodTypeEnum })
  type: FoodTypeEnum;

  @prop({ required: true })
  portion: string;

  @prop({ index: true, type: Date, default: null })
  lastConsumed: Date;
}
