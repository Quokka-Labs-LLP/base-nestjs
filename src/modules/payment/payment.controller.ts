import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseInterface } from '@interfaces/Responses/response.interface';
import { PaymentService } from './payment.service';
import { Types } from 'mongoose';

/**
 *
 */
@ApiTags(PaymentController.name)
@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('/webhook')
  async webhook(@Body() data: any) {
    // console.log('In webhook', data);
    this.paymentService.paymentWebhook(data);
  }

  @Post('/:userId')
  async createPaymentSession(
    @Param('userId') userId: string,
    @Body() data: any,
  ): Promise<ResponseInterface> {
    const result = await this.paymentService.createPaymentCheckout(
      new Types.ObjectId(userId),
      data,
    );
    return {
      success: true,
      status: 1004,
      data: result,
    };
  }
}
