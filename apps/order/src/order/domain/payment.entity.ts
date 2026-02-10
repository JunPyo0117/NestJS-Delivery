export enum PaymentMethod {
  creditCard = 'CreditCard',
  kakaopay = 'Kakaopay',
}

export class PaymentEntity {
  paymentId: string;
  paymentMethod: string;
  paymentName: string;
  amount: number;

  constructor(param: PaymentEntity) {
    this.paymentId = param.paymentId;
    this.paymentMethod = param.paymentMethod;
    this.paymentName = param.paymentName;
    this.amount = param.amount;
  }
}
