import {
  Body,
  Controller,
  Get,
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
  async getAllProducts(@Query() query: ExpressQuery): Promise<Product[]> {
    return this.productService.findAll(query);
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
