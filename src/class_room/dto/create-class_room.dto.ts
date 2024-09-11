import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { IsExist } from '../../utils/validator/exist-validator';
import { User } from '../../user/entities/user.entity';
import { Product } from '../../product/entities/product.entity';
export class CreateClassRoomDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsExist([User, 'id'])
  user_id: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsExist([Product, 'id'])
  product_id: number;
}
