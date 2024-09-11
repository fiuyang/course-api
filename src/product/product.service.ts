import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageService } from 'src/utils/service/page/page.service';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService extends PageService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {
    super();
  }
  async create(createProductDto: CreateProductDto) {
    return await this.productRepo.save(createProductDto);
  }

  async findAll(filter) {
    return await this.generatePaging(filter, this.productRepo, {
      relations: ['product_category'],
    });
  }

  async findOne(id: number) {
    const product = await this.productRepo.findOneBy({ id: id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);

    Object.assign(product, updateProductDto);

    return await this.productRepo.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    return this.productRepo.remove(product);
  }

  async count() {
    await this.productRepo.count();
  }
}
