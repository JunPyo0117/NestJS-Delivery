import {
  Controller,
  Get,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RpcInterceptor } from '@app/common/interceptor/rpc.interceptor';
import { MakePaymentDto } from './dto/make-payment.dto';
import { PaymentMicroservice } from '@app/common';

@Controller()
export class PaymentController
  implements PaymentMicroservice.PaymentServiceController
{
  constructor(private readonly paymentService: PaymentService) {}

  // @MessagePattern({ cmd: 'make_payment' })
  // @UsePipes(ValidationPipe)
  // @UseInterceptors(RpcInterceptor)
  makePayment(request: PaymentMicroservice.MakePaymentRequest) {
    return this.paymentService.makePayment({
      ...request,
      paymentMethod: request.paymentMethod as PaymentMethod,
    });
  }
}
