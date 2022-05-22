import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { FoodTypeDto } from '../dto/food-type.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FoodType } from '../entities/food-type.model';
import { Model } from 'mongoose';


@Injectable()
export class FoodTypeService {
  constructor(
    @InjectModel(FoodType.name) private foodTypeModel: Model<FoodType>,
    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  async create(dto: FoodTypeDto) {
    const context = { context: this.constructor.name, dto };
    this.logger.info('Attempting to create food-type', context);
    try {
      return await this.foodTypeModel.create({ ...dto });
    } catch (error) {
      if (error.code === 11000) {
        this.logger.error('food-type already exists', context);
        const { keyPattern } = error as any;

        let message: string[];
        if (keyPattern != null) {
          message = Object.keys(keyPattern).map(
            (key) => `${key} is duplicated`,
          );
        } else {
          message = ['object is duplicated'];
        }
        throw new BadRequestException(message);
      }
      throw error;
    }
  }

  getAll() {
    return this.foodTypeModel.find();
  }
}
