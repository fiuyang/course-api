import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { CartParams } from './dto/update-cart.dto';
import { CartResponse } from './dto/cart-response';
import {
  ApiResponseGeneral,
  ResponseNotFound,
  ResponseServerError,
  ResponseUnauthorized,
  ResponseValidation,
} from '../utils/response.utils';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PagingResponse } from '../utils/dto/page.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { InjectUser } from '../decorator/inject-user.decorator';
@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponseGeneral(HttpStatus.CREATED, 'Added cart successful')
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
  @ApiBody({ type: CreateCartDto })
  @ApiOperation({ summary: 'Add cart' })
  async create(@Body() createCartDto: CreateCartDto) {
    await this.cartService.create(createCartDto);
    return { message: 'Added cart successful' };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponseGeneral(HttpStatus.OK, null, [CartResponse], PagingResponse)
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
  @ApiOperation({ summary: 'Get all cart by user_id' })
  async findAllByUserId(@InjectUser() user_id: number) {
    return this.cartService.findAllByUserId(user_id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponseGeneral(HttpStatus.OK, 'Deleted cart successful')
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
  @ApiOperation({ summary: 'Delete cart by id' })
  async remove(@Param() params: CartParams, @InjectUser() user_id: number) {
    await this.cartService.remove(params.id, user_id);
    return { message: 'Deleted cart successful' };
  }
}
