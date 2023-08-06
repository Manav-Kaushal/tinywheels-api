import { Body, Controller, Get, Post } from '@nestjs/common';
import { CloudinaryService } from 'nestjs-cloudinary';
import { ProductService } from './product.service';
import { Car } from './schemas/product.schema';

@Controller('cars')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  async getAllCars(): Promise<Car[]> {
    return this.productService.findAll();
  }

  // @Get(':id')
  // async getCarById(@Param('id') carId: string): Promise<Car> {
  //   return this.productService.findById(carId);
  // }

  @Post('new')
  // @UseGuards(AuthGuard())
  async createBook(
    @Body()
    carData: Partial<Car>,
    // @Req()
    // req,
  ): Promise<Car> {
    return this.productService.create(carData);
  }

  // @Put(':id')
  // async updateCar(
  //   @Param('id') carId: string,
  //   @Body() carData: Partial<Car>,
  // ): Promise<Car> {
  //   return this.productService.update(carId, carData);
  // }

  // @Delete(':id')
  // async deleteCar(@Param('id') carId: string): Promise<Car> {
  //   return this.productService.delete(carId);
  // }
}
