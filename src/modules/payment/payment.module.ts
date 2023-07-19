import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { StripeService } from '../stripe/stripe.service';
import { UserDao } from 'src/common/dao/user.dao';
import { OrderDao } from 'src/common/dao/order.dao';
import { User, UserSchema } from 'src/common/models/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema, Order } from 'src/common/models/order.schema';

/**
 *
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, StripeService, UserDao, OrderDao],
})
export class PaymentModule {}
