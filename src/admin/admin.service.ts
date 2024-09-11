import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageService } from '../utils/service/page/page.service';
import { BcryptUtils } from '../utils/bcrypt.utils';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminService extends PageService {
  constructor(
    @InjectRepository(Admin)
    private adminRepo: Repository<Admin>,
  ) {
    super();
  }
  async create(createAdminDto: CreateAdminDto): Promise<void> {
    createAdminDto.password = await BcryptUtils.hashPassword(
      createAdminDto.password,
    );
    await this.adminRepo.save(createAdminDto);
  }

  async findAll(filter) {
    return await this.generatePaging(filter, this.adminRepo);
  }

  async findOne(id: number): Promise<Admin> {
    const admin = await this.adminRepo.findOneBy({ id: id });
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }
    return admin;
  }

  async findByEmail(email: string): Promise<Admin> {
    const user = await this.adminRepo.findOneBy({ email: email });
    if (!user) {
      throw new NotFoundException('Admin not found');
    }
    return user;
  }

  async update(id: number, updateAdminDto: UpdateAdminDto): Promise<void> {
    const admin = await this.findOne(updateAdminDto.id);
    if (updateAdminDto.password) {
      updateAdminDto.password = await BcryptUtils.hashPassword(
        updateAdminDto.password,
      );
    }
    const updatedAdmin = { ...admin, ...updateAdminDto };
    await this.adminRepo.save(updatedAdmin);
  }

  async remove(id: number): Promise<void> {
    const admin = await this.findOne(id);
    await this.adminRepo.remove(admin);
  }
}
