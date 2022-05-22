import { Body, Controller, Get, Inject, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { Logger } from 'winston';
import { FoodTypeService } from '../providers/food-type.service';
import { FoodTypeDto } from '../dto/food-type.dto';


@Controller('food-type')
export class FoodTypeController {
  constructor(
    private readonly foodTypeService: FoodTypeService,
    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  @Get()
  getAll() {
    this.logger.info('Logger Ok', { context: this.constructor.name });
    return this.foodTypeService.getAll();
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() dto: FoodTypeDto,) {
    this.logger.info('Logger Ok', { context: this.constructor.name });
    return this.foodTypeService.create(dto);
  }

}
