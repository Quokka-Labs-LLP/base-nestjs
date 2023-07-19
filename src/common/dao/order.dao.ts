import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../models/order.schema';

/**
 *
 */
@Injectable()
export class OrderDao {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  createOrder = async (data: any): Promise<OrderDocument> => {
    try {
      console.log('data', data);
      return await this.orderModel.create(data);
    } catch (e) {
      console.log(e);
      return e;
    }
  };
}
