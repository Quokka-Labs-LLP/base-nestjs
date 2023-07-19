import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';

export type OrderDocument = HydratedDocument<Order>;

/**
 *
 */
@Schema({ timestamps: true })
export class Order {
  @Prop({
    required: true,
    ref: User.name,
    type: Types.ObjectId,
  })
  userId: User;

  @Prop({
    type: String,
    required: true,
  })
  productId: string;

  @Prop({ type: Number })
  amount: number;

  @Prop({ enum: ['PENDING', 'COMPLETE', 'CANCELLED'], default: 'PENDING' })
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
