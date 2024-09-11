import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UserParams } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { QueryFilter, UserResponse } from './dto/user-response';
import {
  ApiResponseGeneral,
  ResponseNotFound,
  ResponseServerError,
  ResponseUnauthorized,
  ResponseValidation,
} from '../utils/response.utils';
import { PagingResponse } from '../utils/dto/page.dto';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponseGeneral(HttpStatus.CREATED, 'Created user successful')
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
  @ApiBody({ type: CreateUserDto })
  @ApiOperation({ summary: 'Create user' })
  async create(@Body() createUserDto: CreateUserDto) {
    await this.userService.create(createUserDto);
    return { message: 'Created user successful' };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponseGeneral(HttpStatus.OK, null, [UserResponse], PagingResponse)
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
  @ApiOperation({ summary: 'Get all user' })
  async findAll(@Query() page: QueryFilter) {
    return await this.userService.findAll(page);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponseGeneral(HttpStatus.OK, null, UserResponse)
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
  @ApiOperation({ summary: 'Get user by id' })
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(+id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponseGeneral(HttpStatus.OK, 'Updated user successful')
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
  @ApiBody({ type: UpdateUserDto })
  @ApiOperation({ summary: 'Update user by id' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    await this.userService.update(+id, updateUserDto);
    return { message: 'Updated user successful' };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponseGeneral(HttpStatus.OK, 'Deleted user successful')
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
  @ApiOperation({ summary: 'Delete user by id' })
  async remove(@Param() id: UserParams) {
    await this.userService.remove(id.id);
    return { message: 'Deleted user successful' };
  }
}
