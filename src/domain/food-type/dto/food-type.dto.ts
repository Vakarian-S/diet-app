import { IsEnum, IsNotEmpty } from 'class-validator';
import { FoodTypeEnum } from '../enums/food-type.enum';

export class FoodTypeDto {
  @IsNotEmpty()
  name: string

  @IsEnum(FoodTypeEnum)
  type: string;

  @IsNotEmpty()
  portion: string
}
