import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { Model } from 'mongoose';
import { CloudinaryService } from 'nestjs-cloudinary';
import { slugifyProductName } from '../utils/helpers';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './schemas/product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAll(query?: ExpressQuery): Promise<Product[]> {
    try {
      let projection: any;

      if (query?.fields === 'all') {
        projection = {};
      } else {
        projection = {
          _id: 1,
          title: 1,
          thumbnail: 1,
          images: 1,
          brand: 1,
          category: 1,
          price: 1,
          currency: 1,
          dimensions: 1,
        };
      }

      if (query?.admin) {
        projection.stockQuantity = 1;
        projection.isFeatured = 1;
      }

      const products = await this.productModel
        .find({}, projection)
        .populate('brand', '_id name logo');

      if (!products || products.length === 0) {
        throw new NotFoundException('No products found.');
      }

      return products;
    } catch (error) {
      return [];
      // throw new Error(`Error while fetching products: ${error.message}`);
    }
  }

  // async findById(productId: string): Promise<Product> {
  //   return this.productModel.findById(productId);
  // }

  async createProduct(
    productData: CreateProductDto,
    images: Express.Multer.File[],
  ): Promise<Product> {
    const slug = slugifyProductName(productData.title);

    const productExists = await this.productModel.exists({ slug });

    if (productExists) {
      throw new ConflictException('Product with the same slug already exists.');
    }

    try {
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const result = await this.cloudinaryService.uploadFile(image, {
            filename_override: image.originalname,
            use_filename: true,
            folder: `products/${slug}`,
          });
          return result.secure_url;
        }),
      );

      const createdProduct = await this.productModel.create({
        ...productData,
        thumbnail: imageUrls[0],
        images: imageUrls,
        slug,
      });

      return createdProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      throw new InternalServerErrorException('Error creating product.');
    }
  }

  // async update(productId: string, productData: Partial<Product>): Promise<Product> {
  //   return this.productModel
  //     .findByIdAndUpdate(productId, productData, { new: true })
  //     .exec();
  // }

  // async delete(productId: string): Promise<Product> {
  //   return this.productModel.findByIdAndDelete(productId).exec();
  // }
}
