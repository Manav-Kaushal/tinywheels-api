import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { Model } from 'mongoose';
import { CloudinaryService } from 'nestjs-cloudinary';
import { NotFoundError } from 'rxjs';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './schemas/product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private async uploadProductImage(
    slug: string,
    image: Express.Multer.File,
    folderName: string,
  ): Promise<any> {
    try {
      return await this.cloudinaryService.uploadFile(image, {
        filename_override: image.originalname,
        use_filename: true,
        folder: `${folderName}/${slug}`,
      });
    } catch (error) {
      console.error('Error uploading product image:', error);
      throw new InternalServerErrorException('Error uploading product image');
    }
  }

  async findAll(
    query?: ExpressQuery,
  ): Promise<{ list: Product[]; total: number }> {
    try {
      let projection: any;

      if (query?.fields === 'all') {
        projection = {};
      } else {
        projection = {
          _id: 1,
          title: 1,
          thumbnail: 1,
          brand: 1,
          category: 1,
          price: 1,
          currency: 1,
          dimensions: 1,
          slug: 1,
        };
      }

      if (query?.admin) {
        projection.stockQuantity = 1;
        projection.isFeatured = 1;
      }

      const products = await this.productModel
        .find({}, projection)
        .populate('brand', '_id name logo');

      const total = await this.productModel.countDocuments();
      return { list: products, total };
    } catch (error) {
      throw new Error(`Error while fetching products: ${error.message}`);
    }
  }

  async findBySlug(productSlug: string): Promise<Product | null> {
    try {
      const product = await this.productModel.findOne({ slug: productSlug });

      if (!product) {
        throw new NotFoundError(`Product with slug ${productSlug} not found`);
      }
      return product;
    } catch (error) {
      throw new InternalServerErrorException(`${error.message}`);
    }
  }

  async createProduct(
    productData: CreateProductDto,
    images: Express.Multer.File[],
  ): Promise<Product> {
    try {
      const { slug } = productData;
      const productExists = await this.productModel.findOne({
        slug,
      });

      if (productExists) {
        throw new ConflictException(
          'Product with the same slug already exists.',
        );
      }

      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const result = await this.uploadProductImage(slug, image, 'products');
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
      console.error('Error creating product:', error?.message);
      throw new InternalServerErrorException(
        error?.message || `Error creating product`,
      );
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
