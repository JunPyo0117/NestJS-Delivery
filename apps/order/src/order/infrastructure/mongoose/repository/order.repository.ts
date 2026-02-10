import { Model } from 'mongoose';
import { OrderOutputPort } from '../../../port/output/order.output-port';
import { InjectModel } from '@nestjs/mongoose';
import { OrderDocument } from '../entity/order.entity';
import { OrderEntity } from '../../../domain/order.entity';
import { OrderDocumentMapper } from '../mapper/order-document.mapper';

export class OrderRepository implements OrderOutputPort {
  constructor(
    @InjectModel(OrderDocument.name)
    private readonly orderRepository: Model<OrderDocument>,
  ) {}

  async getOrder(orderId: string): Promise<OrderEntity> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) throw new Error(`Order not found: ${orderId}`);
    return new OrderDocumentMapper(order).toDomain();
  }

  async createOrder(order: OrderEntity): Promise<OrderEntity> {
    const result = await this.orderRepository.create(order);
    return new OrderDocumentMapper(result).toDomain();
  }

  async updateOrder(order: OrderEntity): Promise<OrderEntity> {
    const { id, ...rest } = order;
    const result = await this.orderRepository.findByIdAndUpdate(id, rest);
    if (!result) throw new Error(`Order not found: ${order.id}`);
    return new OrderDocumentMapper(result).toDomain();
  }
}
