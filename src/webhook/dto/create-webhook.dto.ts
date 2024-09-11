import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWebhookDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  id: string;
}
