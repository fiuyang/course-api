import { Module } from '@nestjs/common';
import { ClassRoomService } from './class_room.service';
import { ClassRoomController } from './class_room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassRoom } from './entities/class_room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClassRoom])],
  controllers: [ClassRoomController],
  providers: [ClassRoomService],
})
export class ClassRoomModule {}
