import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UserMicroservice } from '@app/common';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { GrpcExceptionFilter } from './grpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GrpcExceptionFilter());
  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: UserMicroservice.protobufPackage,
      protoPath: join(process.cwd(), 'proto/user.proto'),
      url: configService.getOrThrow('GRPC_URL'),
    },
  });

  await app.init();

  await app.startAllMicroservices();
}
bootstrap();
