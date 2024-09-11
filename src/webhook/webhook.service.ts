import { BadRequestException, Injectable } from '@nestjs/common';
import { Invoice as InvoiceClient, Xendit } from 'xendit-node';
import { ConfigService } from '@nestjs/config';
import { GetInvoiceByIdRequest } from 'xendit-node/invoice/apis/Invoice';
import { OrderService } from '../order/order.service';
import { UpdateOrderDto } from '../order/dto/update-order.dto';
import { ClassRoomService } from '../class_room/class_room.service';
import { CreateClassRoomDto } from '../class_room/dto/create-class_room.dto';
import { CreateWebhookDto } from './dto/create-webhook.dto';

@Injectable()
export class WebhookService {
  private invoice: InvoiceClient;
  private orderService: OrderService;
  private classRoomService: ClassRoomService;

  constructor(private configService: ConfigService) {
    const xenditClient = new Xendit({
      secretKey: this.configService.get<string>('XENDIT_KEY'),
    });
    this.invoice = xenditClient.Invoice;
  }
  async updatePayment(createWebhookDto: CreateWebhookDto) {
    const params: GetInvoiceByIdRequest = { invoiceId: createWebhookDto.id };
    const dataXendit = await this.invoice.getInvoiceById(params);

    const dataOrder = await this.orderService.findByExternalId(
      dataXendit.externalId,
    );

    if (!dataOrder) {
      throw new BadRequestException('Order is not found');
    }

    if (dataOrder.status === 'settled') {
      throw new BadRequestException('payment has already processed');
    }

    if (dataOrder.status !== 'paid') {
      if (dataXendit.status === 'PAID' || dataXendit.status === 'SETTLED') {
        for (const orderDetail of dataOrder.orderDetails) {
          const dataClassRoom: CreateClassRoomDto = {
            user_id: dataOrder.user_id,
            product_id: orderDetail.product_id,
          };

          try {
            await this.classRoomService.create(dataClassRoom);
          } catch (err) {
            throw new Error(err);
          }
        }
      }
    }

    // Update data order
    const orderDto: UpdateOrderDto = {
      status: dataXendit.status.toLowerCase(),
    };

    await this.orderService.update(dataOrder.id, orderDto);
  }
}
