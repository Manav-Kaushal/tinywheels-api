import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ModelScales, ProductCategory } from '../schemas/product.schema';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  body: string;

  @IsNotEmpty()
  @IsEnum(ProductCategory)
  category: ProductCategory;

  @IsNotEmpty()
  @IsString()
  brand: string;

  @IsNotEmpty()
  @IsString()
  sku: string;

  @IsNotEmpty()
  @IsEnum(ModelScales)
  scale: ModelScales;

  @IsNotEmpty()
  @IsString()
  material: string;

  @IsNotEmpty()
  @IsString()
  color: string;

  @IsOptional()
  @IsString()
  additionalColors: string;

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

  @IsOptional()
  meta: { title: string; description: string; keywords: string };

  @IsNotEmpty()
  weight: { value: number; unit: string };

  tags: string;
}
