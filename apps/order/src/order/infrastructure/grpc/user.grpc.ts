import { Inject, OnModuleInit } from '@nestjs/common';
import { UserOutputPort } from '../../port/output/user.output-port';
import { USER_SERVICE, UserMicroservice } from '@app/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { GetUserInfoResponseMapper } from './mapper/get-user-info-response.mapper';
import { CustomerEntity } from '../../domain/customer.entity';

export class UserGrpc implements UserOutputPort, OnModuleInit {
  userService: UserMicroservice.UserServiceClient;

  constructor(
    @Inject(USER_SERVICE)
    private readonly userMicroservice: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userService =
      this.userMicroservice.getService<UserMicroservice.UserServiceClient>(
        'UserService',
      );
  }

  async getUserById(userId: string): Promise<CustomerEntity> {
    const resp = await lastValueFrom(this.userService.getUserInfo({ userId }));
    return new GetUserInfoResponseMapper(resp).toDomain();
  }
}
