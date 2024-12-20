import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StripePaymentService } from './stripe.-payment.service';
import { PayPalPaymentService } from './paypal-payment.service';
import { PAYMENTS_TYPE } from '@config/constant';
import { RazorpayService } from './razorpay-payment.service';

@Module({})
export class PaymentModule {
    static forRoot(): DynamicModule {
        return {
            module: PaymentModule,
            imports: [ConfigModule.forRoot()], // Ensure ConfigModule is imported
            providers: PaymentModule.getPaymentProviders(), // Use the provider array from getPaymentProviders
            exports: PaymentModule.getPaymentExports(), // Export services you need
        };
    }

    // Returns an array of providers
    private static getPaymentProviders() {
        const config = new ConfigService();
        const paymentGateway = config.get<string>('PAYMENTS_TYPE');

        const providers = [];
        
        if (paymentGateway === PAYMENTS_TYPE.Stripe) {
            providers.push({
                provide: StripePaymentService,
                useFactory: (configService: ConfigService) => {
                    const apiKey = configService.get<string>('STRIPE_API_KEY');
                    if (!apiKey) {
                        throw new Error('Stripe API Key is not configured.');
                    }
                    return new StripePaymentService(apiKey); // Inject API key here
                },
                inject: [ConfigService],
            });
            console.log('Payments using Stripe')
        } else if (paymentGateway === PAYMENTS_TYPE.Paypal) {
            providers.push({
                provide: PayPalPaymentService,
                useFactory: (configService: ConfigService) => {
                    const clientId = configService.get<string>('PAYPAL_CLIENT_ID');
                    const clientSecret = configService.get<string>('PAYPAL_CLIENT_SECRET');
                    if (!clientId || !clientSecret) {
                        throw new Error('PayPal credentials are not configured.');
                    }
                    //   return new PayPalPaymentService(clientId, clientSecret); // Inject credentials here
                },
                inject: [ConfigService],
            });
            console.log('Payments using Paypal')
        } else if (paymentGateway === PAYMENTS_TYPE.RazorPay) {
            providers.push(RazorpayService)
            console.log('Payments using RazorPay')
        }
        return providers;
    }

    private static getPaymentExports() {
        const config = new ConfigService();
        const paymentGateway = config.get<string>('PAYMENTS_TYPE');
        const exports = [];
        if (paymentGateway === PAYMENTS_TYPE.Stripe) {
            exports.push(StripePaymentService);
        } else if (paymentGateway === PAYMENTS_TYPE.Paypal) {
            exports.push(PayPalPaymentService);
        } else if (paymentGateway === PAYMENTS_TYPE.RazorPay) {
            exports.push(RazorpayService);
        }
        return exports;
    }
}
