import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CartService } from '../cart/cart.service';
import { DiscountService } from '../discount/discount.service';
import { ProductService } from '../product/product.service';
import { PaymentService } from '../payment/payment.service';
import { Order } from './entities/order.entity';
import { Product } from '../product/entities/product.entity';
import { Discount } from '../discount/entities/discount.entity';
import { OrderDetailService } from '../order_detail/order_detail.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from '../payment/dto/create-payment.dto';
import { CreateOrderDetailDto } from '../order_detail/dto/create-order_detail.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrderService {
  constructor(
    private cartService: CartService,
    private discountService: DiscountService,
    private productService: ProductService,
    private paymentService: PaymentService,
    private orderDetailService: OrderDetailService,

    @InjectRepository(Order) private orderRepo: Repository<Order>,
  ) {}
  async create(dto: CreateOrderDto) {
    let price: number = 0;
    let totalPrice: number = 0;
    let description: string = '';
    const products: Product[] = [];

    const order = new Order();
    order.user_id = dto.user_id;
    order.status = 'pending';

    let dataDiscount: Discount;
    // Search carts data by user id
    const carts = await this.cartService.findAllByUserId(dto.user_id);

    // Check if the cart is empty or not
    if (carts.length === 0) {
      // If it is empty, we will check the product id whether it will be sent or not
      if (!dto.product_id) {
        throw new BadRequestException('cart is empty');
      }
    }

    // Check data discount
    if (dto.discount_code) {
      try {
        dataDiscount = await this.discountService.findByCode(dto.discount_code);
      } catch (err) {
        throw new BadRequestException('expired discount code');
      }

      if (dataDiscount.remaining_qty === 0) {
        throw new BadRequestException('expired discount code');
      }
    }

    if (carts.length > 0) {
      // If using a cart
      for (const cart of carts) {
        const product = await this.productService.findOne(cart.product_id);
        products.push(product);
      }
    } else if (dto.product_id) {
      // If the user immediately checkout
      const product = await this.productService.findOne(dto.product_id);
      products.push(product);
    }

    //Calculate the price and create a description to xendit
    for (let i = 0; i < products.length; i++) {
      price += products[i].price;
      description += `${i + 1}. Product : ${products[i].title}<br/>`;
    }

    totalPrice = price;

    if (dataDiscount) {
      // Calculate Logic Discount
      if (dataDiscount.type === 'rebate') {
        totalPrice = price - dataDiscount.value;
      } else if (dataDiscount.type === 'percent') {
        totalPrice = price - (price / 100) * dataDiscount.value;
      }

      order.user_id = dataDiscount.id;
    }

    order.price = price; // Original price
    order.total_price = totalPrice; // The price has been reduced by discount
    order.created_by = dto.user_id;

    const externalId = uuidv4();

    order.external_id = externalId;

    // Insert to table order
    const data = await this.orderRepo.create(order);

    //Insert to table order details
    for (const product of products) {
      const orderDetail: CreateOrderDetailDto = {
        order_id: data.id,
        product_id: product.id,
        price: product.price,
      };

      await this.orderDetailService.create(orderDetail);
    }

    // Hit payment
    const dataPayment: CreatePaymentDto = {
      external_id: externalId,
      amount: totalPrice,
      payer_email: dto.email,
      description: description,
    };

    const payment = await this.paymentService.create(dataPayment);
    if (!payment) {
      throw new BadRequestException('Failed to create payment');
    }

    data.checkout_link = payment.invoiceUrl;

    await this.orderRepo.update(data.id, data);

    // Update remaining quantity discount
    if (dto.discount_code) {
      await this.discountService.updateRemainingQty(dataDiscount.id, 1, '-');
    }

    // Delete carts
    await this.cartService.removeByUserId(dto.user_id);
  }

  async findAllByUserId(user_id: number) {
    return await this.orderRepo.find({
      where: { user_id: user_id },
    });
  }

  async findOne(id: number) {
    const order = await this.orderRepo.findOneBy({ id: id });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async findByExternalId(external_id: string) {
    const order = await this.orderRepo.findOneBy({ external_id: external_id });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOne(id);

    Object.assign(order, updateOrderDto);

    return await this.orderRepo.save(order);
  }

  async count() {
    await this.orderRepo.count();
  }
}
