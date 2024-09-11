import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { CreateClassRoomDto } from './create-class_room.dto';
import { IsOptional } from 'class-validator';
export class UpdateClassRoomDto extends PartialType(CreateClassRoomDto) {
  @ApiProperty({ required: false })
  @IsOptional()
  id?: number;
}

export class ClassRoomParams extends PickType(UpdateClassRoomDto, ['id']) {}
