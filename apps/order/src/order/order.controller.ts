import { Body, Controller } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderMicroservice } from '@app/common';
import { OrderStatus } from '../entity/order.entity';
import { PaymentMethod } from '../entity/payment.entity';

@Controller('order')
@OrderMicroservice.OrderServiceControllerMethods()
export class OrderController
  implements OrderMicroservice.OrderServiceController
{
  constructor(private readonly orderService: OrderService) {}

  // @EventPattern({ cmd: 'delivery_started' })
  // @UseInterceptors(RpcInterceptor)
  async deliveryStarted(request: OrderMicroservice.DeliveryStartedRequest) {
    return await this.orderService.changeOrderStatus(
      request.id,
      OrderStatus.deliveryStarted,
    );
  }

  // @MessagePattern({ cmd: 'create_order' })
  // @UsePipes(ValidationPipe)
  // @UseInterceptors(RpcInterceptor)
  async createOrder(
    request: OrderMicroservice.CreateOrderRequest,
    metadata: Metadata,
  ) {
    return this.orderService.createOrder(
      {
        ...request,
        payment: {
          ...request.payment,
          paymentMethod: request.payment.paymentMethod as PaymentMethod,
        },
      },
      metadata,
    );
  }
}
