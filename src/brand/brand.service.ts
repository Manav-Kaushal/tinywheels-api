import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Query } from 'express-serve-static-core';
import * as mongoose from 'mongoose';
import { slugifyProductName } from 'src/utils/helpers';
import { User } from '../auth/schemas/user.schema';
import { Brand } from './schemas/brand.schema';

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Brand.name)
    private brandModel: mongoose.Model<Brand>,
  ) {}

  async findAll(query: Query): Promise<Brand[]> {
    const resPerPage = 20;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const keyword = query.keyword
      ? {
          title: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};
    const brands = await this.brandModel
      .find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);
    return brands;
  }

  async create(brand: Brand, user: User): Promise<Brand> {
    Object.assign(brand, {
      user: user._id,
      slug: slugifyProductName(brand.name),
    });

    const res = await this.brandModel.create(brand);
    return res;
  }

  async findById(id: string): Promise<Brand> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('PLease enter correct id.');
    }

    const brand = await this.brandModel.findById(id);
    if (!brand) {
      throw new NotFoundException('Brand not found!');
    }
    return brand;
  }

  async updateById(id: string, brand: Brand): Promise<Brand> {
    return await this.brandModel.findByIdAndUpdate(id, brand, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id: string): Promise<Brand> {
    return await this.brandModel.findByIdAndDelete(id);
  }
}
