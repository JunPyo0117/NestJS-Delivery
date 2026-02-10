import { CustomerEntity } from './customer.entity';
import { DeliveryAddressEntity } from './delivery-address.entity';
import { PaymentEntity } from './payment.entity';
import { ProductEntity } from './product.entity';

export enum OrderStatus {
  pending = 'Pending',
  paymentCanclled = 'PaymentCanclled',
  paymentFailed = 'PaymentFailed',
  paymentProcessed = 'PaymentProcessed',
  deliveryStarted = 'DeliveryStarted',
  deliveryDone = 'DeliveryDone',
}

export class OrderEntity {
  id: string;
  customer: CustomerEntity;
  products: ProductEntity[];
  deliveryAddress: DeliveryAddressEntity;
  status: OrderStatus;
  payment: PaymentEntity;
  totalAmount: number;

  constructor(param: {
    customer: CustomerEntity;
    products: ProductEntity[];
    deliveryAddress: DeliveryAddressEntity;
  }) {
    this.customer = param.customer;
    this.products = param.products;
    this.deliveryAddress = param.deliveryAddress;
  }

  setId(id: string) {
    this.id = id;
  }

  setPayment(payment: PaymentEntity) {
    if (!this.id) {
      throw new Error('ID가 없는 주문에 결제 정보를 설정할 수 없습니다.');
    }

    this.payment = payment;
  }

  calculateTotalAmount() {
    if (!this.products) {
      throw new Error('Products가 없는 주문에 총 금액을 계산할 수 없습니다.');
    }

    const total = this.products.reduce((acc, n) => acc + n.price, 0);

    if (total <= 0) {
      throw new Error('총 금액이 0원 이하입니다.');
    }

    this.totalAmount = total;
  }

  processPayment(payment: PaymentEntity) {
    if (!this.id) {
      throw new Error('ID가 없는 주문에 결제를 처리할 수 없습니다.');
    }

    if (this.products.length === 0) {
      throw new Error('Products가 없는 주문에 결제를 처리할 수 없습니다.');
    }

    if (!this.deliveryAddress) {
      throw new Error(
        'DeliveryAddress가 없는 주문에 결제를 처리할 수 없습니다.',
      );
    }

    if (!this.totalAmount) {
      throw new Error('총 금액이 없는 주문에 결제를 처리할 수 없습니다.');
    }

    if (this.status !== OrderStatus.pending) {
      throw new Error(
        'Status가 pending가 아닌 주문에 결제를 처리할 수 없습니다.',
      );
    }

    this.status = OrderStatus.paymentProcessed;
  }

  cancelOrder() {
    if (!this.id) {
      throw new Error('ID가 없는 주문에 주문을 취소할 수 없습니다.');
    }

    this.status = OrderStatus.paymentCanclled;
  }

  startDelivery() {
    if (this.status !== OrderStatus.paymentProcessed) {
      throw new Error(
        'Status가 paymentProcessed가 아닌 주문에 배송을 시작할 수 없습니다.',
      );
    }

    this.status = OrderStatus.deliveryStarted;
  }

  finishDelivery() {
    if (this.status !== OrderStatus.deliveryStarted) {
      throw new Error(
        'Status가 deliveryStarted가 아닌 주문에 배송을 완료할 수 없습니다.',
      );
    }

    this.status = OrderStatus.deliveryDone;
  }
}
