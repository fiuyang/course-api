import { Injectable } from '@nestjs/common';
import { CreateOrderDetailDto } from './dto/create-order_detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderDetail } from './entities/order_detail.entity';
@Injectable()
export class OrderDetailService {
  constructor(
    @InjectRepository(OrderDetail)
    private orderDetailRepo: Repository<OrderDetail>,
  ) {}
  async create(createOrderDetailDto: CreateOrderDetailDto) {
    await this.orderDetailRepo.create(createOrderDetailDto);
  }
}
