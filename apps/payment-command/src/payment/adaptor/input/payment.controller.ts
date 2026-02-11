import {
  Controller,
  Get,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PaymentService } from '../../application/payment.service';
import { GrpcInterceptor, PaymentMicroservice } from '@app/common';
import { Metadata } from '@grpc/grpc-js';
import { PaymentMethod } from '../../domain/payment.domain';
import { EventPattern } from '@nestjs/microservices';

@Controller()
@PaymentMicroservice.PaymentServiceControllerMethods()
export class PaymentController
  implements PaymentMicroservice.PaymentServiceController
{
  constructor(private readonly paymentService: PaymentService) {}

  // @MessagePattern({ cmd: 'make_payment' })
  // @UsePipes(ValidationPipe)
  // @UseInterceptors(RpcInterceptor)
  @UseInterceptors(GrpcInterceptor)
  makePayment(request: PaymentMicroservice.MakePaymentRequest) {
    return this.paymentService.makePayment({
      ...request,
      paymentMethod: request.paymentMethod as PaymentMethod,
    });
  }

  @EventPattern('order.notification.failed')
  orderNotificationFailed(orderId: string) {
    this.paymentService.cancelPayment(orderId);
  }
}
