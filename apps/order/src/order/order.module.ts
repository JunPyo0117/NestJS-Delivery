import { Module } from '@nestjs/common';
import { OrderController } from './infrastructure/framework/order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema, OrderDocument } from './infrastructure/mongoose/entity/order.entity';
import { CreateOrderUsecase } from './usecase/create-order.usecase';
import { StartDeliveryUsecase } from './usecase/start-delivery.usecase';
import { OrderRepository } from './infrastructure/mongoose/repository/order.repository';
import { PaymentGrpc } from './infrastructure/grpc/payment.grpc';
import { ProductGrpc } from './infrastructure/grpc/product.grpc';
import { UserGrpc } from './infrastructure/grpc/user.grpc';
import { CancelOrderUsecase } from './usecase/cancel-order.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: OrderDocument.name,
        schema: OrderSchema,
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [
    CreateOrderUsecase,
    StartDeliveryUsecase,
    CancelOrderUsecase,
    {
      provide: 'UserOutputPort',
      useClass: UserGrpc,
    },
    {
      provide: 'ProductOutputPort',
      useClass: ProductGrpc,
    },
    {
      provide: 'OrderOutputPort',
      useClass: OrderRepository,
    },
    {
      provide: 'PaymentOutputPort',
      useClass: PaymentGrpc,
    },
  ],
})
export class OrderModule {}
