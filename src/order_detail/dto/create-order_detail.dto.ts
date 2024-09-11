import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IsExist } from '../../utils/validator/exist-validator';
import { Order } from '../../order/entities/order.entity';
import { Product } from '../../product/entities/product.entity';

export class CreateOrderDetailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsExist([Order, 'id'])
  order_id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsExist([Product, 'id'])
  product_id: number;
}
