import {
  ORDER_SERVICE,
  OrderMicroservice,
  UserMeta,
  UserPayloadDto,
  constructorMetadata,
} from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService implements OnModuleInit {
  orderService: OrderMicroservice.OrderServiceClient;

  constructor(
    // @Inject(ORDER_SERVICE)
    // private readonly orderService: ClientProxy,
    @Inject(ORDER_SERVICE)
    private readonly orderMicroservice: ClientGrpc,
  ) {}

  onModuleInit() {
    this.orderService =
      this.orderMicroservice.getService<OrderMicroservice.OrderServiceClient>(
        'OrderService',
      );
  }

  async createOrder(
    createOrderDto: CreateOrderDto,
    userPayload: UserPayloadDto,
  ) {
    return lastValueFrom(
      this.orderService.createOrder(
        {
          ...createOrderDto,
          meta: {
            user: userPayload,
          },
        },
        constructorMetadata(OrderService.name, 'createOrder'),
      ),
    );
  }
}
