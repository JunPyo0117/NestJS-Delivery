import { PaymentModel } from '../../domain/payment.domain';

export interface NetworkOutputPort {
  sendNotification(orderId: string, to: string): Promise<void>;
}
