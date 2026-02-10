export enum PaymentMethod {
  creditCard = 'CreditCard',
  kakaopay = 'Kakaopay',
}

export class PaymentEntity {
  patmentId: string;
  paymentMethod: string;
  paymentName: string;
  amount: number;

  constructor(param: PaymentEntity) {
    this.patmentId = param.patmentId;
    this.paymentMethod = param.paymentMethod;
    this.paymentName = param.paymentName;
    this.amount = param.amount;
  }
}
