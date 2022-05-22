import { Module } from '@nestjs/common';
import { FoodTypeController } from './controllers/food-type.controller';
import { FoodType } from './entities/food-type.model';
import { FoodTypeService } from './providers/food-type.service';
import { MongooseModule } from '@nestjs/mongoose';
import { buildSchema } from '@typegoose/typegoose';

@Module({
  imports: [MongooseModule.forFeature([{name: FoodType.name, schema: buildSchema(FoodType)}])],
  controllers: [FoodTypeController],
  providers: [FoodTypeService],
})
export class FoodTypeModule {}
