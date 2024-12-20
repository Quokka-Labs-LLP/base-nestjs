import { Injectable } from '@nestjs/common';
import Razorpay from 'razorpay';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RazorpayService {
    private razorpayInstance: Razorpay;

    constructor(private readonly configService: ConfigService) {

        const keyId = this.configService.get<string>('RAZORPAY_KEY_ID');
        const keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');
        // Initialize Razorpay instance
        if (!keyId || !keySecret) {
            throw new Error('Razorpay Key ID and Key Secret must be defined.');
        }

        // Initialize Razorpay instance with the key_id and key_secret
        this.razorpayInstance = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        });
    }

    // Example: Create an order
    async createOrder(amount: number) {
        const options = {
            amount: amount * 100, // Razorpay expects the amount in paise (1 INR = 100 paise)
            currency: 'INR',
            receipt: `receipt_${Math.random()}`,
        };

        try {
            return await this.razorpayInstance.orders.create(options);
        } catch (error) {
            throw new Error(`Error creating Razorpay order: ${error.message}`);
        }
    }

    // Method to verify the payment signature
    // Example: Capture a payment
    async capturePayment(paymentId: string, amount: number) {
        try {
            const payment = await this.razorpayInstance.payments.capture(paymentId, amount * 100, 'INR'); // Amount in paise
            return payment;
        } catch (error) {
            throw new Error(`Error capturing payment: ${error.message}`);
        }
    }
}
