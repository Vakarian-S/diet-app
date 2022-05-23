import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FoodType } from '../entities/food-type.model';
import { Model } from 'mongoose';
import { Logger } from 'winston';
import { FoodTypeDto } from '../dto/food-type.dto';

const onlyValuesProjection = {
  _id: 0,
  __v: 0,
};

interface sortOptions {
  [key: string]: 'asc' | 'desc';
}

@Injectable()
export class FoodTypeRepository {
  constructor(
    @InjectModel(FoodType.name) private foodTypeModel: Model<FoodType>,
    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  async create(dto: FoodTypeDto): Promise<FoodType> {
    const context = { context: this.constructor.name, dto };
    try {
      return await this.foodTypeModel.create(dto);
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

  find(filter?: any, sort?: sortOptions): Promise<FoodType[]> {
    return this.foodTypeModel
      .find(filter, onlyValuesProjection, { sort })
      .exec();
  }

  findOne(filter?: any, sort?: sortOptions): Promise<FoodType> {
    return this.foodTypeModel
      .findOne(filter, onlyValuesProjection, { sort })
      .exec();
  }

  async updateMany(filter?: any): Promise<any> {
    const today = new Date();

    // Mongoose "UpdateMany()" does not work with the $in filter, so we use find and save instead
    const items = await this.foodTypeModel.find(filter).exec()
    items.forEach(item => {
      item.lastConsumed = today;
      item.save();
    })
    return;
  }
}
