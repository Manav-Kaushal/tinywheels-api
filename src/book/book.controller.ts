import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { CloudinaryService } from 'nestjs-cloudinary';
import { slugifyProductName } from 'src/utils/helpers';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './schemas/book.schema';

@Controller('books')
export class BookController {
  constructor(
    private bookService: BookService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  async getAllBooks(@Query() query: ExpressQuery): Promise<Book[]> {
    return this.bookService.findAll(query);
  }

  @Post('new')
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('thumbnail'))
  async createBook(
    @Body()
    book: CreateBookDto,
    @Req()
    req,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Book> {
    const slug = slugifyProductName(book.title);
    const thumbnail = await this.cloudinaryService.uploadFile(file, {
      filename_override: file.originalname,
      use_filename: true,
      folder: slug,
    });

    if (thumbnail) {
      return this.bookService.create(
        { ...book, thumbnail: thumbnail.url },
        req.user,
      );
    } else {
      throw new Error('File could not be uploaded!');
    }
  }

  @Get(':id')
  async getBook(
    @Param('id')
    id: string,
  ): Promise<Book> {
    return this.bookService.findById(id);
  }

  @Put(':id')
  async updateBook(
    @Param('id')
    id: string,
    @Body()
    book: UpdateBookDto,
  ): Promise<Book> {
    return this.bookService.updateById(id, book);
  }

  @Delete(':id')
  async deleteBook(
    @Param('id')
    id: string,
  ): Promise<Book> {
    return this.bookService.deleteById(id);
  }
}
