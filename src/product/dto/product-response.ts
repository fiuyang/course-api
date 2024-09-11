import { ApiProperty } from '@nestjs/swagger';
import { PageRequestDto } from '../../utils/dto/page.dto';
import { IsOptional } from 'class-validator';

export class ProductCategoryMap {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class ProductResponse {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: ProductCategoryMap })
  product_category: ProductCategoryMap;

  @ApiProperty()
  title: string;

  @ApiProperty({ format: 'binary' })
  image: string;

  @ApiProperty({ format: 'binary' })
  video: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class QueryFilter extends PageRequestDto {
  @ApiProperty({ required: false })
  @IsOptional()
  title: string;
}
