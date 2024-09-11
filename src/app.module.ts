import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ExistValidator } from './utils/validator/exist-validator';
import { UniqueValidator } from './utils/validator/unique-validator';
import { PageService } from './utils/service/page/page.service';
import { ProductModule } from './product/product.module';
import { MailModule } from './mail/mail.module';
import { DatabaseModule } from './database/database.module';
import { ClassRoomModule } from './class_room/class_room.module';
import { ProductCategoryModule } from './product_category/product_category.module';
import { CartModule } from './cart/cart.module';
import { DiscountModule } from './discount/discount.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AdminModule } from './admin/admin.module';
import { OrderModule } from './order/order.module';
import { OrderDetailModule } from './order_detail/order_detail.module';
import { PaymentModule } from './payment/payment.module';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    ProductModule,
    MailModule,
    DatabaseModule,
    ClassRoomModule,
    ProductCategoryModule,
    CartModule,
    DiscountModule,
    DashboardModule,
    AdminModule,
    OrderModule,
    OrderDetailModule,
    PaymentModule,
    WebhookModule,
  ],
  controllers: [AppController],
  providers: [AppService, ExistValidator, UniqueValidator, PageService],
})
export class AppModule {}
