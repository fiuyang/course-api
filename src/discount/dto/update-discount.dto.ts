import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { CreateDiscountDto } from './create-discount.dto';
import { IsOptional } from 'class-validator';

export class UpdateDiscountDto extends PartialType(CreateDiscountDto) {
  @ApiProperty({ required: false })
  @IsOptional()
  id?: number;
}
export class DiscountParams extends PickType(UpdateDiscountDto, ['id']) {}
