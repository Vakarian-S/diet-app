import { Controller, Get, Inject } from '@nestjs/common';
import { Logger } from 'winston';

@Controller('food-type')
export class FoodTypeController {
  constructor(
    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  @Get()
  get(): string {
    this.logger.info('Logger Ok', { context: this.constructor.name });
    return 'food-type works!'
  }
}
