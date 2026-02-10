import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProductDocument, ProductSchema } from './product.entity';
import { CustomerDocument, CustomerSchema } from './customer.entity';
import {
  DeliveryAddressDocument,
  DeliveryAddressSchema,
} from './delivery-address.entity';
import { PaymentDocument, PaymentSchema } from './payment.entity';
import { Document, ObjectId } from 'mongoose';

export enum OrderStatus {
  pending = 'Pending',
  paymentCanclled = 'PaymentCanclled',
  paymentFailed = 'PaymentFailed',
  paymentProcessed = 'PaymentProcessed',
  deliveryStarted = 'DeliveryStarted',
  deliveryDone = 'DeliveryDone',
}

@Schema()
export class OrderDocument extends Document<ObjectId> {
  @Prop({ type: CustomerSchema, required: true })
  customer: CustomerDocument;

  @Prop({ type: [ProductSchema], required: true })
  products: ProductDocument[];

  @Prop({ type: DeliveryAddressSchema, required: true })
  deliveryAddress: DeliveryAddressDocument;

  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.pending })
  status: OrderStatus;

  @Prop({ type: PaymentSchema })
  payment: PaymentDocument;

  @Prop({ type: Number, required: true })
  totalAmount: number;
}

export const OrderSchema: any = SchemaFactory.createForClass(OrderDocument);
