import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IsOptional } from 'class-validator';
export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({ required: false })
  @IsOptional()
  id?: number;
}

export class ProductParams extends PickType(UpdateProductDto, ['id']) {}
