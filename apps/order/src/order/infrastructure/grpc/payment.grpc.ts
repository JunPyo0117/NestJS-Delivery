import { PAYMENT_SERVICE } from '@app/common';
import { PaymentOutputPort } from '../../port/output/payment.output-port';
import { PaymentMicroservice } from '@app/common';
import { Inject, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { PaymentDto } from '../../usecase/dto/create-order.dto';
import { OrderEntity, OrderStatus } from '../../domain/order.entity';
import { lastValueFrom } from 'rxjs';
import { OrderEntityMapper } from './mapper/order-entity.mapper';
import { PaymentFailedException } from '../../exception/payment-failed.exception';
import { MakePaymentResponseMapper } from './mapper/make-payment-response';

export class PaymentGrpc implements PaymentOutputPort, OnModuleInit {
  paymentService: PaymentMicroservice.PaymentServiceClient;

  constructor(
    @Inject(PAYMENT_SERVICE)
    private readonly paymentMicroservice: ClientGrpc,
  ) {}

  onModuleInit() {
    this.paymentService =
      this.paymentMicroservice.getService<PaymentMicroservice.PaymentServiceClient>(
        'PaymentService',
      );
  }

  async processPayment(
    order: OrderEntity,
    payment: PaymentDto,
  ): Promise<OrderEntity> {
    const resp = await lastValueFrom(
      this.paymentService.makePayment(
        new OrderEntityMapper(order).toMakePaymentRequest(payment),
      ),
    );

    const isPaid = resp.paymentStatus === 'Approved';
    const orderStatus = isPaid
      ? OrderStatus.paymentProcessed
      : OrderStatus.paymentFailed;

    if (orderStatus === OrderStatus.paymentFailed) {
      throw new PaymentFailedException(resp);
    }

    const result = new MakePaymentResponseMapper(resp).toDomain(order, payment);
    result.status = orderStatus;
    return result;
  }
}
