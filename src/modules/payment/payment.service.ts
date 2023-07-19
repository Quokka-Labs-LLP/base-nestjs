import { Injectable } from '@nestjs/common';
import { StripeService } from '../stripe/stripe.service';
import { UserDao } from 'src/common/dao/user.dao';
import { Stripe } from 'stripe';
import { OrderDao } from 'src/common/dao/order.dao';
import { Types } from 'mongoose';

/**
 *
 */
@Injectable()
export class PaymentService {
  constructor(
    private userDao: UserDao,
    private stripeService: StripeService,
    private orderDao: OrderDao,
  ) {}

  async createPaymentCheckout(
    userId: Types.ObjectId,
    data: any,
  ): Promise<Stripe.Checkout.Session> {
    const { stripeCustomerId } = await this.userDao.findUserById(
      userId,
      'stripeCustomerId',
    );
    const { amount } = data;
    const productId = '67dhjsdv782';
    const order = await this.orderDao.createOrder({
      userId,
      productId,
      amount,
      status: 'PENDING',
    });
    return await this.stripeService.createPaymentCheckoutSession(
      order._id,
      amount,
      stripeCustomerId,
    );
  }

  async paymentWebhook(webhookData: any): Promise<void> {
    console.log(webhookData);
    if (webhookData.type === 'charge.succeeded') {
      // const data: Stripe.Charge = webhookData.data.object;
    }
  }
}
