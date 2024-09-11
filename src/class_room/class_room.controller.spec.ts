import { Test, TestingModule } from '@nestjs/testing';
import { ClassRoomController } from './class_room.controller';
import { ClassRoomService } from './class_room.service';

describe('ClassRoomController', () => {
  let controller: ClassRoomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassRoomController],
      providers: [ClassRoomService],
    }).compile();

    controller = module.get<ClassRoomController>(ClassRoomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
