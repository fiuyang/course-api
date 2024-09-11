import {
  Controller,
  Get,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ClassRoomService } from './class_room.service';
import {
  ApiResponseGeneral,
  ResponseNotFound,
  ResponseServerError,
  ResponseUnauthorized,
  ResponseValidation,
} from '../utils/response.utils';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PagingResponse } from '../utils/dto/page.dto';
import { ClassRoomResponse } from './dto/class_room-response';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { InjectUser } from '../decorator/inject-user.decorator';

@ApiTags('ClassRoom')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('class-rooms')
export class ClassRoomController {
  constructor(private readonly classRoomService: ClassRoomService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponseGeneral(HttpStatus.OK, null, [ClassRoomResponse], PagingResponse)
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation',
    type: ResponseValidation,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
    type: ResponseNotFound,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    type: ResponseUnauthorized,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
    type: ResponseServerError,
  })
  @ApiOperation({ summary: 'Get all class room by user_id' })
  findAllByUserId(@InjectUser() user_id: number) {
    return this.classRoomService.findAllByUserId(user_id);
  }
}
