import { Module } from '@nestjs/common';
import { FoodTypeController } from './controllers/food-type.controller';

@Module({
  controllers: [FoodTypeController]
})
export class FoodTypeModule {}
