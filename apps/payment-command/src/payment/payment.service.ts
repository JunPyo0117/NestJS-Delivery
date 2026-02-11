// import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Payment, PaymentStatus } from './adaptor/output/typeorm/entity/payment.entity';
// import { MakePaymentDto } from './dto/make-payment.dto';
// import {
//   NOTIFICATION_SERVICE,
//   NotificationMicroservice,
//   constructorMetadata,
// } from '@app/common';
// import type { ClientGrpc } from '@nestjs/microservices';
// import { lastValueFrom } from 'rxjs';
// import { Metadata } from '@grpc/grpc-js';

// @Injectable()
// export class PaymentService implements OnModuleInit {
//   notificationService: NotificationMicroservice.NotificationServiceClient;

//   constructor(
//     @InjectRepository(Payment)
//     private readonly paymentRepository: Repository<Payment>,
//     // @Inject(NOTIFICATION_SERVICE)
//     // private readonly notificationService: ClientProxy,
//     @Inject(NOTIFICATION_SERVICE)
//     private readonly notificationMicroservice: ClientGrpc,
//   ) {}

//   onModuleInit() {
//     this.notificationService =
//       this.notificationMicroservice.getService<NotificationMicroservice.NotificationServiceClient>(
//         'NotificationService',
//       );
//   }

//   async makePayment(payload: MakePaymentDto, metadata: Metadata) {
//     let paymentId;

//     try {
//       const result = await this.paymentRepository.save(payload);

//       paymentId = result.id;

//       await this.processPayment();

//       await this.updatePaymentStatus(paymentId, PaymentStatus.approved);

//       // TODO: notification 보내기
//       this.sendNotification(payload.orderId, payload.userEmail, metadata);

//       return this.paymentRepository.findOne({ where: { id: paymentId } });
//     } catch (e) {
//       if (paymentId) {
//         await this.updatePaymentStatus(paymentId, PaymentStatus.rejected);
//       }
//       throw e;
//     }
//   }

//   async processPayment() {
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//   }

//   async updatePaymentStatus(id: string, status: PaymentStatus) {
//     await this.paymentRepository.update(id, { paymentStatus: status });
//   }

//   async sendNotification(orderId: string, to: string, metadata: Metadata) {
//     const resp = await lastValueFrom(
//       this.notificationService.sendPaymentNotification(
//         {
//           to,
//           orderId,
//         },
//         constructorMetadata(PaymentService.name, 'sendNotification', metadata),
//       ),
//     );
//   }
// }
