import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Car } from './schemas/product.schema';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Car.name) private readonly carModel: Model<Car>) {}

  async findAll(): Promise<Car[]> {
    const cars = await this.carModel.find(
      {},
      '_id title description brand category price currency dimensions',
    );
    return cars;
  }

  // async findById(carId: string): Promise<Car> {
  //   return this.carModel.findById(carId);
  // }

  async create(carData: Partial<Car>): Promise<Car> {
    // Object.assign(carData, { user: user._id });
    const res = await this.carModel.create(carData);
    return res;
  }

  // async update(carId: string, carData: Partial<Car>): Promise<Car> {
  //   return this.carModel
  //     .findByIdAndUpdate(carId, carData, { new: true })
  //     .exec();
  // }

  // async delete(carId: string): Promise<Car> {
  //   return this.carModel.findByIdAndDelete(carId).exec();
  // }
}
