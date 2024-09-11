import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageService } from '../utils/service/page/page.service';
import { Discount } from './entities/discount.entity';

@Injectable()
export class DiscountService extends PageService {
  constructor(
    @InjectRepository(Discount) private discountRepo: Repository<Discount>,
  ) {
    super();
  }
  async create(createDiscountDto: CreateDiscountDto) {
    createDiscountDto.remaining_qty = 0;
    return await this.discountRepo.save(createDiscountDto);
  }

  async findAll(filter) {
    return await this.generatePaging(filter, this.discountRepo);
  }

  async findOne(id: number) {
    const discount = await this.discountRepo.findOneBy({ id: id });
    if (!discount) {
      throw new NotFoundException('Discount not found');
    }
    return discount;
  }

  async findByCode(code: string) {
    const discount = await this.discountRepo.findOneBy({ code: code });
    if (!discount) {
      throw new NotFoundException('Discount not found');
    }
    return discount;
  }

  async update(id: number, updateDiscountDto: UpdateDiscountDto) {
    const discount = await this.findOne(id);

    Object.assign(discount, updateDiscountDto);

    return await this.discountRepo.save(discount);
  }

  async updateRemainingQty(id: number, qty: number, operator: string) {
    const discount = await this.findOne(id);

    if (operator === '+') {
      discount.remaining_qty += qty;
    } else if (operator === '-') {
      discount.remaining_qty -= qty;
    } else {
      throw new BadRequestException('Operator not handled');
    }

    return await this.discountRepo.save(discount);
  }

  async remove(id: number) {
    const discount = await this.findOne(id);
    return this.discountRepo.remove(discount);
  }
}
