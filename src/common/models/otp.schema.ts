import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OtpDocument = HydratedDocument<Otp>;

@Schema({ timestamps: true })
export class Otp {
  @Prop({
    unique: true,
    required: true,
  })
  email: string;

  @Prop({ type: String })
  pin: string;

  @Prop({ type: Date })
  expiry: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
