import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductSchema } from './schemas/product.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
