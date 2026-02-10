import { OrderMicroservice } from '@app/common';
import { CreateOrderDto } from '../../../usecase/dto/create-order.dto';
import { PaymentMethod } from '../../../domain/payment.entity';

export class CreateOrderRequestMapper {
  constructor(private readonly request: OrderMicroservice.CreateOrderRequest) {}

  toDomain(): CreateOrderDto {
    const payment = this.request.payment;
    if (!payment) throw new Error('payment is required');
    return {
      userId: this.request.meta!.user!.sub,
      productIds: this.request.productIds,
      address: this.request.address!,
      payment: {
        paymentMethod: this.parsePaymentMethod(payment.paymentMethod),
        paymentName: payment.paymentName ?? '',
        cardNumber: payment.cardNumber ?? '',
        expiryYear: payment.expiryYear ?? '',
        expiryMonth: payment.expiryMonth ?? '',
        birthOrRegistration: payment.birthOrRegistration ?? '',
        passwordTwoDigits: payment.passwordTwoDigits ?? '',
        amount: payment.amount ?? 0,
      },
    };
  }

  private parsePaymentMethod(paymentMethod: string) {
    switch (paymentMethod) {
      case 'CreditCard':
        return PaymentMethod.creditCard;
      case 'Kakaopay':
        return PaymentMethod.kakaopay;
      default:
        throw new Error(`알 수 없는 결제 방법: ${paymentMethod}`);
    }
  }
}
