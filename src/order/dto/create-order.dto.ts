import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsExist } from '../../utils/validator/exist-validator';
import { Discount } from '../../discount/entities/discount.entity';
import { Product } from '../../product/entities/product.entity';
import { User } from '../../user/entities/user.entity';

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsExist([Discount, 'code'])
  discount_code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsExist([Product, 'id'])
  product_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsExist([User, 'id'])
  user_id: number;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: string;
}
