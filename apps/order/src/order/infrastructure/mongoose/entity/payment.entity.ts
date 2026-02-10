import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum PaymentMethod {
  creditCard = 'CreditCard',
  kakaopay = 'Kakaopay',
}

@Schema({
  _id: false,
})
export class PaymentDocument {
  @Prop()
  paymentId: string;

  @Prop({
    type: String,
    enum: PaymentMethod,
    default: PaymentMethod.creditCard,
  })
  paymentMethod: string;

  @Prop({ required: true })
  paymentName: string;

  @Prop({ required: true })
  amount: number;
}

export const PaymentSchema = SchemaFactory.createForClass(PaymentDocument);
