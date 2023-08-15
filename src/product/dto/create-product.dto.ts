import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { ModelScales, ProductCategory } from '../schemas/product.schema';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(ProductCategory)
  category: ProductCategory;

  @IsNotEmpty()
  @IsString()
  brand: string;

  @IsNotEmpty()
  @IsString()
  modelNumber: string;

  @IsNotEmpty()
  @IsEnum(ModelScales)
  scale: ModelScales;

  @IsNotEmpty()
  @IsString()
  material: string;

  @IsNotEmpty()
  @IsString()
  color: string;

  @IsArray()
  additionalColors: string[];

  @IsBoolean()
  @Type(() => Boolean)
  isFeatured: boolean;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsNotEmpty()
  @IsString()
  currency: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  stockQuantity: number;

  images: Express.Multer.File[];

  @IsNotEmpty()
  dimensions: { length: string; width: string; height: string };

  @IsNotEmpty()
  weight: { value: number; unit: string };

  @IsArray()
  tags: string[];
}
