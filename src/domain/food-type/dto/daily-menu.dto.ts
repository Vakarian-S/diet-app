import { FoodType } from '../entities/food-type.model';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class DailyMenuDto {
  @IsNotEmpty()
  breakfast: FoodType[];

  @IsNotEmpty()
  firstSnack: FoodType[];

  @IsNotEmpty()
  lunch: FoodType[];

  @IsNotEmpty()
  supper: FoodType[];

  @IsNotEmpty()
  dinner: FoodType[];

  @IsNotEmpty()
  secondSnack: FoodType[];
}

export class DailyMenuOptionsDto {
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  sameLunchDinner: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  doubleSaladPortion: boolean;
}
