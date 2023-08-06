import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'nestjs-cloudinary';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { BookModule } from './book/book.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    CloudinaryModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        isGlobal: true,
        cloud_name: configService.get('CLOUDINARY_CLOUD_NAME'),
        api_key: configService.get('CLOUDINARY_API_KEY'),
        api_secret: configService.get('CLOUDINARY_API_SECRET'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    BookModule,
    AuthModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
