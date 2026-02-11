import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export enum PaymentStatus {
  pending = 'Pending',
  approved = 'Approved',
  rejected = 'Rejected',
}

@Schema()
export class PaymentDocument extends Document<ObjectId> {
  @Prop({ required: true })
  userEmail: string;

  @Prop({ required: true })
  amount: number;

  @Prop({
    type: String,
    enum: PaymentStatus,
    default: PaymentStatus.pending,
    required: true,
  })
  paymentStatus: PaymentStatus;

  @Prop({ required: true })
  cardNumberLastFourDigits: string;

  @Prop({ required: true })
  orderId: string;
}

export const PaymentSchema: any = SchemaFactory.createForClass(PaymentDocument);
