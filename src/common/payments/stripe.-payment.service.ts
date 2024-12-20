import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripePaymentService {
    private stripe: Stripe;

    constructor(private readonly apiKey: string) {
        this.stripe = new Stripe(apiKey, { apiVersion: '2022-11-15' as any }); // Dynamically resolve typings
    }

    async processPayment(amount: number, currency: string): Promise<any> {
        return await this.stripe.paymentIntents.create({
            amount,
            currency,
        });
    }
}
