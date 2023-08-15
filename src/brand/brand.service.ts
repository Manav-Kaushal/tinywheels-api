import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Query } from 'express-serve-static-core';
import * as mongoose from 'mongoose';
import { CloudinaryService } from 'nestjs-cloudinary';
import { User } from '../auth/schemas/user.schema';
import { extractPublicIdFromUrl } from '../utils/helpers';
import { Brand } from './schemas/brand.schema';

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Brand.name)
    private brandModel: mongoose.Model<Brand>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAll(query: Query): Promise<{ list: Brand[]; total: number }> {
    const resPerPage = 20;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const keyword = query.keyword
      ? {
          name: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};
    const brands = await this.brandModel
      .find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);
    const total = await this.brandModel.countDocuments();
    return { list: brands, total };
  }

  async create(
    brand: Brand,
    file: Express.Multer.File,
    user: User,
  ): Promise<Brand> {
    const logo = await this.cloudinaryService.uploadFile(file, {
      filename_override: file.originalname,
      use_filename: true,
      folder: 'brands',
    });

    Object.assign(brand, {
      user: user._id,
      logo: logo.url,
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

  async updateById(
    id: string,
    brand: Brand,
    file: Express.Multer.File,
  ): Promise<Brand> {
    const brandAlreadyExists = await this.brandModel.findById(id);
    if (!brandAlreadyExists) {
      throw new NotFoundException('Brand not found!');
    }

    try {
      if (file) {
        const logoPublicId = extractPublicIdFromUrl(
          brandAlreadyExists.logo,
          'brands',
        );

        const deletionResponse =
          await this.cloudinaryService.cloudinaryInstance.uploader.destroy(
            logoPublicId,
          );

        if (deletionResponse.result !== 'ok') {
          throw new Error('Failed to delete old logo from Cloudinary');
        }

        const logo = await this.cloudinaryService.uploadFile(file, {
          filename_override: file.originalname,
          use_filename: true,
          folder: 'brands',
        });

        brand.logo = logo.secure_url;
      }

      return await this.brandModel.findByIdAndUpdate(id, brand, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      console.error('Error updating brand:', error);
      throw new InternalServerErrorException('Failed to update brand');
    }
  }

  async deleteById(id: string): Promise<void> {
    const brandToDelete = await this.brandModel.findById(id);
    if (!brandToDelete) {
      throw new NotFoundException('Brand not found!');
    }

    try {
      const logoPublicId = extractPublicIdFromUrl(brandToDelete.logo, 'brands');

      const deletionResponse =
        await this.cloudinaryService.cloudinaryInstance.uploader.destroy(
          logoPublicId,
          {
            resource_type: 'image',
          },
        );

      if (deletionResponse.result === 'ok') {
        await this.brandModel.findByIdAndDelete(id);
      } else {
        throw new Error(deletionResponse.result);
      }
    } catch (error) {
      console.error('Error deleting logo from Cloudinary:', error);
    }
  }
}
