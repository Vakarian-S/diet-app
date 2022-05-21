import { Module } from '@nestjs/common';
import { utilities, WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as winston from 'winston';
import { FoodTypeModule } from './domain/food-type/food-type.module';

@Module({
  imports: [
    FoodTypeModule,
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            utilities.format.nestLike('RequestService'),
          ),
        }),
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
