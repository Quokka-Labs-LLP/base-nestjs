import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Stripe } from 'stripe';
import { Stripe_Constants } from '../../common/config/constant';
import { Types } from 'mongoose';

/**
 *
 */
@Injectable()
export class StripeService {
  readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(
      `${configService.get<string>('STRIPE_SECRET_KEY')}`,
      {
        apiVersion: '2022-11-15',
      },
    );
  }

  /**
   * Retrieve the current balance from Stripe.
   * @returns The balance information.
   */
  async retrieveBalance(): Promise<Stripe.Balance> {
    return await this.stripe.balance.retrieve();
  }

  /**
   * Create a checkout session for payment.
   * @param orderId - The ID of the order.
   * @param totalAmount - The total amount of the payment.
   * @param customerId - The stripe customer ID, Optional for the first customer .
   * @returns The created checkout session.
   * @throws {UnprocessableEntityException} If the checkout session cannot be created.
   */
  async createPaymentCheckoutSession(
    orderId: Types.ObjectId,
    totalAmount: number,
    customerId: string,
  ): Promise<Stripe.Checkout.Session> {
    const minStripeAmount: number = parseFloat(
      `${this.configService.get<string>('STRIPE_MIN_AMOUNT')}`,
    );
    if (!orderId || totalAmount < minStripeAmount) {
      Logger.error(
        `[stripeService] orderId missing or totalAmount less than ${minStripeAmount}`,
      );
      throw new UnprocessableEntityException(
        'The checkout session could not be created',
      );
    }

    try {
      return await this.stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: `${this.configService.get<string>('STRIPE_CURRENCY')}`,
              product_data: {
                name: 'T-shirt',
              },
              unit_amount: Number(totalAmount) * 100,
            },
            quantity: 1,
          },
        ],
        customer: customerId || undefined,
        customer_creation: !customerId ? 'always' : undefined,
        mode: Stripe_Constants.OnetimePayment,
        metadata: {
          orderId: orderId.toString(),
        },
        success_url: 'http://localhost:4242/success',
        cancel_url: 'http://localhost:4242/cancel',
      });
    } catch (error) {
      Logger.error('[stripeService] Error creating a checkout session', error);
      throw new UnprocessableEntityException(
        'The checkout session could not be created',
      );
    }
  }

  /**
   * Create a payment intent for the given order and total amount.
   * @param orderId - The ID of the order.
   * @param totalAmount - The total amount of the payment.
   * @returns The created payment intent.
   * @throws {UnprocessableEntityException} If the payment intent cannot be created.
   */
  async createPaymentIntent(
    orderId: string,
    totalAmount: number,
  ): Promise<Stripe.PaymentIntent> {
    const minStripeAmount: number = parseFloat(
      `${this.configService.get<string>('STRIPE_MIN_AMOUNT')}`,
    );
    if (!orderId || totalAmount < minStripeAmount) {
      Logger.error(
        `[stripeService] orderId missing or totalAmount less than ${minStripeAmount}`,
      );
      throw new UnprocessableEntityException(
        'The payment intent could not be created',
      );
    }
    try {
      const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
        // Total amount to be sent is converted to cents to be used by the Stripe API
        amount: Number(totalAmount) * 100,
        currency: `${this.configService.get<string>('STRIPE_CURRENCY')}`,
        payment_method_types: ['card'],
        metadata: { orderId: orderId },
      };
      return await this.stripe.paymentIntents.create(paymentIntentParams);
    } catch (error) {
      Logger.error('[stripeService] Error creating a payment intent', error);
      throw new UnprocessableEntityException(
        'The payment intent could not be created',
      );
    }
  }

  async webhook(): Promise<void> {}
}
