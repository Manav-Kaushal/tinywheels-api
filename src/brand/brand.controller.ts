import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { CloudinaryService } from 'nestjs-cloudinary';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './schemas/brand.schema';

@Controller('brands')
export class BrandController {
  constructor(
    private brandService: BrandService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  async getAllBrands(@Query() query: ExpressQuery): Promise<Brand[]> {
    return this.brandService.findAll(query);
  }

  @Post('new')
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('logo'))
  async createBrand(
    @Body()
    brand: CreateBrandDto,
    @Req()
    req,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Brand> {
    console.log({ file });

    const logo = await this.cloudinaryService.uploadFile(file, {
      filename_override: file.originalname,
      use_filename: true,
      folder: 'brands',
    });
    console.log({ logo });

    if (logo) {
      return this.brandService.create({ ...brand, logo: logo.url }, req.user);
    } else {
      throw new Error('File could not be uploaded!');
    }
  }

  @Get(':id')
  async getBrand(
    @Param('id')
    id: string,
  ): Promise<Brand> {
    return this.brandService.findById(id);
  }

  @Put(':id')
  async updateBrand(
    @Param('id')
    id: string,
    @Body()
    brand: UpdateBrandDto,
  ): Promise<Brand> {
    return this.brandService.updateById(id, brand);
  }

  @Delete(':id')
  async deleteBrand(
    @Param('id')
    id: string,
  ): Promise<Brand> {
    return this.brandService.deleteById(id);
  }
}
