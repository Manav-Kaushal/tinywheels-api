import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { Product } from './schemas/product.schema';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts(
    @Query() query: ExpressQuery,
  ): Promise<{ list: Product[]; total: number }> {
    return this.productService.findAll(query);
  }

  @Get(':slug')
  async getSingleProductBySlug(
    @Param('slug')
    slug: string,
  ): Promise<Product> {
    return this.productService.findBySlug(slug);
  }

  @Post('new')
  @UseInterceptors(FilesInterceptor('images'))
  async createBook(
    @Body()
    productData: CreateProductDto,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ): Promise<Product> {
    return this.productService.createProduct(productData, images);
  }
}
