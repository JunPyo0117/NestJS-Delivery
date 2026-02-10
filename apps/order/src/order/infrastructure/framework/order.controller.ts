import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcInterceptor, OrderMicroservice } from '@app/common';
import { Metadata } from '@grpc/grpc-js';
import { CreateOrderUsecase } from '../../usecase/create-order.usecase';
import { StartDeliveryUsecase } from '../../usecase/start-delivery.usecase';
import { CreateOrderRequestMapper } from './mapper/create-order-request.mapper';

@Controller('order')
@OrderMicroservice.OrderServiceControllerMethods()
@UseInterceptors(GrpcInterceptor)
export class OrderController
  implements OrderMicroservice.OrderServiceController
{
  constructor(
    // private readonly orderService: OrderService,
    private readonly createOrderUsecase: CreateOrderUsecase,
    private readonly startDeliveryUsecase: StartDeliveryUsecase,
  ) {}

  async deliveryStarted(request: OrderMicroservice.DeliveryStartedRequest) {
    await this.startDeliveryUsecase.execute(request.id);
  }

  async createOrder(
    request: OrderMicroservice.CreateOrderRequest,
    metadata: Metadata,
  ): Promise<OrderMicroservice.CreateOrderResponse> {
    return this.createOrderUsecase.execute(
      new CreateOrderRequestMapper(request).toDomain(),
    );
  }
}
