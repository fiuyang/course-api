import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProductCategoryDto } from './dto/update-product_category.dto';
import { PageService } from 'src/utils/service/page/page.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from './entities/product_category.entity';
import { CreateProductCategoryDto } from './dto/create-product_category.dto';

@Injectable()
export class ProductCategoryService extends PageService {
  constructor(
    @InjectRepository(ProductCategory)
    private productCategoryRepo: Repository<ProductCategory>,
  ) {
    super();
  }
  async create(
    createProductCategoryDto: CreateProductCategoryDto,
  ): Promise<void> {
    await this.productCategoryRepo.save(createProductCategoryDto);
  }

  async findAll(filter) {
    return await this.generatePaging(filter, this.productCategoryRepo, {
      relations: ['products'],
    });
  }

  async findOne(id: number): Promise<ProductCategory> {
    const productCategory = await this.productCategoryRepo.findOneBy({
      id: id,
    });
    if (!productCategory) {
      throw new NotFoundException('Product category not found');
    }
    return productCategory;
  }

  async update(
    id: number,
    updateProductCategoryDto: UpdateProductCategoryDto,
  ): Promise<void> {
    const productCategory = await this.findOne(id);

    Object.assign(productCategory, updateProductCategoryDto);

    await this.productCategoryRepo.save(productCategory);
  }

  async remove(id: number): Promise<void> {
    const productCategory = await this.findOne(id);
    await this.productCategoryRepo.remove(productCategory);
  }
}
