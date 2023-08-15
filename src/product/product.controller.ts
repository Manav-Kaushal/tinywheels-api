import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'nestjs-cloudinary';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { Product } from './schemas/product.schema';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.productService.findAll();
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
