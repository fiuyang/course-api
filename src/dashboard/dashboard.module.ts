import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';
import { OrderModule } from '../order/order.module';
@Module({
  imports: [UserModule, OrderModule, ProductModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
