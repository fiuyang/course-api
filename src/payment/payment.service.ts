import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ConfigService } from '@nestjs/config';
import { Xendit, Invoice as InvoiceClient } from 'xendit-node';
import { CreateInvoiceOperationRequest } from 'xendit-node/invoice/apis';

@Injectable()
export class PaymentService {
  private invoice: InvoiceClient;

  constructor(private configService: ConfigService) {
    const xenditClient = new Xendit({
      secretKey: this.configService.get<string>('XENDIT_KEY'),
    });
    this.invoice = xenditClient.Invoice;
  }
  async create(createPaymentDto: CreatePaymentDto) {
    const data: CreateInvoiceOperationRequest = {
      data: {
        externalId: createPaymentDto.external_id,
        amount: createPaymentDto.amount,
        description: createPaymentDto.description,
        payerEmail: createPaymentDto.payer_email,
        customer: {
          email: createPaymentDto.payer_email,
        },
        customerNotificationPreference: {
          invoiceCreated: ['email'],
          invoicePaid: ['email'],
          invoiceReminder: ['email'],
        },
        invoiceDuration: '86400', // Duration in seconds (24 hours)
        successRedirectUrl:
          this.configService.get<string>('XENDIT_SUCCESS_URL'),
      },
    };

    try {
      return await this.invoice.createInvoice(data);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
