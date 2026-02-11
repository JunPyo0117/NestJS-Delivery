import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcInterceptor, OrderMicroservice } from '@app/common';
import { Metadata } from '@grpc/grpc-js';
import { CreateOrderUsecase } from '../../usecase/create-order.usecase';
import { StartDeliveryUsecase } from '../../usecase/start-delivery.usecase';
import { CreateOrderRequestMapper } from './mapper/create-order-request.mapper';
import { EventPattern } from '@nestjs/microservices';
import { CancelOrderUsecase } from '../../usecase/cancel-order.usecase';

@Controller('order')
@OrderMicroservice.OrderServiceControllerMethods()
export class OrderController
  implements OrderMicroservice.OrderServiceController
{
  constructor(
    // private readonly orderService: OrderService,
    private readonly createOrderUsecase: CreateOrderUsecase,
    private readonly startDeliveryUsecase: StartDeliveryUsecase,
    private readonly cancelOrderUsecase: CancelOrderUsecase,
  ) {}

  @UseInterceptors(GrpcInterceptor)
  async deliveryStarted(request: OrderMicroservice.DeliveryStartedRequest) {
    await this.startDeliveryUsecase.execute(request.id);
  }

  @UseInterceptors(GrpcInterceptor)
  async createOrder(
    request: OrderMicroservice.CreateOrderRequest,
    metadata: Metadata,
  ): Promise<OrderMicroservice.CreateOrderResponse> {
    return this.createOrderUsecase.execute(
      new CreateOrderRequestMapper(request).toDomain(),
    );
  }

  @EventPattern('order.notification.failed')
  async orderNotificationFailed(orderId: string) {
    await this.cancelOrderUsecase.execute(orderId);
  }
}
