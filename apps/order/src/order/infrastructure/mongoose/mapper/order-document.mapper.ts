import { Types } from 'mongoose';
import { OrderEntity } from '../../../domain/order.entity';
import { OrderDocument } from '../entity/order.entity';

export class OrderDocumentMapper {
  constructor(private readonly document: OrderDocument) {}

  toDomain(): OrderEntity {
    const order = new OrderEntity({
      customer: this.document.customer,
      products: this.document.products,
      deliveryAddress: this.document.deliveryAddress,
    });

    order.setId((this.document._id as unknown as Types.ObjectId).toString());
    if (this.document.payment) {
      order.setPayment(this.document.payment);
    }
    order.status = this.document.status;
    // order.totalAmount = this.document.totalAmount;

    return order;
  }
}
