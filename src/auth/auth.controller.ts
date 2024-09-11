import {
  Controller,
  Post,
  Body,
  Patch,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import {
  ApiBody,
  ApiQuery,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailService } from 'src/mail/mail.service';
import {
  ApiResponseCustom,
  ApiResponseGeneral,
  ResponseNotFound,
  ResponseServerError,
  ResponseUnauthorized,
  ResponseValidation,
} from '../utils/response.utils';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponseCustom(HttpStatus.OK, 'Login successful', {
    access_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzI1NjM0NDAzLCJleHAiOjE3MjU2NTYwMDN9.ohwDQKTVU5WLiq9JJ7yPiaoe3Do7M5XZj3m4ir4HrRY',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'Email or Password Wrong',
        error: 'Unauthorized',
      },
    },
  })
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
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
    type: ResponseServerError,
  })
  @ApiBody({ type: LoginDto })
  @ApiOperation({ summary: 'Login user' })
  async signIn(@Body() loginDto: LoginDto): Promise<any> {
    const result = await this.authService.login(loginDto);
    return { message: 'Login successful', result };
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponseGeneral(HttpStatus.CREATED, 'Registered successful')
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
  @ApiBody({ type: RegisterDto })
  @ApiOperation({ summary: 'Register user' })
  async signUp(@Body() registerDto: RegisterDto) {
    await this.authService.register(registerDto);
    return { message: 'Registered successful' };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiResponseCustom(HttpStatus.OK, 'Forgot Password successful', 95746)
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
  @ApiBody({ type: ForgotPasswordDto })
  @ApiOperation({ summary: 'Forgot Password user' })
  async forgotPassword(@Body() forgotPassword: ForgotPasswordDto) {
    const result = await this.userService.createOtp(forgotPassword);

    // send mail reset password
    await this.mailService.sendResetPassword(result.email, result.otp);
    return { message: 'Forgot Password successful', result: result.otp };
  }

  @Post('check-otp')
  @HttpCode(HttpStatus.OK)
  @ApiResponseCustom(HttpStatus.OK, 'Check Otp successful')
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
  @ApiOperation({ summary: 'Check Otp user' })
  async checkOtp(@Body() body: { otp: number }) {
    await this.userService.checkOtp(body.otp);
    return { message: 'Check Otp successful' };
  }

  @Patch('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiResponseCustom(HttpStatus.OK, 'Reset Password successful')
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
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        otp: { type: 'number' },
      },
      required: ['otp'],
    },
  })
  @ApiQuery({ name: 'otp', type: 'number' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiOperation({ summary: 'Reset Password user' })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Query('otp') otp: number,
  ) {
    await this.userService.updateOtp(resetPasswordDto, otp);
    return { message: 'Reset Password successful' };
  }
}
