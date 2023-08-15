import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
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

  async findAll(): Promise<Product[]> {
    const products = await this.productModel.find(
      {},
      '_id title description brand category price currency dimensions',
    );
    return products;
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
