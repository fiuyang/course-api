import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { CreateCartDto } from './create-cart.dto';
import { IsOptional } from 'class-validator';

export class UpdateCartDto extends PartialType(CreateCartDto) {
  @ApiProperty({ required: false })
  @IsOptional()
  id?: number;
}

export class CartParams extends PickType(UpdateCartDto, ['id']) {}
