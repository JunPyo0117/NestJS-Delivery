import { Controller, UseInterceptors } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { GrpcInterceptor, OrderMicroservice } from '@app/common';
import { OrderStatus } from './entity/order.entity';
import { PaymentMethod } from './entity/payment.entity';
import { Metadata } from '@grpc/grpc-js';

@Controller('order')
@OrderMicroservice.OrderServiceControllerMethods()
@UseInterceptors(GrpcInterceptor)
export class OrderController
  implements OrderMicroservice.OrderServiceController
{
  constructor(private readonly orderService: OrderService) {}

  async deliveryStarted(request: OrderMicroservice.DeliveryStartedRequest) {
    await this.orderService.changeOrderStatus(
      request.id,
      OrderStatus.deliveryStarted,
    );
  }

  async createOrder(
    request: OrderMicroservice.CreateOrderRequest,
    metadata?: Metadata,
  ): Promise<OrderMicroservice.CreateOrderResponse> {
    if (!request.payment) throw new Error('payment required');
    const dto = {
      ...request,
      payment: {
        ...request.payment,
        paymentMethod: request.payment.paymentMethod as PaymentMethod,
      },
    } as CreateOrderDto;
    return this.orderService.createOrder(
      dto,
      metadata ?? ({} as Metadata),
    ) as unknown as Promise<OrderMicroservice.CreateOrderResponse>;
  }
}
