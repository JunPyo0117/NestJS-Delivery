import { Inject, Injectable } from '@nestjs/common';
import { PaymentMethod, PaymentModel } from '../domain/payment.domain';
import type { DatabaseOutputPort } from '../port/output/database.output-port';
import type { NetworkOutputPort } from '../port/output/network.output-port';
import type { PaymentOutputPort } from '../port/output/payment.output-port';

@Injectable()
export class PaymentService {
  constructor(
    @Inject('DatabaseOutputPort')
    private readonly databaseOutputPort: DatabaseOutputPort,
    @Inject('PaymentOutputPort')
    private readonly paymentOutputPort: PaymentOutputPort,
    @Inject('NetworkOutputPort')
    private readonly networkOutputPort: NetworkOutputPort,
  ) {}

  async makePayment(param: {
    orderId: string;
    paymentMethod: PaymentMethod;
    cardNumber: string;
    expiryYear: string;
    expiryMonth: string;
    birthOrRegistration: string;
    passwordTwoDigits: string;
    amount: number;
    userEmail: string;
  }) {
    // 1. 파라미터로 PaymentModel 생성 -> Domain 객체
    const payment = new PaymentModel(param);

    // 2. PaymentModel 저장 -> Database
    const result = await this.databaseOutputPort.savePayment(payment);

    // 3. 저장된 데이터의 ID를 PaymentModel에 저장 -> Domain 객체
    payment.assignId(result.id);

    try {
      // 4. 결제 실행 -> PG -> HTTP
      await this.paymentOutputPort.processPayment(payment);

      // 5. 결제 데이터 업데이트 -> Database
      payment.processPayment();
      await this.databaseOutputPort.updatePayment(payment);
    } catch (e) {
      // 7. 실패 시 (4, 5) 결제를 reject 처리 -> Database
      payment.rejectPayment();
      await this.databaseOutputPort.updatePayment(payment);
      return payment;
    }

    // 6. 알림 전송 -> Notification Service -> gRPC
    await this.networkOutputPort.sendNotification(
      payment.orderId,
      payment.userEmail,
    );

    return payment;
  }

  async cancelPayment(orderId: string) {
    await this.paymentOutputPort.cancelPayment(orderId);

    const payment = await this.databaseOutputPort.findPaymentByOrderId(orderId);
    payment.rejectPayment();
    await this.databaseOutputPort.updatePayment(payment);
  }
}
