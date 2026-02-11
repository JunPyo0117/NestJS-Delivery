import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { SendPaymentNotificationDto } from './dto/send-payment-notification.dto';
import { Notification, NotificationStatus } from './entity/notification.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ORDER_SERVICE,
  OrderMicroservice,
  constructorMetadata,
} from '@app/common';
import type { ClientGrpc, ClientKafka } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';

@Injectable()
export class NotificationService implements OnModuleInit, OnModuleDestroy {
  orderService: OrderMicroservice.OrderServiceClient;

  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
    // @Inject(ORDER_SERVICE)
    // private readonly orderService: ClientProxy,
    @Inject(ORDER_SERVICE)
    private readonly orderMicroservice: ClientGrpc,
    @Inject('KAFKA_SERVICE')
    private readonly kafkaService: ClientKafka,
  ) {}

  async onModuleDestroy() {
    await this.kafkaService.close();
  }

  async onModuleInit() {
    this.orderService =
      this.orderMicroservice.getService<OrderMicroservice.OrderServiceClient>(
        'OrderService',
      );
    await this.kafkaService.connect();
  }

  async sendPaymentNotification(
    data: SendPaymentNotificationDto,
    metadata: Metadata,
  ) {
    const notification = await this.createNotification(data.to);

    try {
      throw new Error('에러 test');

      await this.sendEmail();

      await this.updateNotificationStatus(
        notification._id.toString(),
        NotificationStatus.sent,
      );

      // Payment 응답 체인을 막지 않기 위해 비동기로 재시도한다.
      setTimeout(() => {
        this.sendDeliveryStartedMessage(data.orderId, metadata);
      }, 300);

      return this.notificationModel.findById(notification._id).lean();
    } catch (e) {
      this.kafkaService.emit('order.notification.failed', data.orderId);
      return this.notificationModel.findById(notification._id).lean();
    }
  }

  sendDeliveryStartedMessage(id: string, metadata: Metadata) {
    this.orderService
      .deliveryStarted(
        { id },
        constructorMetadata(
          NotificationService.name,
          'sendDeliveryStartedMessage',
          metadata,
        ),
      )
      .subscribe({
        next: (response) => {
          console.log('배송 시작 알림 성공:', response);
        },
        error: (error: Error) => {
          console.error('배송 시작 알림 실패:', error.message);
          // 에러가 발생해도 서비스는 계속 동작
        },
      });
  }

  async updateNotificationStatus(id: string, status: NotificationStatus) {
    await this.notificationModel.findByIdAndUpdate(id, { status });
  }

  async sendEmail() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  async createNotification(to: string) {
    return this.notificationModel.create({
      from: 'notification@example.com',
      to: to,
      subject: '배송이 시작됐습니다.',
      content: `${to}님, 주문하신 물건이 배송이 시작됐습니다.`,
    });
  }
}
