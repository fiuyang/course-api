import { Injectable } from '@nestjs/common';
import { ProductService } from '../product/product.service';
import { UserService } from '../user/user.service';
import { OrderService } from '../order/order.service';

@Injectable()
export class DashboardService {
  constructor(
    private userService: UserService,
    private orderService: OrderService,
    private productService: ProductService,
  ) {}
  async findAll() {
    const totalUser = await this.userService.count();
    const totalOrder = await this.orderService.count();
    const totalProduct = await this.productService.count();

    return {
      totalUser,
      totalOrder,
      totalProduct,
    };
  }
}
