import { Module } from '@nestjs/common';
import { PaymentController } from './adaptor/input/payment.controller';
import { PaymentService } from './application/payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './adaptor/output/typeorm/entity/payment.entity';
import { TypeormAdapter } from './adaptor/output/typeorm/typeorm.adapter';
import { PortoneAdapter } from './adaptor/output/portone/portone.adapter';
import { GrpcAdapter } from './adaptor/output/grpc/grpc.adapter';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentDocument } from './adaptor/output/mongoose/document/payment.document';
import { PaymentSchema } from './adaptor/output/mongoose/document/payment.document';
import { MongooseAdapter } from './adaptor/output/mongoose/mongoose.adapter';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentEntity]),
    MongooseModule.forFeature([
      { name: PaymentDocument.name, schema: PaymentSchema },
    ]),
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    {
      provide: 'DatabaseOutputPort',
      // useClass: TypeormAdapter,
      useClass: MongooseAdapter,
    },
    {
      provide: 'PaymentOutputPort',
      useClass: PortoneAdapter,
    },
    {
      provide: 'NetworkOutputPort',
      useClass: GrpcAdapter,
    },
  ],
})
export class PaymentModule {}
