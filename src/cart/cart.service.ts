import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { PageService } from '../utils/service/page/page.service';

@Injectable()
export class CartService extends PageService {
  constructor(@InjectRepository(Cart) private cartRepo: Repository<Cart>) {
    super();
  }
  async create(createCartDto: CreateCartDto) {
    return await this.cartRepo.save(createCartDto);
  }

  async findAllByUserId(user_id: number) {
    return await this.cartRepo.find({
      where: { user_id: user_id },
    });
  }

  async findOne(id: number) {
    const cart = await this.cartRepo.findOneBy({ id: id });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return cart;
  }

  async remove(id: number, user_id: number) {
    const cart = await this.findOne(id);
    if (cart.user_id != user_id) {
      throw new BadRequestException('This cart is not yours');
    }

    return this.cartRepo.remove(cart);
  }

  async removeByUserId(user_id: number) {
    const cart = await this.cartRepo.findOneBy({ user_id: user_id });
    if (!cart) {
      throw new BadRequestException('Cart not found');
    }

    return this.cartRepo.remove(cart);
  }
}
