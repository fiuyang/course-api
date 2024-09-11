import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ApiResponseGeneral,
  ResponseNotFound,
  ResponseServerError,
  ResponseUnauthorized,
  ResponseValidation,
} from '../utils/response.utils';

@ApiTags('Webhook')
@Controller('webhooks')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponseGeneral(HttpStatus.OK, 'Payment updated successful')
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
  async xenditPayment(@Body() createWebhookDto: CreateWebhookDto) {
    await this.webhookService.updatePayment(createWebhookDto);
    return { message: 'Payment updated successfully' };
  }
}
