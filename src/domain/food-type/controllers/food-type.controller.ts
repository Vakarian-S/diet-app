import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Logger } from 'winston';
import { FoodTypeService } from '../providers/food-type.service';
import { FoodTypeDto } from '../dto/food-type.dto';
import { DailyMenuOptionsDto, DailyMenuDto } from '../dto/daily-menu.dto';

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

  @Get('daily-menu')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  getDailyMenu(
    @Query() dailyMenuDto: DailyMenuOptionsDto,
  ): Promise<DailyMenuDto> {
    this.logger.info('Logger Ok', { context: this.constructor.name });
    return this.foodTypeService.generateDailyMenu(dailyMenuDto);
  }

  @Post('daily-menu')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  confirmDailyMenu(@Body() dailyMenuDto: DailyMenuDto) {
    return this.foodTypeService.confirmDailyMenu(dailyMenuDto);
  }
  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() dto: FoodTypeDto) {
    return this.foodTypeService.create(dto);
  }
}
