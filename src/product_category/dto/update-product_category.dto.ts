import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { CreateProductCategoryDto } from './create-product_category.dto';
import { IsOptional } from 'class-validator';
export class UpdateProductCategoryDto extends PartialType(
  CreateProductCategoryDto,
) {
  @ApiProperty({ required: false })
  @IsOptional()
  id?: number;
}

export class ProductCategoryParams extends PickType(UpdateProductCategoryDto, [
  'id',
]) {}
