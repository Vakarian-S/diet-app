import { Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { FoodTypeDto } from '../dto/food-type.dto';
import { FoodType } from '../entities/food-type.model';
import { SnackTypeEnum } from '../enums/snack-type.enum';
import { FoodTypeEnum } from '../enums/food-type.enum';
import { DailyMenuOptionsDto, DailyMenuDto } from '../dto/daily-menu.dto';
import { FoodTypeRepository } from '../repository/food-type.repository';

@Injectable()
export class FoodTypeService {
  constructor(
    private readonly foodTypeRepository: FoodTypeRepository,
    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  async create(dailyMenuDto: FoodTypeDto) {
    const context = { context: this.constructor.name, dailyMenuDto };
    this.logger.info('Attempting to create food-type', context);

    return await this.foodTypeRepository.create({ ...dailyMenuDto });
  }

  async confirmDailyMenu(dailyMenuDto: DailyMenuDto) {
    const context = { context: this.constructor.name, dailyMenuDto };
    this.logger.info('Attempting to confirm daily-menu', context);

    const consumedFoods = new Set();
    for (const meal of Object.keys(dailyMenuDto)) {
      for (const food of dailyMenuDto[meal]) {
        if (food) {
          consumedFoods.add(food.name);
        }
      }
    }

    this.logger.info('consumed foods detected', {
      ...context,
      consumedFoods: Array.from(consumedFoods),
    });
    return this.foodTypeRepository.updateMany({
      name: Array.from(consumedFoods),
    });
  }

  getAll() {
    return this.foodTypeRepository.find();
  }

  async generateDailyMenu(options: DailyMenuOptionsDto): Promise<DailyMenuDto> {
    const context = { context: this.constructor.name, options };
    this.logger.info('Generating daily menu', context);
    const { sameLunchDinner = false, doubleSaladPortion = false } = options;
    const firstSnack = await this.generateSnack(SnackTypeEnum.FRUIT_BASED);
    const lunch = await this.generateLunchDinner(doubleSaladPortion);
    const secondSnack = await this.generateSnack(SnackTypeEnum.YOGHURT_BASED);
    const dinner = sameLunchDinner ? lunch : await this.generateLunchDinner();

    return {
      firstSnack,
      lunch,
      secondSnack,
      dinner,
    };
  }

  async generateLunchDinner(doubleSaladPortion = false): Promise<FoodType[]> {
    const context = { context: this.constructor.name };
    this.logger.info('Generating Lunch/Dinner', context);
    const meat = await this.getRandomFood(FoodTypeEnum.MEAT, true);
    const sideDish = await this.getRandomFood(FoodTypeEnum.SIDE_DISH);
    const firstSalad = await this.getRandomFood(FoodTypeEnum.SALAD);
    const secondSalad = doubleSaladPortion ? firstSalad : await this.getRandomFood(FoodTypeEnum.SALAD);
    const freeSalad = await this.getRandomFood(FoodTypeEnum.FREE_SALAD);
    const fruits = await this.getRandomFood(FoodTypeEnum.FRUIT);
    return [meat, sideDish, firstSalad, secondSalad, freeSalad, fruits];
  }

  async generateSnack(type: SnackTypeEnum): Promise<FoodType[]> {
    const context = { context: this.constructor.name, type };
    this.logger.info('Generating Snack', context);

    if (type === SnackTypeEnum.FRUIT_BASED) {
      return [await this.getRandomFood(FoodTypeEnum.FRUIT)];
    }

    if (type === SnackTypeEnum.YOGHURT_BASED) {
      const dryFruit = await this.getRandomFood(FoodTypeEnum.DRY_FRUIT);
      const yoghurt = await this.getRandomFood(FoodTypeEnum.YOGHURT);
      return [dryFruit, yoghurt];
    }
  }

  async getRandomFood(type, weighted = false) {
    const foodList = await this.foodTypeRepository.find(
      { type },
      { lastConsumed: 'desc' },
    );

    if (!foodList || foodList.length <= 0) {
      return null;
    }

    if (weighted) {
      return this.weightedRandomBySortedList(foodList, 'lastConsumed');
    } else {
      const randomNumber = Math.floor(foodList.length * Math.random());
      return foodList[randomNumber];
    }
  }

  /**
   * Return a weighted random food based on the given sorted list and sorted attribute
   * @param sortedList List of same-type foods to choose from, already sorted ascending
   * @param sortedAttribute The attribute from which the list was sorted
   */
  weightedRandomBySortedList(
    sortedList: FoodType[],
    sortedAttribute: string,
  ): FoodType {
    if (!sortedList || sortedList.length <= 0) {
      return null;
    }
    const cumulativeWeights = [];
    let currentWeight = 1;
    let currentCumulativeWeight = 0;
    let previousDate;

    for (const food of sortedList) {
      if (previousDate && food[sortedAttribute] < previousDate) {
        currentWeight += 1;
      }
      previousDate = food[sortedAttribute];
      currentCumulativeWeight += currentWeight;
      cumulativeWeights.push(currentCumulativeWeight);
    }
    const maxCumulativeWeight = cumulativeWeights[cumulativeWeights.length - 1];
    const randomNumber = Math.floor((maxCumulativeWeight + 1) * Math.random());

    for (let itemIndex = 0; itemIndex < sortedList.length; itemIndex += 1) {
      if (cumulativeWeights[itemIndex] >= randomNumber) {
        return sortedList[itemIndex];
      }
    }
  }
}
