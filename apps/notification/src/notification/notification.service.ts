import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { SendPaymentNotificationDto } from './dto/send-payment-notification.dto';
import { Repository } from 'typeorm';
import { Notification, NotificationStatus } from './entity/notification.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ORDER_SERVICE,
  OrderMicroservice,
  constructorMetadata,
} from '@app/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';

@Injectable()
export class NotificationService implements OnModuleInit {
  orderService: OrderMicroservice.OrderServiceClient;

  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
    // @Inject(ORDER_SERVICE)
    // private readonly orderService: ClientProxy,
    @Inject(ORDER_SERVICE)
    private readonly orderMicroservice: ClientGrpc,
  ) {}

  onModuleInit() {
    this.orderService =
      this.orderMicroservice.getService<OrderMicroservice.OrderServiceClient>(
        'OrderService',
      );
  }

  async sendPaymentNotification(
    data: SendPaymentNotificationDto,
    metadata: Metadata,
  ) {
    const notification = await this.createNotification(data.to);

    await this.sendEmail();

    await this.updateNotificationStatus(
      notification._id.toString(),
      NotificationStatus.sent,
    );

    // Cold Observable vs Hot Observable
    this.sendDeliveryStartedMessage(data.orderId, metadata);

    return this.notificationModel.findById(notification._id).lean();
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
      .subscribe();
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
