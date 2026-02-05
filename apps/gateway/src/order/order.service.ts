import { ORDER_SERVICE, UserMeta, UserPayloadDto } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDER_SERVICE)
    private readonly orderService: ClientProxy,
  ) {}

  async createOrder(
    createOrderDto: CreateOrderDto,
    userPayload: UserPayloadDto,
  ) {
    return this.orderService.send<any, CreateOrderDto & UserMeta>(
      { cmd: 'create_order' },
      {
        ...createOrderDto,
        meta: {
          user: userPayload,
        },
      },
    );
  }
}
