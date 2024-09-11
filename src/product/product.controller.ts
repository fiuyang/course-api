import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Query,
  HttpCode,
  HttpStatus,
  Body,
  UploadedFiles,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductParams, UpdateProductDto } from './dto/update-product.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { imageFilter, newFileEditor, videoFilter } from '../utils/file.utils';
import { ProductResponse, QueryFilter } from './dto/product-response';
import * as fs from 'fs';
import * as path from 'path';
import {
  ApiResponseGeneral,
  ResponseNotFound,
  ResponseServerError,
  ResponseUnauthorized,
  ResponseValidation,
} from '../utils/response.utils';
import { PagingResponse } from '../utils/dto/page.dto';

@ApiTags('Product')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes('multipart/form-data')
  @ApiResponseGeneral(HttpStatus.CREATED, 'Created product successful')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation',
    type: ResponseValidation,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
    type: ResponseNotFound,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    type: ResponseUnauthorized,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
    type: ResponseServerError,
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'video', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            if (file.fieldname === 'image') {
              cb(null, './asset/product/image');
            } else if (file.fieldname === 'video') {
              cb(null, './asset/product/video');
            }
          },
          filename: newFileEditor,
        }),
        limits: {
          fileSize: 1024 * 1024 * 10, // Max 10MB
        },
        fileFilter: (req, file, cb) => {
          if (file.fieldname === 'image') {
            imageFilter(req, file, cb);
          } else if (file.fieldname === 'video') {
            videoFilter(req, file, cb);
          }
        },
      },
    ),
  )
  @ApiBody({ type: CreateProductDto })
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles()
    files: { image?: Express.Multer.File[]; video?: Express.Multer.File[] },
  ) {
    if (files.image && files.image.length > 0) {
      createProductDto.image = files.image[0].filename;
    }
    if (files.video && files.video.length > 0) {
      createProductDto.video = files.video[0].filename;
    }
    await this.productService.create(createProductDto);
    return { message: 'Created product successful' };
  }
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponseGeneral(HttpStatus.OK, null, [ProductResponse], PagingResponse)
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation',
    type: ResponseValidation,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
    type: ResponseNotFound,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    type: ResponseUnauthorized,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
    type: ResponseServerError,
  })
  async findAll(@Query() page: QueryFilter) {
    return await this.productService.findAll(page);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponseGeneral(HttpStatus.OK, null, ProductResponse)
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation',
    type: ResponseValidation,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
    type: ResponseNotFound,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    type: ResponseUnauthorized,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
    type: ResponseServerError,
  })
  async findOne(@Param('id') id: string) {
    return await this.productService.findOne(+id);
  }

  @Post(':id')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiConsumes('multipart/form-data')
  @HttpCode(HttpStatus.OK)
  @ApiResponseGeneral(HttpStatus.OK, 'Updated product successful')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation',
    type: ResponseValidation,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
    type: ResponseNotFound,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    type: ResponseUnauthorized,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
    type: ResponseServerError,
  })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'video', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            if (file.fieldname === 'image') {
              cb(null, './asset/product/image');
            } else if (file.fieldname === 'video') {
              cb(null, './asset/product/video');
            }
          },
          filename: newFileEditor,
        }),
        limits: {
          fileSize: 1024 * 1024 * 10, // Max 10MB
        },
        fileFilter: (req, file, cb) => {
          if (file.fieldname === 'image') {
            imageFilter(req, file, cb);
          } else if (file.fieldname === 'video') {
            videoFilter(req, file, cb);
          }
        },
      },
    ),
  )
  @ApiBody({ type: UpdateProductDto })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles()
    files: { image?: Express.Multer.File[]; video?: Express.Multer.File[] },
  ) {
    const existingProduct = await this.productService.findOne(+id);
    // Check and delete old files if new ones are uploaded
    if (files.image && files.image[0]) {
      const oldImagePath = path.join(
        __dirname,
        '..',
        '..',
        existingProduct.image,
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      updateProductDto.image = files.image[0].filename;
    }

    if (files.video && files.video[0]) {
      const oldVideoPath = path.join(
        __dirname,
        '..',
        '..',
        existingProduct.video,
      );
      if (fs.existsSync(oldVideoPath)) {
        fs.unlinkSync(oldVideoPath);
      }
      updateProductDto.video = files.video[0].filename;
    }
    await this.productService.update(+id, updateProductDto);
    return { message: 'Updated product successful' };
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiResponseGeneral(HttpStatus.OK, 'Deleted product successful')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation',
    type: ResponseValidation,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
    type: ResponseNotFound,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    type: ResponseUnauthorized,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
    type: ResponseServerError,
  })
  async remove(@Param() id: ProductParams) {
    await this.productService.remove(id.id);
    return { message: 'Deleted product successful' };
  }
}
