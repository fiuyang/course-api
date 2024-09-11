import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}
export class PageRequestDto {
  @ApiProperty({ required: false, default: 1 })
  @Min(1)
  @IsNumber()
  page: number;

  @ApiProperty({ required: false, default: 10 })
  @IsNumber()
  @Min(1)
  limit: number;
}

export class PagingResponse {
  @ApiProperty({ type: Number, default: 1 })
  limit: number;

  @ApiProperty({ type: Number, default: 10 })
  page: number;

  @ApiProperty()
  @IsNumber()
  total_data: number;

  @ApiProperty()
  @IsNumber()
  total_page: number;
}
