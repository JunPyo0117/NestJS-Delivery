import { PaymentModel } from '../../../../domain/payment.domain';
import { PaymentDocument } from '../document/payment.document';

export class PaymentDocumentMapper {
  constructor(private readonly document: PaymentDocument) {}

  toDomain(): PaymentModel {
    const model = new PaymentModel({
      paymentMethod: this.document.paymentMethod,
      cardNumber: this.document.cardNumber,
      expiryYear: this.document.expiryYear,
      expiryMonth: this.document.expiryMonth,
      birthOrRegistration: this.document.birthOrRegistration,
      passwordTwoDigits: this.document.passwordTwoDigits,
      amount: this.document.amount,
      userEmail: this.document.userEmail,
      orderId: this.document.orderId,
    });
    model.assignId(this.document._id.toString());
    return model;
  }
}
