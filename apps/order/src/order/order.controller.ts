import { Metadata } from '@grpc/grpc-js';
import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { GrpcInterceptor, OrderMicroservice, RpcInterceptor } from '@app/common';
import { DeliveryStartedDto } from '../dto/delivery-started.dto';
import { OrderStatus } from '../entity/order.entity';
import { PaymentMethod } from '../entity/payment.entity';

@Controller('order')
@OrderMicroservice.OrderServiceControllerMethods()
@UseInterceptors(GrpcInterceptor)
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
    if (!request.payment || !request.meta?.user || !request.address) {
      throw new Error('meta.user, address, payment는 필수입니다.');
    }
    const payment = request.payment;
    return (await this.orderService.createOrder(
      {
        ...request,
        meta: { user: request.meta.user },
        address: request.address,
        payment: {
          ...payment,
          paymentMethod: payment.paymentMethod as PaymentMethod,
        } as any,
      },
      metadata,
    )) as any;
  }
}
