import { ApiProperty } from '@nestjs/swagger';

export class DashboardResponse {
  @ApiProperty()
  total_user: number;

  @ApiProperty()
  total_order: number;

  @ApiProperty()
  total_product: number;
}
