import { Injectable } from '@nestjs/common';

@Injectable()
export class PayPalPaymentService {
  processPayment(amount: number): string {
    // Logic for processing PayPal payment
    return `Processed payment of $${amount} with PayPal`;
  }
}
