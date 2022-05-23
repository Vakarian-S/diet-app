import { FoodType } from '../entities/food-type.model';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class DailyMenuDto {
  @IsNotEmpty()
  firstSnack: FoodType[];

  @IsNotEmpty()
  lunch: FoodType[];

  @IsNotEmpty()
  secondSnack: FoodType[];

  @IsNotEmpty()
  dinner: FoodType[];
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
