import { ApiProperty } from '@nestjs/swagger';
import { PageRequestDto } from '../../utils/dto/page.dto';
import { IsOptional } from 'class-validator';

export class DiscountResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  qty: number;

  @ApiProperty()
  type: string;

  @ApiProperty()
  remaining_qty: number;

  @ApiProperty()
  value: number;

  @ApiProperty()
  start_date: Date;

  @ApiProperty()
  end_date: Date;

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
  code: string;

  @ApiProperty({ required: false })
  @IsOptional()
  qty: number;
}
