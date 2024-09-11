import { ApiProperty } from '@nestjs/swagger';
import { PageRequestDto } from '../../utils/dto/page.dto';
import { IsOptional } from 'class-validator';

export class ProductMap {
  @ApiProperty()
  id: number;

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

export class ProductCategoryResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: [ProductMap] })
  products: ProductMap[];

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class QueryFilter extends PageRequestDto {
  @ApiProperty({ required: false })
  @IsOptional()
  name: string;
}
