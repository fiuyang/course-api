import { ApiProperty } from '@nestjs/swagger';
import { PageRequestDto } from '../../utils/dto/page.dto';
import { IsOptional } from 'class-validator';
import { ProductResponse } from '../../product/dto/product-response';
import { UserResponse } from '../../user/dto/user-response';

export class ClassRoomResponse {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: [UserResponse] })
  user: UserResponse[];

  @ApiProperty({ type: [ProductResponse] })
  product: ProductResponse[];

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class QueryFilter extends PageRequestDto {
  @ApiProperty({ required: false })
  @IsOptional()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  user_id: number;

  @ApiProperty({ required: false })
  @IsOptional()
  product_id: number;
}
