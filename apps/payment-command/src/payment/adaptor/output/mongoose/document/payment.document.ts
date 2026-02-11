import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  NotificationStatus,
  PaymentMethod,
  PaymentStatus,
} from '../../../../domain/payment.domain';
import { Document } from 'mongoose';

@Schema()
export class PaymentDocument extends Document {
  @Prop({
    type: String,
    required: true,
    enum: PaymentStatus,
    default: PaymentStatus.pending,
  })
  paymentStatus: PaymentStatus;

  @Prop({
    type: String,
    required: true,
    enum: PaymentMethod,
    default: PaymentMethod.creditCard,
  })
  paymentMethod: PaymentMethod;

  @Prop({ required: true })
  cardNumber: string;

  @Prop({ required: true })
  expiryYear: string;

  @Prop({ required: true })
  expiryMonth: string;

  @Prop({ required: true })
  birthOrRegistration: string;

  @Prop({ required: true })
  passwordTwoDigits: string;

  @Prop({
    type: String,
    required: true,
    enum: NotificationStatus,
    default: NotificationStatus.pending,
  })
  notificationStatus: NotificationStatus;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  userEmail: string;

  @Prop({ required: true })
  orderId: string;
}

export const PaymentSchema = SchemaFactory.createForClass(PaymentDocument);
