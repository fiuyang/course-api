import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { IsUnique } from '../../utils/validator/unique-validator';
import { Discount } from '../entities/discount.entity';

export class CreateDiscountDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @IsUnique([Discount, 'code'])
  code: string;

  @ApiProperty({ required: true })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  qty: number;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ required: true })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  remaining_qty: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  value: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  start_date: Date;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  end_date: Date;
}
