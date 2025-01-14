import { forwardRef, Module } from '@nestjs/common';
import { OrderDetailService } from './order_detail.service';
// import { OrderDetailController } from './order_detail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetail } from './entities/order_detail.entity';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderDetail]),
    forwardRef(() => OrderModule),
  ],
  // controllers: [OrderDetailController],
  providers: [OrderDetailService],
  exports: [OrderDetailService],
})
export class OrderDetailModule {}
