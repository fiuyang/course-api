import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClassRoomDto } from './dto/create-class_room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageService } from '../utils/service/page/page.service';
import { ClassRoom } from './entities/class_room.entity';

@Injectable()
export class ClassRoomService extends PageService {
  constructor(
    @InjectRepository(ClassRoom) private classRoomRepo: Repository<ClassRoom>,
  ) {
    super();
  }
  async create(createClassRoomDto: CreateClassRoomDto) {
    const classRoom = await this.findOneByUserIdAndProductId(
      createClassRoomDto.user_id,
      createClassRoomDto.product_id,
    );
    if (classRoom) {
      throw new BadRequestException('You are already in this class');
    }
    return await this.classRoomRepo.save(createClassRoomDto);
  }

  async findAllByUserId(user_id: number) {
    return await this.classRoomRepo.find({
      where: { user_id: user_id },
    });
  }

  async findOneByUserIdAndProductId(user_id: number, product_id: number) {
    const classRoom = await this.classRoomRepo.findOneBy({
      user_id: user_id,
      product_id: product_id,
    });
    if (!classRoom) {
      throw new NotFoundException('Class Room not found');
    }
    return classRoom;
  }
}
