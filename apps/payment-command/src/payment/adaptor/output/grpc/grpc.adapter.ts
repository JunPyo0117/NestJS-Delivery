import { Inject, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { NetworkOutputPort } from '../../../port/output/network.output-port';
import { NOTIFICATION_SERVICE, NotificationMicroservice } from '@app/common';
import { lastValueFrom } from 'rxjs';

export class GrpcAdapter implements NetworkOutputPort, OnModuleInit {
  notificationService: NotificationMicroservice.NotificationServiceClient;

  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationMicroservice: ClientGrpc,
  ) {}

  onModuleInit() {
    this.notificationService =
      this.notificationMicroservice.getService<NotificationMicroservice.NotificationServiceClient>(
        'NotificationService',
      );
  }

  async sendNotification(orderId: string, to: string): Promise<void> {
    await lastValueFrom(
      this.notificationService.sendPaymentNotification({
        to,
        orderId,
      }),
    );
  }
}
