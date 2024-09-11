import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { IsExist } from 'src/utils/validator/exist-validator';
import { ProductCategory } from '../../product_category/entities/product_category.entity';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsExist([ProductCategory, 'id'])
  product_category_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ required: false, format: 'binary' })
  @IsOptional()
  image?: string;

  @ApiProperty({ required: false, format: 'binary' })
  @IsOptional()
  video?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  price: number;
}
