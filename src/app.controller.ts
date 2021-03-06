import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { Logger } from 'winston';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  @Get()
  getHello(): string {
    this.logger.info('Logger Ok', { context: this.constructor.name });
    return this.appService.getHello();
  }
}
